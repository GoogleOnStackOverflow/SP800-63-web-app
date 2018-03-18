import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const getCurrentName = (state) => {
  return state.name;
}

const modalIsShow = (state, name) => {
  return state.current === name;
}

export const SaveModal = ({modalState, closeOnClick}) =>  {
  const modal_name = 'SAVE';

  return (
    <Modal show={modalIsShow(modalState, modal_name)} onHide={closeOnClick}>
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>The result {getCurrentName(modalState)} is successfully saved</p>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={closeOnClick}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

SaveModal.proptypes = {
  modalState: PropTypes.obj,
  closeOnClick: PropTypes.func
}

export const DefaultNameModal = ({modalState, closeOnClick, saveOnClick}) =>  {
  const modal_name = 'DEFAULT_NAME_ASSIGNED';
  var d = new Date();

  return (
    <Modal show={modalIsShow(modalState, modal_name)} onHide={closeOnClick}>
      <Modal.Header closeButton>
        <Modal.Title>Result Name Not Specified</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>The result name is not specified, use {String(d.getTime())} as the name to save it?</p>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={closeOnClick}>Cancel</Button>
          <Button onClick={()=>{saveOnClick(String(d.getTime()))}}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

DefaultNameModal.proptypes = {
  modalState: PropTypes.obj,
  closeOnClick: PropTypes.func,
  saveOnClick: PropTypes.func
}

export const ExistsReplaceModal = ({modalState, closeOnClick, saveOnClick}) =>  {
  const modal_name = 'EXISTS_REPLACE';

  return (
    <Modal show={modalIsShow(modalState, modal_name)} onHide={closeOnClick}>
      <Modal.Header closeButton>
        <Modal.Title>Result Exists</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Result {getCurrentName(modalState)} exists, do yo want to replace it?</p>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={closeOnClick}>Cancel</Button>
          <Button onClick={()=>{saveOnClick(getCurrentName(modalState))}}>Yes</Button>
      </Modal.Footer>
    </Modal>
  );
}

ExistsReplaceModal.proptypes = {
  modalState: PropTypes.obj,
  closeOnClick: PropTypes.func,
  saveOnClick: PropTypes.func
}

export const NotExistsModal = ({modalState, closeOnClick}) =>  {
  const modal_name = 'NOT_EXISTS';

  return (
    <Modal show={modalIsShow(modalState, modal_name)} onHide={closeOnClick}>
      <Modal.Header closeButton>
        <Modal.Title>Result Not Exists</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Result {getCurrentName(modalState)} not exists, please select correct name from the dropdown menu</p>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={closeOnClick}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

NotExistsModal.proptypes = {
  modalState: PropTypes.obj,
  closeOnClick: PropTypes.func,
}

export const LoadConfirmModal = ({modalState, closeOnClick, loadState}) => {
  const modal_name = 'LOAD';

  return (
    <Modal show={modalIsShow(modalState, modal_name)} onHide={closeOnClick}>
      <Modal.Header closeButton>
        <Modal.Title>Load Result Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure to load result {modalState.name}? Current state would be totally cleared after this operation.</p>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={closeOnClick}>No</Button>
          <Button onClick={()=>{loadState(modalState.name)}}>Yes</Button>
      </Modal.Footer>
    </Modal>
  );
}

LoadConfirmModal.proptypes = {
  modalState: PropTypes.obj,
  closeOnClick: PropTypes.func,
  loadState: PropTypes.func
}

export const EmptyCancleModal = ({modalState, closeOnClick}) => {
  const modal_name = 'EMPTY_CANCEL';

  return (
    <Modal show={modalIsShow(modalState, modal_name)} onHide={closeOnClick}>
      <Modal.Header closeButton>
        <Modal.Title>Not Operated Yet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>No questions or requirements are checked. Please save after doing something</p>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={closeOnClick}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}

EmptyCancleModal.proptypes = {
  modalState: PropTypes.obj,
  closeOnClick: PropTypes.func
}