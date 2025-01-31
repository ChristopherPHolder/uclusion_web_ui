import { getMarketInfo } from '../../../utils/userFunctions';
import _ from 'lodash'
import { getMarketComments, refreshMarketComments } from '../../../contexts/CommentsContext/commentsContextHelper'
import { nameFromDescription } from '../../../utils/stringFunctions'
import { addPlanningInvestible } from '../../../api/investibles'
import { moveComments } from '../../../api/comments'
import { addInvestible } from '../../../contexts/InvestibesContext/investiblesContextHelper'
import { getMarketPresences } from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import { RED_LEVEL, YELLOW_LEVEL } from '../../../constants/notifications'
import { findMessagesForMarketId } from '../../../utils/messageUtils'

/**
 * Returns the investibles in the market assigned to the user
 * @param userId
 * @param marketId
 * @param investibles
 * @param visibleStages stages to filter investibles to
 * @returns {*}
 */
export function getUserInvestibles(userId, marketId, investibles, visibleStages=[]) {
  return investibles.filter((investible) => {
    const marketInfo = getMarketInfo(investible, marketId);
    const { assigned, stage } = marketInfo;
    const assignedFull = Array.isArray(assigned) ? assigned : [];
    return assignedFull.includes(userId) && visibleStages.includes(stage);
  });
}

/**
 * Find list of investibles to display in swimlane for that user
 * @param userInvestibles
 * @param limitInvestibles
 * @param limitInvestiblesAge
 * @param marketId
 * @param stageId
 * @returns constrained user investibles
 */
export function getUserSwimlaneInvestibles(userInvestibles, limitInvestibles, limitInvestiblesAge, marketId, stageId) {
  let stageInvestibles = userInvestibles.filter((investible) => {
    const { market_infos: marketInfos } = investible;
    const marketInfo = marketInfos.find(info => info.market_id === marketId);
    if (process.env.NODE_ENV !== 'production') {
      if (marketInfo === undefined) {
        console.warn(`no marketinfo for ${marketId} with `, marketInfos);
      }
    }
    return marketInfo !== undefined && marketInfo.stage === stageId;
  });
  if (limitInvestibles && stageInvestibles) {
    const sortedInvestibles = stageInvestibles.sort(function(a, b) {
      const aMarketInfo = getMarketInfo(a, marketId);
      const bMarketInfo = getMarketInfo(b, marketId);
      return new Date(bMarketInfo.updated_at) - new Date(aMarketInfo.updated_at);
    });
    stageInvestibles = _.slice(sortedInvestibles, 0, limitInvestibles);
  }
  if (limitInvestiblesAge > 0 && stageInvestibles) {
    return stageInvestibles.filter((investible) => {
      const { market_infos: aMarketInfos } = investible;
      const aMarketInfo = aMarketInfos.find(info => info.market_id === marketId);
      return Date.now() - new Date(aMarketInfo.updated_at).getTime() < limitInvestiblesAge*24*60*60*1000;
    });
  }
  return stageInvestibles;
}

export function inVerifedSwimLane(inv, investibles, verifiedStage, marketId) {
  const verifiedStageSafe = verifiedStage || {};
  const verifiedStageId = verifiedStageSafe.id;
  const aMarketInfo = getMarketInfo(inv, marketId);
  const { assigned, stage: currentStageId } = (aMarketInfo || {});
  if (currentStageId !== verifiedStageId) {
    return false;
  }
  if (_.isEmpty(assigned)) {
    return false;
  }
  return assigned.some((userId) => {
    const userInvestibles = getUserInvestibles(userId, marketId, investibles, [verifiedStageId]);
    const inVerified = getUserSwimlaneInvestibles(userInvestibles, verifiedStageSafe.allowed_investibles,
      verifiedStageSafe.days_visible, marketId, verifiedStageId);
    return (inVerified || []).some((investible) => investible.investible.id === inv.investible.id);
  });
}

/**
 * Gets all presence ids related to the comments <em>Including those on submarkets for the comment</em>
 * A sub market participant is considered a collaborator if they've VOTED only.
 * TODO, we should probably account for sub market comments too, but that's a bit of an edge case
 * if they haven't voted
 * @param marketPresences
 * @param comments
 * @param marketPresencesState
 */
