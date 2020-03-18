import _ from 'lodash';
import { pushMessage } from '../utils/MessageBusUtils';
import { getVersions } from './summaries';
import { getMarketDetails, getMarketStages, getMarketUsers } from './markets';
import { getFetchSignaturesForMarket, signatureMatcher } from './versionSignatureUtils';
import {
  PUSH_COMMENTS_CHANNEL,
  PUSH_CONTEXT_CHANNEL, PUSH_INVESTIBLES_CHANNEL, PUSH_PRESENCE_CHANNEL, PUSH_STAGE_CHANNEL,
  VERSIONS_EVENT
} from '../contexts/VersionsContext/versionsContextHelper';
import { fetchComments } from './comments';
import { fetchInvestibles } from './marketInvestibles';
import { AllSequentialMap } from '../utils/PromiseUtils';
import { startTimerChain } from '../utils/timerUtils';
import { MARKET_MESSAGE_EVENT, VERSIONS_HUB_CHANNEL } from '../contexts/WebSocketContext';
import { GLOBAL_VERSION_UPDATE, NEW_MARKET } from '../contexts/VersionsContext/versionsContextMessages';
import {
  OPERATION_HUB_CHANNEL,
  START_OPERATION, STOP_OPERATION
} from '../contexts/OperationInProgressContext/operationInProgressMessages';
import config from '../config';

const MAX_RETRIES = 10;

export class MatchError extends Error {

}

/**
 *  Refreshes the global version swith retry. Does _not_ return a promise.
 *  Use if you want to fire and forget.
 * @param currentHeldVersion
 * @param existingMarkets
 */
export function refreshGlobalVersion (currentHeldVersion, existingMarkets) {
  // WAIT UNTIL VERSIONS CONTEXT LOAD COMPLETES BEFORE DOING ANY API CALL
  if (currentHeldVersion === 'FAKE') return;
  const execFunction = () => {
    return doVersionRefresh(currentHeldVersion, existingMarkets)
      .then((globalVersion) => {
        if (globalVersion !== currentHeldVersion) {
          console.log('Got new version');
          pushMessage(VERSIONS_HUB_CHANNEL, { event: GLOBAL_VERSION_UPDATE, globalVersion });
        }
        return true;
      }).catch((error) => {
        // we'll log match problems, but raise the rest
        if (error instanceof MatchError) {
          console.error(error.message);
          return false;
        } else {
          throw error;
        }
      });
  };
  startTimerChain(6000, MAX_RETRIES, execFunction);
}

/**
 * Function that will make exactly one attempt to update the global versions
 * USed if you have some other control and want access to the promise chain
 * @param currentHeldVersion
 * @param existingMarkets
 * @returns {Promise<*>}
 */
export function doVersionRefresh (currentHeldVersion, existingMarkets) {
  let newGlobalVersion = currentHeldVersion;
  const globalLockEnabled = config.globalLockEnabled === 'true';
  if (globalLockEnabled) {
    pushMessage(OPERATION_HUB_CHANNEL, { event: START_OPERATION });
  }
  return getVersions(currentHeldVersion)
    .then((versions) => {
      console.log('Version fetch');
      console.log(versions);
      const { global_version, signatures: marketSignatures } = versions;
      if (_.isEmpty(marketSignatures) || _.isEmpty(global_version)) {
        console.log('Got new empty');
        return currentHeldVersion;
      }
      console.log(`Got new ${global_version}`);
      newGlobalVersion = global_version;
      return AllSequentialMap(marketSignatures, (marketSignature) => {
        const { market_id: marketId, signatures: componentSignatures } = marketSignature;
        console.log(componentSignatures);
        const promises = doRefreshMarket(marketId, componentSignatures);
        if (!_.isEmpty(promises)) {
          // send a notification to the versions channel saying we have incoming stuff
          // for this market
          pushMessage(VERSIONS_HUB_CHANNEL, { event: MARKET_MESSAGE_EVENT, marketId });
        }
        if (!existingMarkets || !existingMarkets.includes(marketId)) {
          pushMessage(VERSIONS_HUB_CHANNEL, { event: NEW_MARKET, marketId });
          promises.push(getMarketStages(marketId)
            .then((stages) => {
              return pushMessage(PUSH_STAGE_CHANNEL, { event: VERSIONS_EVENT, marketId, stages });
            }));
        }
        return Promise.all(promises);
      });
    })
    .then(() => {
      if (globalLockEnabled) {
        pushMessage(OPERATION_HUB_CHANNEL, { event: STOP_OPERATION });
      }
      return newGlobalVersion;
    });
}

