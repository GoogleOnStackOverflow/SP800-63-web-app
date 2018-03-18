import { connect } from 'react-redux';
import SaveForm from '../components/SaveForm';
import { handleLoadState, handleSaveState, closeModal, openModal, setCurrentName } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		optionState: state.optionStatus,
		modalState: state.modalStatus,
	};
}

const mapDispatchToProps = dispatch => {
	return {
		openModal: name => {
			console.log(`OPEN MODAL ${name}`);
			dispatch(openModal(name));
		},
		closeOnClick: () => {
			dispatch(closeModal());
		},
		saveState: name => {
			dispatch(handleSaveState(name));
		},
		loadState: nextState => {
			dispatch(handleLoadState(nextState));
		},
		chagneName: name => {
			console.log(name);
			dispatch(setCurrentName(name));
		}
	}
}

const ResultSaveForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveForm)

export default ResultSaveForm;