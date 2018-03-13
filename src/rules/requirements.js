import { question, questionGroup } from './index';
import { QUEST_TYPE_MULTI } from './index';
import { selectXALs } from './selectingQuestionPool';
import { evidenceStrength } from './featureQuestionPool';

const passiveConditionObj = (add, remove) => ({
  add, remove
})

export const IAL2_EVIDENCE_CONDITION = (status) => {
  var stengths = evidenceStrength(status);
  var amount = [0,0,0,0,0,0];
    for(var i=0; i<5; i++)
      amount[stengths[i]]++;
  if(amount[5] >=1 
    || amount[4] >=1 
    || amount[3] >= 2 
    || (amount[3] >=1 && amount[2]>=2))
    return passiveConditionObj([['500-1',0]]);
  
  return passiveConditionObj(undefined,[['500-1',0]]);
}

export const IAL3_EVIDENCE_CONDITION = (status) => {
  var stengths = evidenceStrength(status);
  var amount = [0,0,0,0,0,0];
  for(var i=0; i<5; i++)
    amount[stengths[i]]++;

  if(amount[5] >= 2 
    || (amount[5] >= 1 && amount[4] >= 1) 
    || ((amount[4] + amount[3]) >= 2 && amount[2] >= 1))
    return passiveConditionObj([['500-1',1]]);

  return passiveConditionObj(undefined, [['500-1',1]]);
}

const getActivatedOptionIndexArr = (status, optionArrs) => {
  var levels = selectXALs(status);
  var requireArr = [];
  optionArrs.forEach((optionObj, index) => {
    var isActivate = false;
    for(var i=0; i<3; i++){
      if(optionObj.activateLevel[i].includes(levels[i])) {
        isActivate = true;
        break;
      }
    }

    if(isActivate && optionObj.activateFunction !== undefined)
      isActivate = optionObj.activateFunction(status);

    if(isActivate)
      requireArr.push(optionObj.id);
  });

  return requireArr;
}

export const getRequirementObject = (status, questGroup) => {
  var reqObj = {};
  questGroup.questions.forEach(quest => {
    if(quest.active(status))
      reqObj[quest.id] = getActivatedOptionIndexArr(status, quest.options)  
  })
  
  return reqObj;
}

