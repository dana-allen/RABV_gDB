import { useState, useRef, useEffect } from "react";
import DropDownAutocomplete from "./DropDownAutocomplete";
import { Button } from 'react-bootstrap';

import Checkboxes from "./Checkboxes";
import 'assets/styles/filters.css';

export default function CladeCheckboxes({label, id, url, handleParams, reset}) {

  const [open, setOpen] = useState(false);
  const [exclude, setExclude] = useState(false);
  const containerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [selectedDropdown, setSelectedDropdown] = useState([])

  const [selectedValue, setSelectedValue ] = useState()
  const [preSelected, setPreselected] = useState()

  const handleExclude = (value) => {
    console.log("handle exclude", value)
    setExclude(value)
    // handleParams(preSelected, value) 
  }

  const handleIds = (value) => {
    value.length > 0
      ? setSelectedValue(selectedDropdown.length + 1)
      : setSelectedValue(false);

    setPreselected(value);
    console.log("EXclude", exclude)
    handleParams(value, exclude);

    setSelectedDropdown((prev) => [
      ...prev,
      value,
    ]);
  };

  useEffect(() => {
    handleParams(preSelected || [], exclude);
  }, [preSelected, exclude]);

    
  useEffect(() => {
      function handleClickOutside(event) {
          const inDropdown = containerRef.current?.contains(event.target);
          const inAutocomplete = autocompleteRef.current?.contains(event.target);

          if (!inDropdown && !inAutocomplete) {
          setOpen(false);
          }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPreselected()
    setExclude(false)
    setSelectedValue(false)
    setSelectedDropdown([])
  }, [reset])

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
    >

      <Button
          size="sm"
          // className={"btn-filter-active"}
          className={`${selectedValue ? "btn-filter-active" : "btn-filter"}`}
          onClick={() => setOpen((prev) => !prev)}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
          {label}

          {selectedValue && (
              <span
              style={{
                  background: "var(--primary)",
                  color: "black",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  minWidth: "18px",
                  textAlign: "center",
                  border: "1px solid var(--primary)"
              }}
              >
              {selectedValue}
              </span>
          )}
      </Button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            marginTop: "6px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "12px",
            width: "240px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 2,
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Find {label}
            </label>
            <Checkboxes onCheckboxChange={(data) => {
              console.log(data)
                // handleParams(data, exclude);
                handleIds(data)
              }}
                // ref={autocompleteRef}
                // url={url}
                // idKey={id}
                // params={[]}
                // handleId={handleIds}
                // label={label}
                // preSelected={preSelected}
            />

            <hr style={{margin:'5px'}}></hr>

            <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginTop:"2px" }}>
              <input
                type="checkbox"
                checked={exclude}
                onChange={(e) => handleExclude(e.target.checked)}
                style={{
                  appearance: "none",
                  width: "16px",
                  height: "16px",
                  border: "1px solid #767676",
                  borderRadius: "3px",
                  backgroundColor: exclude
                    ? "var(--primary)"
                    : "white",
                  cursor: "pointer",
                }}
              />
              Exclude selected accessions
            </label>
          </div>
        </div>
      )}
    </div>
  );
}