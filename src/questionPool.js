export const QUEST_TYPE_SINGLE = 'QUEST_TYPE_SINGLE';
export const QUEST_TYPE_MULTI = 'QUEST_TYPE_MULTI';
export const QUEST_TYPE_TEXT = 'QUEST_TYPE_TEXT';

const option = (parent, num, name, describtion) => {
	return {
		id: num,
		parent: parent,
		name: name,
		describtion: describtion
	};
};

const question = (group, num, name, describtion, optStringArr, type) => {
	type = type === undefined ? QUEST_TYPE_SINGLE : type;
	return {
		id: `${group}-${num}`,
		type: type,
		name: name,
		describtion: describtion,
		options: optStringArr.map((optString,index) => option(`${group}-${num}`, index, optString[0], optString[1]))
	};
}

const questionGroup = (num, name, describtion, questionArr, nextFunction) => {
	return { 
		id: num,
		name: name,
		describtion: describtion,
		questions: questionArr,
		next: nextFunction
	};
}

const RiskInconv = [
	/*name*/
	'What are the risks (to the organization) or the subject of providing the digital service?',
	/*descibtions*/
	'Inconveniece, distress or damage to standing or reputation',
	/*options*/
	[
		['N/A','No risk'],
		/*option*/
		['Low',
		'At worst, limited, short-term inconvenience, distress, or embarrassment to any party.'],
		/*option*/
		['Moderate',
		'At worst, serious short-term or limited long-term inconvenience, distress, or damage to the standing or reputation of any party.'],
		/*option*/
		['High',
		'Severe or serious long-term inconvenience, distress, or damage to the standing or reputation of any party. This is ordinarily reserved for situations with particularly severe effects or which potentially affect many individuals.']
	]
];

const RiskFin = [
	/*name*/
	'What are the risks (to the organization) or the subject of providing the digital service?',
	/*descibtions*/
	'Financial loss or agency liability',
	/*options*/
	[
		['N/A','No risk'],
		/*option*/
		['Low',
		'At worst, an insignificant or inconsequential financial loss to any party, or at worst, an insignificant or inconsequential agency liability.'],
		/*option*/
		['Moderate',
		'At worst, a serious financial loss to any party, or a serious agency liability.'],
		/*option*/
		['High',
		'Severe or catastrophic financial loss to any party, or severe or catastrophic agency liability.']
	]
];

const RiskAgency = [
	/*name*/
	'What are the risks (to the organization) or the subject of providing the digital service?',
	/*descibtions*/
	'Harm to agency programs or public interests',
	/*options*/
	[
		['N/A','No risk'],
		/*option*/
		['Low',
		'At worst, a limited adverse effect on organizational operations or assets, or public interests. Examples of limited adverse effects are: (i) mission capability degradation to the extent and duration that the organization is able to perform its primary functions with noticeably reduced effectiveness, or (ii) minor damage to organizational assets or public interests.'],
		/*option*/
		['Moderate',
		'At worst, a serious adverse effect on organizational operations or assets, or public interests. Examples of serious adverse effects are: (i) significant mission capability degradation to the extent and duration that the organization is able to perform its primary functions with significantly reduced effectiveness; or (ii) significant damage to organizational assets or public interests.'],
		/*option*/
		['High',
		'A severe or catastrophic adverse effect on organizational operations or assets, or public interests. Examples of severe or catastrophic effects are: (i) severe mission capability degradation or loss of to the extent and duration that the organization is unable to perform one or more of its primary functions; or (ii) major damage to organizational assets or public interests.']
	]
];

