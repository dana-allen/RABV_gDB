import { useState, useRef, useEffect } from "react";

import { Button } from 'react-bootstrap';

import Checkboxes from "./Checkboxes";
import 'assets/styles/filters.css';

import FilterWrapper from "./FilterWrapper";
import { useLineage } from "hooks";

export default function CladeCheckboxes({label, id, url, handleParams, reset}) {

  const { lineageTree = [], loading, error } = useLineage();

  const [exclude, setExclude] = useState(false);
  const [selectedValue, setSelectedValue ] = useState()
  const [preSelected, setPreselected] = useState()

  const handleExclude = (value) => { setExclude(value) }

  const handleIds = (value) => {
    
    const totalCount = value.reduce((total, item) => { return total + 1 + item.children.length;}, 0);
    
    totalCount > 0 ? setSelectedValue(totalCount) : setSelectedValue(false);

    setPreselected(value);
    handleParams(value, exclude);

  };

  useEffect(() => {
    handleParams(preSelected || [], exclude);
  }, [preSelected, exclude]);

    

  useEffect(() => {
    setPreselected()
    setExclude(false)
    setSelectedValue(false)
  }, [reset])

  return (
    <FilterWrapper
      label={label}
      selectedCount={selectedValue}
      reset={reset}
    >
      <Checkboxes
        data={lineageTree}
        onCheckboxChange={handleIds}
        preSelected={preSelected}
      />

      <hr className="exclude-hr" />

      <label className="exclude-label">
        <input
          className="exclude-checkbox"
          type="checkbox"
          checked={exclude}
          onChange={e => handleExclude(e.target.checked)}
        />
        Exclude selected accessions
      </label>

    </FilterWrapper>
  );
}