import { useContext } from 'react';
import { AsyncInvestiblesContext } from './AsyncInvestiblesContext';
import { fetchInvestibles, fetchInvestibleList } from '../api/marketInvestibles';
import _ from 'lodash';

function useInvestiblesContext() {
  const { stateCache, setStateValues, loadingWrapper } = useContext(AsyncInvestiblesContext);

  function refreshInvestibles(marketId) {
    // the loading wrapper can't pass arguments, so we
    // need to bind market id with a closure
    const refresher = () => {
      return fetchInvestibleList(marketId)
        .then((investibleList) => {
          console.debug(investibleList);
          if (_.isEmpty(investibleList)) {
            return Promise.resolve([]);
          }
          const idList = investibleList.map(investible => investible.id);
          return fetchInvestibles(idList, marketId);
        }).then((investibles) => {
          return setStateValues({ [marketId]: investibles });
        });
    };
    return loadingWrapper(refresher);
  }

  function updateInvestibleLocally(investible) {
    return Promise.resolve(true); // do nothing for now
  }

  function getCachedInvestibles(marketId) {
    return stateCache[marketId] || [];
  }

  return {
    refreshInvestibles,
    getCachedInvestibles,
    updateInvestibleLocally,
    ...stateCache,
  };
}

export default useInvestiblesContext;
