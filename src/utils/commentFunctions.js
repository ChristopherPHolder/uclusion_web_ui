import _ from 'lodash'
import { addInvestible, getInvestible } from '../contexts/InvestibesContext/investiblesContextHelper'
import { getBlockedStage, getRequiredInputStage } from '../contexts/MarketStagesContext/marketStagesContextHelper'
import { ISSUE_TYPE, QUESTION_TYPE, SUGGEST_CHANGE_TYPE } from '../constants/comments'
import { addCommentToMarket } from '../contexts/CommentsContext/commentsContextHelper'
import { pushMessage } from './MessageBusUtils'
import { PUSH_INVESTIBLES_CHANNEL } from '../contexts/VersionsContext/versionsContextHelper'
import { LOAD_EVENT } from '../contexts/InvestibesContext/investiblesContextMessages'
import { formCommentLink, formMarketLink } from './marketIdPathFunctions'
import { addMessage } from '../contexts/NotificationsContext/notificationsContextReducer'
import { RED_LEVEL } from '../constants/notifications'

export function scrollToCommentAddBox() {
  const box = document.getElementById('cabox');
  if (box) {
    box.scrollIntoView();
  }
}

export function onCommentOpen(investibleState, investibleId, marketStagesState, marketId, comment, investibleDispatch,
  commentsState, commentsDispatch) {
  const inv = getInvestible(investibleState, investibleId) || {}
  const { market_infos, investible: rootInvestible } = inv
  const [info] = (market_infos || [])
  const { assigned, stage: currentStageId } = (info || {})
  const blockingStage = getBlockedStage(marketStagesState, marketId) || {}
  const requiresInputStage = getRequiredInputStage(marketStagesState, marketId) || {}
  const investibleRequiresInput = ((comment.comment_type === QUESTION_TYPE ||
    comment.comment_type === SUGGEST_CHANGE_TYPE)
    && (assigned || []).includes(comment.created_by)) && currentStageId !== blockingStage.id
    && currentStageId !== requiresInputStage.id
  const investibleBlocks = (investibleId && comment.comment_type === ISSUE_TYPE)
    && currentStageId !== blockingStage.id
  changeInvestibleStageOnCommentChange(investibleBlocks, investibleRequiresInput,
    blockingStage, requiresInputStage, info, market_infos, rootInvestible, investibleDispatch, comment)
  addCommentToMarket(comment, commentsState, commentsDispatch)
}

export function getThreadIds(parents, comments) {
  const commentIds = [];
  parents.forEach((comment) => {
    commentIds.push(comment.id);
    comments.forEach((treeCandidate) => {
      const { root_comment_id: rootId } = treeCandidate;
      if (comment.id === rootId) {
        commentIds.push(treeCandidate.id);
      }
    })
  });
  return commentIds;
}

export function changeInvestibleStageOnCommentChange(investibleBlocks, investibleRequiresInput,
  blockingStage, requiresInputStage, info, market_infos, rootInvestible, investibleDispatch, comment) {
  if (investibleBlocks || investibleRequiresInput) {
    const newStage = investibleBlocks ? blockingStage : requiresInputStage;
    if (newStage.id) {
      const newInfo = {
        ...info,
        stage: newStage.id,
        stage_name: newStage.name,
        open_for_investment: false,
        last_stage_change_date: comment.updated_at,
      };
      const newInfos = _.unionBy([newInfo], market_infos, 'id');
      const newInvestible = {
        investible: rootInvestible,
        market_infos: newInfos
      };
      if (investibleDispatch) {
        // no diff here, so no diff dispatch
        addInvestible(investibleDispatch, () => {}, newInvestible);
      } else {
        pushMessage(PUSH_INVESTIBLES_CHANNEL, { event: LOAD_EVENT, investibles: [newInvestible] });
      }
    }
  }
}

export function notifyImmediate(userId, comment, market, messagesDispatch) {
  const commentLink = formCommentLink(market.id, undefined, comment.id);
  const marketLink = formMarketLink(market.id);
  const notificationType = 'ISSUE';
  messagesDispatch(addMessage({ market_id_user_id: `${market.id}_${userId}`,
    type_object_id: `${notificationType}_${comment.id}`, type: notificationType, market_id: market.id,
    comment_id: comment.id, user_id: userId, text: 'Please assign', level: RED_LEVEL,
    is_highlighted: false, name: 'Immediate TODOs', link: commentLink, market_type: market.market_type,
    link_type: 'MARKET_TODO', market_link: marketLink, market_name: market['name'],
    link_multiple: `${marketLink}##immediateTodos` }));
}