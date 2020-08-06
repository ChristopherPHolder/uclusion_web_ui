import React, { useContext, useEffect, useState } from 'react'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import _ from 'lodash'
import ReadOnlyQuillEditor from '../TextEditors/ReadOnlyQuillEditor'
import CommentAdd from './CommentAdd'
import { JUSTIFY_TYPE, REPLY_TYPE, REPORT_TYPE } from '../../constants/comments'
import { removeComment, reopenComment, resolveComment } from '../../api/comments'
import SpinBlockingButton from '../SpinBlocking/SpinBlockingButton'
import { OperationInProgressContext } from '../../contexts/OperationInProgressContext/OperationInProgressContext'
import { MarketPresencesContext } from '../../contexts/MarketPresencesContext/MarketPresencesContext'
import { getMarketPresences } from '../../contexts/MarketPresencesContext/marketPresencesHelper'
import CommentEdit from './CommentEdit'
import { MarketsContext } from '../../contexts/MarketsContext/MarketsContext'
import { getMarket, getMyUserForMarket } from '../../contexts/MarketsContext/marketsContextHelper'
import {
  HIGHLIGHT_REMOVE,
  HighlightedCommentContext
} from '../../contexts/HighlightingContexts/HighlightedCommentContext'
import CardType from '../CardType'
import { EMPTY_SPIN_RESULT } from '../../constants/global'
import { addCommentToMarket, removeComments } from '../../contexts/CommentsContext/commentsContextHelper'
import { CommentsContext } from '../../contexts/CommentsContext/CommentsContext'
import { ACTIVE_STAGE } from '../../constants/markets'
import { red } from '@material-ui/core/colors'
import { VersionsContext } from '../../contexts/VersionsContext/VersionsContext'
import { EXPANDED_CONTROL, ExpandedCommentContext } from '../../contexts/CommentsContext/ExpandedCommentContext'
import UsefulRelativeTime from '../TextFields/UseRelativeTime'

const useCommentStyles = makeStyles(
  theme => {
    return {
    chip: {
      margin: 0,
      marginBottom: 18
    },
    content: {
      marginTop: "12px",
      fontSize: 15,
      lineHeight: "175%"
    },
    cardContent: {
      padding: "0 20px"
    },
    cardActions: {
      padding: "8px"
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      boxShadow: "none",
      width: "100%"
    },
    action: {
      boxShadow: "none",
      fontSize: 12,
      padding: "4px 16px",
      textTransform: "none",
      "&:hover": {
        boxShadow: "none"
      }
    },
    actionPrimary: {
      backgroundColor: "#2D9CDB",
      color: "white",
      "&:hover": {
        backgroundColor: "#2D9CDB"
      }
    },
    actionSecondary: {
      backgroundColor: "#BDBDBD",
      color: "black",
      "&:hover": {
        backgroundColor: "#BDBDBD"
      }
    },
    actionWarned: {
      backgroundColor: "#BDBDBD",
      color: "black",
      "&:hover": {
        backgroundColor: red["400"],
      }
    },
    updatedBy: {
      alignSelf: "baseline",
      color: "#434343",
      fontWeight: "bold",
      fontSize: 12,
      lineHeight: 1.75,
      marginLeft: "auto"
    },
    actionResolveToggle: {
      alignSelf: "baseline",
      margin: "11px 12px 11px 16px",
      [theme.breakpoints.down('sm')]: {
        margin: "11px 0px 11px 3px",
      },
    },
    actionEdit: {
      alignSelf: "baseline",
      margin: "11px 0px 11px 16px",
      [theme.breakpoints.down('sm')]: {
        margin: "11px 0px 11px 3px",
      },
    },
    commentType: {
      alignSelf: "start",
      display: "inline-flex"
    },
    createdBy: {
      fontSize: "15px",
      fontWeight: "bold"
    },
    childWrapper: {
      // borderTop: '1px solid #DCDCDC',
    },
    initialComment: {
      display: "flex"
    },
    avatarWrapper: {
      marginRight: "20px"
    },
    containerRed: {
      boxShadow: "10px 5px 5px red",
      overflow: "visible"
    },
    containerYellow: {
      boxShadow: "10px 5px 5px yellow",
      overflow: "visible"
    },
    container: {
      overflow: "visible"
    },
    timeElapsed: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '.7rem',
        lineHeight: 1,
        paddingLeft: '5px'
      },
    }
  }
},
{ name: "Comment" }
);

