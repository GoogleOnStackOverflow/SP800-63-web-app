import { NEXT_ON_CLICK, PREVIOUS_ON_CLICK , START_OVER_ON_CLICK } from '../actions'

const questSequence = (state = {}, action) => {
  switch (action.type) {
    case NEXT_ON_CLICK:
      if(state[action.id] === undefined) {
        return {
          ...state,
          [action.id]: [0, action.next]
        };
      } else {
        return {
          ...state,
          [action.id]: state[action.id].concat([action.next])
        }
      }
    case PREVIOUS_ON_CLICK:
      if(state[action.id] === undefined)
        return state;
      if(state[action.id].length === 1)
        return state;
      return {
        ...state,
        [action.id]: state[action.id].slice(0, state[action.id].length-1)
      }
    case START_OVER_ON_CLICK:
      return {
        ...state,
        [action.id]: [0]
      }
    default:
      return state
  }
}
 
export default questSequence