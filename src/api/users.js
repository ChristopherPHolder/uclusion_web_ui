import { getAccountClient, getMarketClient } from './uclusionClient';
import { toastErrorAndThrow } from '../utils/userMessage';
import { USER_POKED_TYPE } from '../constants/notifications'

export function deleteMessage(message) {
  const { marketId, type_object_id: typeObjectId, aType, pokeType } = message;
  const objectId = typeObjectId.split('_').pop();
  if (aType === USER_POKED_TYPE) {
    return getAccountClient()
      .then((client) => client.users.removeNotification(objectId, aType, pokeType));
  }
  return getMarketClient(marketId)
    .then((client) => client.users.removeNotification(objectId, aType));
}

export function startSubscription(paymentId, tier) {
  return getAccountClient()
    .then((client) => client.users.startSubscription(paymentId, tier));
}

export function updatePaymentInfo(paymentId) {
  return getAccountClient()
    .then((client) => client.users.updatePayment(paymentId));
}

export function addParticipants(marketId, participants) {
  return getMarketClient(marketId)
    .then((client) => client.users.addUsers(participants))
    .catch((error) => toastErrorAndThrow(error, 'errorAddParticipantsFailed'));
}

export function inviteParticipants(marketId, participants) {
  return getMarketClient(marketId)
    .then((client) => client.users.inviteUsers(participants))
    .catch((error) => toastErrorAndThrow(error, 'errorInviteParticipantsFailed'));
}

export function updateUser(userOptions) {
  return getAccountClient().then((client) => client.users.update(userOptions))
    .catch((error) => toastErrorAndThrow(error, 'errorUpdateUserFailed'));
}