function doRefreshMarket (marketId, componentSignatures) {
  const fetchSignatures = getFetchSignaturesForMarket(componentSignatures);
  console.log(fetchSignatures);
  const { markets, comments, marketPresences, investibles } = fetchSignatures;
  const promises = [];
  if (!_.isEmpty(markets)) {
    promises.push(fetchMarketVersion(marketId, markets[0])); // can only be one market object per market:)
  }
  // So far only three kinds of deletion supported by UI so handle them below as special cases
  if (!_.isEmpty(comments)) {
    promises.push(fetchMarketComments(marketId, comments));
  } else if (componentSignatures.find((signature) => signature.type === 'comment')) {
    promises.push(Promise.resolve(true));
    // We are not keeping zero version around anymore so handle the rare case of last comment deleted
    pushMessage(PUSH_COMMENTS_CHANNEL, { event: VERSIONS_EVENT, marketId, comments: [] });
  }
  if (!_.isEmpty(investibles)) {
    promises.push(fetchMarketInvestibles(marketId, investibles));
  } else if (componentSignatures.find((signature) => signature.type === 'market_investible')) {
    promises.push(Promise.resolve(true));
    // We are not keeping zero version around anymore so handle the rare case of last investible deleted
    pushMessage(PUSH_INVESTIBLES_CHANNEL, { event: VERSIONS_EVENT, marketId, investibles: [] });
  }
  if (!_.isEmpty(marketPresences) || componentSignatures.find((signature) => signature.type === 'investment')) {
    // Handle the case of the last investment being deleted by just refreshing users
    promises.push(fetchMarketPresences(marketId, marketPresences || []));
  }
  return promises;
}

function fetchMarketVersion (marketId, marketSignature) {
  return getMarketDetails(marketId)
    .then((marketDetails) => {
      console.log(marketDetails);
      const match = signatureMatcher([marketDetails], [marketSignature]);
      // we bothered to fetch the data, so we should use it:)
      pushMessage(PUSH_CONTEXT_CHANNEL, { event: VERSIONS_EVENT, marketDetails });
      if (!match.allMatched) {
        throw new MatchError('Market didn\'t match');
      }
    });
}

function fetchMarketComments (marketId, commentsSignatures) {
  const commentIds = commentsSignatures.map((comment) => comment.id);
  return fetchComments(commentIds, marketId)
    .then((comments) => {
      const match = signatureMatcher(comments, commentsSignatures);
      pushMessage(PUSH_COMMENTS_CHANNEL, { event: VERSIONS_EVENT, marketId, comments });
      if (!match.allMatched) {
        throw new MatchError('Comments didn\'t match');
      }
    });
}

function fetchMarketInvestibles (marketId, investiblesSignatures) {
  const investibleIds = investiblesSignatures.map((inv) => inv.investible.id);
  return fetchInvestibles(investibleIds, marketId)
    .then((investibles) => {
      console.log('Fetching investibles');
      console.log(investibles);
      console.log(investiblesSignatures);
      const match = signatureMatcher(investibles, investiblesSignatures);
      pushMessage(PUSH_INVESTIBLES_CHANNEL, { event: VERSIONS_EVENT, marketId, investibles });
      if (!match.allMatched) {
        throw new MatchError('Investibles didn\'t match');
      }
    });
}

function fetchMarketPresences (marketId, mpSignatures) {
  return getMarketUsers(marketId)
    .then((users) => {
      console.log(users);
      const match = signatureMatcher(users, mpSignatures);
      console.log(mpSignatures);
      pushMessage(PUSH_PRESENCE_CHANNEL, { event: VERSIONS_EVENT, marketId, users });
      if (!match.allMatched) {
        throw new MatchError('Presences didn\'t match');
      }
    });
}