import React from 'react';
import PropTypes from 'prop-types';
import { SaveModal, DefaultNameModal, 
  ExistsReplaceModal, NotExistsModal, 
  EmptyCancleModal, LoadConfirmModal } from './ResultSaveModals';
import { Button, FormGroup, InputGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';

const correctModalName = (optionState, modalState) => {
  // 'SAVE', DEFAULT_NAME_ASSIGNED, 
  // EXISTS_REPLACE, NOT_EXISTS, EMPTY_CANCEL
  if(Object.keys(optionState).length === 0)
    return 'EMPTY_CANCEL';

  if(modalState.name === '' || modalState.name === undefined)
    return 'DEFAULT_NAME_ASSIGNED';

  if(Object.keys(localStorage).includes(modalState.name))
      return 'EXISTS_REPLACE';

  return 'SAVE';
}

const SaveForm = ({optionState, modalState, openModal, closeOnClick, saveState, loadState, chagneName}) => {
  chagneName = chagneName.bind(this);
  return (
    <form>
      <SaveModal closeOnClick={closeOnClick} modalState={modalState}/>
      <NotExistsModal closeOnClick={closeOnClick} modalState={modalState}/>
      <EmptyCancleModal closeOnClick={closeOnClick} modalState={modalState}/>
      <LoadConfirmModal
        loadState = {(name) => {
          loadState(JSON.parse(localStorage[name]));
          closeOnClick();
        }}
        closeOnClick={closeOnClick} 
        modalState={modalState}
      />
      <DefaultNameModal 
        saveOnClick={(name) => {
          chagneName(name);
          saveState(modalState.name);
          openModal('SAVE');
        }}
        closeOnClick={closeOnClick} 
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
              Object.keys(localStorage).length !== 0?
              Object.keys(localStorage).map(name => {
                  return (<MenuItem key={name} onClick={()=>{chagneName(name)}}>{name}</MenuItem>);
                }) : <MenuItem key="deafult">no results yet</MenuItem>
            }
          </DropdownButton>
        </InputGroup>
      </FormGroup>
      <Button onClick={()=>{
        if(localStorage[modalState.name])
          openModal('LOAD');
        else
          openModal('NOT_EXISTS');
      }}>Load</Button>
      <Button onClick={()=>{
        if(correctModalName(optionState, modalState) === 'SAVE') {
          saveState(modalState.name);
          openModal('SAVE');
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
  loadState: PropTypes.func,
  chagneName: PropTypes.func
}

export default SaveForm;