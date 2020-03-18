import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext';
import {
  getInReviewStage,
} from '../../../contexts/MarketStagesContext/marketStagesContextHelper';
import StageChangeAction from '../../../components/SidebarActions/Planning/StageChangeAction';

function MoveToInReviewActionButton(props) {
  const { marketId } = props;


  const [marketStagesState] = useContext(MarketStagesContext);
  const inReviewStage = getInReviewStage(marketStagesState, marketId);

  return (
    <StageChangeAction
      {...props}
      icon={<RateReviewIcon />}
      targetStageId={inReviewStage.id}
      label="planningInvestibleNextStageInReviewLabel"
    />
  );
}

MoveToInReviewActionButton.propTypes = {
  marketId: PropTypes.string.isRequired,
};

export default MoveToInReviewActionButton;
