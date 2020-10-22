import React, { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import CommentSearchResult from '../Search/CommentSearchResult'
import InvestibleSearchResult from '../Search/InvestibleSearchResult'
import MarketSearchResult from '../Search/MarketSearchResult'
import { List, ListItem, Paper, Popper, Typography, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'
import { isTinyWindow } from '../../utils/windowUtils';
import { getFullLink } from './Notifications'
import { NotificationsContext } from '../../contexts/NotificationsContext/NotificationsContext'
import { useIntl } from 'react-intl'
import { searchStyles } from '../Search/SearchResults';
import VotingNotificationResult from './VotingNotificationResult'
import { getCommentRoot } from '../../contexts/CommentsContext/commentsContextHelper'
import { CommentsContext } from '../../contexts/CommentsContext/CommentsContext'

const useStyles = makeStyles(() => {
  return {
    popper: {
      zIndex: 1500,
      maxHeight: '80%',
      overflow: 'auto',
      marginTop: '1rem'
    },
    link: {
      width: '100%'
    },
    viewed: {
      paddingTop: '1rem',
      fontWeight: 'bold'
    }
  };
});

function DisplayNotifications(props) {
  const { open, setOpen } = props;
  const intl = useIntl();
  const theme = useTheme();
  const classes = useStyles();
  const searchClasses = searchStyles(theme);
  const [anchorEl, setAnchorEl] = useState(null);
  const [messagesState] = useContext(NotificationsContext);
  const [commentsState] = useContext(CommentsContext);
  const { recent } = messagesState;

  useEffect(() => {
    if (_.isEmpty(anchorEl)) {
      setAnchorEl(document.getElementById('notifications-fab'));
    }
  }, [setAnchorEl, anchorEl]);

  function zeroResults () {
    setOpen(false);
  }

  const afterOnClick = isTinyWindow()? zeroResults : () => {}

  function getSearchResult (item) {
    const {
      marketId,
      investibleId,
      aType,
      commentId,
      userId,
    } = item;
    const link = getFullLink(item);
    if (aType === 'NEW_VOTES') {
      return (<VotingNotificationResult marketId={marketId} investibleId={investibleId} classes={searchClasses}
                                        userId={userId} afterOnClick={afterOnClick} link={link}/>);
    } else {
      if (commentId) {
        return (<CommentSearchResult marketId={marketId} commentId={commentId} classes={searchClasses}
                                     afterOnClick={afterOnClick} />);
      }
      if (investibleId) {
        return (<InvestibleSearchResult investibleId={investibleId} classes={searchClasses} afterOnClick={afterOnClick}
                                        link={link}/>);
      }
      if (marketId) {
        return (<MarketSearchResult marketId={marketId} classes={searchClasses} afterOnClick={afterOnClick}
                                    link={link}/>);
      }
    }
  }

  // Show each market or investible once across preview and recently viewed lists
  // The email is the gateway to the app and so has full detail
  // Here we are just trying to get you to or back to a page
  const deDupe = {}

  function getResults(toDisplay) {
    return (toDisplay || []).map((item) => {
      const {
        marketId,
        investibleId,
        commentId,
      } = item;
      const commentRoot = getCommentRoot(commentsState, marketId, commentId);
      const commentRootId = commentRoot ? commentRoot.id : commentId;
      const key = `${marketId}_${investibleId}_${commentRootId}`;
      if (key in deDupe) {
        return React.Fragment;
      }
      deDupe[key] = true;
      return (
        <ListItem
          key={key}
          button
          onClick={zeroResults}
        >
            {getSearchResult(item)}
        </ListItem>
      );
    });
  }

  const placement = 'bottom';

  return (
    <Popper
      open={open}
      id="search-results"
      anchorEl={anchorEl}
      placement={placement}
      className={classes.popper}
    >
      <Paper>
        {!_.isEmpty(recent) && (
          <>
            <Typography align="center" className={classes.viewed}>
              {intl.formatMessage({ id: 'notificationsRecent' })}
            </Typography>
            <List
              dense
            >
              {getResults(recent)}
            </List>
          </>
        )}
      </Paper>
    </Popper>
  );
}

export default DisplayNotifications;