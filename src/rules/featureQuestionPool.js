import { question, questionGroup } from './index';
import { QUEST_TYPE_SINGLE, QUEST_TYPE_MULTI } from './index';

export const featureSelectingQeustions = [
	questionGroup(100, 'Generating Requirements', 'In this part we are going to answer some questions about your service. \n Question Group 1 is about generating IALx requirements', 
		[
			question(
				100, 0, 'Enrollment Presence', 
				'An applicant would have to participate the enrollment process: (multi select)',
				[
					['in person at the CSP agency',''],
					['using some supervised-remote station in person',''],
					['using unsupervised-remote process',''],
				],
				QUEST_TYPE_MULTI
				),
			question(
				100, 1, 'Identity Assurance Level', 
				'I would have to use:',
				[
					['AAL1',''],
					['AAL2',''],
					['AAL3',''],
				]),
			question(
				100, 2, 'Identity Assurance Level', 
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
	)
];