import { useState, useRef, useEffect } from "react";
import DropDownAutocomplete from "./DropDownAutocomplete";
import { Button } from 'react-bootstrap';

import 'assets/styles/filters.css';

export default function Dropdown({label, id, url, handleParams, reset}) {

  const [open, setOpen] = useState(false);
  const [exclude, setExclude] = useState(false);
  const containerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [selectedValue, setSelectedValue ] = useState()
  const [preSelected, setPreselected] = useState()

  const handleExclude = (value) => {
    setExclude(value)
    handleParams(preSelected, value) 
  }

  const handleIds = (value) => {

    const totalCount = value.length > 0 ? value.split(',').length : 0
    totalCount > 0 ? setSelectedValue(totalCount) : setSelectedValue(false);

    setPreselected(value);
    handleParams(value, exclude);

  };

  useEffect(() => {
    function handleClickOutside(event) {
        const inDropdown = containerRef.current?.contains(event.target);
        const inAutocomplete = autocompleteRef.current?.contains(event.target);

        if (!inDropdown && !inAutocomplete) { setOpen(false); }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPreselected()
    setExclude(false)
    setSelectedValue(false)
  }, [reset])

  return (
    <div ref={containerRef} className='filter-box'>

      <Button
        size="sm"
        className={`${selectedValue ? "btn-filter-active" : "btn-filter"}`}
        onClick={() => setOpen((prev) => !prev)}> 
        {label} {selectedValue && ( <span className='filter-count'> {selectedValue} </span> )}
      </Button>

      {open && (
        <div className='dropdown-box'>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Find {label}
            </label>
            <DropDownAutocomplete
              ref={autocompleteRef}
              url={url}
              idKey={id}
              params={preSelected}
              handleId={handleIds}
              label={label}
              preSelected={preSelected}
            />

            <label className='exclude-label'>
            <input
              className='exclude-checkbox'
              type="checkbox"
              checked={exclude}
              onChange={ (e) => handleExclude(e.target.checked) }
            />
            Exclude selected accessions
          </label>
          </div>
        </div>
      )}
    </div>
  );
}