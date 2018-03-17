import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, InputGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';

const correctModalName = (optionState, modalState) => {
  // 'SAVE', DEFAULT_NAME_ASSIGNED, 
  // EXISTS_REPLACE, NOT_EXISTS, EMPTY_CANCEL
  if(optionState === {})
    return 'EMPTY_CANCEL';

  if(modalState.name === '' || modalState.name === undefined)
    return 'DEFAULT_NAME_ASSIGNED';

  if(localStorage.savedStates)
    if(Object.keys(localStorage.savedStates).includes(modalState.name))
      return 'EXISTS_REPLACE';

  return 'SAVE';
}

const SaveForm = ({optionState, modalState, openModal, closeOnClick, saveState, loadState, chagneName}) => {
  chagneName = chagneName.bind(this);
  return (
    <Form>
      <FormGroup>
        <InputGroup>
          <FormControl
            type="text"
            value={modalState.name}
            placeholder="Name the result"
            onChange={chagneName}
          />
          <FormControl.Feedback />
          <DropdownButton
            componentClass={InputGroup.Button}
            id="input-dropdown-addon"
            title="Saved Results"
          >
            {
              localStorage.savedStates ?
                Object.keys(localStorage.savedStates).map(name => {
                  return (<MenuItem key={name} onClick={()=>{chagneName(name)}}>{name}</MenuItem>);
                }) : <MenuItem key="deafult">no results yet</MenuItem>
            }
          </DropdownButton>
        </InputGroup>
      </FormGroup>
      <Button onClick={()=>{
        if(localStorage.savedStates)
          var nextstate = JSON.parse(localStorage.savedStates[modalState.name])
        else 
          nextstate = undefined;

        if(nextstate)
          loadState(nextstate);
        else
          openModal('NOT_EXISTS');
      }}>Load</Button>
      <Button onClick={()=>{openModal(correctModalName(optionState, modalState))}}>Save</Button>
    </Form>
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