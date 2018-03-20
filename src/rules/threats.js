import { threat, mitigation } from './index'
import { getRequirementObject, IAL_REQ_GROUP, AAL_REQ_GROUP } from './requirements';
import { UsageOfAuthenticators } from './featureQuestionPool';

const objAllIncludes = (status, reqObj) => {
  if(!reqObj)
    return false;

  if(Object.keys(reqObj).length === 0)
    return false;

  var reqs = Object.entries(reqObj)

  for(var i=0; i<reqs.length; i++) {
    if(Array.isArray(status[reqs[i][0]]) && Array.isArray(reqs[i][1])) {
      for(var j=0; j<reqs[i][1].length; j++) {
        console.log(status[reqs[i][0]].includes(reqs[i][1][j]))
        if(!(status[reqs[i][0]].includes(reqs[i][1][j]))) return false;
      }
    } else return false;
  }

  return true;
}


export const IAL_THREATS = [
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

          switch(x) {
            case 2:
              return 'success';
            case 1:
              return 'warning';
            default:
              return 'danger';
          }
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
          var x = 0;
          var requirements = getRequirementObject(status, IAL_REQ_GROUP);
          if(objAllIncludes(status, {'500-0':[23]})) x++;
          if(objAllIncludes(status, {'500-4':requirements['500-4']})) x++;
          if(objAllIncludes(status, {'500-1':requirements['500-1']})) x++;

          switch(x) {
            case 3:
              return 'success';
            case 2:
            case 1:
              return 'warning';
            default:
              return 'danger';
          }
        }
      ),
      mitigation(
        'Verify applicant- provided non- government-issued documentation (e.g., electricity bills in the name of the applicant with the current address of the applicant printed on the bill, or a credit card bill) to help achieve a higher level of confidence in the applicant’s identity.',
        (status) => {
          var x = 0;
          var requirements = getRequirementObject(status, IAL_REQ_GROUP);
          if(objAllIncludes(status, {'500-0':[23]})) x++;
          if(objAllIncludes(status, {'500-4':requirements['500-4']})) x++;
          if(objAllIncludes(status, {'500-1':requirements['500-1']})) x++;

          switch(x) {
            case 3:
              return 'success';
            case 2:
            case 1:
              return 'warning';
            default:
              return 'danger';
          }
        }
      )
    ]
  ),
  threat(
    'Enrollment repudiation',
    'For example, a subscriber denies enrollment, claiming that they did not enroll with the CSP.',
    [
      mitigation(
        'CSP saves a subscriber’s biometric.',
        (status) => {
          var x = 0;
          var requirements = getRequirementObject(status, IAL_REQ_GROUP);
          if(objAllIncludes(status, {'500-0':[23]})) x++;
          if(objAllIncludes(status, {'500-4':requirements['500-4']})) x++;

          switch(x) {
            case 2:
              return 'success';
            case 1:
              return 'warning';
            default:
              return 'danger';
          }
        }
      )
    ]
  )
]