export const IAL_REQ_GROUP = questionGroup(500, 'Requirements for Enrollment and Identity proofing',
  'To achieve the target IAL, please check if all these requirements are satisfied. Please click the title of each categories to toggle the collapsed requirements. When all requirements in a category are checked, the category panel would be green. Make all the panels green to achieve the IAL',
  [
    question(500,0,
      'General Requirements for CSP and Personal information process',
      'In this part we\'ll check out some general requirements. When the describtion match the practice status, make the requirement green.',
      [
        [ 
          'Provide notice of usage of personal information',
          'The CSP SHALL provide explicit notice to the applicant at the time of collection regarding the purpose for collecting and maintaining a record of the attributes necessary for identity proofing, including whether such attributes are voluntary or mandatory to complete the identity proofing process, and the consequences for not providing the attributes.',
          [[2,3],[],[]]
        ],
        [
          'Measures for additional processing of personal information',
          'If CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”), related fraud mitigation, or to comply with law or legal process, CSPs SHALL implement measures to maintain predictability and manageability commensurate with the privacy risk arising from the additional processing. Measures MAY include providing clear notice, obtaining subscriber consent, or enabling selective use or disclosure of attributes.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Consent for additional processing is not condition of service',
          'When CSPs use consent measures, CSPs SHALL NOT make consent for the additional processing a condition of the identity service.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Provide mechanisms for redress or problem arising',
          'The CSP SHALL provide mechanisms for redress of applicant complaints or problems arising from the identity proofing. These mechanisms SHALL be easy for applicants to find and use. The CSP SHALL assess the mechanisms for their efficacy in achieving resolution of complaints or problems.',
          [[2,3],[],[]]
        ],
        [
          'Provide appropriate practice statement',
          'The identity proofing and enrollment processes SHALL be performed according to an applicable written policy or *practice statement* that specifies the particular steps taken to verify identities. The *practice statement* SHALL include control information detailing how the CSP handles proofing errors that result in an applicant not being successfully enrolled. For example, the number of retries allowed, proofing alternatives (e.g., in-person if remote fails), or fraud counter-measures when anomalies are detected.',
          [[2,3],[],[]]
        ],
        [
          'Maintain a record of associated logs',
          'The CSP SHALL maintain a record, including audit logs, of all steps taken to verify the identity of the applicant and SHALL record the types of identity evidence presented in the proofing process.',
          [[2,3],[],[]]
        ]
      ]),
    
    question(500,1,
      'Evidence Strength', 'Please make this part green by using more stronger evidences (add new evidences in "Feature Checking">"Enrollment Evidences Checking")',
      [
        [
          'IAL 2 Evidence Requirements matched',
          '1 SUPERIOR; OR 1 STRONG with stronger issuing source; OR 2 STRONG; OR 1 STRONG and 2 FAIR',
          [[2],[],[]],
          (status) => {return true;},
          IAL2_EVIDENCE_CONDITION
        ],
        [
          'IAL 3 Evidence Requirements matched',
          '2 SUPERIOR; OR 1 SUPERIOR and 1 STRONG with stronger issuing source; OR 2 STRONG and 1 Fair',
          [[3],[],[]],
          (status) => {return true;},
          IAL3_EVIDENCE_CONDITION
        ]
      ],QUEST_TYPE_MULTI,
      (status) => {
        return selectXALs(status)[0]>=2;
      }
    ),
    question(500,2,
      'Enrollment Codes','Blablabla',
      [
        [ 
          'Provide notice of usage of personal information',
          'The CSP SHALL provide explicit notice to the applicant at the time of collection regarding the purpose for collecting and maintaining a record of the attributes necessary for identity proofing, including whether such attributes are voluntary or mandatory to complete the identity proofing process, and the consequences for not providing the attributes.',
          [[2,3],[],[]]
        ],
        [
          'Measures for additional processing of personal information',
          'If CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”), related fraud mitigation, or to comply with law or legal process, CSPs SHALL implement measures to maintain predictability and manageability commensurate with the privacy risk arising from the additional processing. Measures MAY include providing clear notice, obtaining subscriber consent, or enabling selective use or disclosure of attributes.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Consent for additional processing is not condition of service',
          'When CSPs use consent measures, CSPs SHALL NOT make consent for the additional processing a condition of the identity service.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Provide mechanisms for redress or problem arising',
          'The CSP SHALL provide mechanisms for redress of applicant complaints or problems arising from the identity proofing. These mechanisms SHALL be easy for applicants to find and use. The CSP SHALL assess the mechanisms for their efficacy in achieving resolution of complaints or problems.',
          [[2,3],[],[]]
        ],
        [
          'Provide appropriate practice statement',
          'The identity proofing and enrollment processes SHALL be performed according to an applicable written policy or *practice statement* that specifies the particular steps taken to verify identities. The *practice statement* SHALL include control information detailing how the CSP handles proofing errors that result in an applicant not being successfully enrolled. For example, the number of retries allowed, proofing alternatives (e.g., in-person if remote fails), or fraud counter-measures when anomalies are detected.',
          [[2,3],[],[]]
        ],
        [
          'Maintain a record of associated logs',
          'The CSP SHALL maintain a record, including audit logs, of all steps taken to verify the identity of the applicant and SHALL record the types of identity evidence presented in the proofing process.',
          [[2,3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => {
        return status['100-4'] === 0;
      }
    )
  ]
);

export const AAL_REQ_GROUP = questionGroup(501, 'Requirements for Enrollment and Odentity proofing',
  'To achieve the target IAL, please check if all these requirements are satisfied. Please click the title of each categories to toggle the collapsed requirements. When all requirements in a category are checked, the category panel would be green. Make all the panels green to achieve the IAL',
  [
    question(501,0,
      'General Requirements for CSP and Personal information process',
      'In this part we\'ll check out some general requirements. When the describtion match the practice status, make the requirement green.',
      [
        [ 
          'Provide notice of usage of personal information',
          'The CSP SHALL provide explicit notice to the applicant at the time of collection regarding the purpose for collecting and maintaining a record of the attributes necessary for identity proofing, including whether such attributes are voluntary or mandatory to complete the identity proofing process, and the consequences for not providing the attributes.',
          [[2,3],[],[]]
        ],
        [
          'Measures for additional processing of personal information',
          'If CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”), related fraud mitigation, or to comply with law or legal process, CSPs SHALL implement measures to maintain predictability and manageability commensurate with the privacy risk arising from the additional processing. Measures MAY include providing clear notice, obtaining subscriber consent, or enabling selective use or disclosure of attributes.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Consent for additional processing is not condition of service',
          'When CSPs use consent measures, CSPs SHALL NOT make consent for the additional processing a condition of the identity service.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Provide mechanisms for redress or problem arising',
          'The CSP SHALL provide mechanisms for redress of applicant complaints or problems arising from the identity proofing. These mechanisms SHALL be easy for applicants to find and use. The CSP SHALL assess the mechanisms for their efficacy in achieving resolution of complaints or problems.',
          [[2,3],[],[]]
        ],
        [
          'Provide appropriate practice statement',
          'The identity proofing and enrollment processes SHALL be performed according to an applicable written policy or *practice statement* that specifies the particular steps taken to verify identities. The *practice statement* SHALL include control information detailing how the CSP handles proofing errors that result in an applicant not being successfully enrolled. For example, the number of retries allowed, proofing alternatives (e.g., in-person if remote fails), or fraud counter-measures when anomalies are detected.',
          [[2,3],[],[]]
        ],
        [
          'Maintain a record of associated logs',
          'The CSP SHALL maintain a record, including audit logs, of all steps taken to verify the identity of the applicant and SHALL record the types of identity evidence presented in the proofing process.',
          [[2,3],[],[]]
        ]
      ]),
    question(501,1,
      'Enrollment Codes','Blablabla',
      [
        [ 
          'Provide notice of usage of personal information',
          'The CSP SHALL provide explicit notice to the applicant at the time of collection regarding the purpose for collecting and maintaining a record of the attributes necessary for identity proofing, including whether such attributes are voluntary or mandatory to complete the identity proofing process, and the consequences for not providing the attributes.',
          [[2,3],[],[]]
        ],
        [
          'Measures for additional processing of personal information',
          'If CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”), related fraud mitigation, or to comply with law or legal process, CSPs SHALL implement measures to maintain predictability and manageability commensurate with the privacy risk arising from the additional processing. Measures MAY include providing clear notice, obtaining subscriber consent, or enabling selective use or disclosure of attributes.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Consent for additional processing is not condition of service',
          'When CSPs use consent measures, CSPs SHALL NOT make consent for the additional processing a condition of the identity service.',
          [[1,2,3],[],[]],
          (status) => {
            return status['100-5'] === 0;
          }
        ],
        [
          'Provide mechanisms for redress or problem arising',
          'The CSP SHALL provide mechanisms for redress of applicant complaints or problems arising from the identity proofing. These mechanisms SHALL be easy for applicants to find and use. The CSP SHALL assess the mechanisms for their efficacy in achieving resolution of complaints or problems.',
          [[2,3],[],[]]
        ],
        [
          'Provide appropriate practice statement',
          'The identity proofing and enrollment processes SHALL be performed according to an applicable written policy or *practice statement* that specifies the particular steps taken to verify identities. The *practice statement* SHALL include control information detailing how the CSP handles proofing errors that result in an applicant not being successfully enrolled. For example, the number of retries allowed, proofing alternatives (e.g., in-person if remote fails), or fraud counter-measures when anomalies are detected.',
          [[2,3],[],[]]
        ],
        [
          'Maintain a record of associated logs',
          'The CSP SHALL maintain a record, including audit logs, of all steps taken to verify the identity of the applicant and SHALL record the types of identity evidence presented in the proofing process.',
          [[2,3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => {
        return status['100-4'] === 0;
      }
    )
  ]
);