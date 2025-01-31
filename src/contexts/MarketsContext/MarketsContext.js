import React, { useContext, useEffect, useReducer, useState } from 'react'
import beginListening from './marketsContextMessages'
import reducer, { initializeState } from './marketsContextReducer'
import LocalForageHelper from '../../utils/LocalForageHelper'
import { DiffContext } from '../DiffContext/DiffContext'
import { INDEX_MARKET_TYPE, INDEX_UPDATE, SEARCH_INDEX_CHANNEL } from '../SearchIndexContext/searchIndexContextMessages'
import { pushMessage } from '../../utils/MessageBusUtils'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastId } from '../../components/ContextHacks/BroadcastIdProvider'
import localforage from 'localforage'
import { TOKEN_STORAGE_KEYSPACE } from '../../authorization/TokenStorageManager'

const MARKET_CONTEXT_NAMESPACE = 'market_context';
const EMPTY_STATE = {
  initializing: true,
  marketDetails: [],
};
const MARKETS_CHANNEL = 'markets';
const MarketsContext = React.createContext(EMPTY_STATE);

function pushIndexItems(diskState) {
  const { marketDetails } = diskState;
  const indexMessage = { event: INDEX_UPDATE, itemType: INDEX_MARKET_TYPE, items: marketDetails };
  pushMessage(SEARCH_INDEX_CHANNEL, indexMessage);
}

// normally this would be in context hacks directory but we can use this let to get the context out of the react tree
// we don't use a provider, because we have one defined below
let marketsContextHack;
let tokensHashHack; //Load here so no access without being loaded first - but page also has guards for invite etc.
export { marketsContextHack, tokensHashHack };

function MarketsProvider(props) {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const [, diffDispatch] = useContext(DiffContext);
  const [, setChannel] = useState(undefined);
  const [tokensHash, setTokensHash] = useState({});

  useEffect(() => {
    const myChannel = new BroadcastChannel(MARKETS_CHANNEL);
    myChannel.onmessage = (msg) => {
      if (msg !== broadcastId) {
        console.info(`Reloading on markets channel message ${msg} with ${broadcastId}`);
        const lfg = new LocalForageHelper(MARKET_CONTEXT_NAMESPACE);
        lfg.getState()
          .then((diskState) => {
            if (diskState) {
              pushIndexItems(diskState);
              dispatch(initializeState(diskState));
            }
          });
      }
    }
    setChannel(myChannel);
    return () => {};
  }, []);

  useEffect(() => {
    beginListening(dispatch, diffDispatch, setTokensHash);
    return () => {};
  }, [diffDispatch]);

  useEffect(() => {
    // load market tokens for use by Quill img url re-writing
    const store = localforage.createInstance({ storeName: TOKEN_STORAGE_KEYSPACE });
    const localTokenHash = {};
    store.iterate((value, key) => {
      localTokenHash[key] = value;
    }).then(() => {
      setTokensHash(localTokenHash);
      // load state from storage
      const lfg = new LocalForageHelper(MARKET_CONTEXT_NAMESPACE);
      return lfg.getState().then((diskState) => {
        if (diskState) {
            pushIndexItems(diskState);
            dispatch(initializeState(diskState));
          } else {
            dispatch(initializeState({
              marketDetails: [],
            }));
          }
        });
    });
    return () => {};
  }, []);
  tokensHashHack = tokensHash;
  marketsContextHack = state;
  return (
    <MarketsContext.Provider value={[state, dispatch, tokensHash]}>
      {props.children}
    </MarketsContext.Provider>
  );
}

export { MarketsProvider, MarketsContext, MARKET_CONTEXT_NAMESPACE, MARKETS_CHANNEL, EMPTY_STATE };
