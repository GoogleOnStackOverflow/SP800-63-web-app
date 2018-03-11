import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelGroup } from 'react-bootstrap';

const optionIsChosen = (status , questId, optId) => {
  if(status[questId] === undefined)
    return false;
  if(Array.isArray(status[questId]))
    return status[questId].indexOf(optId) !== -1;
  
  return status[questId] === optId;
}

const OptionPanel = ({optionObj, optionOnClick, isChosen}) => {
	return (
	<Panel eventKey={optionObj.id} 
    onClick={() => {optionOnClick(optionObj)}} 
    bsStyle={isChosen?"success":"default"}>
    <Panel.Heading>
      <Panel.Title toggle>
        {optionObj.name}
      </Panel.Title>
    </Panel.Heading>
    <Panel.Collapse>
      <Panel.Body>
        {optionObj.describtion}
      </Panel.Body>
    </Panel.Collapse>
  </Panel>);
}

OptionPanel.propTypes = {
	optionObj: PropTypes.obj,
	optionOnClick: PropTypes.func,
	isChosen: PropTypes.bool
};

const QuestPanel = ({questObj, optionOnClick, chosenStatus, isCollapsed}) => {
  isCollapsed = isCollapsed === undefined? false : isCollapsed;
	return (
	<Panel>
		<Panel.Heading>
      <Panel.Title toggle componentClass="h3">{questObj.name}</Panel.Title>
    </Panel.Heading>
    <Panel.Body collapsible={isCollapsed} defaultExpanded>{questObj.describtion}
    <PanelGroup accordion id={questObj.id}>
    	{questObj.options.map(option => (
    		<OptionPanel key={option.id} 
    		optionObj={option} 
    		optionOnClick={optionOnClick} 
    		isChosen={optionIsChosen(chosenStatus, questObj.id, option.id)}
    	/>))}
    </PanelGroup>
    </Panel.Body>
	</Panel>);
}

QuestPanel.propTypes = {
	questObj: PropTypes.obj,
	optionOnClick: PropTypes.func,
	chosenStatus: PropTypes.obj,
  isCollapsed: PropTypes.bool
}

export default QuestPanel;