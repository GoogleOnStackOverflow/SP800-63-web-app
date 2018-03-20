import { connect } from 'react-redux';
import ThreatList from '../components/ThreatList'

const mapStateToProps = (state, ownProps) => {
	return {
		optionStatus: state.optionStatus,
		threats: ownProps.threats,
		category: ownProps.name
	};
}

const ThreatListPanel = connect(
  mapStateToProps,
)(ThreatList)
 
export default ThreatListPanel;