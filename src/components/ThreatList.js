import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Well, ListGroup, ListGroupItem } from 'react-bootstrap';

const ThreatAndMitigations = (optionStatus, threat) => {
  return (
    <Panel>
      <Panel.Heading>
        <Panel.Title>{threat.name}</Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        <p>{threat.name}</p>
        <p>{threat.describtion}</p>
        <Well>
          <p>Mitigations</p>
          <ListGroup>
            {
              threat.mitigationArr.map(mitigation => {
                return (    
                  <ListGroupItem bsStyle={mitigation.isAchieved(optionStatus)}>
                    {mitigation.describtion}
                  </ListGroupItem>);
              })
            }
          </ListGroup>
        </Well>
      </Panel.Body>
    </Panel>
  );
}

const ThreatList = ({category, threats, optionStatus}) => {
  return (
    <Panel>
      <Panel.Heading>
        <Panel.Title>
          Threats and related mitigations ({category})
        </Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        <p>Here we list the threats having normative mitigations.</p>
        <p>Those threats not mitigated (or not required to be mitigated at the assureance levels) would be red</p>
        {
          threats.map(threat => (
            ThreatAndMitigations(optionStatus, threat)
          ))
        }
      </Panel.Body>
    </Panel>
  );
}

ThreatList.proptypes = {
  category: PropTypes.string,
  optionStatus: PropTypes.obj,
  threats: PropTypes.array
}

export default ThreatList;