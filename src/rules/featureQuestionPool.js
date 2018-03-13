import { question, questionGroup } from './index';
import { QUEST_TYPE_SINGLE, QUEST_TYPE_MULTI } from './index';
import { selectXALs } from './selectingQuestionPool';

const STRING_MEMORIZED = ['Memorized Secrets','A Memorized Secret authenticator — commonly referred to as a password or, if numeric, a PIN — is a secret value intended to be chosen and memorized by the user. Memorized secrets need to be of sufficient complexity and secrecy that it would be impractical for an attacker to guess or otherwise discover the correct secret value. A memorized secret is something you know.'];
const STRING_LOOKUP = ['Look-up Secrets','A look-up secret authenticator is a physical or electronic record that stores a set of secrets shared between the claimant and the CSP. The claimant uses the authenticator to look up the appropriate secret(s) needed to respond to a prompt from the verifier. For example, the verifier may ask a claimant to provide a specific subset of the numeric or character strings printed on a card in table format. A common application of look-up secrets is the use of "recovery keys" stored by the subscriber for use in the event another authenticator is lost or malfunctions. A look-up secret is something you have.'];
const STRING_OUTOFBAND = ['Out-of-band Device','An out-of-band authenticator is a physical device that is uniquely addressable and can communicate securely with the verifier over a distinct communications channel, referred to as the secondary channel. The device is possessed and controlled by the claimant and supports private communication over this secondary channel, separate from the primary channel for e-authentication. An out-of-band authenticator is something you have.'];
const STRING_SF_OTP = ['Single-factor OTP Device','A single-factor OTP device generates OTPs. This category includes hardware devices and software-based OTP generators installed on devices such as mobile phones. These devices have an embedded secret that is used as the seed for generation of OTPs and does not require activation through a second factor. The OTP is displayed on the device and manually input for transmission to the verifier, thereby proving possession and control of the device. An OTP device may, for example, display 6 characters at a time. A single-factor OTP device is something you have.\nSingle-factor OTP devices are similar to look-up secret authenticators with the exception that the secrets are cryptographically and independently generated by the authenticator and verifier and compared by the verifier. The secret is computed based on a nonce that may be time-based or from a counter on the authenticator and verifier.'];
const STRING_MF_OTP = ['Multi-factor OTP Device','A multi-factor OTP device generates OTPs for use in authentication after activation through an additional authentication factor. This includes hardware devices and software-based OTP generators installed on devices such as mobile phones. The second factor of authentication may be achieved through some kind of integral entry pad, an integral biometric (e.g., fingerprint) reader, or a direct computer interface (e.g., USB port). The OTP is displayed on the device and manually input for transmission to the verifier. For example, an OTP device may display 6 characters at a time, thereby proving possession and control of the device. The multi-factor OTP device is something you have, and it SHALL be activated by either something you know or something you are.'];
const STRING_SF_CS = ['Single-factor Crypto Software','A single-factor software cryptographic authenticator is a cryptographic key stored on disk or some other "soft" media. Authentication is accomplished by proving possession and control of the key. The authenticator output is highly dependent on the specific cryptographic protocol, but it is generally some type of signed message. The single-factor software cryptographic authenticator is something you have.'];
const STRING_MF_CS = ['Multi-factor Crypto Software','A multi-factor software cryptographic authenticator is a cryptographic key stored on disk or some other "soft" media that requires activation through a second factor of authentication. Authentication is accomplished by proving possession and control of the key. The authenticator output is highly dependent on the specific cryptographic protocol, but it is generally some type of signed message. The multi-factor software cryptographic authenticator is something you have, and it SHALL be activated by either something you know or something you are.'];
const STRING_SF_CD = ['Single-factor Crypto Device','A single-factor cryptographic device is a hardware device that performs cryptographic operations using protected cryptographic key(s) and provides the authenticator output via direct connection to the user endpoint. The device uses embedded symmetric or asymmetric cryptographic keys, and does not require activation through a second factor of authentication. Authentication is accomplished by proving possession of the device via the authentication protocol. The authenticator output is provided by direct connection to the user endpoint and is highly dependent on the specific cryptographic device and protocol, but it is typically some type of signed message. A single-factor cryptographic device is something you have.'];
const STRING_MF_CD = ['Multi-factor Crypto Device','A multi-factor cryptographic device is a hardware device that performs cryptographic operations using one or more protected cryptographic keys and requires activation through a second authentication factor. Authentication is accomplished by proving possession of the device and control of the key. The authenticator output is provided by direct connection to the user endpoint and is highly dependent on the specific cryptographic device and protocol, but it is typically some type of signed message. The multi-factor cryptographic device is something you have, and it SHALL be activated by either something you know or something you are.'];

