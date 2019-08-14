import { getMarketClient } from './uclusionClient';
import { ERROR, sendIntlMessage, SUCCESS } from '../utils/userMessage';
// import { commentCreated, commentDeleted, commentsReceived } from '../store/Comments/actions';


export function createComment(investibleId, marketId, body, dispatch) {
  const clientPromise = getMarketClient(marketId);
  return clientPromise.then((client) => {
    client.investibles.createComment(investibleId, body)
      .then((comment) => {
        sendIntlMessage(SUCCESS, { id: 'commentCreateSucceeded' });
      }).catch((error) => {
        console.error(error);
        sendIntlMessage(ERROR, { id: 'commentCreateFailed' });
      });
  });
}

export function deleteComment(commentId, investibleId, marketId, dispatch){
  const clientPromise = getMarketClient(marketId);
  return clientPromise.then((client) => {
    client.investibles.deleteComment(commentId)
      .then(() => {
        sendIntlMessage(SUCCESS, { id: 'commentDeleteSucceeded' });
      }).catch((error) => {
        console.error(error);
        sendIntlMessage(ERROR, { id: 'commentDeleteFailed' });
      });
  });
}

export function fetchComments(idList, marketId, dispatch) {
  const clientPromise = getMarketClient(marketId);
  return clientPromise.then(client => client.investibles.getMarketComments(idList))
    .then((comments) => {
    }).catch((error) => {
      console.error(error);
      sendIntlMessage(ERROR, { id: 'commentsFetchFailed' });
    });
}

export function fetchCommentList(currentCommentList, marketId, dispatch) {
  const clientPromise = getMarketClient(marketId);
  console.debug('Fetching investibles list for:', marketId);
  return clientPromise.then(client => client.investibles.listCommentsByMarket())
    .then((commentList) => {
    }).catch((error) => {
      console.error(error);
      sendIntlMessage(ERROR, { id: 'commentsListFetchFailed' });
    });
}
