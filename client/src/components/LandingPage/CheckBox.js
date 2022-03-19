import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);
  const [CheckedType, setCheckedType] = useState([]);

  const handleToggle = (value) => {
    const typeName = props.list.find((element) => element._id === value);
    const currentIndex = Checked.indexOf(value);
    const currentTypeIndex = Checked.indexOf(typeName);

    const newChecked = [...Checked];
    const newCheckedType = [...CheckedType];

    if (currentIndex === -1) {
      newChecked.push(value);
      newCheckedType.push(typeName);
    } else {
      newChecked.splice(currentIndex, 1);
      newCheckedType.splice(currentTypeIndex, 1);
    }

    setChecked(newChecked);
    setCheckedType(newCheckedType);
    props.handleFilters(newCheckedType);
    //update this checked information into Parent Component
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)}
          type="checkbox"
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        />
        &nbsp;&nbsp;
        <span>{value.type}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Types" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
