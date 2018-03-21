import React from 'react';
import PropTypes from 'prop-types';

import { SaveModal, DefaultNameModal, 
  ExistsReplaceModal, NotExistsModal, 
  EmptyCancleModal, LoadConfirmModal, 
  DeleteModal } from './ResultSaveModals';

import { Button, FormGroup, 
  InputGroup, FormControl, 
  DropdownButton, MenuItem } from 'react-bootstrap';

import { GetResultByName } from '../FirebaseActions';


const correctModalName = (optionState, modalState) => {
  if(Object.keys(optionState).length === 0)
    return 'EMPTY_CANCEL';

  if(modalState.name === '' || modalState.name === undefined)
    return 'DEFAULT_NAME_ASSIGNED';

  if(JSON.parse(localStorage.names).includes(modalState.name))
      return 'EXISTS_REPLACE';

  return 'SAVE';
}

const SaveForm = ({optionState, modalState, 
  openModal, closeOnClick, saveState, loadState, 
  deleteState, chagneName}) => 
{
  chagneName = chagneName.bind(this);
  if(localStorage.names === undefined)
    localStorage.names = [];
  return (
    <form>
      <SaveModal closeOnClick={closeOnClick} modalState={modalState}/>
      <NotExistsModal closeOnClick={closeOnClick} modalState={modalState}/>
      <EmptyCancleModal closeOnClick={closeOnClick} modalState={modalState}/>
      <LoadConfirmModal
        loadState = {(name) => {
          GetResultByName(name, (state) => {
            loadState(state);
            closeOnClick();
          });
        }}
        closeOnClick={closeOnClick} 
        modalState={modalState}
      />
      <DefaultNameModal 
        saveOnClick={(name) => {
          saveState(name);
          openModal('SAVE');
        }}
        closeOnClick={() => {
          chagneName('');
          closeOnClick();
        }} 
        modalState={modalState}
      />
      <ExistsReplaceModal 
        saveOnClick={(name) => {
          saveState(modalState.name);
          openModal('SAVE');
        }}
        closeOnClick={closeOnClick} 
        modalState={modalState}
      />
      <DeleteModal
        deleteOnClick={(name)=> {
          deleteState(name);
          chagneName('');
          closeOnClick();
        }}
        closeOnClick={closeOnClick} 
        modalState={modalState}
      />

      <FormGroup>
        <InputGroup>
          <FormControl
            type="text"
            value={modalState.name}
            placeholder="Name the result"
            onChange={(event)=>{chagneName(event.target.value)}}
          />
          <FormControl.Feedback />
          <DropdownButton
            componentClass={InputGroup.Button}
            id="input-dropdown-addon"
            title="Saved Results"
          >
            {
              (JSON.parse(localStorage.names).length !== 0?
                JSON.parse(localStorage.names).map(name => {
                  return (<MenuItem key={name} onClick={()=>{chagneName(name)}}>{name}</MenuItem>);
              }) : <MenuItem key="deafult">no results yet</MenuItem>)
            }
          </DropdownButton>
        </InputGroup>
      </FormGroup>
      <Button onClick={()=>{
        if(JSON.parse(localStorage.names).includes(modalState.name))
          openModal('DELETE');
        else
          openModal('NOT_EXISTS');
      }}
        disabled = {modalState.name === '' 
          || modalState.name === undefined}
        bsStyle='danger'
      >Delete</Button>
      <Button onClick={()=>{
        if(Array.isArray(JSON.parse(localStorage.names))){
          if(JSON.parse(localStorage.names).includes(modalState.name))
            openModal('LOAD');
          else
            openModal('NOT_EXISTS');
        } else
          openModal('NOT_EXISTS');
      }}>Load</Button>
      <Button onClick={()=>{
        if(correctModalName(optionState, modalState) === 'SAVE') {
          saveState(modalState.name);
          openModal('SAVE');
        } else if(correctModalName(optionState, modalState) === 'DEFAULT_NAME_ASSIGNED') {
          var d = new Date();
          chagneName(String(d.getTime()));
          openModal('DEFAULT_NAME_ASSIGNED');
        } else openModal(correctModalName(optionState, modalState));
      }}>Save</Button>
    </form>
  );
}

SaveForm.proptypes = {
  optionState: PropTypes.obj,
  modalState: PropTypes.obj,
  openModal: PropTypes.func,
  closeOnClick: PropTypes.func,
  saveState: PropTypes.func,
  deleteState: PropTypes.func,
  loadState: PropTypes.func,
  chagneName: PropTypes.func
}

export default SaveForm;