/**
 * @type {React.Context<{comments: Comment[], marketId: string}>}
 */
const LocalCommentsContext = React.createContext(null);
function useComments() {
  return React.useContext(LocalCommentsContext).comments;
}
function useMarketId() {
  return React.useContext(LocalCommentsContext).marketId;
}

/**
 * A question or issue
 * @param {{comment: Comment, comments: Comment[]}} props
 */
function Comment(props) {
  const { comment, marketId, comments, allowedTypes } = props;
  const [commentsState, commentsDispatch] = useContext(CommentsContext);
  const intl = useIntl();
  const classes = useCommentStyles();
  const { id, comment_type: commentType, resolved } = comment;
  const presences = usePresences(marketId);
  const createdBy = useCommenter(comment, presences) || unknownPresence;
  const updatedBy = useUpdatedBy(comment, presences) || unknownPresence;
  const [marketsState] = useContext(MarketsContext);
  const market = getMarket(marketsState, marketId) || {};
  const { market_stage: marketStage } = market;
  const userId = getMyUserForMarket(marketsState, marketId) || {};
  const activeMarket = marketStage === ACTIVE_STAGE;
  const myPresence = presences.find((presence) => presence.current_user) || {};
  const inArchives = !activeMarket || !myPresence.following;
  const replies = comments.filter(comment => comment.reply_id === id);
  const sortedReplies = _.sortBy(replies, "created_at");
  const [highlightedCommentState, highlightedCommentDispatch] = useContext(HighlightedCommentContext);
  const [expandedCommentState, expandedCommentDispatch] = useContext(ExpandedCommentContext);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [operationRunning] = useContext(OperationInProgressContext);
  const [, versionsDispatch] = useContext(VersionsContext);
  const enableEditing = !inArchives;

  function toggleReply() {
    setReplyOpen(!replyOpen);
  }

  function toggleEdit() {
    setEditOpen(!editOpen);
  }

  function reopen() {
    return reopenComment(marketId, id)
      .then((comment) => {
        addCommentToMarket(comment, commentsState, commentsDispatch, versionsDispatch);
        return EMPTY_SPIN_RESULT;
      });
  }
  function remove() {
    return removeComment(marketId, id)
      .then(() => {
        removeComments(commentsDispatch, marketId, [id]);
        return EMPTY_SPIN_RESULT;
      });
  }
  function resolve() {
    return resolveComment(marketId, id)
      .then((comment) => {
        addCommentToMarket(comment, commentsState, commentsDispatch, versionsDispatch);
        return EMPTY_SPIN_RESULT;
      });
  }
  function getHilightedIds(myReplies, highLightedIds) {
    const highLighted = highLightedIds || [];
    if (_.isEmpty(myReplies) || _.isEmpty(highlightedCommentState)) {
      return highLighted;
    }
    myReplies.forEach(reply => {
      if (reply.id in highlightedCommentState) {
        const { level } = highlightedCommentState[reply.id];
        if (level) {
          highLighted.push(reply.id);
        }
      }
    });
    myReplies.forEach((reply) => {
      const replyReplies = comments.filter(
        comment => comment.reply_id === reply.id
      );
      getHilightedIds(replyReplies, highLighted);
    });
    return highLighted;
  }
  const highlightIds = getHilightedIds(replies);
  const myHighlightedState = highlightedCommentState[id] || {};
  const myExpandedState = expandedCommentState[id] || {};
  const { level: myHighlightedLevel } = myHighlightedState;
  const { expanded: myRepliesExpanded } = myExpandedState;
  const myRepliesExpandedCalc = myRepliesExpanded === undefined ? _.isEmpty(highlightIds) ? undefined : true : myRepliesExpanded;
  const repliesExpanded = myRepliesExpandedCalc === undefined ? !comment.resolved || comment.reply_id : myRepliesExpandedCalc;

  useEffect(() => {
    if (!_.isEmpty(highlightIds) && !myRepliesExpanded && commentType !== REPLY_TYPE) {
      // Open if need to highlight inside - user can close again
      expandedCommentDispatch({ type: EXPANDED_CONTROL, commentId: id, expanded: true });
    }
  }, [id, myRepliesExpanded, expandedCommentDispatch, highlightIds, commentType]);

  const displayUpdatedBy =
    updatedBy !== undefined && comment.updated_by !== comment.created_by;

  const showActions = !replyOpen || replies.length > 0;
  function getCommentHighlightStyle() {
    if (myHighlightedLevel) {
      if (myHighlightedLevel === "YELLOW" || myHighlightedLevel === "BLUE") {
        return classes.containerYellow;
      }
      return classes.containerRed;
    }
    return classes.container;
  }

  const isEditable = comment.created_by === userId;

  return (
    <React.Fragment>
      <Card elevation={0} className={getCommentHighlightStyle()}>
        <Box display="flex">
          <CardType className={classes.commentType} type={commentType} resolved={resolved} />
          <Typography className={classes.updatedBy}>
            {displayUpdatedBy &&
              `${intl.formatMessage({ id: "lastUpdatedBy" })} ${
                updatedBy.name
              }`}
          </Typography>
          {commentType !== JUSTIFY_TYPE && commentType !== REPLY_TYPE && (
            <Typography className={classes.timeElapsed} variant="body2">
              <UsefulRelativeTime
                value={Date.parse(comment.updated_at) - Date.now()}
              />
            </Typography>
          )}
          {enableEditing && isEditable && (
            <Button
              className={clsx(
                classes.action,
                classes.actionSecondary,
                classes.actionEdit
              )}
              onClick={toggleEdit}
              variant="contained"
            >
              <FormattedMessage id="edit" />
            </Button>
          )}
          {enableEditing && (
            <SpinBlockingButton
              className={clsx(
                classes.action,
                commentType === REPORT_TYPE ? classes.actionWarned : classes.actionSecondary,
                classes.actionResolveToggle
              )}
              marketId={marketId}
              onClick={commentType === REPORT_TYPE ? remove : comment.resolved ? reopen : resolve}
              variant="contained"
              hasSpinChecker
            >
              {intl.formatMessage({
                id: commentType === REPORT_TYPE ? "commentRemoveLabel" : comment.resolved ? "commentReopenLabel"
                  : "commentResolveLabel"
              })}
            </SpinBlockingButton>
          )}
          {(myPresence.is_admin || isEditable) && enableEditing && commentType !== REPORT_TYPE && comment.resolved && (
            <SpinBlockingButton
              className={clsx(
                classes.action,
                classes.actionWarned,
                classes.actionResolveToggle
              )}
              marketId={marketId}
              onClick={remove}
              variant="contained"
              hasSpinChecker
            >
              {intl.formatMessage({
                id: "commentRemoveLabel"
              })}
            </SpinBlockingButton>
          )}
        </Box>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.createdBy} variant="caption">
            {createdBy.name}
          </Typography>
          <Box marginTop={1}>
            <ReadOnlyQuillEditor value={comment.body} />
            {editOpen && (
              <CommentEdit
                marketId={marketId}
                comment={comment}
                onSave={toggleEdit}
                onCancel={toggleEdit}
                allowedTypes={allowedTypes}
              />
            )}
          </Box>
        </CardContent>
        {showActions && (
          <CardActions className={`${classes.cardActions} ${classes.actions}`}>
            {replies.length > 0 && (
              <Button
                className={clsx(classes.action, classes.actionSecondary)}
                variant="contained"
                onClick={() => {
                  const newRepliesExpanded = !repliesExpanded;
                  expandedCommentDispatch({ type: EXPANDED_CONTROL, commentId: id, expanded: newRepliesExpanded });
                  if (!newRepliesExpanded && !_.isEmpty(highlightIds)) {
                    highlightIds.forEach((commentId) => highlightedCommentDispatch({ type: HIGHLIGHT_REMOVE, commentId }));
                  }
                }}
              >
                <FormattedMessage
                  id={
                    repliesExpanded
                      ? "commentCloseThreadLabel"
                      : "commentViewThreadLabel"
                  }
                />
              </Button>
            )}
            {!comment.resolved && enableEditing && (
              <React.Fragment>
                {commentType !== REPORT_TYPE && (
                  <Button
                    className={clsx(classes.action, classes.actionPrimary)}
                    color="primary"
                    disabled={operationRunning}
                    onClick={toggleReply}
                    variant="contained"
                  >
                    {intl.formatMessage({ id: "commentReplyLabel" })}
                  </Button>
                )}
                {createdBy === userId && (
                  <Button
                    className={clsx(classes.action, classes.actionSecondary)}
                    color="primary"
                    disabled={operationRunning}
                    onClick={toggleEdit}
                    variant="contained"
                  >
                    {intl.formatMessage({ id: "commentEditLabel" })}
                  </Button>
                )}
              </React.Fragment>
            )}
          </CardActions>
        )}
        <CommentAdd
          marketId={marketId}
          hidden={!replyOpen}
          parent={comment}
          onSave={toggleReply}
          onCancel={toggleReply}
          type={REPLY_TYPE}
        />
      </Card>
      <Box marginTop={1} paddingX={1} className={classes.childWrapper}>
        <LocalCommentsContext.Provider value={{ comments, marketId }}>
          {repliesExpanded &&
            sortedReplies.map(child => {
              const { id: childId } = child;
              return (
                <InitialReply
                  key={childId}
                  comment={child}
                  marketId={marketId}
                  highLightId={highlightIds}
                  enableEditing={enableEditing}
                />
              );
            })}
        </LocalCommentsContext.Provider>
      </Box>
    </React.Fragment>
  );
}

