export const OPTION_ON_CLICK = "OPTION_ON_CLICK";
export const MULTI_ON_CLICK = "MULTI_ON_CLICK";
export const TEXT_ON_CHANGE = "TEXT_ON_CHANGE";

export const handleOptionOnClick = optionObj => {
	return {
		type: OPTION_ON_CLICK,
		optionObj
	}
}

export const handleMultiOnClick = optionObj => {
	return {
		type: MULTI_ON_CLICK,
		optionObj
	}
}

export const NEXT_ON_CLICK = "NEXT_ON_CLICK";
export const PREVIOUS_ON_CLICK = "PREVIOUS_ON_CLICK";
export const START_OVER_ON_CLICK = "START_OVER_ON_CLICK";

export const handleNextOnClick = (id, next) => {
	return {
		type: NEXT_ON_CLICK,
		id, 
		next
	}
}

export const handlePreviousOnClick = (id) => {
	return {
		type: PREVIOUS_ON_CLICK,
		id
	}
}

export const handleStartOverOnClick = (id) => {
	return {
		type: START_OVER_ON_CLICK,
		id
	}
}