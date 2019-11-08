import _ from 'lodash';
import { fetchInvestibleList, fetchInvestibles } from '../../api/marketInvestibles';
import { updateStorableInvestibles } from './investiblesContextReducer';
import { fixupItemForStorage } from '../ContextUtils';

export function getMarketInvestibles(state, marketId) {
  const values = Object.values(state);
  const found = values.filter((inv) => {
    const { market_infos } = inv;
    if (!market_infos) {
      return false;
    }
    return market_infos.find((info) => info.market_id === marketId);
  });
  return found;
}

export function getInvestible(state, investibleId) {
  // console.debug(state);
  return state[investibleId];
}

export function refreshInvestibles(dispatch, marketId) {
  return fetchInvestibleList(marketId)
    .then((investibleList) => {
      console.debug(investibleList);
      if (_.isEmpty(investibleList)) {
        return Promise.resolve([]);
      }
      const idList = investibleList.map((investible) => investible.id);
      return fetchInvestibles(idList, marketId);
    }).then((investibles) => {
      if (_.isEmpty(investibles)) {
        return Promise.resolve([]);
      }
      // console.debug(investibles);
      const fixed = investibles.map((item) => {
        const { investible, market_infos } = item;
        const fixedInvestible = fixupItemForStorage(investible);
        return { investible: fixedInvestible, market_infos };
      });
      const investibleHash = _.keyBy(fixed, (item) => item.investible.id);
      // console.debug(investibleHash);
      dispatch(updateStorableInvestibles(investibleHash));
    });
}
