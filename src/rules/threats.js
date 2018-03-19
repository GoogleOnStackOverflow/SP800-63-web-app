import { threat, mitigation } from './index'

const objAllIncludes = (status, reqObj) => {
  Object.entries(reqObj).forEach(req => {
    if(Array.isArray(status[req[0]]) && Array.isArray(req[1]))
      req[1].forEach(index => {
        if(!(status[req[0]].includes(index))) return false;
      });
    else return false;
  });

  return true;
}

export const IAL_THREADS = [
  threat(
    'Falsified identity proofing evidence',
    'For example, an applicant claims an incorrect identity by using a forged driver’s license.',
    [
      mitigation(
        'CSP validates physical security features of presented evidence.',
        (status) => {
          return false;
        }
      ),
      mitigation(
        'CSP validates personal details in the evidence with the issuer or other authoritative source.',
        (status) => {
          return false;
        }
      )
    ]
  ),
  threat(
    'Fraudulent use of another’s identity',
    'For example, an applicant uses a passport associated with a different individual.',
    [
      mitigation(
        'CSP verifies identity evidence and biometric of applicant against information obtained from issuer or other authoritative source.',
        (status) => {

        }
      ),
      mitigation(
        'Verify applicant- provided non- government-issued documentation (e.g., electricity bills in the name of the applicant with the current address of the applicant printed on the bill, or a credit card bill) to help achieve a higher level of confidence in the applicant’s identity.',
        (status) => {
          return false;
        }
      )
    ]
  ),
]