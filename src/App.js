import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import QuestionGroup from './containers/QuestionGroup';
import { xALSelectQuestGroup } from './questionPool';
import ProgressWindow from './containers/ProgressWindow';

class App extends Component {
  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={6} md={4}>
            <p>blablabla</p>
            <p>blablabla</p>
            <p>blablabla</p>
          </Col>
          <Col xs={12} md={8}>
            <ProgressWindow requirementsArr={[{},{},{}]} requirementStatusArr={[{},{},{}]}/>
            <QuestionGroup questGroupObjArr={xALSelectQuestGroup}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
