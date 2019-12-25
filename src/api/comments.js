import { getMarketClient } from './uclusionClient';

import { toastErrorAndThrow } from '../utils/userMessage';

// import { commentCreated, commentDeleted, commentsReceived } from '../store/Comments/actions';

export function deleteComment(commentId, investibleId, marketId) {
  const clientPromise = getMarketClient(marketId);
  return clientPromise.then((client) => client.investibles.deleteComment(commentId));
}

export function fetchComments(idList, marketId) {
  const clientPromise = getMarketClient(marketId);
  // console.debug(idList);
  return clientPromise.then((client) => client.investibles.getMarketComments(idList))
    .catch((error) => toastErrorAndThrow(error, 'errorCommentFetchFailed'));
}

export function fetchCommentList(marketId) {
  const clientPromise = getMarketClient(marketId);
  // console.debug(`Fetching comments list for: ${marketId}`);
  return clientPromise.then((client) => client.investibles.listCommentsByMarket())
    .catch((error) => toastErrorAndThrow(error, 'errorCommentFetchFailed'));
}

export function saveComment(marketId, investibleId, replyId, body, commentType, uploadedFiles) {
  return getMarketClient(marketId)
    .then((client) => client.investibles.createComment(investibleId, body,
      replyId, commentType, uploadedFiles))
    .catch((error) => toastErrorAndThrow(error, 'errorCommentSaveFailed'));
}

export function updateComment(marketId, commentId, body, uploadedFiles) {
  return getMarketClient(marketId)
    .then((client) => client.investibles.updateComment(commentId, body, undefined, uploadedFiles))
    .catch((error) => toastErrorAndThrow(error, 'errorCommentSaveFailed'));
}

export function resolveComment(marketId, commentId) {
  // comments don't have uploaded files, hence we don't need to worry about zeroing them out.
  // otherwise we'd need the full comment to resolve whether or not we're changing them
  return getMarketClient(marketId)
    .then((client) => client.investibles.updateComment(commentId, undefined, true, []))
    .catch((error) => toastErrorAndThrow(error, 'errorCommentResolveFailed'));
}

export function reopenComment(marketId, commentId) {
  // comments don't have uploaded files, hence we don't need to worry about zeroing them out.
  // otherwise we'd need the full comment to resolve whether or not we're changing them
  return getMarketClient(marketId)
    .then((client) => client.investibles.updateComment(commentId, undefined, false, []))
    .catch((error) => toastErrorAndThrow(error, 'errorCommentReopenFailed'));
}