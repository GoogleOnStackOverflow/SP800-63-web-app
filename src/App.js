import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import QuestionGroup from './containers/QuestionGroup';
import RequirementGroup from './containers/RequirementGroup';
import ProgressWindow from './containers/ProgressWindow';
import FlowTab from './components/FlowTab';
import EvidenceQuestionGroup from './containers/EvidenceQuestionGroup';

import { xALSelectQuestGroup } from './rules/selectingQuestionPool';
import { featureQeustGroup } from './rules/featureQuestionPool';
import { IAL_REQ_GROUP, AAL_REQ_GROUP } from './rules/requirements';

const requestTabContentArr = [
  {
    name:'Enrollment & Identity Proofing',
    domClass: <RequirementGroup id="IAL" questGroupObj={IAL_REQ_GROUP}/>,
  },
  {
    name:'Authentication',
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
  }
];

class App extends Component {
  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={6} md={4}>
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
