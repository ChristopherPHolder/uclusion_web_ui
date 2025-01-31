import { ISSUE_TYPE, RED_LEVEL} from '../constants/notifications'
import { removeMessage } from '../contexts/NotificationsContext/notificationsContextReducer'

export function messageComparator (a, b) {
  if (a.level === b.level) {
    if (a.aType === b.aType || a.level !== RED_LEVEL) {
      return 0;
    }
    if (a.aType === ISSUE_TYPE) {
      return -1;
    }
    if (b.aType === ISSUE_TYPE) {
      return 1;
    }
    return 0;
  }
  if (a.level === RED_LEVEL) {
    return -1;
  }
  return 1;
}

/**
 * Gets all messages of the given level. If no messages of that level are found
 * returns []
 * @param level
 * @param unsafeMessages
 */
export function filterMessagesToLevel(level, unsafeMessages){
  const messages = unsafeMessages || [];
  return messages.filter((message) => message.level === level) || [];
}

export function findMessagesForCommentId(commentId, state) {
  const { messages } = (state || {});
  const safeMessages = messages || [];
  return safeMessages.filter((message) => message.comment_id === commentId);
}

export function removeMessagesForCommentId(commentId, state, dispatch) {
  const messages = findMessagesForCommentId(commentId, state) || [];
  messages.forEach((message) => {
    dispatch(removeMessage(message));
  });
}

export function removeMessagesForMarket(marketId, state, dispatch) {
  const messages = findMessagesForMarketId(marketId, state) || [];
  messages.forEach((message) => {
    dispatch(removeMessage(message));
  });
}

export function findMessagesForMarketId(marketId, state) {
  const { messages } = (state || {});
  const safeMessages = messages || [];
  return safeMessages.filter((message) => message.market_id === marketId);
}

export function findMessagesForInvestibleId(investibleId, state) {
  const { messages } = (state || {});
  const safeMessages = messages || [];
  return safeMessages.filter((message) => message.investible_id === investibleId);
}

export function findMessageForCommentId(commentId, state) {
  const { messages } = (state || {});
  const safeMessages = messages || [];
  return safeMessages.find((message) => message.comment_id === commentId);
}

export function findMessageOfType(aType, notificationId, state, subtype) {
  const { messages } = (state || {});
  const safeMessages = messages || [];
  const typeObjectId = subtype ? `${aType}_${subtype}_${notificationId}` : `${aType}_${notificationId}`;
  return safeMessages.find((message) => message.type_object_id === typeObjectId);
}

export function findMessageOfTypeAndId(notificationId, state, subtype) {
  return findMessageOfType('UNREAD', notificationId, state, subtype);
}

/**
 * Converts and orders the raw message stream from the backed into something that's more easily handled
 * by the frontend.
 * @param messages
 * @returns {*}
 */
export function getMassagedMessages (messages) {
  const massagedMessages = messages.map((message) => {
    const {
      type: aType,
      market_id: marketId
    } = message;

    // USER poke messages store their type of poke in the marketID for historical reasons
    if (aType === 'USER_POKED') {
      return {
        ...message, pokeType: marketId
      };
    }
    return message;
  });
  //market level must come before investibles in the market
  massagedMessages.sort(function (a, b) {
    const {
      market_id: aMarketId,
      investible_id: aInvestibleId,
      level: aLevel,
    } = a;
    const {
      market_id: bMarketId,
      investible_id: bInvestibleId,
      level: bLevel,
    } = b;
    if (aLevel === bLevel) {
      if (aMarketId === bMarketId) {
        if (aInvestibleId === bInvestibleId) {
          return 0;
        }
        if (!aInvestibleId) {
          return -1;
        }
        if (!bInvestibleId) {
          return 1;
        }
        return 0;
      }
      if (!aMarketId) {
        return -1;
      }
      return aMarketId.localeCompare(bMarketId);
    }
    if (aLevel === RED_LEVEL) {
      return -1;
    }
    return 1;
  });
  return massagedMessages;
}