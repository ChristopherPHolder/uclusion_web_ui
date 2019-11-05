import uclusion from 'uclusion_sdk';
import _ from 'lodash';
import AmpifyIdentitySource from '../authorization/AmplifyIdentityTokenRefresher';
import config from '../config';


function getSummaryInfo() {
  return new AmpifyIdentitySource().getIdentity()
    .then((idToken) => uclusion.constructSummariesClient(config.api_configuration)
      .then((summaryClient) => ({ summaryClient, idToken })));
}

export function getVersions() {
  return getSummaryInfo()
    .then((summaryInfo) => {
      const { summaryClient, idToken } = summaryInfo;
      // as a side effect, whenever we get the active market list, we'll update the
      // authorization tokens contained inside, since it's free
      return summaryClient.versions(idToken)
        .then((versions) => {
          const rawMarketVersions = _.remove(versions, (versionRow) => versionRow.type_object_id.includes('market'));
          const notificationVersion = versions.length > 0 ? versions[0] : {};
          const marketVersions = rawMarketVersions.map((version) => {
            const { type_object_id: typeObjectId } = version;
            const marketId = typeObjectId.split('_')[1];
            // eslint-disable-next-line no-param-reassign
            delete version.type_object_id;
            return { ...version, marketId };
          });
          return { marketVersions, notificationVersion };
        });
    });
}
