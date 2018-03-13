import { connect } from 'react-redux';
import QuestGroup from '../components/QuestGroup';
import { handleOptionOnClick, handleMultiOnClick, handlePreviousOnClick, handleNextOnClick, handleStartOverOnClick } from '../actions';
import { evidencesQuestGroup } from '../rules/featureQuestionPool'
const EVIDENCE_QUESTIONPOOL_ID = 'Evidence_Qustions';
const mapStateToProps = (state, ownProps) => {
	return {
		id: EVIDENCE_QUESTIONPOOL_ID,
		questGroupObj: evidencesQuestGroup[state.questSequence[EVIDENCE_QUESTIONPOOL_ID]===undefined?0:state.questSequence[EVIDENCE_QUESTIONPOOL_ID][state.questSequence[EVIDENCE_QUESTIONPOOL_ID].length-1]],
		chosenStatus: state.optionStatus,
		havePrevious: state.questSequence[EVIDENCE_QUESTIONPOOL_ID]===undefined? false : !(state.questSequence[EVIDENCE_QUESTIONPOOL_ID].length === 1),
		enableNext: (questGroupObj) => {
			for(var i=0; i<questGroupObj.questions.length; i++){
				if(questGroupObj.questions[i].active(state.optionStatus))
				if(state.optionStatus[questGroupObj.questions[i].id] === undefined)
					return false;
			}
			return true;
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		optionOnClick: optionObj => {
			dispatch(handleOptionOnClick(optionObj));
		},
		multiOnClick: optionObj => {
			dispatch(handleMultiOnClick(optionObj));
		},
		previousOnClick: (id) => {
			dispatch(handlePreviousOnClick(id));
		},
		nextOnClick: (id, next) => {
			dispatch(handleNextOnClick(id, next));
		},
		startOverOnClick: (id) => {
			dispatch(handleStartOverOnClick(id));
		},
		finishedOnClick: (id) => {
			dispatch(handleNextOnClick(id, -1));
		}
	}
}

const EvidenceQuestionGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestGroup)
 
export default EvidenceQuestionGroup