import { connect } from 'react-redux';
import AL_Bar from '../components/AL_Bar';
import { selectXALs } from '../rules/selectingQuestionPool';
import { getRequirementObject } from '../rules/requirements';

const mapStateToProps = (state, ownProps) => {
  return {
    levelArr: selectXALs(state.optionStatus),
    requirementsArr: ownProps.requirementsQuestGroupArr.map(questGroup => getRequirementObject(state.optionStatus, questGroup)),
    requirementStatusArr: [state.optionStatus, state.optionStatus, state.optionStatus]
  }
}

const ProgressWindow = connect(
  mapStateToProps
)(AL_Bar)
 
export default ProgressWindow