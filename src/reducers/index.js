import { combineReducers } from 'redux'
import optionStatus from './optionStatus'
import questSequence from './questSequence'
import modalStatus from './modalStatus'
 
const estApp = combineReducers({
  optionStatus,
  questSequence,
  modalStatus
})
 
export default estApp