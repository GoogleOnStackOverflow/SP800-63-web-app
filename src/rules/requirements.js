import { question, questionGroup } from './index';
import { QUEST_TYPE_MULTI } from './index';
import { selectXALs } from './selectingQuestionPool';
import { validatingStrength, evidenceStrength, verificationStrength, KBV_pieces } from './featureQuestionPool';

const MIN = (a, b) => {
  return a < b ? a : b;
}

const passiveConditionObj = (add, remove) => ({
  add, remove
})

export const IAL_EVIDENCE_CONDITION = (status) => {
  var addArr = [];
  var removeArr = [];

  var stengths = evidenceStrength(status);
  var validating = validatingStrength(status);
  var verifying = verificationStrength(status);

  var amount = [0,0,0,0,0,0];
  var minVerifyStrength = 6;
  for(var i=0; i<5; i++) {
    amount[MIN(stengths[i], validating[i])]++;

    if(MIN(stengths[i], validating[i]) >=2) 
      minVerifyStrength = MIN(minVerifyStrength, verifying[i]);
  }

  minVerifyStrength = (minVerifyStrength === 6)? 0 : minVerifyStrength;

  if(minVerifyStrength === 5) {
    addArr.push(['500-1',2]);
    addArr.push(['500-1',3]);
  } else if (minVerifyStrength === 4) {
    addArr.push(['500-1',2]);
    removeArr.push(['500-1',3]);
  } else {
    removeArr.push(['500-1',2]);
    removeArr.push(['500-1',3]);
  }

  if(amount[5] >=1 
    || amount[4] >=1 
    || amount[3] >= 2 
    || (amount[3] >=1 && amount[2]>=2))
    addArr.push(['500-1',0]);
  else removeArr.push(['500-1',0]);

  if(amount[5] >= 2 
    || (amount[5] >= 1 && amount[4] >= 1) 
    || ((amount[4] + amount[3]) >= 2 && amount[2] >= 1))
    addArr.push(['500-1',1]);
  else removeArr.push(['500-1',1]);

  if(KBV_pieces(status) > 1)
    removeArr.push(['500-1', 4]);
  else
    addArr.push(['500-1', 4]);
  
  return passiveConditionObj(addArr, removeArr);
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
          'Collection of personal information is limited to the minimum necessary',
          'Collection of PII SHALL be limited to the minimum necessary to validate the existence of the claimed identity and associate the claimed identity with the applicant providing identity evidence for appropriate identity resolution, validation, and verification. This MAY include attributes that correlate identity evidence to authoritative sources and to provide RPs with attributes used to make authorization decisions.',
          [[2,3],[],[]]
        ],
        [ 
          'Provide notice of usage of personal information',
          'The CSP SHALL provide explicit notice to the applicant at the time of collection regarding the purpose for collecting and maintaining a record of the attributes necessary for identity proofing, including whether such attributes are voluntary or mandatory to complete the identity proofing process, and the consequences for not providing the attributes.',
          [[2,3],[],[]]
        ],
        [
          'Measures for additional processing of personal information',
          'If CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”), related fraud mitigation, or to comply with law or legal process, CSPs SHALL implement measures to maintain predictability and manageability commensurate with the privacy risk arising from the additional processing. Measures MAY include providing clear notice, obtaining subscriber consent, or enabling selective use or disclosure of attributes.',
          [[1,2,3],[],[]],
          (status) => (status['100-5'] === 0)
        ],
        [
          'Consent for additional processing is not condition of service',
          'When CSPs use consent measures, CSPs SHALL NOT make consent for the additional processing a condition of the identity service.',
          [[1,2,3],[],[]],
          (status) => (status['100-5'] === 0)
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
        ],
        [
          'Conduct risk management for enrollment process',
          'The CSP SHALL conduct a risk management process, including assessments of privacy and security risks to determine any steps that it will take to verify the identity of the applicant beyond any mandatory requirements specified herein',
          [[2,3],[],[]]
        ],
        [
          'Conduct risk management for records of attributes',
          'The CSP SHALL conduct a risk management process, including assessments of privacy and security risks to determine the PII, including any biometrics, images, scans, or other copies of the identity evidence that the CSP will maintain as a record of identity proofing (Note: Specific federal requirements may apply.)',
          [[2,3],[],[]]
        ],
        [
          'Conduct risk management for privacy risks',
          'The CSP SHALL conduct a risk management process, including assessments of privacy and security risks to determine the schedule of retention for these records. Note: CSPs may be subject to specific retention policies in accordance with applicable laws, regulations, or policies, including any National Archives and Records Administration (NARA) records retention schedules that may apply.',
          [[2,3],[],[]]
        ],
        [

          'All persinal information collected as part of the enrollment process is protected',
          'All PII collected as part of the enrollment process SHALL be protected to ensure confidentiality, integrity, and attribution of the information source.',
          [[2,3],[],[]]
        ],
        [
          'Use authenticated protected channel',
          'The entire proofing transaction, including transactions that involve a third party, SHALL occur over an authenticated protected channel.',
          [[2,3],[],[]]
        ],
        [
          'Sensitive information is properly distroyed after identity proofing ceased',
          'In the event a CSP ceases to conduct identity proofing and enrollment processes, the CSP SHALL be responsible for fully disposing of or destroying any sensitive data including PII, or its protection from unauthorized access for the duration of retention.',
          [[2,3],[],[]]
        ],
        [
          'Privacy Act checked',
          'The agency SHALL consult with their Senior Agency Official for Privacy (SAOP) to conduct an analysis determining whether the collection of PII to conduct identity proofing triggers Privacy Act requirements.',
          [[2,3],[],[]]
        ],
        [
          'SORN is published',
          'The agency SHALL publish a System of Records Notice (SORN) to cover such collection, as applicable.',
          [[2,3],[],[]]
        ],
        [
          'E-Government Act of 2002 checked',
          'The agency SHALL consult with their SAOP to conduct an analysis determining whether the collection of PII to conduct identity proofing triggers E-Government Act of 2002 requirements.',
          [[2,3],[],[]]
        ],
        [
          'Privacy Impact Assessment published',
          'The agency SHALL publish a Privacy Impact Assessment (PIA) to cover such collection, as applicable.',
          [[2,3],[],[]]
        ],
        [
          'A CSP that supports only IAL1 SHALL NOT validate and verify attributes.',
          'A CSP that supports only IAL1 SHALL NOT validate and verify attributes.',
          [[1],[],[]]
        ],
        [
          'A CSP SHALL preferentially proof according to the requirements',
          'A CSP SHALL preferentially proof according to the requirements',
          [[2,3],[],[]]
        ],
        [
          'Security controll is appropriately employed',
          'The CSP SHALL employ appropriately tailored security controls, to include control enhancements, from the moderate or high baseline of security controls defined in SP 800-53 or equivalent federal (e.g., FEDRAMP) or industry standard.',
          [[2,3],[],[]]
        ],
        [
          'The minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          'The CSP SHALL ensure that the minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          [[3],[],[]]
        ],
        [
          'Biometric sample is collected at the time of proofing',
          'The CSP SHALL collect and record a biometric sample at the time of proofing (e.g., facial image, fingerprints) for the purposes of non-repudiation and re-proofing',
          [[3],[],[]]
        ],
      ]),
    
    question(500,1,
      'Evidence Requirements', 'Please make this part green by using more stronger evidences (add new evidences in "Feature Checking">"Enrollment Evidences Checking", use next/previous to edit at most 5 evidences)',
      [
        [
          'IAL 2 evidence strength and corresponding validating requirements matched',
          '1 SUPERIOR; OR 1 STRONG with stronger issuing source; OR 2 STRONG; OR 1 STRONG and 2 FAIR',
          [[2],[],[]],
          (status) => (true),
          true
        ],
        [
          'IAL 3 evidence strength and corresponding validating requirements matched',
          '2 SUPERIOR; OR 1 SUPERIOR and 1 STRONG with stronger issuing source; OR 2 STRONG and 1 Fair',
          [[3],[],[]],
          (status) => (true),
          true
        ],
        [
          'IAL 2 Evidence Verifying Strength matched',
          'All evidences should be verified by process achieving at least strength of STRONG',
          [[2],[],[]],
          (status) => (true),
          true
        ],
        [
          'IAL 3 Evidence Verifying Strength matched',
          'All evidences should be verified by process achieving at least strength of SUPERIOR',
          [[3],[],[]],
          (status) => (true),
          true
        ],
        [
          'Knowledge-based verification (KBV) is not used to verify more than one piece of Evidence',
          'The CSP SHALL NOT use KBV to verify an applicant\'s identity against more than one piece of validated identity evidence.',
          [[2,3],[],[]],
          (status) => (status['100-3'] === 0),
          true
        ]
      ],QUEST_TYPE_MULTI,
      (status) => (selectXALs(status)[0]>=2)
    ),
    question(500, 2,
      'Address Confirmation',
      'Requirements in this part are about rules for address confirmation. Please check if the descibtion match the process for address confirmation.',
      [
        [
          'Address of record is confirmed',
          'The CSP SHALL confirm address of record. The CSP SHOULD confirm address of record through validation of the address contained on any supplied, valid piece of identity evidence. The CSP MAY confirm address of record by validating information supplied by the applicant that is not contained on any supplied piece of identity evidence.',
          [[2],[],[]]
        ],
        [
          'Use records from issuing source(s) or authoritative source(s) to confirm address',
          'Valid records to confirm address SHALL be issuing source(s) or authoritative source(s).',
          [[2],[],[]]
        ],
        [
          'Self-asserted address data is not used for confirmation',
          'Self-asserted address data that has not been confirmed in records SHALL NOT be used for confirmation.',
          [[2,3],[],[]]
        ],
        [
          'The enrollment code for address confirmation in an in-person enrollment process is valid for a maximum of 7 days.',
          'The CSP MAY provide an enrollment code directly to the subscriber if binding to an authenticator will occur at a later time. The enrollment code SHALL be valid for a maximum of 7 days.',
          [[2],[],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-4'] === 0 && status['100-0'].includes(0);
            return false;
          }
        ],
        [
          'The CSP sends an enrollment code to the applicant during remote enrollment process.',
          'The CSP SHALL send an enrollment code to a confirmed address of record for the applicant.',
          [[2],[],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-4'] === 0 && status['100-0'].includes(1);
            return false;
          }
        ],
        [
          'The applicant SHALL present a valid enrollment code to complete the identity proofing process.',
          'The applicant SHALL present a valid enrollment code to complete the identity proofing process.',
          [[2],[],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-4'] === 0 && status['100-0'].includes(1);
            return false;
          }
        ],
        [
          'The enrollment code is reset upon first use to be an authentication.',
          'If the enrollment code is also intended to be an authentication factor, it SHALL be reset upon first use.',
          [[2],[],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-4'] === 0 && status['100-0'].includes(1);
            return false;
          }
        ],
        [
          'Enrollment codes have the appropriate maximum validities',
          '(1) 10 days, when sent to a postal address of record within the contiguous United States. (2) 30 days, when sent to a postal address of record outside the contiguous United States. (3) 10 minutes, when sent to a telephone of record (SMS or voice). (4) 24 hours, when sent to an email address of record.',
          [[2],[],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-4'] === 0 && status['100-0'].includes(1);
            return false;
          }
        ],
        [
          'The enrollment code and notification of proofing are sent to different addresses of record.',
          'The CSP SHALL ensure the enrollment code and notification of proofing are sent to different addresses of record. For example, if the CSP sends an enrollment code to a phone number validated in records, a proofing notification will be sent to the postal address validated in records or obtained from validated and verified evidence, such as a driver\'s license.',
          [[2],[],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-4'] === 0 && status['100-0'].includes(1);
            return false;
          }
        ],
        [
          'An enrollment code is comprised of minimally, a random six character alphanumeric or equivalent entropy.',
          'An enrollment code SHALL be comprised of minimally, a random six character alphanumeric or equivalent entropy. For example, a code generated using an approved random number generator or a serial number for a physical hardware authenticator.Or an enrollment code SHALL be comprised of a machine-readable optical label, such as a QR Code, that contains data of similar or higher entropy as a random six character alphanumeric.',
          [[2,3],[],[]],
          (status) => (status['100-4'] === 0)
        ],
        [
          'A notification of proofing is sent to the address of record',
          'A notification of proofing SHALL be sent to the confirmed address of record',
          [[3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => (selectXALs(status)[0]>=2)
    ),
    question(500, 3,
      'Knowledge-based verification (KBV)',
      'Requirements in this part are about rules for Knowledge-based verification (KBV). Please check if the descibtion match the process of KBV.',
      [
        [ 
          'Information used in Knowledge-based verification (KBV) is ensured appropriate',
          'The CSP SHALL only use information that is expected to be known only to the applicant and the authoritative source, to include any information needed to begin the KBV process. Information accessible freely, for a fee in the public domain, or via the black market SHALL NOT be used.',
          [[2,3],[],[]]
        ],
        [
          'Options other than using Knowledge-based verification (KBV) is available',
          'The CSP SHALL allow a resolved and validated identity to opt out of KBV and leverage another process for verification.',
          [[2,3],[],[]]
        ],
        [
          'Knowledge-based verification (KBV) is not used for in-person (physical or supervised remote) identity verification.',
          'Knowledge-based verification (KBV) SHALL NOT be used for in-person (physical or supervised remote) identity verification.',
          [[2,3],[],[]]
        ],
        [
          'Transaction information has at least 20 bits of entropy',
          'The CSP SHOULD perform KBV by verifying knowledge of recent transactional history in which the CSP is a participant. The CSP SHALL ensure that transaction information has at least 20 bits of entropy.',
          [[2,3],[],[]]
        ],
        [
          'KBV SHOULD be based on multiple authoritative sources.',
          'KBV SHOULD be based on multiple authoritative sources.',
          [[2,3],[],[]]
        ],
        [
          'A minimum of four KBV questions are asked during the KBV process',
          'The CSP SHALL require a minimum of four KBV questions with each requiring a correct answer to successfully complete the KBV step.',
          [[2,3],[],[]]
        ],
        [
          'Per multiple choice questions should have a minimum of four answer options.',
          'The CSP SHOULD require free-form response KBV questions. The CSP MAY allow multiple choice questions, however, if multiple choice questions are provided, the CSP SHALL require a minimum of four answer options per question.',
          [[2,3],[],[]]
        ],
        [ 
          'No more than 3 attemps are alloed',
          'The CSP SHOULD allow two attempts for an applicant to complete the KBV. A CSP SHALL NOT allow more than three attempts to complete the KBV.',
          [[2,3],[],[]]
        ],
        [
          'Time out is set for KBV',
          'The CSP SHALL time out KBV sessions after two minutes of inactivity per question. In cases of session timeout, the CSP SHALL restart the entire KBV process and consider this a failed attempt.',
          [[2,3],[],[]]
        ],
        [
          'The CSP SHALL NOT present a majority of diversionary KBV questions.',
          'The CSP SHALL NOT present a majority of diversionary KBV questions. i.e., those where "none of the above" is the correct answer.',
          [[2,3],[],[]]
        ],
        [
          'Questions provides no information that could assist in answering any future KBV question',
          'The CSP SHALL NOT ask a KBV question that provides information that could assist in answering any future KBV question in a single session or a subsequent session after a failed attempt.',
          [[2,3],[],[]]
        ],
        [
          'The CSP SHALL NOT use KBV questions for which the answers do not change.',
          'The CSP SHALL NOT use KBV questions for which the answers do not change.',
          [[2,3],[],[]]
        ],
        [
          'Questions provides no personal information',
          'The CSP SHALL ensure that any KBV question does not reveal PII that the applicant has not already provided, nor personal information that, when combined with other information in a KBV session, could result in unique identification.',
          [[2,3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => (status['100-3'] === 0)
    ),
    question(500, 4,
      'Presence Requirements - In-person at IAL3',
      'In this part, we are going to check the requirements about how an applicant completes the enrollment process in person at IAL3.',
      [
        [
          'Presence of non-natural materials are checked when collecting biometrics',
          'The CSP SHALL have the operator view the biometric source (e.g., fingers, face) for presence of non-natural materials and perform such inspections as part of the proofing process.',
          [[3],[],[]]
        ],
        [
          'Biometric source is ensured from the applicant',
          'The CSP SHALL collect biometrics in such a way that ensures that the biometric is collected from the applicant, and not another subject.',
          [[3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => {
        if(Array.isArray(status['100-0']))
          return selectXALs(status)[0] === 3 && status['100-0'].includes(0);
        return false;
      }
    ),
    question(500, 5,
      'Presence Requirements - Supervised Remote at IAL3',
      'In this part, we are going to check the requirements about how an applicant completes the enrollment process remotely at IAL3.',
      [
        [
          'Remote proofing session is monitered not suspended',
          'The CSP SHALL monitor the entire identity proofing session, from which the applicant SHALL NOT depart. For example, by a continuous high-resolution video transmission of the applicant.',
          [[3],[],[]]
        ],
        [
          'A live operator participate remotely',
          'The CSP SHALL have a live operator participate remotely with the applicant for the entirety of the identity proofing session.',
          [[3],[],[]]
        ],
        [
          'Require all actions taken by the applicant during the identity proofing session to be clearly visible to the remote operator',
          'The CSP SHALL require all actions taken by the applicant during the identity proofing session to be clearly visible to the remote operator.',
          [[3],[],[]]
        ],
        [
          'Integrity of scanners or sensors are checked',
          'The CSP SHALL require that all digital verification of evidence (e.g., via chip or wireless technologies) be performed by integrated scanners and sensors.',
          [[3],[],[]]
        ],
        [
          'Operators are trained',
          'The CSP SHALL require operators to have undergone a training program to detect potential fraud and to properly perform a supervised remote proofing session.',
          [[3],[],[]]
        ],
        [
          'Physical tamper detection and resistance features are emplyed',
          'The CSP SHALL employ physical tamper detection and resistance features appropriate for the environment in which it is located. For example, a kiosk located in a restricted area or one where it is monitored by a trusted individual requires less tamper detection than one that is located in a semi-public area such as a shopping mall concourse.',
          [[3],[],[]]
        ],
        [
          'Mutually authenticated protected channel is used',
          'The CSP SHALL ensure that all communications occur over a mutually authenticated protected channel.',
          [[3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => {
        if(Array.isArray(status['100-0']))
          return selectXALs(status)[0] === 3 && status['100-0'].includes(1);
        return false;
      }
    ),
    question(500, 6,
      'Referee',
      'In this part, we are going to check the requirements about how an referee completes the enrollment process.',
      [
        [
          'Written policy about referee is provided',
          'The CSP SHALL establish written policy and procedures as to how a trusted referee is determined and the lifecycle by which the trusted referee retains their status as a valid referee, to include any restrictions, as well as any revocation and suspension requirements.',
          [[1,2,3],[],[]]
        ],
        [
          'Trusted referee\'s identity is proofed at the same IAL',
          'The CSP SHALL proof the trusted referee at the same IAL as the applicant proofing.',
          [[1,2,3],[],[]]
        ],
        [
          'Evidences for referee is determined',
          'The CSP SHALL determine the minimum evidence required to bind the relationship between the trusted referee and the applicant.',
          [[1,2,3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => (status['100-1'] === 0)
    ),
    question(500, 7,
      'Minors',
      'In this part, we are going to check the requirements about how a minor completes the enrollment process.',
      [
        [
          'Special consideration to the legal restrictions of interacting with minors are given',
          'The CSP SHALL give special consideration to the legal restrictions of interacting with minors unable to meet the evidence requirements of identity proofing to ensure compliance with the Children’s Online Privacy Protection Act of 1998 (COPPA), and other laws, as applicable.',
          [[1,2,3],[],[]]
        ],
        [
          'COPPA, and other laws are abided',
          'Minors under age 13 require additional special considerations under COPPA, and other laws, to which the CSP SHALL ensure compliance, as applicable.',
          [[1,2,3],[],[]]
        ]
      ], QUEST_TYPE_MULTI,
      (status) => (status['100-6'] === 0)
    ),
  ]
);

export const AAL_REQ_GROUP = questionGroup(501, 'Requirements for Enrollment and Odentity proofing',
  'To achieve the target AAL, please check if all these requirements are satisfied. Please click the title of each categories to toggle the collapsed requirements. When all requirements in a category are checked, the category panel would be green. Make all the panels green to achieve the AAL',
  [
    question(501,0,
      'General Requirements for Authenticators, Verifiers and the CSPs',
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