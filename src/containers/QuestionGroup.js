import { connect } from 'react-redux';
import QuestGroup from '../components/QuestPanel';
import { handleOptionOnClick, handlePreviousOnClick, handleNextOnClick, handleStartOverOnClick } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		questGroupObj: ownProps.questGroupObjArr[state.questSequence[state.questSequence.length-1]],
		chosenStatus: state.optionStatus,
		havePrevious: !(state.questSequence.length === 1),
		enableNext: (questGroupObj) => {
			for(var i=0; i<questGroupObj.questions.length; i++){
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
		previousOnClick: () => {
			dispatch(handlePreviousOnClick());
		},
		nextOnClick: next => {
			dispatch(handleNextOnClick(next));
		},
		startOverOnClick: () => {
			dispatch(handleStartOverOnClick());
		}
	}
}

const QuestionGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestGroup)
 
export default QuestionGroup