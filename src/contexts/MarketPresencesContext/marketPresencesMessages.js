import {
  BANNED_LIST,
  PUSH_PRESENCE_CHANNEL,
  REMOVED_MARKETS_CHANNEL,
  VERSIONS_EVENT
} from '../VersionsContext/versionsContextHelper'
import {
  processBannedList,
  removeMarketsPresence,
  versionsUpdateMarketPresences
} from './marketPresencesContextReducer'
import { registerListener } from '../../utils/MessageBusUtils'
import { addPresenceToMarket } from './marketPresencesHelper'

export const ADD_PRESENCE = 'AddPresence';

function beginListening(dispatch) {
  registerListener(REMOVED_MARKETS_CHANNEL, 'marketPresenceRemovedMarketStart', (data) => {
    const { payload: { event, message, bannedList } } = data;
    switch (event) {
      case VERSIONS_EVENT:
        dispatch(removeMarketsPresence(message));
        break;
      case BANNED_LIST:
        dispatch(processBannedList(bannedList));
        break;
      default:
        // console.debug(`Ignoring identity event ${event}`);
    }
  });
  registerListener(PUSH_PRESENCE_CHANNEL, 'marketPresencePushStart', (data) => {
    const { payload: { event, marketId, users, presence } } = data;

    switch (event) {
      case VERSIONS_EVENT:
        dispatch(versionsUpdateMarketPresences(marketId, users));
        break;
      case ADD_PRESENCE:
        addPresenceToMarket(dispatch, marketId, presence);
        break;
      default:
        // console.debug(`Ignoring push event ${event}`);
    }
  });
}

export default beginListening;

