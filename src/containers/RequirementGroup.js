import { connect } from 'react-redux';
import RequestGroup from '../components/RequestGroup';
import { handleMultiOnClick } from '../actions';
import { getRequirementObject } from '../rules/requirements';

const mapStateToProps = (state, ownProps) => {
	return {
		id: ownProps.id,
		questGroupObj: ownProps.questGroupObj,
		chosenStatus: state.optionStatus,
		requirements: getRequirementObject(state.optionStatus, ownProps.questGroupObj)
	};
}

const mapDispatchToProps = dispatch => {
	return {
		requestOnClick: optionObj => {
			dispatch(handleMultiOnClick(optionObj));
		}
	}
}

const RequirementGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestGroup)
 
export default RequirementGroup;