import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Card, Button, CardContent } from '@material-ui/core';
import HtmlRichTextEditor from '../TextEditors/HtmlRichTextEditor';
import { saveComment } from '../../api/comments';
import useAsyncCommentsContext from '../../contexts/useAsyncCommentsContext';
import CardActions from '@material-ui/core/CardActions';

function CommentReply(props) {

  const { parent, intl, marketId, onSave, onCancel } = props;
  const { addCommentLocally } = useAsyncCommentsContext();
  const [body, setBody] = useState('');

  const placeHolder = intl.formatMessage({ id: 'commentReplyDefault' });

  function handleChange(event) {
    const { value } = event.target;
    setBody(value);
  }

  function handleSave() {
    const usedParent = parent || {};
    const { investible_id, id: parentId } = usedParent;
    return saveComment(marketId, investible_id, parentId, body)
      .then(result => addCommentLocally(result))
      .then(onSave());
  }

  function handleCancel() {
    setBody('');
    onCancel();
  }

  return (
    <Card>
      <CardContent>
        <HtmlRichTextEditor placeHolder={placeHolder} value={body} onChange={handleChange}/>
      </CardContent>
      <CardActions>
        <Button onClick={handleSave}>
          {intl.formatMessage({ id: 'commentReplySaveLabel' })}
        </Button>
        <Button onClick={handleCancel}>
          {intl.formatMessage({ id: 'commentReplyCancelLabel' })}
        </Button>
      </CardActions>
    </Card>
  );
}

export default injectIntl(CommentReply);
