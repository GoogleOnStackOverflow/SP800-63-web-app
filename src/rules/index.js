export const QUEST_TYPE_SINGLE = 'QUEST_TYPE_SINGLE';
export const QUEST_TYPE_MULTI = 'QUEST_TYPE_MULTI';
export const QUEST_TYPE_TEXT = 'QUEST_TYPE_TEXT';

export const option = (parent, num, name, describtion, activateLevel, activateFunction, isPassive) => {
	return {
		id: num,
		parent: parent,
		name: name,
		describtion: describtion,
		activateLevel: activateLevel,
		activateFunction: activateFunction,
		isPassive: isPassive
	};
};

export const question = (group, num, name, describtion, optStringArr, type, activateFunction) => {
	activateFunction = activateFunction === undefined? (status) => {return true} : activateFunction;
	type = type === undefined ? QUEST_TYPE_SINGLE : type;
	return {
		id: `${group}-${num}`,
		type: type,
		name: name,
		describtion: describtion,
		options: optStringArr.map((optString,index) => option(`${group}-${num}`, index, optString[0], optString[1], optString[2], optString[3], optString[4])),
		active: activateFunction
	};
}

export const questionGroup = (num, name, describtion, questionArr, nextFunction) => {
	return { 
		id: num,
		name: name,
		describtion: describtion,
		questions: questionArr,
		next: nextFunction
	};
}

export const mitigation = (describtion, isAchieved) => {
	return {
		describtion,
		isAchieved
	}
}

export const threat = (name, describtion, mitigationArr) => {
	return {
		name,
		describtion,
		mitigationArr,
	}
}