const RiskInf = [
	/*name*/
	'What are the risks (to the organization) or the subject of providing the digital service?',
	/*descibtions*/
	'Unauthorized release of sensitive information',
	/*options*/
	[
		['N/A','No risk'],
		/*option*/
		['Low',
		'At worst, a limited release of personal, U.S. government sensitive, or commercially sensitive information to unauthorized parties resulting in a loss of confidentiality with a low impact as defined in FIPS 199.'],
		/*option*/
		['Moderate',
		'At worst, a release of personal, U.S. government sensitive, or commercially sensitive information to unauthorized parties resulting in loss of confidentiality with a moderate impact as defined in FIPS 199.'],
		/*option*/
		['High',
		'A release of personal, U.S. government sensitive, or commercially sensitive information to unauthorized parties resulting in loss of confidentiality with a high impact as defined in FIPS 199.']
	]
];
const RiskSafety = [
	/*name*/
	'What are the risks (to the organization) or the subject of providing the digital service?',
	/*descibtions*/
	'Personal Safety',
	/*options*/
	[
		['N/A','No risk'],
		/*option*/
		['Low',
		'At worst, minor injury not requiring medical treatment.'],
		/*option*/
		['Moderate',
		'At worst, moderate risk of minor injury or limited risk of injury requiring medical treatment.'],
		/*option*/
		['High',
		'A risk of serious injury or death.']
	]
];
const RiskCivil = [
	/*name*/
	'What are the risks (to the organization) or the subject of providing the digital service?',
	/*descibtions*/
	'Civil or criminal violations',
	/*options*/
	[
		['N/A','No risk'],
		/*option*/
		['Low',
		'At worst, a risk of civil or criminal violations of a nature that would not ordinarily be subject to enforcement efforts.'],

		/*option*/
		['Moderate',
		'At worst, a risk of civil or criminal violations that may be subject to enforcement efforts.'],

		/*option*/
		['High',
		'A risk of civil or criminal violations that are of special importance to enforcement programs.']
	]
];

const riskQuestArr = [
	question(3, 0, RiskInconv[0], RiskInconv[1], RiskInconv[2]),
	question(3, 1, RiskFin[0], RiskFin[1], RiskFin[2]),
	question(3, 2, RiskAgency[0], RiskAgency[1], RiskAgency[2]),
	question(3, 3, RiskInf[0], RiskInf[1], RiskInf[2]),
	question(3, 4, RiskCivil[0], RiskCivil[1], RiskCivil[2]),
	question(3, 5, RiskSafety[0], RiskSafety[1], RiskSafety[2]),
];

