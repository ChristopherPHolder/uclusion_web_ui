import {
  PUSH_STAGE_CHANNEL,
  REMOVED_MARKETS_CHANNEL,
  VERSIONS_EVENT,
} from '../VersionsContext/versionsContextHelper';
import { removeMarketsStageDetails, updateMarketStages } from './marketStagesContextReducer';
import { registerListener } from '../../utils/MessageBusUtils';

function beginListening(dispatch) {
  registerListener(REMOVED_MARKETS_CHANNEL, 'marketStagesRemovedMarketStart', (data) => {
    const { payload: { event, message } } = data;
    switch (event) {
      case VERSIONS_EVENT:
        // console.debug(`Stages context responding to updated market event ${event}`);
        dispatch(removeMarketsStageDetails(message));
        break;
      default:
        // console.debug(`Ignoring identity event ${event}`);
    }
  });
  registerListener(PUSH_STAGE_CHANNEL, 'marketStagesPushStart',  (data) => {
    const { payload: { event, marketId, stages } } = data;
    switch (event) {
      case VERSIONS_EVENT:
        // console.debug(`Stages context responding to updated market event ${event}`);
        dispatch(updateMarketStages(marketId, stages));
        break;
      default:
        // console.debug(`Ignoring identity event ${event}`);
    }
  });
}

export default beginListening;
