import { connect } from 'react-redux';
import QuestGroup from '../components/QuestGroup';
import { handleOptionOnClick, handleMultiOnClick, handlePreviousOnClick, handleNextOnClick, handleStartOverOnClick } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		id: ownProps.id,
		questGroupObj: ownProps.questGroupObjArr[state.questSequence[ownProps.id]===undefined?0:state.questSequence[ownProps.id][state.questSequence[ownProps.id].length-1]],
		chosenStatus: state.optionStatus,
		havePrevious: state.questSequence[ownProps.id]===undefined? false : !(state.questSequence[ownProps.id].length === 1),
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
		}
	}
}

const QuestionGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestGroup)
 
export default QuestionGroup