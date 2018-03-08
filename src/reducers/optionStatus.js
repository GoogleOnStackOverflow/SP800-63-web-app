import { OPTION_ON_CLICK , MULTI_ON_CLICK } from '../actions'

const spliceAndReturn = (arr, num, len) => {
  arr.splice(num, len);
  return arr;
}

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
    case MULTI_ON_CLICK:
      if(state[action.optionObj.parent] !== undefined) {
        var position = state[action.optionObj.parent].indexOf(action.optionObj.id);
        if(position !== -1)
          return {
            ...state,
            [action.optionObj.parent]: spliceAndReturn(state[action.optionObj.parent], position, 1)
          };
        else
          return {
            ...state,
            [action.optionObj.parent]: state[action.optionObj.parent].concat([action.optionObj.id])
          };
      } else {
        return {
          ...state,
          [action.optionObj.parent]: [action.optionObj.id]
        }
      }

    default:
      return state
  }
}
 
export default optionStatus