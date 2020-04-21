import React, { useContext, useEffect, useLayoutEffect, useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router'
import _ from 'lodash'
import reducer, {
  initializeState,
  isMessageEqual,
  NOTIFICATIONS_CONTEXT_NAMESPACE,
  pageIsEqual,
  processedPage,
} from './notificationsContextReducer'
import beginListening from './notificationsContextMessages'
import LocalForageHelper from '../../utils/LocalForageHelper'
import { HighlightedCommentContext, HIGHTLIGHT_ADD } from '../HighlightedCommentContext'
import { DiffContext } from '../DiffContext/DiffContext'
import { HighlightedVotingContext } from '../HighlightedVotingContext'
import { hasUnViewedDiff } from '../DiffContext/diffContextHelper'
import { navigate } from '../../utils/marketIdPathFunctions'
import { getFullLink } from '../../components/Notifications/Notifications'
import { ISSUE_TYPE } from '../../constants/notifications'

export const EMPTY_STATE = {
  initializing: true,
  messages: [],
};

const NotificationsContext = React.createContext(EMPTY_STATE);

export const VISIT_CHANNEL = 'VisitChannel';
export const VIEW_EVENT = 'pageView';

function NotificationsProvider(props) {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const { page, messages, lastPage } = state;
  const [diffState] = useContext(DiffContext);
  const [isInitialization, setIsInitialization] = useState(true);
  const [isProcessingPage, setIsProcessingPage] = useState(undefined);
  const [isProcessingPageInitial, setIsProcessingPageInitial] = useState(true);
  const [, highlightedCommentDispatch] = useContext(HighlightedCommentContext);
  const [, highlightedVotingDispatch] = useContext(HighlightedVotingContext);
  const history = useHistory();
  const { location } = history;
  const { pathname, hash } = location;
  const [hashFragment, setHashFragment] = useState(undefined);
  const [asyncTimerId, setAsyncTimerId] = useState(undefined);
  const [observer, setObserver] = useState(undefined);
  const [scrollTarget, setScrollTarget] = useState(undefined);

  useEffect(() => {
    if (isInitialization) {
      const lfg = new LocalForageHelper(NOTIFICATIONS_CONTEXT_NAMESPACE);
      lfg.getState()
        .then((state) => {
          if (state) {
            const { messages } = state;
            //We don't want to load up page or lastPage from disk
            dispatch(initializeState({messages}));
          }
        });
      beginListening(dispatch);
      setIsInitialization(false);
    }
    return () => {
    };
  }, [isInitialization]);

  useLayoutEffect(() => {
    // See https://github.com/rafrex/react-router-hash-link/blob/master/src/index.js
    function reset(full) {
      if (observer) observer.disconnect();
      if (asyncTimerId) {
        window.clearTimeout(asyncTimerId);
        setAsyncTimerId(undefined);
      }
      if (full) {
        setHashFragment(undefined);
        setScrollTarget(undefined);
      }
    }

    function getElAndScroll() {
      const element = document.getElementById(hashFragment);
      if (element !== null) {
        element.scrollIntoView({block: 'center'});
        reset(true);
        return true;
      }
      return false;
    }

    function hashLinkScroll() {
      // Push onto callback queue so it runs after the DOM is updated
      window.setTimeout(() => {
        if (getElAndScroll() === false) {
          const myObserver = new MutationObserver(getElAndScroll);
          myObserver.observe(document, {
            attributes: true,
            childList: true,
            subtree: true,
          });
          setObserver(myObserver);
          // if the element doesn't show up in 10 seconds, stop checking
          const myAsyncTimerId = window.setTimeout(() => {
            reset(true);
          }, 10000);
          setAsyncTimerId(myAsyncTimerId);
        }
      }, 0);
    }
    if (hashFragment && hashFragment !== scrollTarget) {
      setScrollTarget(hashFragment);
      reset(false);
      hashLinkScroll();
    }
  }, [asyncTimerId, hashFragment, observer, scrollTarget]);

  useLayoutEffect(() => {
    if (page && !pageIsEqual(page, isProcessingPage)) {
      if (isProcessingPageInitial) {
        setIsProcessingPage(page);
        // Too confusing for the user if multiple processing happening at once so ignore everything for 5s
        setTimeout(() => {
          setIsProcessingPageInitial(false);
          setIsProcessingPage(undefined);
        }, 5000);
      }
      let isOldPage = lastPage !== undefined && pageIsEqual(page, lastPage);
      // If last page and page are equal then we last processed this page and consider the user as already reading it
      page.lastProcessed = Date.now();
      const scrollTarget = (hash && hash.length > 1) ? hash.substring(1, hash.length) : undefined;
      if (!isOldPage && !hash) {
        //Scroll to the top if its a new page and there is no anchor to scroll to
        window.scrollTo(0, 0);
      }
      if (_.isEmpty(messages)) {
        if (!isOldPage) {
          // If there are no new messages on a new page then just scroll and mark old
          setHashFragment(scrollTarget);
        }
      } else {
        const newUserMessage = messages.find((massagedMessage) => massagedMessage.pokeType === 'new_user');
        if (newUserMessage) {
          if (pathname === '/') {
            // This is a new user going to home page but we need to redirect
            navigate(history, '/dialogAdd#type=PLANNING');
          } else {
            const { marketId, action } = page;
            let removeNewUserNotification = false;
            if (marketId) {
              // This user is coming in on a market invite
              removeNewUserNotification = true;
            } else if (action === 'dialogAdd' ) {
              // This new user reached the dialog add page successfully so delete this message
              // Otherwise they might click on the notification in the tray when already where supposed to be
              removeNewUserNotification = true;
            }
            if (removeNewUserNotification) {
              dispatch(processedPage(page, [newUserMessage], {}));
              return;
            }
          }
        }
        const filtered = messages.filter((message) => {
          const { marketId, investibleId, action, beingProcessed } = page;
          const {
            marketId: messageMarketId,
            investibleId: messageInvestibleId,
            pokeType,
          } = message;
          const marketMatch = action === 'dialog' && !_.isEmpty(messageMarketId)
            && marketId === messageMarketId && investibleId === messageInvestibleId;
          const processedMessage = (beingProcessed || []).find((processing) => isMessageEqual(message, processing));
          const isBeingProcessed = !_.isEmpty(processedMessage);
          // We would like to guarantee that we don't process the same messages twice but it is difficult
          const doRemove = !isBeingProcessed && (marketMatch ||
            (pokeType === 'slack_reminder' && action === 'notificationPreferences')
            || (pokeType === 'upgrade_reminder' && action === 'upgrade'));
          if (doRemove) {
            if (!beingProcessed) {
              page.beingProcessed = [];
            }
            page.beingProcessed.push(message);
          }
          return doRemove;
        });
        if (_.isEmpty(filtered)) {
          if (!isOldPage) {
            setHashFragment(scrollTarget);
          }
          return;
        }
        if (!isProcessingPageInitial) {
          setIsProcessingPage(page);
          // More came in on this page so put the guard back up
          setTimeout(() => {
            setIsProcessingPageInitial(true);
            setIsProcessingPage(undefined);
          }, 5000);
        }
        //If you've been on the page less than 3s count as new for the purposes of new messages
        isOldPage = isOldPage && (Date.now() - page.lastProcessed > 3000);
        // Process the messages that match this page
        filtered.forEach((message) => {
          const {
            level,
            commentId,
            associatedUserId,
          } = message;
          if (commentId) {
            highlightedCommentDispatch({ type: HIGHTLIGHT_ADD, commentId, level });
          }
          if (associatedUserId) {
            highlightedVotingDispatch({ type: HIGHTLIGHT_ADD, associatedUserId, level });
          }
        });
        filtered.sort(function(a, b) {
          if (a.level === b.level) {
            if (a.aType === b.aType || a.level !== 'RED') {
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
          if (a.level === 'RED') {
            return -1;
          }
          return 1;
        });
        // We only link to one message and we only need one message to tell the delete API what page we are on
        // so it can delete all messages associated with that page.
        const message = filtered[0];
        let toastInfo = {};
        const {
          marketId,
          investibleId,
          text,
          level,
          aType,
          commentId,
        } = message;
        // If there are multiple new RED on this page not much we can do - not a bug tracker
        const multiUpdate = filtered.length > 1 && level !== 'RED';
        // Sadly intl not available here TODO - Fix
        const myText = multiUpdate ? `${filtered.length} Updates` : text;
        const diffId = commentId || investibleId || marketId;
        const linkNotMatching = getFullLink(message) !== `${pathname}${hash}`;
        // Do not toast a non red unread as already have diff and dismiss - unless is new
        // Do toast if the page hasn't changed since will not scroll in that case and need toast if want to scroll
        const shouldToast = (multiUpdate || isOldPage || (!isOldPage && linkNotMatching))
          || (level === 'RED') || (!commentId && (aType !== 'UNREAD' || hasUnViewedDiff(diffState, diffId)));
        const myCustomToastId = myText + '_' + diffId;
        if (shouldToast && !toast.isActive(myCustomToastId)) {
          //Tell the notifications reducer what to do but only do it inside the dispatch for fear of processing twice
          const options = {
            onClick: () => navigate(history, getFullLink(message)),
            toastId: myCustomToastId
          }
          toastInfo = { myText, level, options };
        }
        dispatch(processedPage(page, filtered, toastInfo));
        if (!isOldPage) {
          setHashFragment(scrollTarget);
        }
      }
    }
    return () => {
    };
  }, [page, messages, diffState, history, lastPage, highlightedCommentDispatch, highlightedVotingDispatch,
    pathname, hash, isProcessingPage, isProcessingPageInitial]);

  return (
    <NotificationsContext.Provider value={[state, dispatch]}>
      {children}
    </NotificationsContext.Provider>
  );
}

export { NotificationsContext, NotificationsProvider };
