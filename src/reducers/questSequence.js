import { NEXT_ON_CLICK, PREVIOUS_ON_CLICK , START_OVER_ON_CLICK } from '../actions'

const questSequence = (state = [0], action) => {
  switch (action.type) {
    case NEXT_ON_CLICK:
      return [
        ...state,
        action.next
      ];
    case PREVIOUS_ON_CLICK:
      if(state.length === 1)
        return state
      return state.slice(0, state.length-1)
    case START_OVER_ON_CLICK:
      return [0]
    default:
      return state
  }
}
 
export default questSequence