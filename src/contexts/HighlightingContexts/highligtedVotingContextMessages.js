import { registerListener } from '../../utils/MessageBusUtils';
import { HIGHTLIGHT_ADD } from './HighlightedCommentContext';

export const HIGHLIGHTED_VOTING_CHANNEL = 'HIGHLIGHTED_VOTING';

function beginListening (dispatch) {
  registerListener(HIGHLIGHTED_VOTING_CHANNEL, 'votingHighlightListener', (data) => {
    const { payload: message } = data;
    const {
      level,
      associatedUserId,
    } = message;
    dispatch({ type: HIGHTLIGHT_ADD, associatedUserId, level });
  });
}

export default beginListening;