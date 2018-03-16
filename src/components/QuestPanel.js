import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelGroup } from 'react-bootstrap';

const optionIsComplete = (status, questObj, requirements) => {
  if(requirements === undefined)
    return false;

  if(Array.isArray(status[questObj.id]) && Array.isArray(requirements[questObj.id])) {
    for(var i=0; i<requirements[questObj.id].length; i++)
      if(!(status[questObj.id].includes(requirements[questObj.id][i]))) return false;
  } else return false;
  
  return status[questObj.id].length>0;
}

const optionIsChosen = (status , questId, optId) => {
  if(status[questId] === undefined)
    return false;
  if(Array.isArray(status[questId]))
    return status[questId].includes(optId);
  
  return status[questId] === optId;
}

const OptionPanel = ({optionObj, optionOnClick, isChosen, isSuggested}) => {
	return (
	<Panel eventKey={optionObj.id}
    onClick={() => {optionOnClick(optionObj)}} 
    bsStyle={isChosen?"success":(isSuggested?"warning":"default")}>
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
	isChosen: PropTypes.bool,
  isSuggested: PropTypes.bool
};

const QuestPanel = ({questObj, optionOnClick, chosenStatus, isCollapsed, requirements}) => {
  isCollapsed = isCollapsed === undefined? false : isCollapsed;

	return (
	<Panel bsStyle={isCollapsed?(optionIsComplete(chosenStatus, questObj, requirements)?"success":"default"):"default"}>
		<Panel.Heading>
      <Panel.Title toggle componentClass="h3">{questObj.name}</Panel.Title>
    </Panel.Heading>
    <Panel.Body collapsible={isCollapsed} defaultExpanded>{questObj.describtion}
    <PanelGroup accordion id={questObj.id}>
    	{questObj.options.map(option => {
        if(!isCollapsed || (requirements===undefined? false:(isCollapsed && requirements[questObj.id].includes(option.id))))
          return (  
            <OptionPanel key={option.id} 
    		    optionObj={option} 
    		    optionOnClick={option.isPassive? ()=> {} : optionOnClick} 
    		    isChosen={optionIsChosen(chosenStatus, questObj.id, option.id)}
          />);
        return <div/>;
      })}
    </PanelGroup>
    </Panel.Body>
	</Panel>);
}

QuestPanel.propTypes = {
	questObj: PropTypes.obj,
	optionOnClick: PropTypes.func,
	chosenStatus: PropTypes.obj,
  isCollapsed: PropTypes.bool,
  requirements: PropTypes.obj,
}

export default QuestPanel;