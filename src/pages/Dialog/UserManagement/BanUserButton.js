import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import BlockIcon from '@material-ui/icons/Block';
import TooltipIconButton from '../../../components/Buttons/TooltipIconButton';
import WarningDialog from '../../../components/Warnings/WarningDialog';
import { FormattedMessage } from 'react-intl';
import { useLockedDialogStyles } from '../DialogBodyEdit';
import { banUser } from '../../../api/users';
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext';
import { changeBanStatus } from '../../../contexts/MarketPresencesContext/marketPresencesHelper';
import SpinningIconLabelButton from '../../../components/Buttons/SpinningIconLabelButton'
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext'

function BanUserButton(props){
  const {
    marketId,
    userId,
  } = props;
  const lockedDialogClasses = useLockedDialogStyles();
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useContext(MarketPresencesContext);
  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function onSpinStop(result) {
    changeBanStatus(state, dispatch, marketId, userId, true);
  }

  function onProceed() {
    return banUser(marketId, userId)
      .then(() => {
        setOperationRunning(false);
        onSpinStop(true);
      });
  }

  return (
    <div>
    <TooltipIconButton
      translationId="existingUsersBanUser"
      icon={<BlockIcon/>}
      onClick={handleOpen}
    />
      <WarningDialog
        classes={lockedDialogClasses}
        open={open}
        onClose={handleClose}
        issueWarningId="banUserWarning"
        /* slots */
        actions={
          <SpinningIconLabelButton icon={BlockIcon} onClick={onProceed} id="banUserProceedButton">
            <FormattedMessage id="issueProceed" />
          </SpinningIconLabelButton>
        }
      />
  </div>

  )
}

BanUserButton.propTypes = {
  marketId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default BanUserButton;