const EvidenceQuestion = (num, total, nextFunction) => {
	return questionGroup(300+num,
	`Evidence #${num+1}`, 
		`In this part we are going to check the strength of the evidences acceptable for an applicant to use. Please anwer these questions by the strongest evidences of all (and then the less stronger one). You can add up to 5 acceptable evidences. We'll later check if these evidences' combinations reaches the reqirements of selected IAL. This is #${num+1} of all ${total} evidences.`,
		[
		question(300+num, 0, 'Evidence Features', 'Please select the describtions that match this evidence (multi select).',
			[
				['Issuing through identity proofing process', 'The issuing source of the evidence confirmed the claimed identity through an identity proofing process.'],
				['Issuing to claimed identity through written procedures', 'The issuing source of the evidence confirmed the claimed identity through written procedures designed to enable it to form a reasonable belief that it knows the real-life identity of the person. Such procedures are subject to recurring oversight by regulatory or publicly-accountable institutions. For example, the Customer Identification Program guidelines established in response to the USA PATRIOT Act of 2001 or the Red Flags Rule, under Section 114 of the Fair and Accurate Credit Transaction Act of 2003 (FACT Act).'],
				['Issuing after existence of the person checked', 'The issuing source visually identified the applicant and performed further checks to confirm the existence of that person.'],
				['Possession is reasonably assumed ', 'The issuing process for the evidence means that it can reasonably be assumed to have been delivered into the possession of the person to whom it relates.'],
				['Possesion is ensured', 'The issuing process for the evidence ensured that it was delivered into the possession of the subject to whom it relates.'],
				['The evidence contains full name of the person', 'The full name on the issued evidence must be the name that the person was officially known by at the time of issuance. Not permitted are pseudonyms, aliases, an initial for surname, or initials for all given names'],
				['The evidence has IAL2/AAL2 features', 'Applicant proves possession of an AAL2 authenticator, or equivalent, bound to an IAL2 identity, at a minimum.'],
				['The evidence contains unique reference numbers', 'The evidence contains at least one reference number that uniquely identifies the person to whom it relates.'],
				['The evidence contains photograph', 'The evidence contains a photograph of the person to whom it relates.'],
				['The evidence contains biometrics', 'The evidence contains a biometric template (any modality) of the person to whom it relates.'],
				['The evidence contains digital information', 'The evidence includes digital information, the information is protected using approved cryptographic or proprietary methods, or both, and those methods ensure the integrity of the information and enable the authenticity of the issuing source to be confirmed.'],
				['The evidence includes physical security features', 'The evidence includes physical security features that require proprietary knowledge and proprietary technologies to be able to reproduce it.'],
				['Ownership confirmed through KBV.', 'The evidence can have ownership confirmed through KBV.'],
				['Unexpired', 'The issued evidence is unexpired.']
			],QUEST_TYPE_MULTI),

		question(300+num, 1, 'Validating Methods', 'Please select the describtions that would be done in order to validate this evidence (multi select).',
			[
				['Personal data confirmed through information from an authoritative source','All personal details from the evidence have been confirmed as valid by comparison with information held or published by an authoritative source.'],
				['Integrity of physical security features (if any) confirmed','The evidence has been confirmed as genuine using appropriate technologies, confirming the integrity of physical security features and that the evidence is not fraudulent or inappropriately modified.'],
				['Intergrity of cryptographic security features confirmed', 'The issued evidence has been confirmed as genuine by confirmation of the integrity of cryptographic security features.'],
				['Genuineness confirmed by trained personnel', 'The evidence has been confirmed as genuine by trained personnel.'],
			]
			,QUEST_TYPE_MULTI),

		question(300+num, 2, 'Verification Methods', 'Please select the describtions that would be done in order to verify the relationship between this evidence and the applicant (multi select).',
			[
				['Ownership confirmed by accessibility', 'The applicant has been confirmed as having access to the evidence provided to support the claimed identity.'],
				['Ownership confirmed by KBV', 'The applicant’s ownership of the claimed identity has been confirmed by KBV.'],
				['Ownership confirmed by phisical comparison to the strongest evidence', 'The applicant’s ownership of the claimed identity has been confirmed by a physical comparison of the applicant to the strongest piece of identity evidence provided to support the claimed identity.'],
				['Ownership confirmed by biometric comparison ', 'The applicant’s ownership of the claimed identity has been confirmed by biometric comparison of the applicant to the identity evidence.'],
				['Biometric comparison using appropriate technologies', 'The applicant’s ownership of the claimed identity has been confirmed by biometric comparison, using appropriate technologies, of the applicant to the strongest piece of identity evidence provided to support the claimed identity.'],
				['Ownership confirmed by photograph comparison to the strongest evidence', 'The applicant’s ownership of the claimed identity has been confirmed by physical comparison, using appropriate technologies, to a photograph, to the strongest piece of identity evidence provided to support the claimed identity.'],
				['Photograph comparison using appropriate technologies','The applicant’s ownership of the claimed identity has been confirmed by physical comparison, using appropriate technologies, to a photograph, to the strongest piece of identity evidence provided to support the claimed identity.'],
			]
			,QUEST_TYPE_MULTI)
		],
		nextFunction
	);
}

