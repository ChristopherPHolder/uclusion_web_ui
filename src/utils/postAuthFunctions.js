import { fetchUser } from '../store/Users/actions';

import { setUclusionLocalStorageItem, getUclusionLocalStorageItem } from '../components/utils';
import { fetchMarket, fetchMarketStages } from '../store/Markets/actions';
import { clearReduxStore } from './userStateFunctions';

/**
 * Checks the current application version against the version of the application
 * we have stored in the state. If they don't match, force reloads the page.
 * @param currentVersion
 */
function forceApplicationVersion(currentVersion){
  const key = 'applicationVersion';
  const myVersion = getUclusionLocalStorageItem(key);
  if (currentVersion !== myVersion) {
    console.debug('Reloading to version ' + currentVersion);
    setUclusionLocalStorageItem(key, currentVersion);
    // deprecated, but basically the only way to do this
  //  window.location.reload(true);
  }
}

export function marketChangeTasks(dispatch, market_id, user, webSocket) {
  // console.log('Destination ' + destination_page + ' for user ' + JSON.stringify(user))
  // pre-emptively fetch the market and user, since we're likely to need it
  dispatch(fetchMarket({ market_id }));
  // Have the user from login but not the market presences which this fetch user will retrieve
  dispatch(fetchUser({ marketId: market_id, user }));
  dispatch(fetchMarketStages({ marketId: market_id }));
  webSocket.subscribe(user.id, { market_id });
}

export function postAuthTasks(usersReducer, deployedVersion, uclusionToken, tokenType, dispatch, market_id, user, webSocket) {
  if (uclusionToken) {
    const authInfo = { token: uclusionToken, type: tokenType };
    setUclusionLocalStorageItem('auth', authInfo);
  }
  forceApplicationVersion(deployedVersion);
  // if we're not sure the user is the same as we loaded redux with, zero out redux
  if (!usersReducer || !usersReducer.currentUser || usersReducer.currentUser.id !== user.id) {
    console.debug('Clearing user redux');
    clearReduxStore(dispatch);
  }
  marketChangeTasks(dispatch, market_id, user, webSocket);

}
