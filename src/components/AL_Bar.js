import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar , Tooltip , OverlayTrigger, PageHeader } from 'react-bootstrap';

const getProgressNow = (requirementStatus, requirements) => {
  var boolArr = Object.keys(requirements).map(quest_id => {
    return requirementStatus[quest_id] === requirements[quest_id];
  })

  var count = 0;
  for(var i=0; i<boolArr.length; i++)
    count += boolArr[i]? 1 : 0;

  if(boolArr.length === 0) return 0;
  return count/boolArr.length;
}

const BarToolTip = (name) => {
  return (
    <Tooltip id={`tooltip-${name}`}>
      {name}
    </Tooltip>
  );
}

const XALProgressBar = ({requirementStatus, name, requirements}) => {

  var now = getProgressNow(requirementStatus, requirements)
  return (
     <OverlayTrigger placement="right" overlay={BarToolTip(name)}>
      <ProgressBar 
        active now={now} label={`${now}%`}  
        bsStyle={now <= 60 ? "danger" : (now <= 99 ? "warning" : "success")}/>
    </OverlayTrigger>
  );
}

XALProgressBar.propTypes = {
  requirementStatus: PropTypes.obj,
  requirements: PropTypes.obj,
  name: PropTypes.string
};

const ProgressWindow = ({requirementStatusArr, requirementsArr, levelArr}) => {
  return (
    <PageHeader>
      Target xALs complete Progress <small><p>Please finish the feature check problems and start the TODO list to complete the process</p></small>
      <XALProgressBar name={`IAL${levelArr[0]}`} requirementStatus={requirementStatusArr[0]} requirements={requirementsArr[0]}/>
      <XALProgressBar name={`AAL${levelArr[1]}`} requirementStatus={requirementStatusArr[1]} requirements={requirementsArr[1]}/>
      <div>
      { levelArr[3] !== 0 ? <XALProgressBar name={`FAL${levelArr[2]}`} requirementStatus={requirementStatusArr[2]} requirements={requirementsArr[2]}/> : <p>No FAL required</p> }
      </div>
    </PageHeader>
  );
}

ProgressWindow.propTypes = {
  levelArr: PropTypes.array,
  requirementsArr: PropTypes.array,
  requirementStatusArr: PropTypes.array
}

export default ProgressWindow;