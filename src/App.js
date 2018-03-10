import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import QuestionGroup from './containers/QuestionGroup';
import { xALSelectQuestGroup } from './rules/selectingQuestionPool';
import { featureQeustGroup } from './rules/featureQuestionPool';
import ProgressWindow from './containers/ProgressWindow';
import FlowTab from './components/FlowTab';

const tabContentArr = [
  {
    name:'xAL Selector',
    domClass: <QuestionGroup id="xAL-selector" questGroupObjArr={xALSelectQuestGroup}/>,
  },
  {
    name:'Feature Checking',
    domClass: <QuestionGroup id="feature-selector" questGroupObjArr={featureQeustGroup}/>,
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
            <ProgressWindow requirementsArr={[{'1-1':1},{'1-1':1},{'1-1':1,'1-2':2}]} requirementStatusArr={[{'1-1':1},{'1-1':1},{'1-1':1}]}/>
            <FlowTab contentArr={tabContentArr}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
