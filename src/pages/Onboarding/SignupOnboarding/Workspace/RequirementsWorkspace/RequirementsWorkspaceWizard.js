import React from 'react'
import PropTypes from 'prop-types'
import WorkspaceNameStep from './WorkspaceNameStep'
import OnboardingWizard from '../../../OnboardingWizard'
import { useIntl } from 'react-intl'
import InitialRequirementsStep from './InitialRequirementsStep'
import TodoStep from './TodoStep'
import CreatingWorkspaceStep from './CreatingWorkspaceStep'

function RequirementsWorkspaceWizard (props) {
  const { hidden, onStartOver } = props;
  const intl = useIntl();

  const stepPrototypes = [
    {
      label: 'ReqWorkspaceWizardNameStepLabel',
      content: <WorkspaceNameStep />,
    },
    {
      label: 'ReqWorkspaceWizardRequirementsStepLabel',
      content: <InitialRequirementsStep/>,
    },
    {
      label: 'ReqWorkspaceWizardTodoStepLabel',
      content: <TodoStep/>,
    },
    {
      label: 'ReqWorkspaceWizardCreatingworkspaceStepLabel',
      content: <CreatingWorkspaceStep/>,
    }

  ];

  return (
    <OnboardingWizard
      title={intl.formatMessage({ id: 'WorkspaceWizardTitle' })}
      hidden={hidden}
      onStartOver={onStartOver}
      stepPrototypes={stepPrototypes}
    />
  );
}

RequirementsWorkspaceWizard.propTypes = {
  hidden: PropTypes.bool.isRequired,
  onStartOver: PropTypes.func,
};

RequirementsWorkspaceWizard.defaultProps = {
  onStartOver: () => {},
};

export default RequirementsWorkspaceWizard;