const isAllIncludes = (subArr, Arr) => {
	if (!Array.isArray(Arr))
		return false;
	for(var i=0; i<subArr.length; i++) {
		if(!Arr.includes(subArr[i]))
			return false;
	}
	return true;
}

export const evidenceStrength = (status) => {
	var result = []
	for(var i=0; i<5; i++){
		if(isAllIncludes([1,2,4,5,7,8,9,10,11,13] ,status[`30${i}-0`]))
			result[i] = 5;
		else if(isAllIncludes([1,2,4,5,7,13,6] ,status[`30${i}-0`])
			|| isAllIncludes([1,2,4,5,7,13,8] ,status[`30${i}-0`])
			|| isAllIncludes([1,2,4,5,7,13,9] ,status[`30${i}-0`]))
			result[i] = 4;
		else if(isAllIncludes([1,4,5,7,13,6] ,status[`30${i}-0`])
			|| isAllIncludes([1,4,5,7,13,8] ,status[`30${i}-0`])
			|| isAllIncludes([1,4,5,7,13,9] ,status[`30${i}-0`]))
			result[i] = 3;
		else if(isAllIncludes([0,3,13,7] ,status[`30${i}-0`])
			|| isAllIncludes([0,3,13,8] ,status[`30${i}-0`])
			|| isAllIncludes([0,3,13,9] ,status[`30${i}-0`])
			|| isAllIncludes([0,3,13,12] ,status[`30${i}-0`]))
			result[i] = 2;
		else if(isAllIncludes([3,7] ,status[`30${i}-0`])
			|| isAllIncludes([3,8] ,status[`30${i}-0`])
			|| isAllIncludes([3,9] ,status[`30${i}-0`]))
			result[i] = 1;
		else
			result[i] = 0;
	}

	return result;
}

export const evidencesQuestGroup = [
	EvidenceQuestion(0,5,(status)=>{return 1;}),
	EvidenceQuestion(1,5,(status)=>{return 2;}),
	EvidenceQuestion(2,5,(status)=>{return 3;}),
	EvidenceQuestion(3,5,(status)=>{return 4;}),
	EvidenceQuestion(4,5,(status)=>{return -1;})
];


