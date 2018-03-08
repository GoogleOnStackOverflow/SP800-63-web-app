import { OPTION_ON_CLICK } from '../actions'

const optionStatus = (state = {}, action) => {
  switch (action.type) {
    case OPTION_ON_CLICK:
      if(state[action.optionObj.parent]===action.optionObj.id)
        return {
          ...state,
          [action.optionObj.parent]: undefined
        }
      else
        return {
          ...state,
          [action.optionObj.parent]: action.optionObj.id
        }
    default:
      return state
  }
}
 
export default optionStatus