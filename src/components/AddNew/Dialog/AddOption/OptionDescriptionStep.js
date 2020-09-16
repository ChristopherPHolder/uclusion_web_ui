import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import QuillEditor from '../../../TextEditors/QuillEditor';
import _ from 'lodash';
import { useIntl } from 'react-intl';
import StepButtons from '../../StepButtons';
import { urlHelperGetName } from '../../../../utils/marketIdPathFunctions';
import { MarketsContext } from '../../../../contexts/MarketsContext/MarketsContext';
import { InvestiblesContext } from '../../../../contexts/InvestibesContext/InvestiblesContext';
import WizardStepContainer from '../../WizardStepContainer';
import { WizardStylesContext } from '../../WizardStylesContext';

function OptionDescriptionStep (props) {
  const { updateFormData, formData } = props;
  const { dialogReason, dialogReasonUploadedFiles } = formData;
  const [editorContents, setEditorContents] = useState(dialogReason || '');
  const intl = useIntl();
  const classes = useContext(WizardStylesContext);
  const [marketState] = useContext(MarketsContext);
  const [investibleState] = useContext(InvestiblesContext);

  function onEditorChange (content) {
    setEditorContents(content);
  }

  function onStepChange () {
    updateFormData({
      optionDescription: editorContents,
    });
  }

  function onS3Upload (metadatas) {
    const oldUploadedFiles = dialogReasonUploadedFiles || [];
    const newUploadedFiles = _.uniqBy([...oldUploadedFiles, metadatas], 'path');
    updateFormData({
      optionUploadedFiles: newUploadedFiles
    });
  }

  return (
    <WizardStepContainer
      {...props}
      titleId="AddOptionWizardOptionDescriptionStepLabel"
    >
      <div>
        <Typography className={classes.introText} variant="body2">
          An Option in a Uclusion Dialog is a choice your collaborators can approve. Don't worry about getting the
          description perfect
          since a collaborator can Ask a Question, make a Suggestion, or propose their own options.
        </Typography>
        <QuillEditor
          onChange={onEditorChange}
          defaultValue={editorContents}
          value={editorContents}
          onS3Upload={onS3Upload}
          placeholder={intl.formatMessage({ id: 'AddOptionWizardOptionDescriptionPlaceHolder' })}
          getUrlName={urlHelperGetName(marketState, investibleState)}
        />
        <div className={classes.borderBottom}/>
        <StepButtons
          {...props}
          startOverLabel="AddOptionWizardCancelOption"
          onPrevious={onStepChange}
          onNext={onStepChange}
        />
      </div>
    </WizardStepContainer>
  );
}

OptionDescriptionStep.propTypes = {
  updateFormData: PropTypes.func,
  formData: PropTypes.object,
};

OptionDescriptionStep.defaultProps = {
  updateFormData: () => {},
  formData: {},
};

export default OptionDescriptionStep;