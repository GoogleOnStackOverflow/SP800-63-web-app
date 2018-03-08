import React, { Component } from 'react';
import { PageHeader, Jumbotron , Grid, Row, Col } from 'react-bootstrap';
import QuestionGroup from './containers/QuestionGroup';
import { xALSelectQuestGroup } from './questionPool';

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
            <PageHeader>
              Example page header <small>Subtext for header</small>
            </PageHeader>
            <Jumbotron class=".fixed-top">
              <h1>Hello, world!</h1>
              <p>
                This is a simple hero unit, a simple jumbotron-style component for calling
                extra attention to featured content or information.
              </p>
            </Jumbotron>
            <QuestionGroup questGroupObjArr={xALSelectQuestGroup}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
