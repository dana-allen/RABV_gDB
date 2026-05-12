import { useState, useRef, useEffect } from "react";
import SearchAutocomplete from "./SearchAutocomplete";
import { Button } from 'react-bootstrap';

import 'assets/styles/filters.css';

export default function AccessionDropdown({label, id, url, handleParams, reset}) {

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
    value.length > 0 ? setSelectedValue(value.length) : setSelectedValue(false)
    setPreselected(value)
    handleParams(value, exclude) 

  };
  
  
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
            <SearchAutocomplete
                ref={autocompleteRef}
                url={url}
                idKey={id}
                handleId={handleIds}
                label={label}
                preSelected={preSelected}
            />

            <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginTop:"2px" }}>
            <input
              type="checkbox"
              checked={exclude}
              onChange={(e) => handleExclude(e.target.checked)}
            />
            Exclude selected accessions
          </label>
          </div>
        </div>
      )}
    </div>
  );
}