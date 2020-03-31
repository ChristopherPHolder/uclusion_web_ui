import React, { useContext, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  Card, Button, CardContent, CardActions, makeStyles, darken, RadioGroup, FormControlLabel, Radio, FormControl
} from '@material-ui/core'
import PropTypes from 'prop-types';
import QuillEditor from '../TextEditors/QuillEditor';
import { updateComment } from '../../api/comments';
import { processTextAndFilesForSave } from '../../api/files';
import SpinBlockingButton from '../SpinBlocking/SpinBlockingButton';
import { OperationInProgressContext } from '../../contexts/OperationInProgressContext/OperationInProgressContext';
import { CommentsContext } from '../../contexts/CommentsContext/CommentsContext';
import { addCommentToMarket } from '../../contexts/CommentsContext/commentsContextHelper';
import { EMPTY_SPIN_RESULT } from '../../constants/global';
import { ISSUE_TYPE, QUESTION_TYPE } from '../../constants/comments'

const useStyles = makeStyles(() => ({
  hidden: {
    display: 'none',
  },
  add: {},
  cardContent: {
    padding: 0,
  },
  cardActions: {
    padding: 8,
  },
  buttonPrimary: {
    backgroundColor: '#2d9cdb',
    color: '#fff',
    "&:hover": {
      backgroundColor: darken('#2d9cdb', 0.08)
    },
    "&:focus": {
      backgroundColor: darken('#2d9cdb', 0.24)
    },
  },
}), { name: 'CommentEdit' });

function CommentEdit(props) {
  const {
    intl, marketId, onSave, onCancel, comment, allowedTypes,
  } = props;
  const { id, body: initialBody, uploaded_files: initialUploadedFiles, comment_type: commentType } = comment;
  const [body, setBody] = useState(initialBody);
  const [uploadedFiles, setUploadedFiles] = useState(initialUploadedFiles);
  const classes = useStyles();
  const [operationRunning, setOperationRunning] = useContext(OperationInProgressContext);
  const [commentState, commentDispatch] = useContext(CommentsContext);
  const [type, setType] = useState(commentType);

  function onEditorChange(content) {
    setBody(content);
  }

  function handleSave() {
    const {
      uploadedFiles: filteredUploads,
      text: tokensRemoved,
    } = processTextAndFilesForSave(uploadedFiles, body);
    const updatedType = type !== commentType ? type : undefined;
    return updateComment(marketId, id, tokensRemoved, filteredUploads, updatedType)
      .then((comment) => {
        addCommentToMarket(comment, commentState, commentDispatch);
        return EMPTY_SPIN_RESULT;
      })
  }

  function onS3Upload(metadatas) {
    setUploadedFiles(metadatas);
  }

  function handleCancel() {
    onCancel();
  }

  function onTypeChange(event) {
    const { value } = event.target;
    setType(value);
  }

  return (
    <div
      className={classes.add}
    >
      <Card elevation={0}>
        <CardContent className={classes.cardContent}>
          <FormControl component="fieldset" className={classes.commentType}>
            <RadioGroup
              aria-labelledby="comment-type-choice"
              className={classes.commentTypeGroup}
              onChange={onTypeChange}
              value={type}
              row
            >
              {allowedTypes.map((commentType) => {
                return (
                  <FormControlLabel
                    key={commentType}
                    className={
                      commentType === ISSUE_TYPE
                        ? `${classes.chipItem} ${classes.chipItemIssue}`
                        : commentType === QUESTION_TYPE ? `${classes.chipItem} ${classes.chipItemQuestion}`
                        : `${classes.chipItem} ${classes.chipItemSuggestion}`
                    }
                    /* prevent clicking the label stealing focus */
                    onMouseDown={e => e.preventDefault()}
                    control={<Radio color="primary" />}
                    label={<FormattedMessage id={`${commentType.toLowerCase()}Present`} />}
                    labelPlacement="end"
                    value={commentType}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
          <QuillEditor
            defaultValue={initialBody}
            onChange={onEditorChange}
            onS3Upload={onS3Upload}
            setOperationInProgress={setOperationRunning}
          />
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            onClick={handleCancel}
            disabled={operationRunning}
            variant="text"
            size="small"
          >
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
          <SpinBlockingButton
            className={classes.buttonPrimary}
            disabled={operationRunning}
            variant="contained"
            size="small"
            marketId={marketId}
            onClick={handleSave}
            hasSpinChecker
            onSpinStop={onSave}
          >
            {intl.formatMessage({ id: 'save' })}
          </SpinBlockingButton>

        </CardActions>
      </Card>
    </div>
  );
}

CommentEdit.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  marketId: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  intl: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  comment: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
};

CommentEdit.defaultProps = {
  allowedTypes: [],
  onCancel: () => {
  },
  onSave: () => {
  },
};

export default injectIntl(CommentEdit);