Comment.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  comment: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: () => {
    // TODO error
    //return new Error('depth is deprecated')
    return null;
  },
  marketId: PropTypes.string.isRequired
};

function InitialReply(props) {
  const { comment, highLightId, enableEditing } = props;

  return <Reply id={`c${comment.id}`} comment={comment} highLightId={highLightId} enableEditing={enableEditing}/>;
}

const useReplyStyles = makeStyles(
  theme => {
    return {
      actions: {
        display: "flex",
        boxShadow: "none",
        width: "100%"
      },
      action: {
        padding: "0 4px",
        minWidth: "20px",
        height: "20px",
        color: "#A7A7A7",
        fontWeight: "bold",
        fontSize: 12,
        lineHeight: "18px",
        textTransform: "capitalize",
        background: "transparent",
        borderRight: "none !important",
        "&:hover": {
          color: "#ca2828",
          background: "white",
          boxShadow: "none"
        },
        display: "inline-block"
      },
      cardContent: {
        // 25px in Figma
        marginLeft: theme.spacing(3),
        padding: 0,
        paddingTop: 8,
        "&:last-child": {
          paddingBottom: 8
        }
      },
      cardActions: {
        marginLeft: theme.spacing(3),
        padding: 0
      },
      commenter: {
        color: "#7E7E7E",
        display: "inline-block",
        fontSize: 14,
        fontWeight: "bold",
        marginRight: "8px"
      },
      replyContainer: {
        marginLeft: theme.spacing(3)
      },
      timeElapsed: {
        color: "#A7A7A7",
        display: "inline-block",
        fontSize: 14
      },
      timePosted: {
        color: "#A7A7A7",
        display: "inline-block",
        fontSize: 12,
        fontWeight: "bold"
      },
      containerYellow: {
        boxShadow: "10px 5px 5px yellow"
      },
      editor: {
        margin: "2px 0px",
        "& .ql-editor": {
          paddingTop: 0,
          paddingBottom: 0
        }
      }
    };
  },
  { name: "Reply" }
);