export const xALSelectQuestGroup = [
	questionGroup(0, 'Selecting Assurance Levels', '', 
		[question(
			0, 0, 'Selecting Assurance Levels', 
			'Do you know which assurance levels are required for your service?', 
			[
				['Yes','Let me select assurance levels manually'],
				['No','Please help me select assurance levels']
			],QUEST_TYPE_MULTI)
		], 
		(status) => {
			return status['0-0']===0?10:1;
		}
	),

	questionGroup(1, 'Selecting Assurance Levels', 'This question is about selecting IAL', 
		[question(
			1, 0, 'Personal information', 
			'To provide service, do you need any personal information?', 
			[
				['Yes',''],
				['No','']
			])
		], 
		(status) => {
			return status['1-0']===0?2:3;
		}
	),

	questionGroup(2, 'Selecting Assurance Levels', 'This question is about selecting IAL', 
		[question(
			2, 0, 'Personal information', 
			'To complete the transaction, do you need the personal information to be validated?', 
			[
				['Yes',''],
				['No',''],
				['I don\'t know','']
			])
		], 
		(status) => {
			return 3;
		}
	),

	questionGroup(3, 'Risk Impact Estimate', 'To decide what xALs should a service take, we need to know the risk impacts to an agency providing the service.', 
		riskQuestArr,
		(status) => {
			for(var i=0; i<6; i++)
				if(status[`3-${i}`]>0) return 5;
			return 4;
		}
	),

	questionGroup(4, 'Selecting Assurance Levels', 'This question is about selecting AAL', 
		[question(
			4, 0, 'Personal Data', 
			'Are you making personal data accessable?', 
			[
				['Yes',''],
				['No','']
			])
		], 
		(status) => {
			return 5;
		}
	),

	questionGroup(5, 'Federation?', 'This question is about to selecting federating or not.', 
		[question(
			5, 0, 'Do you need to resolve an identity uniquely?', 
			'Determine if the personal information required by the agency will ultimately resolve to a unique identity. In other word, the agency needs to know the full identity of the subject accessing the digital service.', 
			[
				['Yes',''],
				['No','']
			])
		], 
		(status) => {
			return status['5-0']===0?-1:6;
		}
	),


	questionGroup(6, 'Federation?', 'This question is about to selecting federating or not.', 
		[question(
			6, 0, 'Can you accept reference?', 
			'The digital service can be provided without having access to full attribute values. This does not mean all attributes must be delivered as claims, but this step does ask the agency to look at each personal attribute they have deemed necessary, and identify which can suffice as claims and which need to be complete values.', 
			[
				['Yes',''],
				['No','']
			])
		], 
		(status) => {
			return status['6-0']===0?7:-1;
		}
	),

	questionGroup(7, 'Federation?', 'This question is about to selecting federating or not.', 
		[question(
			7, 0, 'Are you federating?', 
			'As title, are you considering using federated system?',
			[
				['Yes',''],
				['No','']
			])
		], 
		(status) => {
			return status['7-0']===0?8:-1;
		}
	),
	
	questionGroup(8, 'Selecting Assurance Levels', 'This question is about selecting FAL', 
		[question(
			8, 0, 'Personal Data', 
			'Would personal data in assertion?',
			[
				['Yes',''],
				['No','']
			])
		], 
		(status) => {
			return status['8-0']===0?-1:9;
		}
	),


	questionGroup(9, 'Selecting Assurance Levels', 'This question is about selecting FAL', 
		[question(
			9, 0, 'What assertion channel scheme do you use?', 
			'As title, are you using front-channel or back-channel assrtion presentation?',
			[
				['front-channel',''],
				['back-channel',''],
				['I\'m not sure',''],
			])
		], 
		(status) => {
			return -1;
		}
	),

	questionGroup(10, 'Selecting Assurance Levels', 'Select assurance levels manually', 
		[
			question(
				10, 0, 'Identity Assurance Level', 
				'I would have to use:',
				[
					['IAL1',''],
					['IAL2',''],
					['IAL3',''],
				]),
			question(
				10, 1, 'Identity Assurance Level', 
				'I would have to use:',
				[
					['AAL1',''],
					['AAL2',''],
					['AAL3',''],
				]),
			question(
				10, 2, 'Identity Assurance Level', 
				'I would have to use:',
				[
					['I\'m not federating',''],
					['FAL1',''],
					['FAL2',''],
					['FAL3',''],
				]),
		], 
		(status) => {
			return -1;
		}
	),
];

export const selectXALs = (status) => {
	var ial = 0, aal = 0, fal = 0;
	if(status['0-0'] === 0) {
		ial = status['10-0']+1;
		aal = status['10-1']+1;
		fal = status['10-2'];
	} else if (status['0-0'] === 1){
		if(status['1-0']===1) ial = 1;
		if(status['2-0']===1) ial = 1;

		if(status['3-5']>=2) {
			ial = ial===0 ? 3 : ial;
			aal = fal = 3;
		} else {
			for(var i=0; i<5; i++){
				if(status[`3-${i}`]===3){
					ial = ial===0 ? 3 : ial;
					aal = fal = 3;
					break;
				}
			}

			if(aal === 0) 
				for(i=0; i<5; i++){
					if(status[`3-${i}`]===2){
						ial = ial===0 ? 2 : ial;
						aal = fal = 2;
						break;
					}
				}

			if(aal === 0) 
				for(i=2; i<6; i++){
					if(status[`3-${i}`]===1){
						ial = ial===0 ? 2 : ial;
						aal = fal = 2;
						break;
					}
				}
		}

		if(aal===0)
			aal = status['4-0']===0 ? 2 : 1;

		if(status['8-0'] === 0 && fal === 0)
			fal = 2;

		if(fal === 0)
			fal = status['9-0'] === 0? 2 : 1;

		if(status['5-0'] === 0 ||
			status['6-0'] === 1 || 
			status['7-0'] === 1)
			fal =  0;
	}

	if(ial >= 2 && aal === 1) aal = ial;
	if(ial >= 2 && fal !== 0) fal = ial;

	return ial === 0 ? [NaN, NaN, NaN] : [ial, aal ,fal];
};
