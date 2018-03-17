import { OPEN_MODAL, CLOSE_MODAL , SET_CURRENT_NAME } from '../actions'

const modalStatus = (state = {}, action) => {
  console.log(state);
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        current: action.name
      };
    case CLOSE_MODAL:
      return {
        ...state,
        current: undefined
      };
    case SET_CURRENT_NAME:
      return {
        ...state,
        name: action.name
      }
    default:
      return state
  }
}
 
export default modalStatus