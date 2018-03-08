import { combineReducers } from 'redux'
import optionStatus from './optionStatus'
import questSequence from './questSequence'
 
const estApp = combineReducers({
  optionStatus,
  questSequence
})
 
export default estApp