/**
 * @type {Presence}
 */
const unknownPresence = {
  name: "unknown"
};

/**
 *
 * @param {{comment: Comment}} props
 */
function Reply(props) {
  const { comment, highLightId, enableEditing, ...other } = props;

  const marketId = useMarketId();
  const presences = usePresences(marketId);
  // TODO: these shouldn't be unknown?
  const commenter = useCommenter(comment, presences) || unknownPresence;

  const [marketsState] = useContext(MarketsContext);
  const userId = getMyUserForMarket(marketsState, marketId) || {};
  const isEditable = comment.created_by === userId;

  const classes = useReplyStyles();

  const [editing, setEditing] = React.useState(false);
  function handleEditClick() {
    setEditing(true);
  }

  const [replyOpen, setReplyOpen] = React.useState(false);

  const intl = useIntl();
  return (
    <Card
      elevation={0}
      className={
        highLightId.includes(comment.id) ? classes.containerYellow : classes.container
      }
      {...other}
    >
      <CardContent className={classes.cardContent}>
        <Typography className={classes.commenter} variant="body2">
          {commenter.name}
        </Typography>
        <Typography className={classes.timeElapsed} variant="body2">
          <UsefulRelativeTime
            value={Date.parse(comment.created_at) - Date.now()}
          />
        </Typography>
        {editing ? (
          <CommentEdit
            intl={intl}
            marketId={marketId}
            onSave={() => setEditing(false)}
            onCancel={() => setEditing(false)}
            comment={comment}
          />
        ) : (
          <ReadOnlyQuillEditor
            className={classes.editor}
            value={comment.body}
          />
        )}
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Typography className={classes.timePosted} variant="body2">
          <FormattedDate value={comment.created_at} />
        </Typography>
        {enableEditing && (
          <Button
            className={classes.action}
            onClick={() => setReplyOpen(true)}
            variant="text"
          >
            {intl.formatMessage({ id: "issueReplyLabel" })}
          </Button>
        )}
        {enableEditing && isEditable && (
          <Button
            className={classes.action}
            onClick={handleEditClick}
            variant="text"
          >
            <FormattedMessage id="commentEditLabel" />
          </Button>
        )}
      </CardActions>
      <div className={classes.replyContainer}>
        <CommentAdd
          marketId={marketId}
          hidden={!replyOpen}
          parent={comment}
          onSave={() => setReplyOpen(false)}
          onCancel={() => setReplyOpen(false)}
          type={REPLY_TYPE}
        />
      </div>
      {comment.children !== undefined && (
        <CardContent className={classes.cardContent}>
          <ThreadedReplies
            replies={comment.children}
            highLightId={highLightId}
            enableEditing={enableEditing}
          />
        </CardContent>
      )}
    </Card>
  );
}
Reply.propTypes = {
  comment: PropTypes.object.isRequired
};

