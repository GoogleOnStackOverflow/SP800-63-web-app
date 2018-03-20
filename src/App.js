import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import QuestionGroup from './containers/QuestionGroup';
import RequirementGroup from './containers/RequirementGroup';
import ProgressWindow from './containers/ProgressWindow';
import FlowTab from './components/FlowTab';
import EvidenceQuestionGroup from './containers/EvidenceQuestionGroup';
import ResultSaveForm from './containers/ResultSaveForm';
import ThreatListPanel from './containers/ThreatListPanel';

import { xALSelectQuestGroup } from './rules/selectingQuestionPool';
import { featureQeustGroup } from './rules/featureQuestionPool';
import { IAL_REQ_GROUP, AAL_REQ_GROUP } from './rules/requirements';
import { IAL_THREATS, AAL_THREATS } from './rules/threats';

const requestTabContentArr = [
  {
    name:'Enrollment & Identity Proofing',
    domClass: <RequirementGroup id="IAL" questGroupObj={IAL_REQ_GROUP}/>,
  },
  {
    name:'Authentication & Lifecycle Management',
    domClass: <RequirementGroup id="AAL" questGroupObj={AAL_REQ_GROUP}/>,
  }
];

const featureCheckingTabContentArr = [
  {
    name: 'General Feature Checking',
    domClass: <QuestionGroup 
      id="feature-selector" 
      questGroupObjArr={featureQeustGroup}
    />
  },
  {
    name: 'Enrollment Evidences Checking',
    domClass: <EvidenceQuestionGroup />
  }
]

const threatTabContentArr = [
  {
    name:'Enrollment & Identity Proofing',
    domClass: <ThreatListPanel name="Enrollment & Identity Proofing" threats={IAL_THREATS}/>
  },
  {
    name:'Authentication & Lifecycle Management',
    domClass: <ThreatListPanel name="Authentication & Lifecycle Management" threats={AAL_THREATS}/>
  }
];

const tabContentArr = [
  {
    name:'xAL Selector',
    domClass: <QuestionGroup id="xAL-selector" questGroupObjArr={xALSelectQuestGroup}/>,
  },
  {
    name:'Feature Checking',
    domClass: <FlowTab contentArr={featureCheckingTabContentArr}/>,
  },
  {
    name:'Requirements',
    domClass: <FlowTab contentArr={requestTabContentArr}/>
  },
  {
    name:'Threats',
    domClass: <FlowTab contentArr={threatTabContentArr}/>
  }
];

class App extends Component {
  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={6} md={4}>
            <ResultSaveForm/>
          </Col>
          <Col xs={12} md={8}>
            <ProgressWindow requirementsQuestGroupArr={[IAL_REQ_GROUP, AAL_REQ_GROUP]}/>
            <FlowTab contentArr={tabContentArr}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
