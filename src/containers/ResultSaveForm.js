import { connect } from 'react-redux';
import SaveForm from '../components/SaveForm';
import { handleLoadState, deleteSaveState,
	handleSaveState, closeModal, 
	openModal, setCurrentName } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		optionState: state.optionStatus,
		modalState: state.modalStatus,
	};
}

const mapDispatchToProps = dispatch => {
	return {
		openModal: name => {
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
			dispatch(setCurrentName(name));
		},
		deleteState: name => {
			dispatch(deleteSaveState(name));
		}
	}
}

const ResultSaveForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveForm)

export default ResultSaveForm;