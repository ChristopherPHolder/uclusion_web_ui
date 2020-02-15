import React, { useContext, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import {
  Card, CardActions, CardContent, TextField, Typography, withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import localforage from 'localforage';
import { updateInvestible } from '../../../api/investibles';
import QuillEditor from '../../../components/TextEditors/QuillEditor';
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext';
import {
  getProposedOptionsStage,
} from '../../../contexts/MarketStagesContext/marketStagesContextHelper';
import SpinBlockingButton from '../../../components/SpinBlocking/SpinBlockingButton';
import { processTextAndFilesForSave } from '../../../api/files';
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  row: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

function DecisionInvestibleEdit(props) {
  const {
    fullInvestible, intl, classes, onCancel, onSave, marketId,
    isAdmin, userId, storedDescription,
  } = props;

  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const [marketStagesState] = useContext(MarketStagesContext);
  const inProposedStage = getProposedOptionsStage(marketStagesState, marketId);
  const { market_infos: marketInfos, investible: myInvestible } = fullInvestible;
  const marketInfo = marketInfos.find((info) => info.market_id === marketId);
  const inProposed = marketInfo.stage === inProposedStage.id;
  const { id, description: initialDescription, created_by: createdBy } = myInvestible;
  const [currentValues, setCurrentValues] = useState(myInvestible);
  const [validForm, setValidForm] = useState(true);
  const { name } = currentValues;
  const initialUploadedFiles = myInvestible.uploaded_files || [];
  const [uploadedFiles, setUploadedFiles] = useState(initialUploadedFiles);
  const [description, setDescription] = useState(storedDescription || initialDescription);

  useEffect(() => {
    // Long form to prevent flicker
    if (name && description && description.length > 0) {
      if (!validForm) {
        setValidForm(true);
      }
    } else if (validForm) {
      setValidForm(false);
    }
  }, [name, description, validForm]);

  function handleChange(field) {
    return (event) => {
      const { value } = event.target;
      const newValues = { ...currentValues, [field]: value };
      setCurrentValues(newValues);
    };
  }

  function onEditorChange(description) {
    setDescription(description);
  }

  function onStorageChange(description) {
    localforage.setItem(id, description);
  }

  function handleFileUpload(metadatas) {
    setUploadedFiles(metadatas);
  }

  function saveInvestible() {
    const oldInvestibleUploadedFiles = myInvestible.uploaded_files || [];
    // uploaded files on edit is the union of the new uploaded files and the old uploaded files
    const newUploadedFiles = [...uploadedFiles, ...oldInvestibleUploadedFiles];
    const {
      uploadedFiles: filteredUploads,
      text: tokensRemoved,
    } = processTextAndFilesForSave(newUploadedFiles, description);
    const updateInfo = {
      uploadedFiles: filteredUploads,
      name,
      description: tokensRemoved,
      marketId,
      investibleId: id,
    };
    return updateInvestible(updateInfo);
  }

  function handleSave() {
    saveInvestible();
  }

  return (
    <Card>
      <CardContent>
        <TextField
          className={classes.row}
          inputProps={{ maxLength: 255 }}
          id="name"
          helperText={intl.formatMessage({ id: 'investibleEditTitleLabel' })}
          margin="normal"
          fullWidth
          variant="outlined"
          value={name}
          onChange={handleChange('name')}
        />
        <Typography>
          {intl.formatMessage({ id: 'descriptionEdit' })}
        </Typography>
        <QuillEditor
          onS3Upload={handleFileUpload}
          onChange={onEditorChange}
          defaultValue={description}
          onStoreChange={onStorageChange}
          setOperationInProgress={setOperationRunning}
        />
      </CardContent>
      <CardActions>
        <SpinBlockingButton
          marketId={marketId}
          onClick={onCancel}
        >
          {intl.formatMessage({ id: 'investibleEditCancelLabel' })}
        </SpinBlockingButton>
        {(isAdmin || (inProposed && createdBy === userId)) && (
          <SpinBlockingButton
            marketId={marketId}
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!validForm}
            onSpinStop={onSave}
          >
            {intl.formatMessage({ id: 'investibleEditSaveLabel' })}
          </SpinBlockingButton>
        )}
      </CardActions>
    </Card>

  );
}

DecisionInvestibleEdit.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  intl: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fullInvestible: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  marketId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  isAdmin: PropTypes.bool,
  storedDescription: PropTypes.string.isRequired,
};

DecisionInvestibleEdit.defaultProps = {
  onSave: () => {},
  onCancel: () => {},
  isAdmin: false,
};
export default withStyles(styles)(injectIntl(DecisionInvestibleEdit));
