import _ from 'lodash'
import LocalForageHelper from '../../utils/LocalForageHelper'
import { MARKET_STAGES_CONTEXT_NAMESPACE, STAGES_CHANNEL } from './MarketStagesContext'
import { removeInitializing } from '../../components/localStorageUtils'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastId } from '../../components/ContextHacks/BroadcastIdProvider'

const INITIALIZE_STATE = 'INITIALIZE_STATE';
const UPDATE_MARKET_STAGES = 'UPDATE_MARKET_STAGES';
const REMOVE_MARKET_STAGES = 'REMOVE_MARKET_STAGES';
const UPDATE_MARKET_STAGES_FROM_NETWORK = 'UPDATE_MARKET_STAGES_FROM_NETWORK';

/** Messages we can send the reducer **/

export function initializeState(newState) {
  return {
    type: INITIALIZE_STATE,
    newState,
  };
}

export function updateMarketStages(marketId, stagesList) {
  return {
    type: UPDATE_MARKET_STAGES,
    marketId,
    stagesList,
  };
}

export function updateMarketStagesFromNetwork(marketId, stagesList) {
  return {
    type: UPDATE_MARKET_STAGES_FROM_NETWORK,
    marketId,
    stagesList,
  };
}

export function removeMarketsStageDetails(marketIds) {
  return {
    type: REMOVE_MARKET_STAGES,
    marketIds,
  };
}

/** Functions that generate the new state **/

function doUpdateMarketStages(state, action, isQuickAdd) {
  const { marketId, stagesList } = action;
  const stagesListTransformed = isQuickAdd ? stagesList.map((stage) => {
    return { ...stage, fromQuickAdd: true };
  }) : stagesList;
  return {
    ...removeInitializing(state, isQuickAdd),
    [marketId]: stagesListTransformed,
  };
}

function removeMarketStages(state, action) {
  const { marketIds } = action;
  return _.omit(state, marketIds);
}

function computeNewState(state, action) {
  switch (action.type) {
    case INITIALIZE_STATE:
      return action.newState;
    case UPDATE_MARKET_STAGES:
      return doUpdateMarketStages(state, action, true);
    case UPDATE_MARKET_STAGES_FROM_NETWORK:
      return doUpdateMarketStages(state, action);
    case REMOVE_MARKET_STAGES:
      return removeMarketStages(state, action);
    default:
      return state;
  }
}

let marketStagesStoragePromiseChain = Promise.resolve(true);

function reducer(state, action) {
  const newState = computeNewState(state, action);
  if (action.type !== INITIALIZE_STATE) {
    const lfh = new LocalForageHelper(MARKET_STAGES_CONTEXT_NAMESPACE);
    marketStagesStoragePromiseChain = marketStagesStoragePromiseChain.then(() => {
      lfh.setState(newState).then(() => {
        const myChannel = new BroadcastChannel(STAGES_CHANNEL);
        return myChannel.postMessage(broadcastId || 'stages').then(() => myChannel.close())
          .then(() => console.info('Update stages context sent.'));
      });
    });
  }
  return newState;
}

export default reducer;
