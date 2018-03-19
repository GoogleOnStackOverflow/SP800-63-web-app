import { threat, mitigation } from './index'
import { getRequirementObject, IAL_REQ_GROUP, AAL_REQ_GROUP } from './requirements';

const objAllIncludes = (status, reqObj) => {
  console.log('!!!!');
  console.log(reqObj);
  console.log(status);
  console.log('!!!');
  if(!reqObj)
    return false;

  if(Object.keys(reqObj).length === 0)
    return false;

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
          if(Array.isArray(status['500-1'])) {
            if(status['500-1'].includes(2) || status['500-1'].includes(3))
              return 'success';
          } else
            return 'warning';
          
          return 'danger';
        }
      ),
      mitigation(
        'CSP validates personal details in the evidence with the issuer or other authoritative source.',
        (status) => {
          console.log('validates called');
          var requirements = getRequirementObject(status, IAL_REQ_GROUP);
          var x = 0;
          if(Array.isArray(status['500-1']))
            if(status['500-1'].includes(2) || status['500-1'].includes(3))
              x++;

          if(objAllIncludes(status, {'500-2': requirements['500-2']}))
            x++;

          return (x === 2)? 'success' : ((x===1)? 'warning' : 'danger');
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
          return 'default';
        }
      ),
      mitigation(
        'Verify applicant- provided non- government-issued documentation (e.g., electricity bills in the name of the applicant with the current address of the applicant printed on the bill, or a credit card bill) to help achieve a higher level of confidence in the applicant’s identity.',
        (status) => {
          return 'default';
        }
      )
    ]
  ),
]