const useThreadedReplyStyles = makeStyles(
  {
    container: {
      borderLeft: "2px solid #ADADAD",
      listStyle: "none",
      margin: 0,
      marginTop: 15,
      padding: 0
    },
    visible: {
      overflow: 'visible'
    }
  },
  { name: "ThreadedReplies" }
);
/**
 *
 * @param {{comments: Comment[], replies: string[]}} props
 */
function ThreadedReplies(props) {
  const { replies: replyIds, highLightId, enableEditing } = props;
  const comments = useComments();

  const classes = useThreadedReplyStyles();

  const replies = (replyIds || []).map(replyId => {
    return comments.find(comment => comment.id === replyId);
  });

  const sortedReplies = _.sortBy(replies, "created_at");

  return (
    <ol className={classes.container}>
      {sortedReplies.map((reply) => {
        if (reply) {
          return (
            <ThreadedReply
              className={classes.visible}
              comment={reply}
              key={`threadc${reply.id}`}
              highLightId={highLightId}
              enableEditing={enableEditing}
            />
          );
        }
        return React.Fragment;
      })}
    </ol>
  );
}

function ThreadedReply(props) {
  const { comment, highLightId, enableEditing } = props;
  return <Reply key={`keyc${comment.id}`} id={`c${comment.id}`} className={props.className} comment={comment} elevation={0} highLightId={highLightId}
                enableEditing={enableEditing} />;
}

/**
 * user-like
 * @typedef {Object} Presence
 * @property {string} name -
 */

/**
 *
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string[]} [children] - ids of comments
 * @property {string} created_by - presence id of creator
 * @property {string} created_at -
 * @property {string} updated_by - presence id of updater
 * @property {string} updated_at -
 */

/**
 * @param {string} marketId
 * @returns {Presence[]}
 */
function usePresences(marketId) {
  const [presencesState] = useContext(MarketPresencesContext);
  return getMarketPresences(presencesState, marketId) || [];
}

/**
 * @param {Comment} comment
 * @param {Presence[]} presences
 * @returns {Presence | undefined}
 */
function useCommenter(comment, presences) {
  return presences.find(presence => presence.id === comment.created_by);
}

/**
 * @param {Comment} comment
 * @param {Presence[]} presences
 * @returns {Presence | undefined}
 */
function useUpdatedBy(comment, presences) {
  return presences.find(presence => presence.id === comment.updated_by);
}

export default Comment;
