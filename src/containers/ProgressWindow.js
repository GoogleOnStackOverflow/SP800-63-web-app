import { connect } from 'react-redux';
import AL_Bar from '../components/AL_Bar';
import { selectXALs } from '../questionPool';

const mapStateToProps = (state, ownProps) => {
  return {
    levelArr: selectXALs(state.optionStatus),
    requirementsArr: ownProps.requirementsArr,
    requirementStatusArr: ownProps.requirementStatusArr
  }
}

const ProgressWindow = connect(
  mapStateToProps
)(AL_Bar)
 
export default ProgressWindow