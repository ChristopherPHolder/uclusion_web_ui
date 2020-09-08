import { VIEW_EVENT, VISIT_CHANNEL } from '../contexts/NotificationsContext/NotificationsContext'
import { intl } from '../components/ContextHacks/IntlGlobalProvider'
import { pushMessage } from './MessageBusUtils'
import _ from 'lodash'
import { getInvestible } from '../contexts/InvestibesContext/investiblesContextHelper'
import { getMarket } from '../contexts/MarketsContext/marketsContextHelper'

/** Given the pathpart _without the hash or query params
 * will extract the action, the marketId and the investibleId
 * Assumes the pathpart has a leading /
 * @param path
 * @return {null}
 */
export function decomposeMarketPath(path) {
  const split = path.split('/');
  // first match is empty. because it's the leading / the action
  // so well have ["", <action>, <marketid>, <investibleid>] in that order
  const [, action, marketId, investibleId] = split;
  return { action, marketId, investibleId };
}

export function broadcastView(marketId, investibleId, isEntry, action) {
  const message = { marketId, investibleId, isEntry, action };
  pushMessage(
    VISIT_CHANNEL,
    {
      event: VIEW_EVENT,
      message,
    },
  );
}

export function navigate(history, to) {
  const {
    action: fromAction,
    marketId: fromMarketId,
    investibleId: fromInvestibleId,
  } = decomposeMarketPath(history.location.pathname);
  broadcastView(fromMarketId, fromInvestibleId, false, fromAction);
  if (to) {
    history.push(to);
  } else {
    history.goBack();
  }
  const {
    action: toAction,
    marketId: toMarketId,
    investibleId: toInvestibleId,
  } = decomposeMarketPath(history.location.pathname);
  broadcastView(toMarketId, toInvestibleId, true, toAction);
}


/**
 *
 * @param history
 * @param crumbs A list objects of the type { name, link }
 * @param includeHome if Home Should be prepended to the list
 */
export function makeBreadCrumbs(history, crumbs = [], includeHome = true) {
  const homeName = intl.formatMessage({ id: 'homeBreadCrumb' });
  const homeCrumb = [];
  if (includeHome) {
    homeCrumb.push({ name: homeName, link: '/', id:'homeCrumb'});
  }
  const myCrumbs = homeCrumb.concat(crumbs);
  const breadCrumbs = myCrumbs.map((crumb) => {
    const { name, link, image, id, onClick } = crumb;
    const usedOnClick = onClick || ((event) => {
      event.preventDefault();
      navigate(history, link);
    });
    return {
      title: name,
      image,
      id,
      link,
      onClick: usedOnClick,
    };
  });
  return breadCrumbs;
}

/**
 * Makes a breadcrumb chain that includes /home/archives
 * @param history
 * @param crumbs
 */
export function makeArchiveBreadCrumbs(history, crumbs = []) {
  const archiveCrumb = {
    name: intl.formatMessage({ id: 'archivesTitle'}),
    link: '/archives',
  };
  const myCrumbs = [archiveCrumb, ...crumbs];
  return makeBreadCrumbs(history, myCrumbs);
}

export function createTitle(fullTitle, titleSize) {
  if (!fullTitle) {
    return '';
  }
  if (!fullTitle.substring) {
    return fullTitle;
  }
  if (fullTitle.length < titleSize) {
    return fullTitle;
  }
  return `${fullTitle.substring(0, titleSize)}...`;
}

export function formInviteLink(marketToken) {
  const current = window.location.href;
  const url = new URL(current);
  url.pathname = `invite/${marketToken}`;
  url.search = '';
  url.hash = '';
  return url.toString();
}

export function urlHelperGetName(marketState, investibleState) {
  return (url) => {
    const urlParts = new URL(url);
    if (urlParts.host === window.location.host) {
      const { action, marketId, investibleId } = decomposeMarketPath(urlParts.pathname);
      if (action === 'dialog') {
        if (investibleId) {
          const inv = getInvestible(investibleState, investibleId);
          if (!_.isEmpty(inv)) {
            const { investible } = inv;
            const { name } = investible;
            return name;
          }
        }
        if (marketId) {
          const market = getMarket(marketState, marketId);
          if (!_.isEmpty(market)) {
            const { name } = market;
            return name;
          }
        }
      }
    }
    return undefined;
  }
}

export function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

export function formCommentLink(marketId, investibleId, commentId){
  const commentPart = `#c${commentId}`;
  if (!_.isEmpty(investibleId)) {
    return formInvestibleLink(marketId, investibleId) + commentPart;
  }
  return formMarketLink(marketId) + commentPart;
}


export function formInvestibleEditLink(marketId, investibleId){
  return formInvestibleLinkWithPrefix('investibleEdit', marketId, investibleId)
}

export function formInvestibleLinkWithPrefix(preFix, marketId, investibleId) {
  return `/${preFix}/${marketId}/${investibleId}`;
}

export function formInvestibleLink(marketId, investibleId) {
  return formInvestibleLinkWithPrefix('dialog', marketId, investibleId);
}

export function formatMarketLinkWithPrefix(prefix, marketId) {
  return `/${prefix}/${marketId}`;
}

/**
 * Forms a link to a given market id with the given subpath. Usually used when switching
 * to a different market
 * @param marketId
 * @returns {string}
 */
export function formMarketLink(marketId) {
  return formatMarketLinkWithPrefix('dialog', marketId);
}

export function formMarketArchivesLink(marketId) {
  return formatMarketLinkWithPrefix('dialogArchives', marketId);
}

export function formMarketEditLink(marketId) {
  return formatMarketLinkWithPrefix('marketEdit', marketId);
}

export function formMarketManageLink(marketId, participations) {
  const manageLink = formatMarketLinkWithPrefix('marketManage', marketId);
  return participations? manageLink + '#participation=true' : manageLink;
}

export function formMarketAddInvestibleLink(marketId) {
  return formatMarketLinkWithPrefix('investibleAdd', marketId);
}
