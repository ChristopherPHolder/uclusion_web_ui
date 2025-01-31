import React, { useContext, useEffect, useReducer, useState } from 'react'
import _ from 'lodash'
import reducer, { initializeState } from './commentsContextReducer'
import LocalForageHelper from '../../utils/LocalForageHelper'
import beginListening from './commentsContextMessages'
import { pushMessage } from '../../utils/MessageBusUtils'
import {
  INDEX_COMMENT_TYPE,
  INDEX_UPDATE,
  SEARCH_INDEX_CHANNEL
} from '../SearchIndexContext/searchIndexContextMessages'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastId } from '../../components/ContextHacks/BroadcastIdProvider'
import { DiffContext } from '../DiffContext/DiffContext'

const COMMENTS_CHANNEL = 'comments';
const COMMENTS_CONTEXT_NAMESPACE = 'comments_context';
const EMPTY_STATE = {initializing: true};

const CommentsContext = React.createContext(EMPTY_STATE);

function pushIndexItems(diskState) {
  const indexItems = _.flatten(Object.values(diskState));
  const indexMessage = { event: INDEX_UPDATE, itemType: INDEX_COMMENT_TYPE, items: indexItems };
  pushMessage(SEARCH_INDEX_CHANNEL, indexMessage);
}

function CommentsProvider(props) {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE, undefined);
  const [, diffDispatch] = useContext(DiffContext);
  const [, setChannel] = useState(undefined);

  useEffect(() => {
    const myChannel = new BroadcastChannel(COMMENTS_CHANNEL);
    myChannel.onmessage = (msg) => {
      if (msg !== broadcastId) {
        console.info(`Reloading on comments channel message ${msg} with ${broadcastId}`);
        const lfg = new LocalForageHelper(COMMENTS_CONTEXT_NAMESPACE);
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
    beginListening(dispatch, diffDispatch);
    return () => {};
  }, [diffDispatch]);

  useEffect(() => {
    // load state from storage
    const lfg = new LocalForageHelper(COMMENTS_CONTEXT_NAMESPACE);
    lfg.getState()
      .then((state) => {
        if (state) {
          pushIndexItems(state);
          dispatch(initializeState(state));
        } else {
          dispatch(initializeState({}));
        }
      });
    return () => {};
  }, []);

  return (
    <CommentsContext.Provider value={[state, dispatch]} >
      {props.children}
    </CommentsContext.Provider>
  );
}

export { CommentsProvider, CommentsContext, EMPTY_STATE, COMMENTS_CONTEXT_NAMESPACE, COMMENTS_CHANNEL };
