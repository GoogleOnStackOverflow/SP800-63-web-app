import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';
import QuestPanel from './QuestPanel';

const RequestGroup = ({
  id, questGroupObj, requestOnClick, chosenStatus, requirements}) => 
{
  if(questGroupObj === undefined)
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">No Requestments Generated</Panel.Title>
        </Panel.Heading>
        <Panel.Body>Please use the tab above to select xALs and Features.</Panel.Body>
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
          {questGroupObj.questions.map(question => {
            if(question.active(chosenStatus))
                return (<QuestPanel key={question.id} 
                  questObj={question}
                  optionOnClick={requestOnClick} 
                  chosenStatus={chosenStatus}
                  isCollapsed={true}
                  requirements={requirements}/>
                );
            return <div/>;
          })}
        </Panel.Body>
	  </Panel>);
}

RequestGroup.propTypes = {
  id: PropTypes.string,
	questGroupObj: PropTypes.obj,
	requestOnClick: PropTypes.func,
	chosenStatus: PropTypes.obj,
  requirements: PropTypes.obj
}

export default RequestGroup;