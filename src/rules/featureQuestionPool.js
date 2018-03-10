import { question, questionGroup } from './index';
import { QUEST_TYPE_SINGLE, QUEST_TYPE_MULTI } from './index';

import { selectXALs } from './selectingQuestionPool';

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
				100, 2, 'Evidence Categories', 
				'How many kinds of personal identity evidences (e.g. driver\'s license, ID card ... etc) can an applicant use in a identity resolution process?\n\nAll acceptable evidences should be counted and we\'ll make sure that the "strongest" evidences\' combination reached the AAL requirements later.',
				[
					['1', 'An applicant would only have to use this specified kind evidences to complete enrollment.'],
					['2','An applicant would have to use one or more evidences of these 2 kinds of evidences to complete enrollment.'],
					['3','An applicant would have to use one or more evidences of these 3 kinds of evidences to complete enrollment.'],
					['4','An applicant would have to use one or more evidences of these 4 kinds of evidences to complete enrollment.'],
					['5 or more','An applicant would have to use one or more evidences of these 5 or more kinds of evidences to complete enrollment.'],
				],QUEST_TYPE_SINGLE,
				(status) => {
					return selectXALs(status)[0] >= 2;
				}),
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
				})
		], 
		(status) => {
			return 1;
		}
	),
	questionGroup(101, 'Generating Requirements', 'In this part we are going to answer some questions about your service. \n Question Group 2 is about generating AALx requirements', 
		[
			question(
				101, 0, 'Authenticators', 
				'What kind of authenticators may an claimant use to authenticate? (multi select)',
				[
					['Memorized Secrets','A Memorized Secret authenticator — commonly referred to as a password or, if numeric, a PIN — is a secret value intended to be chosen and memorized by the user. Memorized secrets need to be of sufficient complexity and secrecy that it would be impractical for an attacker to guess or otherwise discover the correct secret value. A memorized secret is something you know.'],
					['Look-up Secrets','A look-up secret authenticator is a physical or electronic record that stores a set of secrets shared between the claimant and the CSP. The claimant uses the authenticator to look up the appropriate secret(s) needed to respond to a prompt from the verifier. For example, the verifier may ask a claimant to provide a specific subset of the numeric or character strings printed on a card in table format. A common application of look-up secrets is the use of "recovery keys" stored by the subscriber for use in the event another authenticator is lost or malfunctions. A look-up secret is something you have.'],
					['Out-of-band Device','An out-of-band authenticator is a physical device that is uniquely addressable and can communicate securely with the verifier over a distinct communications channel, referred to as the secondary channel. The device is possessed and controlled by the claimant and supports private communication over this secondary channel, separate from the primary channel for e-authentication. An out-of-band authenticator is something you have.'],
					['Single-factor OTP Device','A single-factor OTP device generates OTPs. This category includes hardware devices and software-based OTP generators installed on devices such as mobile phones. These devices have an embedded secret that is used as the seed for generation of OTPs and does not require activation through a second factor. The OTP is displayed on the device and manually input for transmission to the verifier, thereby proving possession and control of the device. An OTP device may, for example, display 6 characters at a time. A single-factor OTP device is something you have.\nSingle-factor OTP devices are similar to look-up secret authenticators with the exception that the secrets are cryptographically and independently generated by the authenticator and verifier and compared by the verifier. The secret is computed based on a nonce that may be time-based or from a counter on the authenticator and verifier.'],
					['Multi-factor OTP Device','A multi-factor OTP device generates OTPs for use in authentication after activation through an additional authentication factor. This includes hardware devices and software-based OTP generators installed on devices such as mobile phones. The second factor of authentication may be achieved through some kind of integral entry pad, an integral biometric (e.g., fingerprint) reader, or a direct computer interface (e.g., USB port). The OTP is displayed on the device and manually input for transmission to the verifier. For example, an OTP device may display 6 characters at a time, thereby proving possession and control of the device. The multi-factor OTP device is something you have, and it SHALL be activated by either something you know or something you are.'],
					['Single-factor Crypto Software','A single-factor software cryptographic authenticator is a cryptographic key stored on disk or some other "soft" media. Authentication is accomplished by proving possession and control of the key. The authenticator output is highly dependent on the specific cryptographic protocol, but it is generally some type of signed message. The single-factor software cryptographic authenticator is something you have.'],
					['Multi-factor Crypto Software','A multi-factor software cryptographic authenticator is a cryptographic key stored on disk or some other "soft" media that requires activation through a second factor of authentication. Authentication is accomplished by proving possession and control of the key. The authenticator output is highly dependent on the specific cryptographic protocol, but it is generally some type of signed message. The multi-factor software cryptographic authenticator is something you have, and it SHALL be activated by either something you know or something you are.'],
					['Single-factor Crypto Device','A single-factor cryptographic device is a hardware device that performs cryptographic operations using protected cryptographic key(s) and provides the authenticator output via direct connection to the user endpoint. The device uses embedded symmetric or asymmetric cryptographic keys, and does not require activation through a second factor of authentication. Authentication is accomplished by proving possession of the device via the authentication protocol. The authenticator output is provided by direct connection to the user endpoint and is highly dependent on the specific cryptographic device and protocol, but it is typically some type of signed message. A single-factor cryptographic device is something you have.'],
					['Multi-factor Crypto Device','A multi-factor cryptographic device is a hardware device that performs cryptographic operations using one or more protected cryptographic keys and requires activation through a second authentication factor. Authentication is accomplished by proving possession of the device and control of the key. The authenticator output is provided by direct connection to the user endpoint and is highly dependent on the specific cryptographic device and protocol, but it is typically some type of signed message. The multi-factor cryptographic device is something you have, and it SHALL be activated by either something you know or something you are.'],
				],
				QUEST_TYPE_MULTI
				),
			question(
				101, 1, 'Confirmation Code', 
				'Do you use confirmation code to recover an subscriber\'s account?\nThat is, when a claimant forgets the password, he/she can require a recovery that you send a confirmation code to the address in record. The claimant then start a memorized secret recovery by the confirmation code (e.g. an Email with a recovery url).',
				[
					['Yes','We support this feature.'],
					['No','Memorized secret cannot be recovered in this way.'],
				],QUEST_TYPE_SINGLE,
				(status) => {
					if(!Array.isArray(status['101-0'])) return false;
					return status['101-0'].indexOf(0) !== -1;
				}),
			question(
				101, 2, 'Out-of-band Device',
				'How does the out-of-band device complete the authentication?',
				[
					['Transfer of secret to primary channel','The verifier MAY signal the device containing the subscriber’s authenticator to indicate readiness to authenticate. It SHALL then transmit a random secret to the out-of-band authenticator. The verifier SHALL then wait for the secret to be returned on the primary communication channel.'],
					['Transfer of secret to secondary channel','The verifier SHALL display a random authentication secret to the claimant via the primary channel. It SHALL then wait for the secret to be returned on the secondary channel from the claimant’s out-of-band authenticator.'],
					['Verification of secrets by claimant','The verifier SHALL display a random authentication secret to the claimant via the primary channel, and SHALL send the same secret to the out-of-band authenticator via the secondary channel for presentation to the claimant. It SHALL then wait for an approval (or disapproval) message via the secondary channel.']
				],QUEST_TYPE_SINGLE,
				(status) => {
					if(!Array.isArray(status['101-0'])) return false;
					return status['101-0'].indexOf(2) !== -1;
				}),
			question(
				101, 3, 'Multi Factors',
				'What second factor would the multi-factor device(s) use? (multi select)',
				[
					['Something you know','For example, PIN or passwords.'],
					['Something you are','For example, biometrics like finger prints'],
				],QUEST_TYPE_MULTI,
				(status) => {
					if(!Array.isArray(status['101-0'])) return false;
					return status['101-0'].indexOf(4) !== -1 || status['101-0'].indexOf(6) !== -1 || status['101-0'].indexOf(8) !== -1;
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
				],
				QUEST_TYPE_SINGLE
				),
		],
		(status) => {
			return -1;
		}
	)
];