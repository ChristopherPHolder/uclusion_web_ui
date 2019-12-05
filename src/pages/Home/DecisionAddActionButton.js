import React from 'react';
import PropTypes from 'prop-types';
import ExpandableSidebarAction from '../../components/SidebarActions/ExpandableSidebarAction';
import { useIntl } from 'react-intl';
import { getDialogTypeIcon } from '../../components/Dialogs/dialogIconFunctions';
import { DECISION_TYPE } from '../../constants/markets';


function DecisionAddActionButton(props) {

  const { onClick } = props;

  const intl = useIntl();
  const label = intl.formatMessage({ id: 'homeAddDecision' });

  return (
    <ExpandableSidebarAction
      icon={getDialogTypeIcon(DECISION_TYPE)}
      label={label}
      onClick={onClick}/>
  );
}

DecisionAddActionButton.propTypes = {
  onClick: PropTypes.func,
};

DecisionAddActionButton.defaultProps = {
  onClick: () => {},
};

export default DecisionAddActionButton;