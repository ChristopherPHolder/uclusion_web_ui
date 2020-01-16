import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Box,
  ButtonGroup,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
import ReadOnlyQuillEditor from '../TextEditors/ReadOnlyQuillEditor';
import CommentAdd from './CommentAdd';
import { REPLY_TYPE } from '../../constants/comments';
import { reopenComment, resolveComment } from '../../api/comments';
import SpinBlockingButton from '../SpinBlocking/SpinBlockingButton';
import { OperationInProgressContext } from '../../contexts/OperationInProgressContext';
import { MarketPresencesContext } from '../../contexts/MarketPresencesContext/MarketPresencesContext';
import { getMarketPresences } from '../../contexts/MarketPresencesContext/marketPresencesHelper';
import CustomChip from '../CustomChip';
import CommentEdit from './CommentEdit';
import { MarketsContext } from '../../contexts/MarketsContext/MarketsContext';
import { getMyUserForMarket } from '../../contexts/MarketsContext/marketsContextHelper';
import { HighlightedCommentContext } from '../../contexts/HighlightedCommentContext';

const useStyles = makeStyles({
  container: {
    padding: '30px 20px 16px',
    background: 'white',
    boxShadow: 'none',
  },
  childContainer: {
    padding: '8px 20px',
    background: 'white',
    boxShadow: 'none',
  },
  containerRed: {
    padding: '30px 20px 16px',
    background: 'white',
    boxShadow: '10px 5px 5px red',
  },
  containerYellow: {
    padding: '30px 20px 16px',
    background: 'white',
    boxShadow: '10px 5px 5px yellow',
  },
  chip: {
    marginTop: '12px',
  },
  content: {
    marginTop: '12px',
    fontSize: 15,
    lineHeight: '175%',
  },
  cardContent: {
    padding: '0 20px',
  },
  childCardContent: {
    padding: 0,
  },
  cardActions: {
    padding: '8px',
  },
  childCardActions: {
    padding: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    boxShadow: 'none',
    width: '100%',
  },
  childActions: {
    display: 'flex',
    boxShadow: 'none',
    width: '100%',
  },
  action: {
    minWidth: '89px',
    height: '36px',
    color: 'rgba(0,0,0,0.38)',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: '18px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    background: 'transparent',
    borderRight: 'none !important',
    '&:hover': {
      color: '#ca2828',
      background: 'white',
      boxShadow: 'none',
    },
  },
  childAction: {
    padding: '0 4px',
    minWidth: '20px',
    height: '20px',
    color: '#A7A7A7',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: '18px',
    textTransform: 'capitalize',
    background: 'transparent',
    borderRight: 'none !important',
    '&:hover': {
      color: '#ca2828',
      background: 'white',
      boxShadow: 'none',
    },
  },
  actionResolve: {
    minWidth: '89px',
    height: '36px',
    color: '#D40000',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: '18px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    background: 'transparent',
    borderRight: 'none !important',
    '&:hover': {
      color: '#ca2828',
      background: 'white',
      boxShadow: 'none',
    },
  },
  childWrapper: {
    // borderTop: '1px solid #DCDCDC',
  },
  topicWrapper: {
    borderBottom: '1px solid #DCDCDC',
  },
  initialComment: {
    display: 'flex',
  },
  avatarWrapper: {
    marginRight: '20px',
  },
  commenter: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

function Comment(props) {
  const {
    comment, depth, marketId, comments,
  } = props;
  const intl = useIntl();
  const classes = useStyles();
  const { id, comment_type: commentType, created_by: createdBy } = comment;
  const [presencesState] = useContext(MarketPresencesContext);
  const presences = getMarketPresences(presencesState, marketId) || [];
  const commenter = presences.find((presence) => presence.id === createdBy);
  const updatedBy = presences.find((presence) => presence.id === comment.updated_by);
  const [marketsState] = useContext(MarketsContext);
  const user = getMyUserForMarket(marketsState, marketId) || {};
  const children = comments.filter((comment) => comment.reply_id === id);
  const sortedChildren = _.sortBy(children, 'created_at');
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [toggledOpen, setToggledOpen] = useState(false);
  const [operationRunning] = useContext(OperationInProgressContext);
  const [highlightedCommentState] = useContext(HighlightedCommentContext);

  const isRoot = !comment.reply_id;
  const expanded = replyOpen
    || toggledOpen
    || (isRoot && !comment.resolved)
    || comment.reply_id;

  function getChildComments() {
    if (_.isEmpty(sortedChildren)) {
      return <></>;
    }
    return sortedChildren.map((child) => {
      const { id: childId } = child;
      const childDepth = depth + 1;
      // we are rendering ourselves, so we don't get the injection automagically
      return (
        <Comment
          key={childId}
          comment={child}
          depth={childDepth}
          marketId={marketId}
          comments={comments}
        />
      );
    });
  }

  function getInitialChildComments() {
    if (_.isEmpty(sortedChildren)) {
      return <></>;
    }
    const initialComment = sortedChildren[0];
    return (
      <Box marginTop={4} marginBottom={4} className={classes.initialComment}>
        <div className={classes.avatarWrapper}>
          <Avatar>H</Avatar>
        </div>
        <div>
          {commenter && <Typography className={classes.commenter}>{commenter.name}</Typography>}
          <ReadOnlyQuillEditor value={initialComment.body} paddingLeft={0} />
        </div>
      </Box>
    );
  }

  function getCommentHighlightStyle() {
    if (id in highlightedCommentState) {
      const level = highlightedCommentState[id];
      if (level === 'YELLOW') {
        return classes.containerYellow;
      }
      return classes.containerRed;
    }
    return classes.container;
  }

  function toggleReply() {
    setReplyOpen(!replyOpen);
  }

  function toggleEdit() {
    setEditOpen(!editOpen);
  }

  function reopen() {
    return reopenComment(marketId, id);
  }

  function resolve() {
    return resolveComment(marketId, id);
  }

  function flipToggledOpen() {
    setToggledOpen(!toggledOpen);
  }

  return (
    <Card
      className={!isRoot ? classes.childContainer : getCommentHighlightStyle()}
    >
      <CardContent
        className={!isRoot ? classes.childCardContent : classes.cardContent}
      >
        {isRoot && (
          <CustomChip
            className={classes.chip}
            active
            type={commentType}
            content={comment.body}
          />
        )}
        {updatedBy && comment.updated_by !== createdBy && (
          <Typography className={classes.commenter}>
            {`${intl.formatMessage({ id: 'lastUpdatedBy' })} ${updatedBy.name}`}
          </Typography>
        )}
        <Box
          marginTop={1}
          className={isRoot && toggledOpen ? classes.topicWrapper : ''}
        >
          <ReadOnlyQuillEditor
            value={comment.body}
            heading={toggledOpen}
            paddingLeft={0}
          />
          {editOpen && (
            <CommentEdit
              marketId={marketId}
              comment={comment}
              onSave={toggleEdit}
              onCancel={toggleEdit}
            />
          )}
          {expanded && isRoot && getInitialChildComments()}
        </Box>
      </CardContent>
      {!toggledOpen && !replyOpen && (
        <CardActions
          className={!isRoot ? classes.childCardActions : classes.cardActions}
        >
          {!comment.resolved && (
            <ButtonGroup
              className={!isRoot ? classes.childActions : classes.actions}
              disabled={operationRunning}
              color="primary"
              variant="contained"
            >
              <Button
                className={!isRoot ? classes.childAction : classes.action}
                onClick={toggleReply}
              >
                {intl.formatMessage({ id: 'commentReplyLabel' })}
              </Button>
              {createdBy === user.id && (
                <Button
                  className={!isRoot ? classes.childAction : classes.action}
                  onClick={toggleEdit}
                >
                  {intl.formatMessage({ id: 'commentEditLabel' })}
                </Button>
              )}
              {!comment.reply_id && (
                <SpinBlockingButton
                  className={classes.actionResolve}
                  marketId={marketId}
                  onClick={resolve}
                >
                  {intl.formatMessage({ id: 'commentResolveLabel' })}
                </SpinBlockingButton>
              )}
            </ButtonGroup>
          )}
          {comment.resolved && (
            <ButtonGroup
              className={classes.actions}
              disabled={operationRunning}
              color="primary"
              variant="contained"
            >
              {children && (
                <Button className={classes.action} onClick={flipToggledOpen}>
                  {!toggledOpen
                    && intl.formatMessage({ id: 'commentViewThreadLabel' })}
                  {toggledOpen
                    && intl.formatMessage({ id: 'commentCloseThreadLabel' })}
                </Button>
              )}
              <SpinBlockingButton
                className={classes.action}
                marketId={marketId}
                onClick={reopen}
              >
                {intl.formatMessage({ id: 'commentReopenLabel' })}
              </SpinBlockingButton>
            </ButtonGroup>
          )}
        </CardActions>
      )}
      <Box marginTop={1} className={classes.childWrapper}>
        {expanded && getChildComments()}
      </Box>

      {replyOpen && (
        <CommentAdd
          marketId={marketId}
          parent={comment}
          onSave={toggleReply}
          onCancel={toggleReply}
          type={REPLY_TYPE}
        />
      )}
    </Card>
  );
}

Comment.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  comment: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: PropTypes.number.isRequired,
  marketId: PropTypes.string.isRequired,
};

export default Comment;
