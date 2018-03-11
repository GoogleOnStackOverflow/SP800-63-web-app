import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Pager } from 'react-bootstrap';
import { QUEST_TYPE_SINGLE, QUEST_TYPE_MULTI } from '../rules/index';
import QuestPanel from './QuestPanel';

const QuestGroup = ({
  id, questGroupObj, optionOnClick, multiOnClick, previousOnClick, nextOnClick, 
  startOverOnClick, chosenStatus, havePrevious, enableNext}) => 
{
  if(questGroupObj === undefined)
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Finished</Panel.Title>
        </Panel.Heading>
        <Panel.Body>Please use the tab above to continue the next part.</Panel.Body>
        <Pager>
          
          <Pager.Item onClick={()=>{
            startOverOnClick(id)}}>
            Start Over
          </Pager.Item>{' '}
          
          <Pager.Item onClick={()=>{
            previousOnClick(id)}}>
            Previous
          </Pager.Item>

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
          {questGroupObj.questions.map(question => {
            if(question.active(chosenStatus))
              switch(question.type) {
                case QUEST_TYPE_SINGLE:
                  return (<QuestPanel key={question.id} 
                    questObj={question} 
                    optionOnClick={optionOnClick} 
                    chosenStatus={chosenStatus}/>
                  );
                case QUEST_TYPE_MULTI:
                  return (<QuestPanel key={question.id} 
                    questObj={question}
                    optionOnClick={multiOnClick} 
                    chosenStatus={chosenStatus}/>
                  );
                default:
                  return <div/>;
            }
            return <div/>;
          })}
        </Panel.Body>
        <Pager>
          
          <Pager.Item disabled={!havePrevious} 
            onClick={()=>{previousOnClick(id)}}>
            Previous
          </Pager.Item>{' '}
          
          <Pager.Item disabled={!enableNext(questGroupObj)} 
            onClick={()=>{nextOnClick(id, questGroupObj.next(chosenStatus))}}>
            Next
          </Pager.Item>
        
        </Pager>
	  </Panel>);
}

QuestGroup.propTypes = {
  id: PropTypes.string,
	questGroupObj: PropTypes.obj,
	optionOnClick: PropTypes.func,
  multiOnClick: PropTypes.func,
  previousOnClick: PropTypes.func,
  nextOnClick: PropTypes.func,
  startOverOnClick: PropTypes.func,
	chosenStatus: PropTypes.obj,
  havePrevious: PropTypes.bool,
  enableNext: PropTypes.func
}

export default QuestGroup;