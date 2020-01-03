import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import GroupIcon from '@material-ui/icons/Group';
import ExpandableSidebarAction from '../../../components/SidebarActions/ExpandableSidebarAction';

function ManageParticipantsActionButton(props) {
  const { onClick } = props;

  const intl = useIntl();
  const label = intl.formatMessage({ id: 'planningDialogManageParticipantsLabel' });

  return (
    <ExpandableSidebarAction
      icon={<GroupIcon />}
      label={label}
      onClick={onClick}
    />
  );
}

ManageParticipantsActionButton.propTypes = {
  onClick: PropTypes.func,
};

ManageParticipantsActionButton.defaultProps = {
  onClick: () => {},
};

export default ManageParticipantsActionButton;
