import { OPTION_ON_CLICK , MULTI_ON_CLICK } from '../actions'
import { IAL2_EVIDENCE_CONDITION, IAL3_EVIDENCE_CONDITION } from '../rules/requirements'

const spliceAndReturn = (arr, num, len) => {
  arr.splice(num, len);
  return arr;
}

const passiveConditionsArr = [IAL2_EVIDENCE_CONDITION, IAL3_EVIDENCE_CONDITION];

const multi_onclick_check_passive = (state) => {
  var additionalState = Object.assign({}, state);
  passiveConditionsArr.forEach(conditionfunc => {
    var newStateChangeObj = conditionfunc(state);

    if(newStateChangeObj.add)
      newStateChangeObj.add.forEach(add => {
        if(Array.isArray(additionalState[add[0]]))
          additionalState[add[0]].push(add[1]);
        else
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

    default:
      return state
  }
}
 
export default optionStatus