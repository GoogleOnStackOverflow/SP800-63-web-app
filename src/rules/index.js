export const QUEST_TYPE_SINGLE = 'QUEST_TYPE_SINGLE';
export const QUEST_TYPE_MULTI = 'QUEST_TYPE_MULTI';
export const QUEST_TYPE_TEXT = 'QUEST_TYPE_TEXT';

export const option = (parent, num, name, describtion) => {
	return {
		id: num,
		parent: parent,
		name: name,
		describtion: describtion
	};
};

export const question = (group, num, name, describtion, optStringArr, type) => {
	type = type === undefined ? QUEST_TYPE_SINGLE : type;
	return {
		id: `${group}-${num}`,
		type: type,
		name: name,
		describtion: describtion,
		options: optStringArr.map((optString,index) => option(`${group}-${num}`, index, optString[0], optString[1]))
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