import getMenuItems from './menuItems';

import locales from './locales';
import routes from './routes';
import { themes } from './themes';
import grants from './grants';
import ReactWebAuthorizer from '../utils/ReactWebAuthorizer';

const authorizer = new ReactWebAuthorizer(process.env.REACT_APP_UCLUSION_URL);

const config = {
  initial_state: {
    themeSource: {
      isNightModeOn: false,
      source: 'light',
    },
    locale: 'en',
  },
  maxRichTextEditorSize: 7340032,
  drawer_width: 256,
  locales,
  themes,
  grants,
  routes,
  getMenuItems,
  webSockets: {
    wsUrl: process.env.REACT_APP_WEBSOCKET_URL,
    reconnectInterval: 2000,
  },
  api_configuration: {
    authorizer,
    baseURL: process.env.REACT_APP_UCLUSION_URL,
  },
  version: process.env.REACT_APP_VERSION,
  uclusionSupportInfo: {
    email: process.env.REACT_APP_UCLUSION_SUPPORT_EMAIL
  },
  helpMovies: {
    playerDemo: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    accountSignupHelp: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    usersInvestiblesIntro: 'https://www.uclusion.com/help_videos/users/UclusionIntroUserInvestibles.mp4',
    adminsMarketEditIntro: 'https://www.uclusion.com/help_videos/admins/UclusionIntroAdminMarketEdit.mp4',
  },
  termsOfUseLink: 'https://app.termly.io/document/terms-of-use-for-saas/02fc002b-2cab-4027-8c49-ed2589077551',
};

export default config;