export const featureQeustGroup = [
	questionGroup(100, 'Generating Requirements', 'In this part we are going to answer some questions about your service. \n Question Group 1 is about generating IALx requirements', 
		[
			question(
				100, 0, 'Enrollment Presence', 
				'An applicant would have to participate the enrollment process use one of the selected method: (multi select)',
				[
					['In person at the CSP agency',''],
					['remotely','']
				],
				QUEST_TYPE_MULTI
				),
			question(
				100, 1, 'Referee', 
				'The CSP MAY use trusted referees that can vouch for or act on behalf of the applicant in accordance with applicable laws, regulations, or agency policy.\nTrusted referees such as notaries, legal guardians, medical professionals, conservators, persons with power of attorney, or some other form of trained and approved or certified individuals are allowed.',
				[
					['Yes',
					'A referee can vouch for or act on behalf of the applicant.'],
					['No',
					'No referees are allowed to participate the enrollment process.'],
				], QUEST_TYPE_SINGLE),

			question(
				100, 3, 'Knowledge Based Verification', 
				'Do you use knowledge based verification process to verify an applicant\'s identity?\nWhich means that you ask the applicant some questions (that you know the answer) about the identity to make sure that the applicant is associate with the identity.',
				[
					['Yes','An applicant is going to be asked some questions to proof the association between he/she and the identity.'],
					['No','No KBV is going to be used.'],
				],QUEST_TYPE_SINGLE,
				(status) => {
					return selectXALs(status)[0] >= 2;
				}),
			question(
				100, 4, 'Enrollment Codes', 
				'Do you use an enrollment code to verify the address attributes an applicant provided or in records?\n For example, asking an applicant to reply some PIN recieved via SMS from their cell phone, to verify the phone number of the applicant.',
				[
					['Yes','An applicant would have to verify their attributes through enrollment codes'],
					['No', 'No enrollment code is going to be used']
				],QUEST_TYPE_SINGLE,
				(status) => {
					return selectXALs(status)[0] >= 2;
				}),
      		question(
        		100, 5, 'Other Usage of User Attributes', 
        		'Would CSPs process attributes for purposes other than identity proofing, authentication, or attribute assertions (collectively “identity service”)related fraud mitigation, or to comply with law or legal process?',
        		[
          			['Yes',
          				'User\'s identity attributes would be used for purpose other than identity service or related works'],
          			['No',
          				'User\'s identity attributes are for identity services and related works only'],
		        ], QUEST_TYPE_SINGLE),
			], 
		(status) => {
			return 1;
		}
	),
	questionGroup(101, 'Generating Requirements', 'In this part we are going to answer some questions about your service. \n Question Group 2 is about generating AALx requirements', 
		[
			question(
				101, 0, 'Authenticators', 
				'What authenticators\' combinations may an claimant use to authenticate? (multi select)',
				[
					STRING_MEMORIZED, STRING_LOOKUP, 
					STRING_OUTOFBAND, 
					STRING_SF_OTP, STRING_MF_OTP,
					STRING_SF_CS, STRING_MF_CS,
					STRING_SF_CD, STRING_MF_CD
				],
				QUEST_TYPE_MULTI,
				(status) => {
					return selectXALs(status)[1] === 1;
				}),
			question(
				101, 1, 'Authenticators', 
				'What authenticators\' combinations may an claimant use to authenticate? (multi select)',
				[
					['Memorized Secrets plus Look-up Secrets',`${STRING_MEMORIZED[1]} ${STRING_LOOKUP[1]}`],
					['Memorized Secrets plus Out-of-band Device',`${STRING_MEMORIZED[1]} ${STRING_OUTOFBAND[1]}`],
					['Memorized Secrets plus Single-factor OTP Device',`${STRING_MEMORIZED[1]} ${STRING_SF_OTP[1]}`],
					['Memorized Secrets plus Single-factor Crypto Software',`${STRING_MEMORIZED[1]} ${STRING_SF_CS[1]}`],
					['Memorized Secrets plus Single-factor Crypto Device',`${STRING_MEMORIZED[1]} ${STRING_SF_CD[1]}`],
					STRING_MF_OTP, STRING_MF_CS, STRING_MF_CD
				],
				QUEST_TYPE_MULTI,
				(status) => {
					return selectXALs(status)[1] === 2;
				}),
			question(
				101, 2, 'Authenticators', 
				'What authenticators\' combinations may an claimant use to authenticate? (multi select)',
				[
					['Memorized Secrets plus Single-factor OTP Device plus Single-factor Crypto Software',
						`${STRING_MEMORIZED[1]} ${STRING_SF_OTP[1]} ${STRING_SF_CS[1]}`
					],
					['Memorized Secrets plus Single-factor Crypto Device',
						`${STRING_MEMORIZED[1]} ${STRING_SF_CD[1]}`
					],
					['Single-factor OTP Device plus Multi-factor Crypto Software',
						`${STRING_SF_OTP[1]} ${STRING_MF_CS[1]}`
					],
					['Single-factor OTP Device plus Multi-factor Crypto Device',
						`${STRING_SF_OTP[1]} ${STRING_MF_CD[1]}`
					],
					STRING_MF_CD
				],
				QUEST_TYPE_MULTI,
				(status) => {
					return selectXALs(status)[1] === 3;
				}),
			question(
				101, 3, 'Confirmation Code', 
				'Do you use confirmation code to recover an subscriber\'s account?\nThat is, when a claimant forgets the password, he/she can require a recovery that you send a confirmation code to the address in record. The claimant then start a memorized secret recovery by the confirmation code (e.g. an Email with a recovery url).',
				[
					['Yes','We support this feature.'],
					['No','Memorized secret cannot be recovered in this way.'],
				],QUEST_TYPE_SINGLE,
				(status) => {
					if(Array.isArray(status['101-0']))
						if(status['101-0'].includes(0))
							return true;

					if(Array.isArray(status['101-1']))
						if(status['101-1'].includes(0)
						|| status['101-1'].includes(1)
						|| status['101-1'].includes(2)
						|| status['101-1'].includes(3)
						|| status['101-1'].includes(4))
							return true;

					if(Array.isArray(status['101-2']))
						if(status['101-2'].includes(0)
						|| status['101-2'].includes(1))
							return true;
					return false;
				}),
			question(
				101, 4, 'Out-of-band Device',
				'How does the out-of-band device complete the authentication?',
				[
					['Transfer of secret to primary channel','The verifier MAY signal the device containing the subscriber’s authenticator to indicate readiness to authenticate. It SHALL then transmit a random secret to the out-of-band authenticator. The verifier SHALL then wait for the secret to be returned on the primary communication channel.'],
					['Transfer of secret to secondary channel','The verifier SHALL display a random authentication secret to the claimant via the primary channel. It SHALL then wait for the secret to be returned on the secondary channel from the claimant’s out-of-band authenticator.'],
					['Verification of secrets by claimant','The verifier SHALL display a random authentication secret to the claimant via the primary channel, and SHALL send the same secret to the out-of-band authenticator via the secondary channel for presentation to the claimant. It SHALL then wait for an approval (or disapproval) message via the secondary channel.']
				],QUEST_TYPE_SINGLE,
				(status) => {
					if(Array.isArray(status['101-0']))
						if(status['101-0'].includes(2))
							return true;
					if(Array.isArray(status['101-1']))
						if(status['101-1'].includes(1))
							return true;
					return false;
				}),
			question(
				101, 5, 'Multi Factors',
				'What second factor would the multi-factor device(s) use? (multi select)',
				[
					['Something you know','For example, PIN or passwords.'],
					['Something you are','For example, biometrics like finger prints'],
				],QUEST_TYPE_MULTI,
				(status) => {
					if(Array.isArray(status['101-0']))
						if(status['101-0'].includes(4)
						|| status['101-0'].includes(6)
						|| status['101-0'].includes(8))
							return true;
					if(Array.isArray(status['101-1']))
						if(status['101-1'].includes(5)
						|| status['101-1'].includes(6)
						|| status['101-1'].includes(7))
							return true;
					if(Array.isArray(status['101-2']))
						if(status['101-2'].includes(2)
						|| status['101-2'].includes(3)
						|| status['101-2'].includes(4))
							return true;
					return false;
				}),
		],
		(status) => {
			return selectXALs(status)[2] > 0 ? 2 : -1;
		}
	),
	questionGroup(102, 'Generating Requirements', 'In this part we are going to answer some questions about your service. \n Question Group 3 is about generating FALx requirements', 
		[
			question(
				102, 0, 'FOO', 
				'Bar',
				[
					['foo', 'bar'],
					['foo', 'bar']
				],QUEST_TYPE_SINGLE),
		],
		(status) => {
			return -1;
		}
	)
];