import { question, questionGroup } from './index';
import { QUEST_TYPE_MULTI } from './index';
import { selectXALs } from './selectingQuestionPool';
import { validatingStrength, evidenceStrength, verificationStrength, KBV_pieces , UsageOfAuthenticators } from './featureQuestionPool';

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
      // 0
        [
          'Collection of personal information is limited to the minimum necessary',
          'Collection of PII SHALL be limited to the minimum necessary to validate the existence of the claimed identity and associate the claimed identity with the applicant providing identity evidence for appropriate identity resolution, validation, and verification. This MAY include attributes that correlate identity evidence to authoritative sources and to provide RPs with attributes used to make authorization decisions.',
          [[2,3],[],[]]
        ],
      // 1
        [ 
          'Provide notice of usage of personal information',
          'The CSP SHALL provide explicit notice to the applicant at the time of collection regarding the purpose for collecting and maintaining a record of the attributes necessary for identity proofing, including whether such attributes are voluntary or mandatory to complete the identity proofing process, and the consequences for not providing the attributes.',
          [[2,3],[],[]]
        ],
      // 2
        [
          'Measures for additional processing of personal information',
          'If CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”), related fraud mitigation, or to comply with law or legal process, CSPs SHALL implement measures to maintain predictability and manageability commensurate with the privacy risk arising from the additional processing. Measures MAY include providing clear notice, obtaining subscriber consent, or enabling selective use or disclosure of attributes.',
          [[1,2,3],[],[]],
          (status) => (status['100-5'] === 0)
        ],
      // 3
        [
          'Consent for additional processing is not condition of service',
          'When CSPs use consent measures, CSPs SHALL NOT make consent for the additional processing a condition of the identity service.',
          [[1,2,3],[],[]],
          (status) => (status['100-5'] === 0)
        ],
      // 4
        [
          'Provide mechanisms for redress or problem arising',
          'The CSP SHALL provide mechanisms for redress of applicant complaints or problems arising from the identity proofing. These mechanisms SHALL be easy for applicants to find and use. The CSP SHALL assess the mechanisms for their efficacy in achieving resolution of complaints or problems.',
          [[2,3],[],[]]
        ],
      // 5
        [
          'Provide appropriate practice statement',
          'The identity proofing and enrollment processes SHALL be performed according to an applicable written policy or *practice statement* that specifies the particular steps taken to verify identities. The *practice statement* SHALL include control information detailing how the CSP handles proofing errors that result in an applicant not being successfully enrolled. For example, the number of retries allowed, proofing alternatives (e.g., in-person if remote fails), or fraud counter-measures when anomalies are detected.',
          [[2,3],[],[]]
        ],
      // 6
        [
          'Maintain a record of associated logs',
          'The CSP SHALL maintain a record, including audit logs, of all steps taken to verify the identity of the applicant and SHALL record the types of identity evidence presented in the proofing process.',
          [[2,3],[],[]]
        ],
      // 7
        [
          'Conduct risk management for enrollment process',
          'The CSP SHALL conduct a risk management process, including assessments of privacy and security risks to determine any steps that it will take to verify the identity of the applicant beyond any mandatory requirements specified herein',
          [[2,3],[],[]]
        ],
      // 8
        [
          'Conduct risk management for records of attributes',
          'The CSP SHALL conduct a risk management process, including assessments of privacy and security risks to determine the PII, including any biometrics, images, scans, or other copies of the identity evidence that the CSP will maintain as a record of identity proofing (Note: Specific federal requirements may apply.)',
          [[2,3],[],[]]
        ],
      // 9
        [
          'Conduct risk management for privacy risks',
          'The CSP SHALL conduct a risk management process, including assessments of privacy and security risks to determine the schedule of retention for these records. Note: CSPs may be subject to specific retention policies in accordance with applicable laws, regulations, or policies, including any National Archives and Records Administration (NARA) records retention schedules that may apply.',
          [[2,3],[],[]]
        ],
      // 10
        [

          'All persinal information collected as part of the enrollment process is protected',
          'All PII collected as part of the enrollment process SHALL be protected to ensure confidentiality, integrity, and attribution of the information source.',
          [[2,3],[],[]]
        ],
      // 11
        [
          'Use authenticated protected channel',
          'The entire proofing transaction, including transactions that involve a third party, SHALL occur over an authenticated protected channel.',
          [[2,3],[],[]]
        ],
      // 12
        [
          'Sensitive information is properly distroyed after identity proofing ceased',
          'In the event a CSP ceases to conduct identity proofing and enrollment processes, the CSP SHALL be responsible for fully disposing of or destroying any sensitive data including PII, or its protection from unauthorized access for the duration of retention.',
          [[2,3],[],[]]
        ],
      // 13
        [
          'Privacy Act checked',
          'The agency SHALL consult with their Senior Agency Official for Privacy (SAOP) to conduct an analysis determining whether the collection of PII to conduct identity proofing triggers Privacy Act requirements.',
          [[1,2,3],[],[]]
        ],
      // 14
        [
          'SORN is published',
          'The agency SHALL publish a System of Records Notice (SORN) to cover such collection, as applicable.',
          [[1,2,3],[],[]]
        ],
      // 15
        [
          'E-Government Act of 2002 checked',
          'The agency SHALL consult with their SAOP to conduct an analysis determining whether the collection of PII to conduct identity proofing triggers E-Government Act of 2002 requirements.',
          [[1,2,3],[],[]]
        ],
      // 16
        [
          'Privacy Impact Assessment published',
          'The agency SHALL publish a Privacy Impact Assessment (PIA) to cover such collection, as applicable.',
          [[1,2,3],[],[]]
        ],
      // 17
        [
          'A CSP that supports only IAL1 SHALL NOT validate and verify attributes.',
          'A CSP that supports only IAL1 SHALL NOT validate and verify attributes.',
          [[1],[],[]]
        ],
      // 18
        [
          'A CSP SHALL preferentially proof according to the requirements',
          'A CSP SHALL preferentially proof according to the requirements',
          [[2,3],[],[]]
        ],
      // 19
        [
          'Security controll is appropriately employed',
          'The CSP SHALL employ appropriately tailored security controls, to include control enhancements, from the moderate or high baseline of security controls defined in SP 800-53 or equivalent federal (e.g., FEDRAMP) or industry standard.',
          [[2,3],[],[]]
        ],
      // 20
        [
          'The minimum assurance-related controls for low-impact systems or equivalent are satisfied.',
          'The CSP SHALL ensure that the minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          [[1],[],[]]
        ],
      // 21
        [
          'The minimum assurance-related controls for moderate-impact systems or equivalent are satisfied.',
          'The CSP SHALL ensure that the minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          [[2],[],[]]
        ],
      // 22
        [
          'The minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          'The CSP SHALL ensure that the minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          [[3],[],[]]
        ],
      // 23
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
          'IAL 2 evidence verifying strength matched',
          'All evidences should be verified by process achieving at least strength of STRONG',
          [[2],[],[]],
          (status) => (true),
          true
        ],
        [
          'IAL 3 evidence verifying strength matched',
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
          [[2,3],[],[]]
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
          'An enrollment code SHALL be comprised of minimally, a random six character alphanumeric or equivalent entropy. For example, a code generated using an approved random bit generator or a serial number for a physical hardware authenticator.Or an enrollment code SHALL be comprised of a machine-readable optical label, such as a QR Code, that contains data of similar or higher entropy as a random six character alphanumeric.',
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

export const AAL_REQ_GROUP = questionGroup(501, 'Requirements for Authentication and Lifecycle Management',
  'To achieve the target AAL, please check if all these requirements are satisfied. Please click the title of each categories to toggle the collapsed requirements. When all requirements in a category are checked, the category panel would be green. Make all the panels green to achieve the AAL',
  [
    question(501,0,
      'General Requirements for authentication process',
      'In this part we\'ll check out some general requirements. When the describtion match the practice status, make the requirement green.',
      [
        [
          'Records retention policies are complied',
          'The CSP shall comply with its respective records retention policies in accordance with applicable laws, regulations, and policies, including any National Archives and Records Administration (NARA) records retention schedules that may apply.',
          [[],[1,2,3],[]]
        ],
        [
          'Risk management process for records are conducted and delivered to the subscriber',
          'If the CSP opts to retain records in the absence of any mandatory requirements, the CSP SHALL conduct a risk management process, including assessments of privacy and security risks, to determine how long records should be retained and SHALL inform the subscriber of that retention policy.',
          [[],[1,2,3],[]]
        ],
        [
          'Appropriately-tailored privacy controls defined in SP 800-53 or equivalent industry standard is employed',
          'The CSP SHALL employ appropriately-tailored privacy controls defined in SP 800-53 or equivalent industry standard.',
          [[],[1,2,3],[]]
        ],
        [
          'Low baseline of security controls defined in SP 800-53 are enployed',
          'The CSP SHALL employ appropriately-tailored security controls from the low baseline of security controls defined in SP 800-53 or equivalent federal (e.g. FEDRAMP) or industry standard.',
          [[],[1],[]]
        ],
        [
          'Moderate baseline of security controls defined in SP 800-53 are enployed',
          'The CSP SHALL employ appropriately-tailored security controls from the moderate baseline of security controls defined in SP 800-53 or equivalent federal (e.g. FEDRAMP) or industry standard.',
          [[],[2],[]]
        ],
        [
          'High baseline of security controls defined in SP 800-53 are enployed',
          'The CSP SHALL employ appropriately-tailored security controls from the high baseline of security controls defined in SP 800-53 or an equivalent federal (e.g., FEDRAMP) or industry standard.',
          [[],[3],[]]
        ],
        [
          'The minimum assurance-related controls for low-impact systems or equivalent are satisfied.',
          'The CSP SHALL ensure that the minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          [[],[1],[]]
        ],
        [
          'The minimum assurance-related controls for moderate-impact systems or equivalent are satisfied.',
          'The CSP SHALL ensure that the minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          [[],[2],[]]
        ],
        [
          'The minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          'The CSP SHALL ensure that the minimum assurance-related controls for high-impact systems or equivalent are satisfied.',
          [[],[3],[]]
        ],
        [
          'Authentication intent checked',
          'All authentication and reauthentication SHALL demonstrate authentication intent from at least one authenticator',
          [[],[3],[]]
        ],
        [
          'Measures for additional processing of personal information',
          'If CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”), related fraud mitigation, or to comply with law or legal process, CSPs SHALL implement measures to maintain predictability and manageability commensurate with the privacy risk arising from the additional processing. Measures MAY include providing clear notice, obtaining subscriber consent, or enabling selective use or disclosure of attributes.',
          [[],[1,2,3],[]],
          (status) => (status['100-5'] === 0)
        ],
        [
          'Consent for additional processing is not condition of service',
          'When CSPs use consent measures, CSPs SHALL NOT make consent for the additional processing a condition of the identity service.',
          [[],[1,2,3],[]],
          (status) => (status['100-5'] === 0)
        ],
        [
          'Privacy Act checked',
          'The agency SHALL consult with their Senior Agency Official for Privacy (SAOP) to conduct an analysis determining whether the collection of PII to conduct identity proofing triggers Privacy Act requirements.',
          [[],[1,2,3],[]]
        ],
        [
          'SORN is published',
          'The agency SHALL publish a System of Records Notice (SORN) to cover such collection, as applicable.',
          [[],[1,2,3],[]]
        ],
        [
          'E-Government Act of 2002 checked',
          'The agency SHALL consult with their SAOP to conduct an analysis determining whether the collection of PII to conduct identity proofing triggers E-Government Act of 2002 requirements.',
          [[],[1,2,3],[]]
        ],
        [
          'Privacy Impact Assessment published',
          'The agency SHALL publish a Privacy Impact Assessment (PIA) to cover such collection, as applicable.',
          [[],[1,2,3],[]]
        ],
      ]
    ),
    question(501,1,
      'General Requirements for authenticator and verifiers',
      'In this part we\'ll check out some general requirements. When the describtion match the practice status, make the requirement green.',
      [
        [
          'Cryptographic authenticators use approved cryptography.',
          'Cryptographic authenticators SHALL use approved cryptography.',
          [[],[1,2,3],[]],
          (status) => {
            var usage = UsageOfAuthenticators(status);
            return (usage.SINGLE_FACTOR_OTP 
              || usage.MULTI_FACTOR_OTP
              || usage.SINGLE_FACTOR_CRYPTO_SOFTWARE
              || usage.MULTI_FACTOR_CRYPTO_SOFTWARE
              || usage.SINGLE_FACTOR_CRYPTO_DEVICE
              || usage.MULTI_FACTOR_CRYPTO_DEVICE
            );
          }
        ],
        [
          'MitM resistance',
          'Communication between the claimant and verifier (using the primary channel in the case of an out-of-band authenticator) SHALL be via an authenticated protected channel to provide confidentiality of the authenticator output and resistance to man-in-the-middle (MitM) attacks.',
          [[],[1,2,3],[]],
        ],
        [
          'Verifiers achieve FIPS 140 Level 1',
          'Verifiers operated by government agencies SHALL be validated to meet the requirements of FIPS 140 Level 1.',
          [[],[1,2,3],[]],
        ],
        [
          'Multi-factor autenticators use hardware validated at FIPS 140 Level 2 or higher overall with at least FIPS 140 Level 3 physical security',
          'Multi-factor authenticators SHALL be hardware cryptographic modules validated at FIPS 140 Level 2 or higher overall with at least FIPS 140 Level 3 physical security.',
          [[],[3],[]],
          (status) => {
            var usage = UsageOfAuthenticators(status)
            return (usage.MULTI_FACTOR_OTP || usage.MULTI_FACTOR_CRYPTO_DEVICE);
          }
        ],
        [
          'Single-factor cryptographic devices are validated at FIPS 140 Level 1 or higher overall with at least FIPS 140 Level 3 physical security.',
          'Single-factor cryptographic devices SHALL be validated at FIPS 140 Level 1 or higher overall with at least FIPS 140 Level 3 physical security.',
          [[],[3],[]],
          (status) => {
            var usage = UsageOfAuthenticators(status)
            return (usage.SINGLE_FACTOR_OTP || usage.SINGLE_FACTOR_CRYPTO_DEVICE);
          }
        ],
        [
          'Biomertic sensor and subsequent processing meet the requirements',
          'The verifier SHALL make a determination that the biometric sensor and subsequent processing meet the requirements.',
          [[],[3],[]],
          (status) => {
            if(Array.isArray(status['101-5']))
              return status['101-5'].includes(1);
            return false;
          }
        ],
        [
          'Instructions on how to appropriately protect the authenticator provided',
          'CSPs SHALL provide subscriber instructions on how to appropriately protect the authenticator against theft or loss.',
          [[],[1,2,3],[]],
          (status) => {
            var usage = UsageOfAuthenticators(status);
            return (usage.LOOK_UP_SECRET
              || usage.OUT_OF_BAND
              || usage.SINGLE_FACTOR_OTP
              || usage.MULTI_FACTOR_OTP
              || usage.SINGLE_FACTOR_CRYPTO_SOFTWARE
              || usage.MULTI_FACTOR_CRYPTO_SOFTWARE
              || usage.SINGLE_FACTOR_CRYPTO_DEVICE
              || usage.MULTI_FACTOR_CRYPTO_DEVICE
            );
          }
        ],
        [
          'Mechanism to revoke or suspend the authenticator is provided',
          'The CSP SHALL provide a mechanism to revoke or suspend the authenticator immediately upon notification from subscriber that loss or theft of the authenticator is suspected.',
          [[],[1,2,3],[]]
        ],
        [
          'When verifiers and CSP are separate entities, communications between them occur through a mutually-authenticated secure channel (e.g. TLS)',
          'In situations where the verifier and CSP are separate entities, communications between the verifier and CSP SHALL occur through a mutually-authenticated secure channel (such as a client-authenticated TLS connection) using approved cryptography.',
          [[],[1,2,3],[]],
        ],
        [
          'Authentication and reauthentication process demonstrate authentication intent from at least one authenticator',
          'All authentication and reauthentication processes at AAL3 SHALL demonstrate authentication intent from at least one authenticator.Authentication intent MAY be established in a number of ways. Authentication processes that require the subject’s intervention (e.g., a claimant entering an authenticator output from an OTP device) establish intent. Cryptographic devices that require user action (e.g., pushing a button or reinsertion) for each authentication or reauthentication operation are also establish intent.',
          [[],[3],[]]
        ],
        [
          'Relevant side-channel attacks are determined by a risk assessment performed by the CSP.',
          'Hardware-based authenticators and verifiers at AAL3 SHOULD resist relevant side-channel (e.g., timing and power-consumption analysis) attacks. Relevant side-channel attacks SHALL be determined by a risk assessment performed by the CSP.',
          [[],[3],[]],
          (status) => {
            var usage = UsageOfAuthenticators(status);
            return (usage.SINGLE_FACTOR_OTP
              || usage.MULTI_FACTOR_OTP
              || usage.SINGLE_FACTOR_CRYPTO_DEVICE
              || usage.MULTI_FACTOR_CRYPTO_DEVICE
            );
          }
        ]
      ]
    ),
    question(501, 2,
      'Session Management',
      'In this part we\'ll check out some requirements about session management. When the describtion match the practice status, make the requirement green.',
      [
        [
          'A session secret is shared between the subscriber’s software and the service being accessed.',
          'A session secret SHALL be shared between the subscriber’s software and the service being accessed.',
          [[],[1,2,3],[]]
        ],
        [
          'Subscriber present possession of session secret directly using a cryptographic mechanism',
          'The session secret SHALL be presented directly by the subscriber’s software or possession of the secret SHALL be proven using a cryptographic mechanism.',
          [[],[1,2,3],[]]
        ],
        [
          'Secret for session binding is generated by the session host in direct response to an authentication event',
          'The secret used for session binding SHALL be generated by the session host in direct response to an authentication event.',
          [[],[1,2,3],[]]
        ],
        [
          'Secrets used for session binding are generated by the session host during an interaction, typically immediately following authentication.',
          'Secrets used for session binding SHALL be generated by the session host during an interaction, typically immediately following authentication.',
          [[],[1,2,3],[]]
        ],
        [
          'Secrets used for session binding are generated by an approved random bit generator and contain at least 64 bits of entropy.',
          'Secrets used for session binding SHALL be generated by an approved random bit generator [SP 800-90Ar1] and contain at least 64 bits of entropy.',
          [[],[1,2,3],[]]
        ],
        [
          'Secrets used for session binding are erased or invalidated by the session subject when the subscriber logs out.',
          'Secrets used for session binding SHALL be erased or invalidated by the session subject when the subscriber logs out.',
          [[],[1,2,3],[]]
        ],
        [
          'Secrets used for session binding are sent to and received from the device using an authenticated protected channel.',
          'Secrets used for session binding SHALL be sent to and received from the device using an authenticated protected channel.',
          [[],[1,2,3],[]]
        ],
        [
          'Secrets used for session binding time out appropriately',
          'Secrets used for session binding SHALL time out and not be accepted after the times specified as appropriate for the AAL.',
          [[],[1,2,3],[]]
        ],
        [
          'Secrets used for session binding are not available to insecure communications.',
          'Secrets used for session binding SHALL NOT be available to insecure communications between the host and subscriber’s endpoint.',
          [[],[1,2,3],[]]
        ],
        [
          'Authenticated sessions do not fall back to an insecure transport, such as from https to http, following authentication.',
          'Authenticated sessions SHALL NOT fall back to an insecure transport, such as from https to http, following authentication.',
          [[],[1,2,3],[]]
        ],
        [
          'URLs or POST content contains a session identifier',
          'URLs or POST content SHALL contain a session identifier that SHALL be verified by the RP to ensure that actions taken outside the session do not affect the protected session.',
          [[],[1,2,3],[]]
        ],
        [
          'Browser cookies are tagged to be accessible only on secure sessions.',
          'Browser cookies SHALL be tagged to be accessible only on secure (HTTPS) sessions.',
          [[],[1,2,3],[]]
        ],
        [
          'Browser cookies are accessible to the minimum practical set of hostnames and paths.',
          'Browser cookies SHALL be accessible to the minimum practical set of hostnames and paths.',
          [[],[1,2,3],[]]
        ],
        [
          'The presence of an OAuth access token is interpreted by the RP as presence of the subscriber, in the absence of other signals.',
          'The presence of an OAuth access token SHALL NOT be interpreted by the RP as presence of the subscriber, in the absence of other signals.',
          [[],[1,2,3],[]]
        ],
        [
          'Reauthentication is executed properly',
          'Reauthentication of the subscriber SHOULD be repeated at least once per 30 days during an extended usage session, regardless of user activity. The session SHOULD be terminated (i.e., logged out) when this time limit is reached.',
          [[],[1],[]]
        ],
        [
          'Reauthentication is executed properly',
          'Authentication of the subscriber SHALL be repeated at least once per 12 hours during an extended usage session, regardless of user activity.',
          [[],[2,3],[]]
        ],
        [
          'Reauthentication is executed properly after period of inactivity',
          'Reauthentication of the subscriber SHALL be repeated following any period of inactivity lasting 30 minutes or longer.',
          [[],[2],[]]
        ],
        [
          'Reauthentication is executed properly after period of inactivity',
          'Reauthentication of the subscriber SHALL be repeated following any period of inactivity lasting 15 minutes or longer.',
          [[],[3],[]]
        ],
        [
          'Reauthentication SHALL use both authentication factors.',
          'Reauthentication SHALL use both authentication factors.',
          [[],[3],[]]
        ],
        [
          'Session is terminated after time-out',
          'The session SHALL be terminated (i.e., logged out) when either of these time limits is reached.',
          [[],[2,3],[]]
        ],
        [
          'Session secrets are non-persistent',
          'Session secrets SHALL be non-persistent. That is, they SHALL NOT be retained across a restart of the associated application or a reboot of the host device.',
          [[],[1,2,3],[]]
        ],
        [
          'Session is not extended past the guidelines depending on AAL,based on presentation of the session secret alone.',
          'A session SHALL NOT be extended past the guidelines depending on AAL,based on presentation of the session secret alone.',
          [[],[1,2,3],[]]
        ],
        [
          'Prior to session expiration, the reauthentication time limit can be extended by prompting the subscriber for the authentication factor(s)',
          'Prior to session expiration, the reauthentication time limit SHALL be extended by prompting the subscriber for the authentication factor(s) according to different AALs.',
          [[],[2,3],[]]
        ],
        [
          'After time out, user is required to establish a new session by authenticating again.',
          'When a session has been terminated, due to a time-out or other action, the user SHALL be required to establish a new session by authenticating again.',
          [[],[1,2,3],[]]
        ],
        [
          'The RP requires reauthentication through a federation protocol and, if possible, specifies the maximum acceptable authentication age',
          'An RP requiring reauthentication through a federation protocol SHALL — if possible within the protocol — specify the maximum acceptable authentication age to the CSP, and the CSP SHALL reauthenticate the subscriber if they have not been authenticated within that time period.',
          [[],[1,2,3],[]],
          (status) => (!isNaN(selectXALs(status)[2]))
        ],
        [
          'Reauthentication event time is decided by the RP communicating with the CSP',
          'The CSP SHALL communicate the authentication event time to the RP to allow the RP to decide if the assertion is sufficient for reauthentication and to determine the time for the next reauthentication event.',
          [[],[1,2,3],[]],
          (status) => (!isNaN(selectXALs(status)[2]))
        ]
      ]),
    question(501, 3,
      'Memorized Secret',
      'In this part we check the requirements about how to use and implement memorized secret authentication. Make the requirement green if it\'s achieved',
      [
        [
          'Subscriber is required to choose memorized secrets at least 8 characters, or use the generated one',
          'Verifiers SHALL require subscriber-chosen memorized secrets to be at least 8 characters in length. Verifiers SHOULD permit subscriber-chosen memorized secrets at least 64 characters in length. No other complexity requirements for memorized secrets SHOULD be imposed.',
          [[],[1,2,3],[]]
        ],
        [
          'Memorized secrets chosen randomly by the CSP or verifier is at least 6 characters in length',
          'Memorized secrets chosen randomly by the CSP or verifier SHALL be at least 6 characters in length and MAY be entirely numeric.',
          [[],[1,2,3],[]]
        ],
        [
          'Memorized secrets that are randomly chosen by the CSP is generated by approved random bit generator',
          'Memorized secrets that are randomly chosen by the CSP (e.g., at enrollment) or by the verifier (e.g., when a user requests a new PIN) SHALL be at least 6 characters in length and SHALL be generated using an approved random bit generator.',
          [[],[1,2,3],[]]
        ],
        [
          'Subscriber is disallowed to choose a weak password',
          'If the CSP or verifier disallows a chosen memorized secret based on its appearance on a blacklist of compromised values, the subscriber SHALL be required to choose a different memorized secret.',
          [[],[1,2,3],[]]
        ],
        [
          'Secrets are not truncated',
          'Truncation of the secret SHALL NOT be performed. For purposes of the above length requirements, each Unicode code point SHALL be counted as a single character.',
          [[],[1,2,3],[]]
        ],
        [
          'No hint accessible to an unauthenticated claimant is permitted for a subsciber to store',
          'Memorized secret verifiers SHALL NOT permit the subscriber to store a “hint” that is accessible to an unauthenticated claimant. Verifiers SHALL NOT prompt subscribers to use specific types of information (e.g., “What was the name of your first pet?”) when choosing memorized secrets.',
          [[],[1,2,3],[]]
        ],
        [
          'Strength of secret is checked whenever it is established or changed',
          'When processing requests to establish and change memorized secrets, verifiers SHALL compare the prospective secrets against a list that contains values known to be commonly-used, expected, or compromised. For example, the list MAY include, but is not limited to: passwords obtained from previous breach corpuses, dictionary words, repetitive or sequential characters (e.g. ‘aaaaaa’, ‘1234abcd’), context-specific words, such as the name of the service, the username, and derivatives thereof.',
          [[],[1,2,3],[]]
        ],
        [
          'Subsciber is advised to use another secret and is told the reason why when a chosen password is rejected',
          'If the chosen secret is found unsuitable, the CSP or verifier SHALL advise the subscriber that they need to select a different secret, SHALL provide the reason for rejection, and SHALL require the subscriber to choose a different value.',
          [[],[1,2,3],[]]
        ],
        [
          'Rate Limiting (Throttling) is implemented properly',
          'Verifiers SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber’s account. Additional techniques MAY be used to reduce the likelihood that an attacker will lock the legitimate claimant out as a result of rate limiting. These include: Requiring the claimant to complete a CAPTCHA before attempting authentication. Requiring the claimant to wait following a failed attempt for a period of time that increases as the account approaches its maximum allowance for consecutive failed attempts (e.g., 30 seconds up to an hour). Accepting only authentication requests that come from a white list of IP addresses from which the subscriber has been successfully authenticated before. Leveraging other risk-based or adaptive authentication techniques to identify user behavior that falls within, or out of, typical norms. When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for that user from the same IP address.',
          [[],[1,2,3],[]]
        ],
        [
          'The verifier limits consecutive failed authentication attempts on a single account to no more than 100.',
          'Unless otherwise specified in the description of a given authenticator, the verifier SHALL limit consecutive failed authentication attempts on a single account to no more than 100.',
          [[],[1,2,3],[]]
        ],
        [
          'Subscriber is forced to change the secret if there is evidence of compromise of it',
          'Verifiers SHALL force a change if there is evidence of compromise of the authenticator.',
          [[],[1,2,3],[]]
        ],
        [
          'Authenticated protected channel and approved encryption are used to transmit the secrets',
          'The verifier SHALL use approved encryption and an authenticated protected channel when requesting memorized secrets in order to provide resistance to eavesdropping and MitM attacks.',
          [[],[1,2,3],[]]
        ],
        [
          'Storage of secrets is offline addtack resistant',
          'Verifiers SHALL store memorized secrets in a form that is resistant to offline attacks. Memorized secrets SHALL be salted and hashed using a suitable one-way key derivation function. Examples of suitable key derivation functions include Password-based Key Derivation Function 2 (PBKDF2) and Balloon.',
          [[],[1,2,3],[]]
        ],
        [
          'Approved key derivation functions are used for secret storage',
          'The key derivation function SHALL use an approved one-way function such as Keyed Hash Message Authentication Code (HMAC) [FIPS 198-1], any approved hash function in SP 800-107, Secure Hash Algorithm 3 (SHA-3) [FIPS 202], CMAC [SP 800-38B] or Keccak Message Authentication Code (KMAC), Customizable SHAKE (cSHAKE), or ParallelHash [SP 800-185]. The chosen output length of the key derivation function SHOULD be the same as the length of the underlying one-way function output.',
          [[],[1,2,3],[]]
        ],
        [
          'The salt is at least 32 bits in length and is chosen arbitrarily',
          'The salt SHALL be at least 32 bits in length and be chosen arbitrarily so as to minimize salt value collisions among stored hashes.',
          [[],[1,2,3],[]]
        ],
        [
          'Both the salt value and the resulting hash are stored for each subscriber using a memorized secret authenticator.',
          'Both the salt value and the resulting hash SHALL be stored for each subscriber using a memorized secret authenticator.',
          [[],[1,2,3],[]]
        ],
        [
          'A salt known only to the verifier, if exists, provides enough entropy (at least 112 bits)',
          'Verifiers SHOULD perform an additional iteration of a key derivation function using a salt value that is secret and known only to the verifier. This salt value, if used, SHALL be generated by an approved random bit generator [SP 800-90Ar1] and provide at least the minimum security strength specified in the latest revision of SP 800-131A (112 bits as of the date of this publication).',
          [[],[1,2,3],[]]
        ],
        [
          'The secret salt value is stored separately from the hashed memorized secrets',
          'The secret salt value SHALL be stored separately from the hashed memorized secrets (e.g., in a specialized device like a hardware security module).',
          [[],[1,2,3],[]]
        ]
      ],QUEST_TYPE_MULTI,
      (status) => (UsageOfAuthenticators(status).MEMORIZED_SECRET)
    ),
    question(501, 4,
      'Look-Up Secret',
      'In this part we check the requirements about how to use and implement look-up secret authentication. Make the requirement green if it\'s achieved',
      [
        [
          'Look-up secret is created using approved random bit generator and delivered securely to the subscriber',
          'CSPs creating look-up secret authenticators SHALL use an approved random bit generator [SP 800-90Ar1] to generate the list of secrets and SHALL deliver the authenticator securely to the subscriber.',
          [[],[1,2,3],[]]
        ],
        [
          'Look-up secrets have at least 20 bits of entropy.',
          'Look-up secrets SHALL have at least 20 bits of entropy.',
          [[],[1,2,3],[]]
        ],
        [
          'If distributed online, look-up secrets are distributed over a secure channel',
          'If distributed online, look-up secrets SHALL be distributed over a secure channel in accordance with the post-enrollment binding requirements.',
          [[],[1,2,3],[]]
        ],
        [
          'Prompt of the secret is delivered properly',
          'Verifiers of look-up secrets SHALL prompt the claimant for the next secret from their authenticator or for a specific (e.g., numbered) secret.',
          [[],[1,2,3],[]]
        ],
        [
          'A given secret from an authenticator can be used successfully only once',
          'A given secret from an authenticator SHALL be used successfully only once.',
          [[],[1,2,3],[]]
        ],
        [
          'For the look-up secret derived from a grid card, each cell of the grid is used only once',
          'If the look-up secret is derived from a grid card, each cell of the grid SHALL be used only once',
          [[],[1,2,3],[]]
        ],
        [
          'Look-up secrets are stored in a form that is resistant to offline attacks.',
          'Verifiers SHALL store look-up secrets in a form that is resistant to offline attacks.',
          [[],[1,2,3],[]]
        ],
        [
          'Look-up secrets having at least 112 bits of entropy are hashed with an approved one-way function',
          'Look-up secrets having at least 112 bits of entropy SHALL be hashed with an approved one-way function',
          [[],[1,2,3],[]]
        ],
        [
          'Look-up secrets with fewer than 112 bits of entropy are salted and hashed using a suitable one-way key derivation function',
          'Look-up secrets with fewer than 112 bits of entropy SHALL be salted and hashed using a suitable one-way key derivation function',
          [[],[1,2,3],[]]
        ],
        [
          'The salt value, if any, is at least 32 in bits in length and arbitrarily chosen',
          'The salt value SHALL be at least 32 in bits in length and arbitrarily chosen so as to minimize salt value collisions among stored hashes.',
          [[],[1,2,3],[]]
        ],
        [
          'Both the salt value and the resulting hash are stored for each look-up secret',
          'Both the salt value and the resulting hash SHALL be stored for each look-up secret.',
          [[],[1,2,3],[]]
        ],
        [
          'Rate limiting is employed properly when the secrets have less than 64 entropy',
          'For look-up secrets that have less than 64 bits of entropy, the verifier SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber’s account',
          [[],[1,2,3],[]]
        ],
        [
          'The verifier use approved encryption and authenticated protected channel when requesting',
          'The verifier SHALL use approved encryption and an authenticated protected channel when requesting look-up secrets in order to provide resistance to eavesdropping and MitM attacks.',
          [[],[1,2,3],[]]
        ]
      ],QUEST_TYPE_MULTI,
      (status) => (UsageOfAuthenticators(status).LOOK_UP_SECRET)
    ),
    question(501, 5,
      'Out-of-Band Device',
      'In this part we check the requirements about how to use and implement out-of-band device authentication. Make the requirement green if it\'s achieved',
      [
        [
          'A separate channel is established properly for authentication',
          'The out-of-band authenticator SHALL establish a separate channel with the verifier in order to retrieve the out-of-band secret or authentication request. This channel is considered to be out-of-band with respect to the primary communication channel (even if it terminates on the same device) provided the device does not leak information from one channel to the other without the authorization of the claimant.',
          [[],[1,2,3],[]]
        ],
        [
          'Communication over the secondary channel, but not sent via the public switched telephone network (PSTN), is encrypted',
          'The out-of-band device SHOULD be uniquely addressable and communication over the secondary channel SHALL be encrypted unless sent via the public switched telephone network (PSTN).',
          [[],[1,2,3],[]]
        ],
        [
          'Methods that do not prove possession of a specific device (such as VoIP or E-mail) is not used for authentication',
          'Methods that do not prove possession of a specific device, such as voice-over-IP (VOIP) or email, SHALL NOT be used for out-of-band authentication.',
          [[],[1,2,3],[]]
        ],
        [
          'An out-of-band authenticator uniquely authenticates itself properly when communicating with the verifier',
          'The out-of-band authenticator SHALL uniquely authenticate itself in one of the following ways when communicating with the verifier: Establish an authenticated protected channel to the verifier using approved cryptography. The key used SHALL be stored in suitably secure storage available to the authenticator application (e.g., keychain storage, TPM, TEE, secure element). Authenticate to a public mobile telephone network using a SIM card or equivalent that uniquely identifies the device. This method SHALL only be used if a secret is being sent from the verifier to the out-of-band device via the PSTN (SMS or voice).',
          [[],[1,2,3],[]]
        ],
        [
          'Transfer of secret to primary channel is implemented properly',
          'If the out-of-band authenticator sends an approval message over the secondary communication channel — rather than by the claimant transferring a received secret to the primary communication channel — it SHALL do one of the following: The authenticator SHALL accept transfer of the secret from the primary channel which it SHALL send to the verifier over the secondary channel to associate the approval with the authentication transaction. The claimant MAY perform the transfer manually or use a technology such as a barcode or QR code to effect the transfer. The authenticator SHALL present a secret received via the secondary channel from the verifier and prompt the claimant to verify the consistency of that secret with the primary channel, prior to accepting a yes/no response from the claimant. It SHALL then send that response to the verifier.',
          [[],[1,2,3],[]],
          (status) => {
            if(Array.isArray(status['101-4']))
              return status['101-4'].includes(0);
            return false;
          }
        ],
        [
          'When secure application is used, The verifier does not store the identifying key itself, but uses a verification method to uniquely identify the authenticator.',
          'If out-of-band verification is to be made using a secure application, such as on a smart phone, the verifier MAY send a push notification to that device. The verifier then waits for the establishment of an authenticated protected channel and verifies the authenticator’s identifying key. The verifier SHALL NOT store the identifying key itself, but SHALL use a verification method (e.g., an approved hash function or proof of possession of the identifying key) to uniquely identify the authenticator.',
          [[],[1,2,3],[]]
        ],
        [
          'Authentication time out properly',
          'The authentication SHALL be considered invalid if not completed within 10 minutes. In order to provide replay resistance, verifiers SHALL accept a given authentication secret only once during the validity period.',
          [[],[1,2,3],[]]
        ],
        [
          'Out-of-Band authentication secret is generated by approved random bit generator',
          'The verifier SHALL generaterandom authentication secrets using an approved random bit generator',
          [[],[1,2,3],[]]
        ],
        [
          'Out-of-Band authentication secret provides at least 20 bits of entropy',
          'The verifier SHALL generate random authentication secrets with at least 20 bits of entropy',
          [[],[1,2,3],[]]
        ],
        [
          'Rate limiting is deployed properly when the secret has less than 64 bits of entropy',
          'If the authentication secret has less than 64 bits of entropy, the verifier SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber’s account',
          [[],[1,2,3],[]]
        ],
        [
          'When transfer secret over PSTN, the phone number is checked owned by the subscriber',
          'If out-of-band verification is to be made using the PSTN, the verifier SHALL verify that the pre-registered telephone number being used is associated with a specific physical device.',
          [[],[1,2,3],[]]
        ],
        [
          'Changing the pre-registered telephone number is considered to be the binding of a new authenticator and follows the binding new authenticator rules.',
          'Changing the pre-registered telephone number is considered to be the binding of a new authenticator and SHALL follow the binding new authenticator rules.',
          [[],[1,2,3],[]]
        ]
      ],QUEST_TYPE_MULTI,
      (status) => (UsageOfAuthenticators(status).OUT_OF_BAND)
    ),
    question(501, 6,
      'OTP (One Time Password) Device',
      'In this part we check the requirements about how to use and implement OTP device authentication. Consider both single-factor and multi-factor devices (whatever you use) and make the requirement green if it\'s achieved',
      [
        [
          'The secret key and its algorithm provide enough security strength (112 bits)',
          'The secret key and its algorithm SHALL provide at least the minimum security strength specified in the latest revision of SP 800-131A (112 bits as of the date of this publication).',
          [[],[1,2,3],[]]
        ],
        [
          'The nounce is of sufficient length',
          'The nonce SHALL be of sufficient length to ensure that it is unique for each operation of the device over its lifetime.',
          [[],[1,2,3],[]]
        ],
        [
          'Users are not couraged or helped to clone the secret key to other devices',
          'Authenticators SHOULD discourage and SHALL NOT facilitate the cloning of the secret key onto multiple devices.',
          [[],[1,2,3],[]]
        ],
        [
          'The OTP value associated with a given nonce is accepted only once.',
          'The OTP value associated with a given nonce SHALL be accepted only once. In order to provide replay resistance, verifiers SHALL accept a given time-based OTP only once during the validity period.',
          [[],[1,2,3],[]]
        ],
        [
          'The verifier stores the symmetric key properly',
          'The symmetric keys used by authenticators are also present in the verifier, and SHALL be strongly protected against compromise.',
          [[],[1,2,3],[]]
        ],
        [
          'Approved cryptography is used to generate, exchange or obtain the secret',
          'The verifier or associated CSP SHALL use approved cryptography to either generate and exchange or to obtain the secrets required to duplicate the authenticator output.',
          [[],[1,2,3],[]]
        ],
        [
          'The authentication is MitM resistant using approved encryption and authenticated protected channel',
          'The verifier SHALL use approved encryption and an authenticated protected channel when collecting the OTP in order to provide resistance to eavesdropping and MitM attacks.',
          [[],[1,2,3],[]]
        ],
        [
          'Time-based OTPs have a defined lifetime',
          'Time-based OTPs [RFC 6238] SHALL have a defined lifetime that is determined by the expected clock drift — in either direction — of the authenticator over its lifetime, plus allowance for network delay and user entry of the OTP.',
          [[],[1,2,3],[]]
        ],
        [
          'When using a time-based OTP, the output changes at least once every 2 minutes',
          'If the nonce used to generate the authenticator output is based on a real-time clock, the nonce SHALL be changed at least once every 2 minutes.',
          [[],[1,2,3],[]]
        ],
        [
          'Rate limiting is deployed properly when the authenticator output has less than 64 bits of entropy',
          'If the authenticator output has less than 64 bits of entropy, the verifier SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber’s account.',
          [[],[1,2,3],[]]
        ],
        [
          'When using multi-factor OTP device, all the unencrypted key and biometric sample and related data are zeroized properly after an OTP is generated',
          'The unencrypted key and activation secret or biometric sample — and any biometric data derived from the biometric sample such as a probe produced through signal processing — SHALL be zeroized immediately after an OTP has been generated.',
          [[],[1,2,3],[]],
          (status) => {
            if(UsageOfAuthenticators(status).MULTI_FACTOR_OTP)
              if(Array.isArray(status['101-5']))
                return status['101-5'].includes(1);
            return false;
          }
        ]
      ],QUEST_TYPE_MULTI,
      (status) => {
        var usage = UsageOfAuthenticators(status);
        return (usage.SINGLE_FACTOR_OTP || usage.MULTI_FACTOR_OTP);
      }
    ),
    question(501, 7,
      'Cryptographic Software and Device',
      'In this part we check the requirements about how to use and implement cryptographic authentication. Consider both single-factor and multi-factor softwares (whatever you use) and make the requirement green if it\'s achieved',
      [
        [
          'The key is required to be stored properly',
          'The key SHALL be stored in suitably secure storage available to the authenticator application (e.g., keychain storage, TPM, or TEE if available).',
          [[],[1,2,3],[]],
          (status) => {
            var usage = UsageOfAuthenticators(status);
            return (usage.SINGLE_FACTOR_CRYPTO_SOFTWARE || usage.MULTI_FACTOR_CRYPTO_SOFTWARE);
          }
        ],
        [
          'The key is protected against unauthorized disclosure',
          'The key SHALL be strongly protected against unauthorized disclosure by the use of access controls that limit access to the key to only those software components on the device requiring access.',
          [[],[1,2,3],[]],
          (status) => {
            var usage = UsageOfAuthenticators(status);
            return (usage.SINGLE_FACTOR_CRYPTO_SOFTWARE || usage.MULTI_FACTOR_CRYPTO_SOFTWARE);
          }
        ],
        [
          'The secret key and its algorithm provide sufficient security strength',
          'The secret key and its algorithm SHALL provide at least the minimum security length specified in the latest revision of SP 800-131A (112 bits as of the date of this publication).',
          [[],[1,2,3],[]],
        ],
        [
          'The challenge is at least 64 bits in length',
          'The challenge nonce SHALL be at least 64 bits in length, and SHALL either be unique over the authenticator’s lifetime or statistically unique (i.e., generated using an approved random bit generator [SP 800-90Ar1]).',
          [[],[1,2,3],[]],
        ],
      ],QUEST_TYPE_MULTI,
      (status) => {
        var usage = UsageOfAuthenticators(status);
        return (usage.SINGLE_FACTOR_CRYPTO_SOFTWARE || usage.MULTI_FACTOR_CRYPTO_SOFTWARE
          || usage.SINGLE_FACTOR_CRYPTO_DEVICE || usage.MULTI_FACTOR_CRYPTO_DEVICE);
      }
    ),
    question(501, 8,
      'Multi Factors - General',
      'In this part we\'ll check some general requirements for multi-factor authenticators. Consider every multi-factor softwares or devices (whatever you use) and make the requirement green if it\'s achieved',
      [
        [
          'Memorized secret used by the authenticator for activation meet the requirements.',
          'Any memorized secret used by the authenticator for activation SHALL be a randomly-chosen numeric secret at least 6 decimal digits in length or other memorized secret meeting the requirements.',
          [[],[1,2,3],[]],
          (status) => {
            if(Array.isArray(status['101-5']))
              return status['101-5'].includes(0);
            return false;
          }
        ],
        [
          'Rate limiting is deployed properly when using memorized secret as an activate factor',
          'Any memorized secret used by the authenticator for activation SHALL be rate limited.',
          [[],[1,2,3],[]],
          (status) => {
            if(Array.isArray(status['101-5']))
              return status['101-5'].includes(0);
            return false;
          }
        ],
        [
          'The verifier or CSP checks that the authenticator is multi-factor before authentication',
          'The verifier or CSP SHALL also establish, via the authenticator source, that the authenticator is a multi-factor device. In the absence of a trusted statement that it is a multi-factor device, the verifier SHALL treat the authenticator as single-factor.',
          [[],[1,2,3],[]]
        ]
      ],QUEST_TYPE_MULTI,
      (status) => {
        var usage = UsageOfAuthenticators(status);
        return (usage.MULTI_FACTOR_OTP || usage.MULTI_FACTOR_CRYPTO_DEVICE
          || usage.MULTI_FACTOR_CRYPTO_SOFTWARE);
      }
    ),
    question(501, 9,
      'Multi Factors - Biometrics',
      'In this part we\'ll check out some requirements about biometric using. Please consider all multi-factor authenticators you use. When the describtion match the practice status, make the requirement green.',
      [
        [
          'Biometric is not used as a single factor authenticator',
          'Biometrics SHALL be used only as part of multi-factor authentication with a physical authenticator (something you have).',
          [[],[1,2,3],[]]
        ],
        [
          'Transaction between endpoint, sensor and verifier is completed through authenticated protected channel',
          'An authenticated protected channel between sensor (or an endpoint containing a sensor that resists sensor replacement) and verifier SHALL be established and the sensor or endpoint SHALL be established and the sensor or endpoint SHALL be authenticated prior to capturing the biometric sample from the claimant.',
          [[],[1,2,3],[]]
        ],
        [
          'The biometric system operates with an FMR of 1 in 1000 or better',
          'The biometric system SHALL operate with an FMR [ISO/IEC 2382-37] of 1 in 1000 or better. This FMR SHALL be achieved under conditions of a conformant attack (i.e., zero-effort impostor attempt) as defined in [ISO/IEC 30107-1]',
          [[],[1,2,3],[]]
        ],
        [
          'Throttling (Rate Limiting) is properly employed',
          'The biometric system SHALL allow no more than 5 consecutive failed authentication attempts or 10 consecutive failed attempts if PAD meeting the above requirements is implemented. Once that limit has been reached, the biometric authenticator SHALL either: Impose a delay of at least 30 seconds before the next attempt, increasing exponentially with each successive attempt (e.g., 1 minute before the following failed attempt, 2 minutes before the second following attempt), or Disable the biometric user authentication and offer another factor (e.g., a different biometric modality or a PIN/Passcode if it is not already a required factor) if such an alternative method is already available.',
          [[],[1,2,3],[]]
        ],
        [
          'The verifier do make a determination of sensor and endpoint performance, integrity, and authenticity.',
          'The verifier SHALL make a determination of sensor and endpoint performance, integrity, and authenticity. Acceptable methods for making this determination include, but are not limited to: Authentication of the sensor or endpoint. Certification by an approved accreditation authority. Runtime interrogation of signed metadata (e.g., attestation).',
          [[],[1,2,3],[]]
        ],
        [
          'When comparison is performed centrally, the devices are identified using approved cryptography using a seperate key other than the main one',
          'If comparison is performed centrally, use of the biometric as an authentication factor SHALL be limited to one or more specific devices that are identified using approved cryptography. Since the biometric has not yet unlocked the main authentication key, a separate key SHALL be used for identifying the device.',
          [[],[1,2,3],[]]
        ],
        [
          'When comparison is performed centrally, biometric revocation is implemented properly',
          'If comparison is performed centrally, biometric revocation, referred to as biometric template protection in ISO/IEC 24745, SHALL be implemented.',
          [[],[1,2,3],[]]
        ],
        [
          'When comparison is performed centrally, all transmission of biometric is over authenticated protected channel',
          'If comparison is performed centrally, all transmission of biometrics SHALL be over the authenticated protected channel.',
          [[],[1,2,3],[]]
        ],
        [
          'Biometric sample is, only after user consent, used for other research purposes other than to train comparison algorithms',
          'Biometric samples collected in the authentication process MAY be used to train comparison algorithms or — with user consent — for other research purposes.',
          [[],[1,2,3],[]]
        ],
        [
          'All attestation and sign, if any, uses a digital signature that provides enough entropy (112 bits)',
          'If attestation is performed and signed, it SHALL be signed using a digital signature that provides at least the minimum security strength specified in the latest revision of SP 800-131A (112 bits as of the date of this publication). An attestation is information conveyed to the verifier regarding a directly-connected authenticator or the endpoint involved in an authentication operation. Information conveyed by attestation MAY include, but is not limited to: The provenance (e.g., manufacturer or supplier certification), health, and integrity of the authenticator and endpoint. Security features of the authenticator. Security and performance characteristics of biometric sensor(s). Sensor modality.',
          [[],[1,2,3],[]]
        ]
      ],QUEST_TYPE_MULTI,
      (status) => {
        if(Array.isArray(status['101-5']))
          return status['101-5'].includes(1);
        return false;
      }
    ),  
    question(501, 10,
      'Verifier Impersonation Resistance',
      'In this part we\'ll check out if the authentication process is verifier impersonation resistant. When the describtion match the practice status of the cryptographic softwares or devices authenticators, make the requirement green.',
      [
        [
          'A verifier impersonation-resistant authentication protocol is properly implemented',
          'A verifier impersonation-resistant authentication protocol SHALL establish an authenticated protected channel with the verifier. It SHALL then strongly and irreversibly bind a channel identifier that was negotiated in establishing the authenticated protected channel to the authenticator output. The verifier SHALL validate the signature or other information used to prove verifier impersonation resistance.',
          [[],[3],[]]
        ],
        [
          'Using approved cryptographic',
          'Approved cryptographic algorithms SHALL be used to establish verifier impersonation resistance where it is required.',
          [[],[3],[]]
        ],
        [
          'Using keys that provide enough entropy (112 bits)',
          'Keys used for this purpose SHALL provide at least the minimum security strength specified in the latest revision of SP 800-131A (112 bits as of the date of this publication).',
          [[],[3],[]]
        ],
      ],QUEST_TYPE_MULTI,
      (status) => (selectXALs(status)[1] === 3)
    ),
    question(501, 11,
      'Verifier Compromise Resistance',
      'In this part we\'ll check out if the authentication process is verifier compromise resistant. When the describtion match the practice status, make the requirement green.',
      [
        [
          'Verifier compromise resistance is achieved',
          'Verifier compromise resistance can be achieved in different ways, for example: Use a cryptographic authenticator that requires the verifier store a public key corresponding to a private key held by the authenticator. Store the expected authenticator output in hashed form. This method can be used with some look-up secret authenticators, for example. To be considered verifier compromise resistant, public keys stored by the verifier SHALL be associated with the use of approved cryptographic algorithms and SHALL provide at least the minimum security strength specified in the latest revision of SP 800-131A (112 bits as of the date of this publication).',
          [[],[3],[]]
        ],
        [
          'Verifier compromise resistant secrets provide enough entropy (112 bits)',
          'Other verifier compromise resistant secrets SHALL use approved hash algorithms and the underlying secrets SHALL have at least the minimum security strength specified in the latest revision of SP 800-131A (112 bits as of the date of this publication).',
          [[],[3],[]]
        ]
      ],QUEST_TYPE_MULTI,
      (status) => (selectXALs(status)[1] === 3)
    ),
    question(501, 12,
      'Authenticator Binding - at Enrollment',
      'In this part we take a look at the process how a subscriber bind an authenticator to their account at enrollment. Please check the requirements and make them green if they match the practive status',
      [
        [
          'Authenticators are from the CSP, or provided by authenticator after approval of CSP',
          'Authenticators SHALL be bound to subscriber accounts by either: Issuance by the CSP as part of enrollment; or Associating a subscriber-provided authenticator that is acceptable to the CSP.',
          [[],[1,2,3],[]]
        ],
        [
          'Records of authenticators are maintained properly throughout a digital identity lifecycle',
          'Throughout the digital identity lifecycle, CSPs SHALL maintain a record of all authenticators that are or have been associated with each identity.',
          [[],[1,2,3],[]]
        ],
        [
          'Login information is maintained properly to implement throttling',
          'The CSP or verifier SHALL maintain the information required for throttling authentication attempts when required.',
          [[],[1,2,3],[]]
        ],
        [
          'When using user provided authenticators, the authenticators\' type are verified and the authenticators reach all the requirements',
          'The CSP SHALL also verify the type of user-provided authenticator (e.g., single-factor cryptographic device vs. multi-factor cryptographic device) so verifiers can determine compliance with requirements at each AAL.',
          [[],[1,2,3],[]]
        ],
        [
          'Multi-factor authentication or proofing is required before binding a multi-factor authenticator',
          'Binding of multi-factor authenticators SHALL require multi-factor authentication or equivalent (e.g., association with the session in which identity proofing has been just completed) be used in order to bind the authenticator.',
          [[],[1,2,3],[]]
        ],
        [
          'At least one authenticator other than memorized secret is bind to a subscriber\'s  online account',
          'The CSP SHALL bind at least one, and SHOULD bind at least two, physical (something you have) authenticators to the subscriber’s online identity, in addition to a memorized secret or one or more biometrics. Binding of multiple authenticators is preferred in order to recover from the loss or theft of the subscriber’s primary authenticator.',
          [[],[1,2,3],[]]
        ],
        [
          'When AAL1 authenticator is bind to a IAL2 or above account, no personal information is exposed in authentication process',
          'At IAL2 and above, authenticators at the same AAL as the desired IAL SHALL be bound to the account. While a CSP MAY bind an AAL1 authenticator to an IAL2 identity, if the subscriber is authenticated at AAL1, the CSP SHALL NOT expose personal information, even if self-asserted, to the subscriber.',
          [[2,3],[1,2,3],[]]
        ],
        [
          'When binding is not finished remotely in a transaction, identity is properly prooved in each new binding transaction',
          'If enrollment and binding cannot be completed in a single physical encounter or electronic transaction (i.e., within a single protected session), for remote transactions: The applicant SHALL identify themselves in each new binding transaction by presenting a temporary secret which was either established during a prior transaction, or sent to the applicant’s phone number, email address, or postal address of record. Long-term authenticator secrets SHALL only be issued to the applicant within a protected session.',
          [[],[1,2,3],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-0'].includes(1);
            return false
          }
        ],
        [
          'When binding is not finished in a single physical encounter , identity is properly prooved in each new binding transaction',
          'If enrollment and binding cannot be completed in a single physical encounter or electronic transaction (i.e., within a single protected session), for in-person transactions: The applicant SHALL identify themselves in person by either using a temporary secret which was either established during a prior transaction, or sent to the applicant’s phone number, email address, or postal address of record, or through use of a biometric that was recorded during a prior encounter. Temporary secrets SHALL NOT be reused. If the CSP issues long-term authenticator secrets during a physical transaction, then they SHALL be loaded locally onto a physical device that is issued in person to the applicant or delivered in a manner that confirms the address of record.',
          [[],[1,2,3],[]],
          (status) => {
            if(Array.isArray(status['100-0']))
              return status['100-0'].includes(0);
            return false
          }
        ]
      ]
    ),
    question(501, 13,
      'Authenticator Binding - Post Enrollment',
      'In this part we take a look at the process how a subscriber bind a new authenticator to their account, or replace a lost one, after enrollment. Please check the requirements and make them green if they match the practive status',
      [
        [
          'Subscriber is authenticated before binding',
          'Before adding the new authenticator, the CSP SHALL first require the subscriber to authenticate at the AAL (or a higher AAL) at which the new authenticator will be used.',
          [[],[1,2,3],[]]
        ],
        [
          'When user provided authenticator is acceptable, if CSPs supports, the authenticators are binding properly according to relative AAL',
          'CSPs SHOULD, where practical, accommodate the use of subscriber-provided authenticators in order to relieve the burden to the subscriber of managing a large number of authenticators. Binding of these authenticators SHALL be done by the same way as binding at an existing AAL.',
          [[],[1,2,3],[]]
        ],
        [
          'When replacing a lost authenticator, if all authenticators\' factors are lost, a subsciber is required to repeat the identity proofing process',
          'If a subscriber loses all authenticators of a factor necessary to complete multi-factor authentication and has been identity proofed at IAL2 or IAL3, that subscriber SHALL repeat the identity proofing process.',
          [[2,3],[],[]]
        ],
        [
          
          'When replacing a lost authenticator, claimant is required to authenticate using a remaining factor, if any',
          'The CSP SHALL require the claimant to authenticate using an authenticator of the remaining factor, if any, to confirm binding to the existing identity.',
          [[],[1,2,3],[]]
        ],
        [
          'Reestablishment of authentication factors is done in person, or through a supervised remote process, and verifies the biometric collected during the original proofing process.',
          'Reestablishment of authentication factors at IAL3 SHALL be done in person, or through a supervised remote process, and SHALL verify the biometric collected during the original proofing process.',
          [[3],[],[]]
        ],
        [
          'When using confirmation code as a recover method, the code is at least 6 bits random alphanumeric generated by an approved random bit generator.',
          'The confirmation code SHALL consist of at least 6 random alphanumeric characters generated by an approved random bit generator.',
          [[],[1,2,3],[]]
        ],
        [
          'When using confirmation code as a recover method, the valid time of the code is properly set',
          'Those sent to a postal address of record SHALL be valid for a maximum of 7 days but MAY be made valid up to 21 days via an exception process to accommodate addresses outside the direct reach of the U.S. Postal Service. Confirmation codes sent by means other than physical mail SHALL be valid for a maximum of 10 minutes.',
          [[],[1,2,3],[]]
        ],
      ]
    ),
    question(501, 14,
      'Authenticator Compromised, Expired and Revoked',
      'In this part we take a look at the process how a subscriber troubleshooting their authenticators when problems occur. Please check the requirements and make them green if they match the practive status',
      [
        [
          'Memorized secret or a physical authenticator as a backup or alternate authenticator, if exists, to facilitate secure reporting of the loss, theft, or damage to an authenticator',
          'To facilitate secure reporting of the loss, theft, or damage to an authenticator, the CSP SHOULD provide the subscriber with a method of authenticating to the CSP using a backup or alternate authenticator. The backup authenticator SHALL be either a memorized secret or a physical authenticator. Either MAY be used, but only one authentication factor is required to make this report.',
          [[],[1,2,3],[]]
        ],
        [
          'Suspension of a report authenticator is reversible',
          'The suspension SHALL be reversible if the subscriber successfully authenticates to the CSP using a valid (i.e., not suspended) authenticator and requests reactivation of an authenticator suspended in this manner.',
          [[],[1,2,3],[]]
        ],
        [
          'Expired authenticators are no longer usable for authentication',
          'If and when an authenticator expires, it SHALL NOT be usable for authentication.',
          [[],[1,2,3],[]]
        ],
        [
          'Expired authenticators are required to be destroyed or to surrender properly',
          'The CSP SHALL require subscribers to surrender or prove destruction of any physical authenticator containing attribute certificates signed by the CSP as soon as practical after expiration or receipt of a renewed authenticator.',
          [[],[1,2,3],[]]
        ],
        [
          'Revocation of an authenticator is properly executed in time',
          'CSPs SHALL revoke the binding of authenticators promptly when an online identity ceases to exist (e.g., subscriber’s death, discovery of a fraudulent subscriber), when requested by the subscriber, or when the CSP determines that the subscriber no longer meets its eligibility requirements.',
          [[],[1,2,3],[]]
        ],
        [
          'Revoked authenticators are required to be destroyed or to surrender properly',
          'The CSP SHALL require subscribers to surrender or certify destruction of any physical authenticator containing certified attributes signed by the CSP as soon as practical after revocation or termination takes place. This is necessary to block the use of the authenticator’s certified attributes in offline situations between revocation/termination and expiration of the certification.',
          [[],[1,2,3],[]]
        ]
      ]
    ),
  ]
);