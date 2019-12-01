import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Grid,
} from '@material-ui/core';
import QuillEditor from '../TextEditors/QuillEditor';
import CommentAdd from './CommentAdd';
import { REPLY_TYPE } from '../../constants/comments';

import RaisedCard from '../Cards/RaisedCard';
import { reopenComment, resolveComment } from '../../api/comments';

function Comment(props) {
  const {
    comment, commentsHash, depth, marketId,
  } = props;
  const intl = useIntl();
  const { children, id } = comment;

  const [replyOpen, setReplyOpen] = useState(false);
  const [toggledOpen, setToggledOpen] = useState(false);

  function getChildComments() {
    if (children) {
      return children.map((childId) => {
        const child = commentsHash[childId];
        const childDepth = depth + 1;
        // we are rendering ourselves, so we don't get the injection automagically
        return (
          <Comment
            key={childId}
            comment={child}
            depth={childDepth}
            marketId={marketId}
            commentsHash={commentsHash}
          />
        );
      });
    }
    return <div />;
  }

  function toggleReply() {
    setReplyOpen(!replyOpen);
  }

  function reopen() {
    return reopenComment(marketId, id);
  }

  function resolve() {
    resolveComment(marketId, id);
  }

  function flipToggledOpen() {
    setToggledOpen(!toggledOpen);
  }

  const expanded = replyOpen || toggledOpen || !comment.is_resolved;

  return (
    <RaisedCard>
      <Grid
        container
        direction="column"
      >
        <Grid
          item
          xs={12}
        >
          <QuillEditor marketId={marketId} readOnly value={comment.body}/>
        </Grid>
        <Grid
          item
          xs={12}
        >

          {!comment.is_resolved && (
            <ButtonGroup
              color="primary"
              variant="contained"
            >
              <Button onClick={toggleReply}>
                {intl.formatMessage({ id: 'commentReplyLabel' })}
              </Button>
              {!comment.reply_id && (
                <Button onClick={resolve}>
                  {intl.formatMessage({ id: 'commentResolveLabel' })}
                </Button>
              )}
            </ButtonGroup>
          )}
          {comment.is_resolved && (
            <ButtonGroup
              color="primary"
              variant="contained"
            >
              <Button onClick={flipToggledOpen}>
                {intl.formatMessage({ id: 'commentViewLabel' })}
              </Button>
              <Button onClick={reopen}>
                {intl.formatMessage({ id: 'commentReopenLabel' })}
              </Button>
            </ButtonGroup>
          )}
        </Grid>
        {replyOpen && (
          <Grid
            item
            xs={12}
          >

            <CommentAdd
              marketId={marketId}
              parent={comment}
              onSave={toggleReply}
              onCancel={toggleReply}
              type={REPLY_TYPE}
            />
          </Grid>
        )}
        {expanded && (
          <Grid
            item
            xs={12}
          >
            {getChildComments()}
          </Grid>
        )}
      </Grid>
    </RaisedCard>
  );
}

Comment.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  comment: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  commentsHash: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  marketId: PropTypes.string.isRequired,
};

export default Comment;
