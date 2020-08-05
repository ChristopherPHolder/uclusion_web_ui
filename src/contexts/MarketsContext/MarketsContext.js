import React, { useContext, useEffect, useReducer } from 'react'
import beginListening from './marketsContextMessages'
import reducer, { initializeState } from './marketsContextReducer'
import LocalForageHelper from '../../utils/LocalForageHelper'
import { DiffContext } from '../DiffContext/DiffContext'
import { INDEX_MARKET_TYPE, INDEX_UPDATE, SEARCH_INDEX_CHANNEL } from '../SearchIndexContext/searchIndexContextMessages'
import { pushMessage } from '../../utils/MessageBusUtils'

const MARKET_CONTEXT_NAMESPACE = 'market_context';
const EMPTY_STATE = {
  initializing: true,
  marketDetails: [],
};

const MarketsContext = React.createContext(EMPTY_STATE);

function MarketsProvider(props) {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const [, diffDispatch] = useContext(DiffContext);

  useEffect(() => {
    beginListening(dispatch, diffDispatch);
    return () => {};
  }, [diffDispatch]);

  useEffect(() => {
    // load state from storage
    const lfg = new LocalForageHelper(MARKET_CONTEXT_NAMESPACE);
    lfg.getState()
      .then((diskState) => {
        if (diskState) {
          const { marketDetails } = diskState;
          const indexMessage = { event: INDEX_UPDATE, itemType: INDEX_MARKET_TYPE, items: marketDetails};
          pushMessage(SEARCH_INDEX_CHANNEL, indexMessage);
          dispatch(initializeState(diskState));
        }
      });
    return () => {};
  }, []);

  return (
    <MarketsContext.Provider value={[state, dispatch]}>
      {props.children}
    </MarketsContext.Provider>
  );
}

export { MarketsProvider, MarketsContext, MARKET_CONTEXT_NAMESPACE, EMPTY_STATE };
