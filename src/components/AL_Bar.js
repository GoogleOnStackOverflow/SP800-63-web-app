import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar , Tooltip , OverlayTrigger, PageHeader } from 'react-bootstrap';

const getProgressNow = (requirementStatus, requirements) => {
  if(requirements === undefined)
    return 0;

  var boolArr = [];
  Object.keys(requirements).forEach(quest_id => {
    requirements[quest_id].forEach(option => {
      if(Array.isArray(requirementStatus[quest_id]))
        boolArr.push(requirementStatus[quest_id].includes(option));
      else
        boolArr.push(false);
    });
  })

  var count = 0;
  for(var i=0; i<boolArr.length; i++)
    count += boolArr[i]? 1 : 0;

  if(boolArr.length === 0) return 0;
  return Number(((count/boolArr.length)*100).toFixed(2));
}

const BarToolTip = (name) => {
  return (
    <Tooltip id={`tooltip-${name}`}>
      {name}
    </Tooltip>
  );
}

const XALProgressBar = ({requirementStatus, name, requirements}) => {
  return (
     <OverlayTrigger placement="right" overlay={BarToolTip(name)}>
      <ProgressBar 
        active now={getProgressNow(requirementStatus, requirements)} label={`${getProgressNow(requirementStatus, requirements)}%`}  
        bsStyle={getProgressNow(requirementStatus, requirements) <= 60 ? "danger" : (getProgressNow(requirementStatus, requirements) <= 99 ? "warning" : "success")}/>
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
      <XALProgressBar name={`FAL${levelArr[2]}`} requirementStatus={requirementStatusArr[2]} requirements={requirementsArr[2]}/>
    </PageHeader>
  );
}

ProgressWindow.propTypes = {
  levelArr: PropTypes.array,
  requirementsArr: PropTypes.array,
  requirementStatusArr: PropTypes.array
}

export default ProgressWindow;