export function getCommenterPresences(marketPresences, comments, marketPresencesState) {
  const undeduped = (comments || []).reduce((idList, comment) => {
    const thisCommentPresences = [];
    const { inline_market_id: inlineMarketId, created_by } = comment;
    const createdPresence = marketPresences.find((presence) => presence.id === created_by);
    if (createdPresence) {
      thisCommentPresences.push(createdPresence);
    }
    if (inlineMarketId) {
      // get all of the presences out of the inline market, and find the presences
      // in THIS market that correspond to the inline market presence external ids
      // (all presences are joinable on the external ID which is a unique id for the user across all markets)
      // if that's found, and they have voted in the inline market, then add this market's presence to the collaborator list
      const inlinePresences = getMarketPresences(marketPresencesState, inlineMarketId, true);
      inlinePresences.forEach((inlinePresence) => {
        const thisMarketPresence = marketPresences.find((presence) => presence.external_id === inlinePresence.external_id);
        if (thisMarketPresence && !_.isEmpty(inlinePresence.investments)) {
          thisCommentPresences.push(thisMarketPresence);
        }
      });
    }
  return idList.concat(thisCommentPresences);
  }, []);
  return _.uniqBy(undeduped, 'id');
}

export function doShowEdit(id) {
  const pencilIconHolder = document.getElementById(`showEdit0${id}`);
  const belowPencilHolder = document.getElementById(`showEdit1${id}`);
  if (pencilIconHolder) {
    pencilIconHolder.style.display = 'block';
  }
  if (belowPencilHolder) {
    belowPencilHolder.style.paddingTop = '0';
  }
}

export function doRemoveEdit(id, hasIcon) {
  const pencilIconHolder = document.getElementById(`showEdit0${id}`);
  const belowPencilHolder = document.getElementById(`showEdit1${id}`);
  if (pencilIconHolder) {
    pencilIconHolder.style.display = 'none';
  }
  if (belowPencilHolder && !hasIcon) {
    belowPencilHolder.style.paddingTop = '0.5rem';
  }
}

export function sumNotificationCounts(presence, comments, marketPresencesState, messagesState, marketId) {
  const { critical_notifications: criticalNotifications,
    delayable_notifications: delayableNotifications, external_id: externalId,
    current_user: isCurrentUser } = presence;
  if (isCurrentUser) {
    const messages = findMessagesForMarketId(marketId, messagesState) || [];
    // Special case current user because presence counts don't have quick add
    const redMessages = messages.filter((message) => message.level === RED_LEVEL) || [];
    const yellowMessages = messages.filter((message) => message.level === YELLOW_LEVEL) || [];
    return { criticalNotificationCount: redMessages.length, delayableNotificationCount: yellowMessages.length };
  }
  let criticalNotificationCount = criticalNotifications;
  let delayableNotificationCount = delayableNotifications;
  (comments || []).forEach((comment) => {
    const { inline_market_id: inlineMarketId, resolved } = comment;
    if (inlineMarketId && !resolved) {
      const inlineMarketPresences = getMarketPresences(marketPresencesState, inlineMarketId);
      const myInlinePresence = inlineMarketPresences && inlineMarketPresences.find((presence) => {
        return presence.external_id === externalId;
      });
      if (myInlinePresence) {
        const { critical_notifications: inlineCriticalNotifications,
          delayable_notifications: inlineDelayableNotifications } = myInlinePresence;
        if (inlineCriticalNotifications) {
          criticalNotificationCount += inlineCriticalNotifications;
        }
        if (inlineDelayableNotifications) {
          delayableNotificationCount += inlineDelayableNotifications;
        }
      }
    }
  });
  return { criticalNotificationCount, delayableNotificationCount };
}

export function onDropTodo(commentId, commentsState, marketId, setOperationRunning, intl, commentsDispatch, invDispatch,
  presenceId) {
  const comments = getMarketComments(commentsState, marketId) || [];
  const fromComment = comments.find((comment) => comment.id === commentId);
  if (fromComment) {
    setOperationRunning(true);
    let name = nameFromDescription(fromComment.body);
    if (!name) {
      name = intl.formatMessage({ id: `notificationLabel${fromComment.notification_type}` });
    }
    const addInfo = {
      marketId,
      name,
    };
    if (presenceId) {
      addInfo.assignments = [presenceId];
    }
    return addPlanningInvestible(addInfo).then((inv) => {
      const { investible } = inv;
      return moveComments(marketId, investible.id, [commentId])
        .then((movedComments) => {
          const comments = getMarketComments(commentsState, marketId);
          const newComments = _.unionBy(movedComments, comments, 'id')
          refreshMarketComments(commentsDispatch, marketId, newComments);
          addInvestible(invDispatch, () => {}, inv);
          setOperationRunning(false);
        });
    });
  }
}
