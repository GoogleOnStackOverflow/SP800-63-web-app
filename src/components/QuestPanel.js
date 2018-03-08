import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelGroup, Pager } from 'react-bootstrap';
import { selectXALs } from '../questionPool';

const OptionPanel = ({optionObj, optionOnClick, isChosen}) => {
	return (
	<Panel eventKey={optionObj.id} onClick={() => {optionOnClick(optionObj)}} bsStyle={isChosen?"success":"default"}>
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
    </Panel>
    );
}

OptionPanel.propTypes = {
	optionObj: PropTypes.obj,
	optionOnClick: PropTypes.func,
	isChosen: PropTypes.bool
};

const QuestPanel = ({questObj, optionOnClick, chosenStatus}) => {
	return (
	<Panel>
		<Panel.Heading>
      <Panel.Title componentClass="h3">{questObj.name}</Panel.Title>
    </Panel.Heading>
    <Panel.Body>{questObj.describtion}</Panel.Body>
    <PanelGroup accordion id={questObj.id}>
    	{questObj.options.map(option => (
    		<OptionPanel key={option.id} 
    		optionObj={option} 
    		optionOnClick={optionOnClick} 
    		isChosen={chosenStatus[questObj.id]===option.id}
    	/>))}
    </PanelGroup>
	</Panel>);
}

QuestPanel.propTypes = {
	questObj: PropTypes.obj,
	optionOnClick: PropTypes.func,
	chosenStatus: PropTypes.obj
}

const QuestGroup = ({questGroupObj, optionOnClick, previousOnClick, nextOnClick, startOverOnClick, chosenStatus, havePrevious, enableNext}) => {
  if(questGroupObj === undefined)
    return (
      <Panel>
        <h4> Target xALs </h4>
        <p>IAL{selectXALs(chosenStatus)[0]}, AAL{selectXALs(chosenStatus)[1]}, FAL{selectXALs(chosenStatus)[2]}</p>
        <Pager>
          <Pager.Item onClick={()=>{startOverOnClick()}}>Start Over</Pager.Item>{' '}
          <Pager.Item onClick={()=>{previousOnClick()}}>Previous</Pager.Item>
        </Pager>
      </Panel>
    );
  else
	  return (
	    <Panel>
		    <Panel.Heading>
      		<Panel.Title componentClass="h3">{questGroupObj.name}</Panel.Title>
    	  </Panel.Heading>
    	  <Panel.Body>{questGroupObj.describtion}</Panel.Body>
        <Panel.Body>
          {questGroupObj.questions.map(question => (
            <QuestPanel key={question.id} 
              questObj={question} 
              optionOnClick={optionOnClick} 
              chosenStatus={chosenStatus}/>)
          )}
        </Panel.Body>
        <Pager>
          <Pager.Item disabled={!havePrevious} onClick={()=>{previousOnClick()}}>Previous</Pager.Item>{' '}
          <Pager.Item disabled={!enableNext(questGroupObj)} onClick={()=>{nextOnClick(questGroupObj.next(chosenStatus))}}>Next</Pager.Item>
        </Pager>
	  </Panel>);
}

QuestGroup.propTypes = {
	questGroupObj: PropTypes.obj,
	optionOnClick: PropTypes.func,
  previousOnClick: PropTypes.func,
  nextOnClick: PropTypes.func,
  startOverOnClick: PropTypes.func,
	chosenStatus: PropTypes.obj,
  havePrevious: PropTypes.bool,
  enableNext: PropTypes.func
}

export default QuestGroup;