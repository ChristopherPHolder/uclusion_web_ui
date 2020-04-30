import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import { MarketStagesContext } from '../../../contexts/MarketStagesContext/MarketStagesContext'
import {
  getAcceptedStage,
  getBlockedStage,
  getInCurrentVotingStage,
  getInReviewStage,
  getVerifiedStage,
} from '../../../contexts/MarketStagesContext/marketStagesContextHelper'
import StageChangeAction from '../../../components/SidebarActions/Planning/StageChangeAction'

function MoveToNextVisibleStageActionButton(props) {
  const { marketId, currentStageId, disabled, enoughVotes } = props;
  const [marketStagesState] = useContext(MarketStagesContext);
  const acceptedStage = getAcceptedStage(marketStagesState, marketId) || {};
  const inReviewStage = getInReviewStage(marketStagesState, marketId) || {};
  const inVotingStage = getInCurrentVotingStage(marketStagesState, marketId) || {};
  const inBlockedStage = getBlockedStage(marketStagesState, marketId) || {};
  let destinationStage;
  let destinationExplanation;
  let destinationLabel;
  if (currentStageId === inVotingStage.id) {
    destinationStage = acceptedStage;
    destinationExplanation = 'planningInvestibleAcceptedExplanation';
    destinationLabel = 'planningInvestibleNextStageAcceptedLabel';
  } else if (currentStageId === acceptedStage.id) {
    destinationStage = inReviewStage;
    destinationLabel = 'planningInvestibleNextStageInReviewLabel';
    destinationExplanation = 'planningInvestibleInReviewExplanation';
  } else if (currentStageId === inReviewStage.id) {
    destinationStage = getVerifiedStage(marketStagesState, marketId);
    destinationLabel = 'planningInvestibleMoveToVerifiedLabel';
    destinationExplanation = 'planningInvestibleVerifiedExplanation';
  } else if (currentStageId === inBlockedStage.id) {
    if (enoughVotes) {
      destinationStage = acceptedStage;
      destinationExplanation = 'planningInvestibleAcceptedExplanation';
      destinationLabel = 'planningInvestibleNextStageAcceptedLabel';
    } else {
      destinationStage = inVotingStage;
      destinationLabel = 'planningInvestibleToVotingLabel';
      destinationExplanation = 'planningInvestibleVotingExplanation';
    }
  }

  if (!destinationStage) {
    return React.Fragment;
  }

  return (
    <StageChangeAction
      {...props}
      icon={<ArrowUpwardIcon />}
      translationId={destinationLabel}
      explanationId={destinationExplanation}
      targetStageId={destinationStage.id}
      disabled={disabled}
    />
  );
}

MoveToNextVisibleStageActionButton.propTypes = {
  marketId: PropTypes.string.isRequired,
  currentStageId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  enoughVotes: PropTypes.bool.isRequired,
};

export default MoveToNextVisibleStageActionButton;
