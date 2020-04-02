import { getMarketPresences } from '../MarketPresencesContext/marketPresencesHelper';
import LocalForageHelper from '../../utils/LocalForageHelper';
import { MARKET_CONTEXT_NAMESPACE } from './MarketsContext';
import { addContents } from '../DiffContext/diffContextReducer';
import { updateMarketDetails } from './marketsContextReducer';
import { fixupItemForStorage } from '../ContextUtils';
import { pushMessage } from '../../utils/MessageBusUtils';
import {
  INDEX_MARKET_TYPE,
  INDEX_UPDATE,
  SEARCH_INDEX_CHANNEL
} from '../SearchIndexContext/searchIndexContextMessages';

export function getMarket(state, marketId) {
  const { marketDetails } = state;
  const usedDetails = marketDetails || [];
  return usedDetails.find((market) => market.id === marketId);
}

export function getMyUserForMarket(state, marketId) {
  const market = getMarket(state, marketId);
  if (market) {
    const { currentUser } = market;
    return currentUser;
  }
  return undefined;
}

export function getMarketDetailsForType(state, marketType = 'DECISION') {
  if (state.marketDetails) {
    // eslint-disable-next-line max-len
    return state.marketDetails.filter((market) => market.market_type === marketType && market.is_inline !== true);
  }
  return null;
}

export function getHiddenMarketDetailsForUser(state, marketPresenceState) {
  const { marketDetails } = state;
  if (marketDetails) {
    return marketDetails.filter((market) => {
      const { id } = market;
      const marketPresences = getMarketPresences(marketPresenceState, id);
      if (!marketPresences) {
        return [];
      }
      const myPresence = marketPresences.find((presence) => presence.current_user) || {};
      return myPresence.market_hidden;
    });
  }
  return [];
}

export function addMarketToStorage(dispatch, diffDispatch, marketDetails){
  const fixed = fixupItemForStorage(marketDetails);
  if (diffDispatch) {
    diffDispatch(addContents([fixed]));
  }
  pushMessage(SEARCH_INDEX_CHANNEL, { event: INDEX_UPDATE, itemType: INDEX_MARKET_TYPE, items: [fixed]});
  dispatch(updateMarketDetails([fixed]));
}

export function getNotHiddenMarketDetailsForUser(state, marketPresencesState) {
  if (state.marketDetails) {
    const newMarketDetails = state.marketDetails.filter((market) => {
      const marketPresences = getMarketPresences(marketPresencesState, market.id) || [];
      const myPresence = marketPresences.find((presence) => presence.current_user) || {};
      const { market_hidden: marketHidden } = myPresence;
      return marketHidden === undefined || !marketHidden;
    });
    return { marketDetails: newMarketDetails };
  }
  return state;
}


export function checkMarketInStorage(marketId) {
  const lfh = new LocalForageHelper(MARKET_CONTEXT_NAMESPACE);
  return lfh.getState()
    .then((state) => {
      // console.debug(`Checking localforage for market ${marketId}`);
      return !!getMarket(state, marketId);
    });
}
