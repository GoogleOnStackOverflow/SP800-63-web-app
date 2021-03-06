import { OPTION_ON_CLICK , MULTI_ON_CLICK , 
  LOAD_STATE, SAVE_STATE, DELETE_STATE } from '../actions'
import { IAL_EVIDENCE_CONDITION } from '../rules/requirements'
import { SaveResultToDB, DeleteResultFromDB } from '../FirebaseActions';

const spliceAndReturn = (arr, num, len) => {
  arr.splice(num, len);
  return arr;
}

const passiveConditionsArr = [IAL_EVIDENCE_CONDITION];

const multi_onclick_check_passive = (state) => {
  var additionalState = Object.assign({}, state);
  passiveConditionsArr.forEach(conditionfunc => {
    var newStateChangeObj = conditionfunc(state);

    if(newStateChangeObj.add)
      newStateChangeObj.add.forEach(add => {
        if(Array.isArray(additionalState[add[0]])) {
          if(!additionalState[add[0]].includes(add[1]))
            additionalState[add[0]].push(add[1]);
        } else
          additionalState[add[0]] = [add[1]];
      });
    if(newStateChangeObj.remove)
      newStateChangeObj.remove.forEach(remove => {
        if(Array.isArray(additionalState[remove[0]])) {
          var position = additionalState[remove[0]].indexOf(remove[1])
          if(position !== -1)
            additionalState[remove[0]].splice(position, 1);
        }
      });
  });

  return additionalState;
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
        if(position !== -1) {
          return multi_onclick_check_passive({
            ...state,
            [action.optionObj.parent]: spliceAndReturn(state[action.optionObj.parent], position, 1)
          });
        } else {
          return multi_onclick_check_passive({
            ...state,
            [action.optionObj.parent]: state[action.optionObj.parent].concat([action.optionObj.id])
          });
        }
      } else {
        return multi_onclick_check_passive({
          ...state,
          [action.optionObj.parent]: [action.optionObj.id]
        });
      }
    case LOAD_STATE:
      return action.nextState
    case SAVE_STATE:
      if(!action.name){
        var d = new Date();
        action.name = d.getTime();
      }
      
      SaveResultToDB(action.name, state);
      return state;

    case DELETE_STATE:
      if(!localStorage.names)
        return state;
      if(!Array.isArray(JSON.parse(localStorage.names)))
        return state;
      if(!JSON.parse(localStorage.names).includes(action.name))
        return state;

      DeleteResultFromDB(action.name);
      return state;
    default:
      return state
  }
}
 
export default optionStatus