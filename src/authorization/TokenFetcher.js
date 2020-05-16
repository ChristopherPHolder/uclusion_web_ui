/*
Class that manages the tokens for a particular type and market.
It _does not_ manage identity's, but does
ask the identity source for new identities when needed
 */
import TokenStorageManager, {
  TOKEN_TYPE_ACCOUNT,
  TOKEN_TYPE_MARKET,
  TOKEN_TYPE_MARKET_INVITE
} from './TokenStorageManager'

class TokenFetcher {

  constructor (tokenRefresher, ssoClient, tokenType, itemId, isObserver) {
    this.ssoClient = ssoClient;
    this.tokenRefresher = tokenRefresher;
    this.tokenStorageManager = new TokenStorageManager();
    this.tokenType = tokenType;
    this.itemId = itemId;
    this.isObserver = isObserver;
  }

  /**
   * Gets a token for our type of token and item id
   * @returns {void|undefined|Promise<the>}
   */
  getToken () {
    return this.tokenStorageManager.getValidToken(this.tokenType, this.itemId)
      .then((token) => {
        if (token) {
          console.log(`got token for ${this.tokenType} id ${this.itemId}`);
          return Promise.resolve(token);
        }
        console.log(`refreshing token for ${this.tokenType} id ${this.itemId}`);
        return this.getRefreshedToken(this.itemId);
      });
  }

  getRefreshedToken (itemId) {
    if (this.tokenType === TOKEN_TYPE_MARKET || this.tokenType === TOKEN_TYPE_ACCOUNT) {
      return this.getIdentityBasedToken(this.isObserver, itemId);
    }
    throw new Error('Can\'t refresh your token because I don\'t know how');
  }

  getIdentityBasedToken (isObserver, itemId) {
    return this.tokenRefresher.getIdentity()
      .then((identity) => {
        switch (this.tokenType) {
          case TOKEN_TYPE_MARKET:
            return this.getMarketToken(identity, itemId, isObserver);
          case TOKEN_TYPE_ACCOUNT:
            return this.getAccountToken(identity, itemId);
          default:
            throw new Error('Unknown token type');
        }
      });
  }

  getIdentityBasedTokenAndInfo (isObserver) {
    return this.tokenRefresher.getIdentity()
      .then((identity) => {
        switch (this.tokenType) {
          case TOKEN_TYPE_MARKET:
            return this.getMarketTokenAndLoginData(identity, this.itemId, isObserver);
          case TOKEN_TYPE_MARKET_INVITE:
            return this.getMarketTokenOnInvite(identity, this.itemId, isObserver);
          case TOKEN_TYPE_ACCOUNT:
            return this.getAccountToken(identity, this.itemId);
          default:
            throw new Error('Unknown token type');
        }
      });
  }

  getMarketToken (identity, marketId, isObserver) {
    // console.debug(`logging into market ${marketId} with cognito identity ${identity} and isObserver ${isObserver}`);
    return this.getMarketTokenAndLoginData(identity, marketId, isObserver)
      .then((loginData) => {
        const { uclusion_token } = loginData;
        return uclusion_token;
      });

  }

  getMarketTokenAndLoginData (identity, marketId, isObserver) {
    // console.debug(`logging into market ${marketId} with cognito identity ${identity} and isObserver ${isObserver}`);
    return this.ssoClient.marketCognitoLogin(identity, marketId, isObserver)
      .then((loginData) => {
        const { uclusion_token } = loginData;
        return this.tokenStorageManager.storeToken(TOKEN_TYPE_MARKET, marketId, uclusion_token)
          .then(() => loginData);
      });

  }

  getMarketTokenOnInvite (identity, marketToken, isObserver) {
    // console.debug(`invite into market ${marketId} with cognito identity ${identity} and isObserver ${isObserver}`);
    return this.ssoClient.marketInviteLogin(identity, marketToken, isObserver)
      .then((loginData) => {
        const { uclusion_token, market_id: marketId } = loginData;
        return this.tokenStorageManager.storeToken(TOKEN_TYPE_MARKET, marketId, uclusion_token)
          .then(() => loginData);
      });

  }

  getAccountToken (identity, accountId) {
    return this.ssoClient.accountCognitoLogin(identity, accountId)
      .then((loginData) => {
        const { uclusion_token } = loginData;
        return this.tokenStorageManager.storeToken(TOKEN_TYPE_ACCOUNT, accountId, uclusion_token)
          .then(() => uclusion_token);
      });
  }
}

export default TokenFetcher;
