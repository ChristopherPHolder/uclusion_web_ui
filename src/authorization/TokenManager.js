/*
Class that manages the tokens for a particular type and market.
It _does not_ manage identity's, but does
ask the identity source for new identities when needed
 */
import TokenStorageManager, { TOKEN_TYPE_ACCOUNT, TOKEN_TYPE_MARKET, TOKEN_TYPE_FILE } from './TokenStorageManager';

class TokenManager {

  constructor(tokenRefresher, ssoClient, tokenType, itemId) {
    this.ssoClient = ssoClient;
    this.tokenRefresher = tokenRefresher;
    this.tokenStorageManager = new TokenStorageManager();
    this.tokenType = tokenType;
    this.itemId = itemId;
  }

  getToken() {
    const token = this.tokenStorageManager.getValidToken(this.tokenType, this.itemId);
    if (token) {
      return Promise.resolve(token);
    }
    if (this.tokenType === TOKEN_TYPE_MARKET || this.tokenType === TOKEN_TYPE_ACCOUNT) {
      return this.getIdentityBasedToken();
    }
    if (this.tokenType === TOKEN_TYPE_FILE) {
      return this.refreshFileToken();
    }

    throw new Error('Can\'t refresh your token because I don\'t know how');
  }

  /**
   * Refreshes a file token for the given item id
   * Note this dies if there is no existing token in the system
   * or we can't get a token for the market that issued the file token
   */
  refreshFileToken() {
    const oldToken = this.tokenStorageManager.getToken(this.tokenType, this.itemId);
    this.tokenRefresher.refreshFileToken(oldToken)
      .then((result) => {
        const { uclusion_token } = result;
        this.tokenStorageManager.storeToken(TOKEN_TYPE_FILE, this.itemId, uclusion_token);
        return uclusion_token;
      });
  }

  getIdentityBasedToken() {
    return this.tokenRefresher.getIdentity()
      .then((identity) => {
        switch(this.tokenType){
          case TOKEN_TYPE_MARKET:
            return this.getMarketToken(identity, this.itemId);
          case TOKEN_TYPE_ACCOUNT:
            return this.getAccountToken(identity, this.itemId);
          default:
            throw new Error('Unknown token type');
        }
      });
  }

  getMarketToken(identity, marketId){
    return this.ssoClient.marketCognitoLogin(identity, marketId)
      .then((loginData) => {
        const { uclusion_token } = loginData;
        this.tokenStorageManager.storeToken(TOKEN_TYPE_MARKET, marketId, uclusion_token);
        return uclusion_token;
      });

  }

  getAccountToken(identity, accountId){
    return this.ssoClient.accountCognitoLogin(identity, accountId)
      .then((loginData) => {
        const { uclusion_token } = loginData;
        this.tokenStorageManager.storeToken(TOKEN_TYPE_ACCOUNT, accountId, uclusion_token);
        return uclusion_token;
      });
  }

  clearTokens() {
    this.tokenStorageManager.clearTokenStorage();
  }

}

export default TokenManager;
