import React from 'react';
import PropTypes from 'prop-types';
import { Tab ,Tabs } from 'react-bootstrap';

const FlowTab = ({contentArr}) => {
  return (
    <Tabs defaultActiveKey={0} id="tab-test">
      {contentArr.map((contentObj, index) => {
        return (
          <Tab key={index} eventKey={index} title={contentObj.name} disabled={false}>
            {contentObj.domClass}
          </Tab>
        );
      })}
    </Tabs>
  );
}

FlowTab.propTypes = {
  contentArr: PropTypes.array
}

export default FlowTab;