export const AAL_THREATS = [
  threat(
    'Theft',
    'A physical authenticator is stolen by an Attacker. For example, a hardware cryptographic device, an OTP device, a look-up secret authenticator or a cell phone is stolen.',
    [
      mitigation(
        'Use multi-factor authenticators that need to be activated through a memorized secret or biometric.',
        (status) => {
          if(Array.isArray(status['101-1']))
            if(status['101-1'].length > 0) return 'success';
          if(Array.isArray(status['101-2']))
            if(status['101-2'].length > 0) return 'success';
          
          var usage = UsageOfAuthenticators(status);
          if(usage.MULTI_FACTOR_OTP 
            || usage.MULTI_FACTOR_CRYPTO_DEVICE 
            || usage.MULTI_FACTOR_CRYPTO_SOFTWARE)
            return 'success';

          return 'warning';
        }
      ),
      mitigation(
        'Use a combination of authenticators that includes a memorized secret or biometric.',
        (status) => {
          if(Array.isArray(status['101-1']))
            if(status['101-1'].length > 0) return 'success';
          if(Array.isArray(status['101-2']))
            if(status['101-2'].length > 0) return 'success';
          return 'warning';
        }
      )
    ]
  ),
  threat(
    'Duplication',
    'The subscriber’s authenticator has been copied with or without their knowledge. For example, a password on a card or in electronic file, or a look-up secret authenticator is copied, or counterfeit biometric authenticator manufactured.',
    [
      mitigation(
        'Use authenticators from which it is difficult to extract and duplicate long-term authentication secrets.',
        (status) => {
          var x = 0
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          if(objAllIncludes(status, {'501-0':requirements['501-0']})) x++;
          if(objAllIncludes(status, {'501-1':requirements['501-1']})) x++;

          switch(x) {
            case 2:
              return 'success';
            case 1:
              return 'warning';
            default:
              return 'danger';
          }
        }
      )
    ]
  ),
  threat(
    'Eavesdropping',
    'The authenticator secret or authenticator output is revealed to the attacker as the subscriber is authenticating. For example, memorized secrets  or authenticator outputs are intercepted by keystroke logging software or obtained by watching keyboard entry; a PIN is captured from a PIN pad device; or a hashed password is obtained and used by an attacker for another authentication (pass-the-hash attack). Or, an out-of-band secret is intercepted by the attacker by compromising the communication channel. For example, an out-of-band secret is transmitted via unencrypted Wi-Fi and received by the attacker.',
    [
      mitigation(
        'Ensure the security of the endpoint, especially with respect to freedom from malware such as key loggers, prior to use.',
        (status) => {
          var x = 0
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          if(objAllIncludes(status, {'501-0':requirements['501-0']})) x++;
          if(objAllIncludes(status, {'501-1':requirements['501-1']})) x++;

          switch(x) {
            case 2:
              return 'success';
            case 1:
              return 'warning';
            default:
              return 'danger';
          }
        }
      ),
      mitigation(
        'Avoid use of non-trusted wireless networks as unencrypted secondary out-of-band authentication channels.',
        (status) => {
          if(!UsageOfAuthenticators(status).OUT_OF_BAND)
            return 'default';
          if(objAllIncludes(status, {'501-5': [0, 1, 2, 10]}))
            return 'success';

          return 'danger';
        }
      ),
      mitigation(
        'Authenticate over authenticated protected channels (e.g., observe lock icon in browser window).',
        (status) => {
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          if(objAllIncludes(status, {'501-0':requirements['501-0']})) 
            return 'success';

          return 'danger';
        }
      ),
      mitigation(
        'Use authentication protocols that are resistant to replay attacks such as pass-the-hash.',
        (status) => {
          var usage = UsageOfAuthenticators(status);
          if(usage.SINGLE_FACTOR_OTP
            || usage.MULTI_FACTOR_OTP
            || usage.LOOK_UP_SECRET
            || usage.SINGLE_FACTOR_CRYPTO_DEVICE
            || usage.MULTI_FACTOR_CRYPTO_DEVICE
            || usage.SINGLE_FACTOR_CRYPTO_SOFTWARE
            || usage.MULTI_FACTOR_CRYPTO_SOFTWARE
            )
            return 'success';
          return 'warning';
        }
      ),
      mitigation(
        'Use authentication endpoints that employ trusted input and trusted display capabilities.',
        (status) => {
          var usage = UsageOfAuthenticators(status);
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);

          if(usage.SINGLE_FACTOR_CRYPTO_SOFTWARE
            || usage.MULTI_FACTOR_CRYPTO_SOFTWARE) {
            if(objAllIncludes(status, {'501-7': requirements['501-7']}))
              return 'success';
            else return 'danger';
          } else return 'default';
        }
      ),
    ]
  ),
  threat(
    'Offline Cracking',
    'The authenticator is exposed using analytical methods outside the authentication mechanism. For example, a software PKI authenticator is subjected to dictionary attack to identify the correct password to use to decrypt the private key.',
    [
      mitigation(
        'Use an authenticator with a high entropy authenticator secret.',
        (status) => {
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          var usage = UsageOfAuthenticators(status);

          if(usage.LOOK_UP_SECRET 
            && objAllIncludes(status, {'501-4': requirements['501-4']}))
            return 'success';
          if((usage.SINGLE_FACTOR_OTP
            || usage.MULTI_FACTOR_OTP)
            && objAllIncludes(status, {'501-6': requirements['501-6']}))
            return 'success';

          if((usage.SINGLE_FACTOR_CRYPTO_DEVICE
            || usage.MULTI_FACTOR_CRYPTO_DEVICE)
            && objAllIncludes(status, {'501-7': requirements['501-7']}))
            return 'success';

          if(usage.LOOK_UP_SECRET
            || usage.SINGLE_FACTOR_OTP
            || usage.MULTI_FACTOR_OTP
            || usage.SINGLE_FACTOR_CRYPTO_DEVICE
            || usage.MULTI_FACTOR_CRYPTO_DEVICE)
            return 'warning';

          return 'danger';
        }
      ),
      mitigation(
        'Store memorized secrets in a salted, hashed form, including a keyed hash.',
        (status) => {
          if(!UsageOfAuthenticators(status).MEMORIZED_SECRET)
            return 'default';

          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          var x = 0;
          if(objAllIncludes(status, {'501-3': requirements['501-3']}))
            x++;
          if(objAllIncludes(status, {'501-11': requirements['501-11']}))
            x++;

          switch(x) {
            case 2:
              return 'success';
            case 1:
              return 'warning';
            default:
              return 'danger';
          }
        }
      ),
    ]
  ),
  threat(
    'Side Channel Attack',
    'The authenticator secret is exposed using physical characteristics of the authenticator. For example, is extracted by differential power analysis on a hardware cryptographic authenticator; or, a cryptographic authenticator secret is extracted by analysis of the response time of the authenticator over a number of attempts.',
    [
      mitigation(
        'Use authenticator algorithms that are designed to maintain constant power consumption and timing regardless of secret values.',
        (status) => {
          var usage = UsageOfAuthenticators(status);
          if(!(usage.SINGLE_FACTOR_OTP
            || usage.MULTI_FACTOR_OTP
            || usage.SINGLE_FACTOR_CRYPTO_DEVICE
            || usage.MULTI_FACTOR_CRYPTO_DEVICE
          ))
            return 'default';

          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          if(objAllIncludes(status, {'501-1': requirements['501-1']}))
            return 'success'

          return 'warning';
        }
      ),
    ]
  ),
  threat(
    'Phishing or Pharming',
    'The authenticator output is captured by fooling the subscriber into thinking the attacker is a verifier or RP. For example, a password is revealed by subscriber to a website impersonating the verifier; a memorized secret is revealed by a bank subscriber in response to an email inquiry from a phisher pretending to represent the bank; or a memorized secret is revealed by the subscriber at a bogus verifier website reached through DNS spoofing.',
    [
      mitigation(
        'Use authenticators that provide verifier impersonation resistance.',
        (status) => {
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          if(objAllIncludes(status, {'501-10': requirements['501-10']}))
            return 'success';

          return 'warning';
        }
      ),
    ]
  ),
  threat(
    'Social Engineering',
    'The attacker establishes a level of trust with a subscriber in order to convince the subscriber to reveal their authenticator secret or authenticator output. For example, a memorized secret is revealed by the subscriber to an officemate asking for the password on behalf of the subscriber’s boss; a memorized secret is revealed by a subscriber in a telephone inquiry from an attacker masquerading as a system administrator; or an out of band secret sent via SMS is received by an attacker who has convinced the mobile operator to redirect the victim’s mobile phone to the attacker.',
    [
      mitigation(
        'Avoid use of authenticators that present a risk of social engineering of third parties such as customer service agents.',
        (status) => {
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          if(objAllIncludes(status, {'501-13': requirements['501-13']}))
            return 'success';
          
          return 'warning';
        }
      ),
    ]
  ),
  threat(
    'Online Guessing',
    'The attacker connects to the verifier online and attempts to guess a valid authenticator output in the context of that verifier. For example, online dictionary attacks are used to guess memorized secrets, or online guessing is used to guess authenticator outputs for an OTP device registered to a legitimate claimant.',
    [
      mitigation(
        'Use authenticators that generate high entropy output.',
        (status) => {
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          var usage = UsageOfAuthenticators(status);

          if(usage.LOOK_UP_SECRET
            && objAllIncludes(status, {'501-4': requirements['501-4']}))
            return 'success';
          if((usage.SINGLE_FACTOR_OTP
            || usage.MULTI_FACTOR_OTP)
            && objAllIncludes(status, {'501-6': requirements['501-6']}))
            return 'success';

          if(usage.LOOK_UP_SECRET
            || usage.SINGLE_FACTOR_OTP
            || usage.MULTI_FACTOR_OTP)
            return 'warning';

          return 'danger';
        }
      ),
      mitigation(
        'Use an authenticator that locks up after a number of repeated failed activation attempts.',
        (status) => {
          if(objAllIncludes(status, {'501-1': [11, 12]}))
            return 'success';
          return 'danger';
        }
      ),
    ]
  ),
  threat(
    'Endpoint Compromise',
    'Malicious code on the endpoint proxies remote access to a connected authenticator without the subscriber’s consent. For example, a cryptographic authenticator connected to the endpoint is used to authenticate remote attackers. Or, Malicious code on the endpoint causes authentication to other than the intended verifier. For example, authentication is performed on behalf of an attacker rather than the subscriber, or a malicious app on the endpoint reads an out-of-band secret sent via SMS and the attacker uses the secret to authenticate. Or, Malicious code on the endpoint compromises a multi-factor software cryptographic authenticator. For example, malicious code proxies authentication or exports authenticator keys from the endpoint.',
    [
      mitigation(
        'Use hardware authenticators that require physical action by the subscriber.',
        (status) => {
          if(objAllIncludes(status, {'501-0': [9]}))
            return 'success';
          return 'warning';
        }
      ),
      mitigation(
        'Maintain software-based keys in restricted-access storage.',
        (status) => {
          var usage = UsageOfAuthenticators(status);
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          var x=0, y=0;

          if(!(usage.OUT_OF_BAND
            || usage.SINGLE_FACTOR_CRYPTO_SOFTWARE
            || usage.MULTI_FACTOR_CRYPTO_SOFTWARE
          ))
            return 'default';

          if(usage.OUT_OF_BAND) {
            y++;
            if(objAllIncludes(status, {'501-5': requirements['501-5']}))
              x++;
          }

          if(usage.SINGLE_FACTOR_CRYPTO_SOFTWARE
            || usage.MULTI_FACTOR_CRYPTO_SOFTWARE
          ){
            y++;
            if(objAllIncludes(status, {'501-7': requirements['501-7']}))
              x++;
          }

          if(x === y)
            return 'success';
          if(x === 1)
            return 'warning';
          if(x === 0)
            return 'danger';
        }
      ),
    ]
  ),
  threat(
    'Unauthorized Binding',
    'An attacker is able to cause an authenticator under their control to be bound to a subscriber’s account. For example, an attacker intercepts an authenticator or provisioning key en route to the subscriber.',
    [
      mitigation(
        'Use MitM-resistant protocols for provisioning of authenticators and associated keys.',
        (status) => {
          var requirements = getRequirementObject(status, AAL_REQ_GROUP);
          if(objAllIncludes(status, {
            '501-12': requirements['501-12'],
            '501-13': requirements['501-13']
          }))
            return 'success';

          return 'danger';
        }
      ),
    ]
  )
]