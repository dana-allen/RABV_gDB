import { useState, useRef, useEffect } from "react";
import SearchAutocomplete from "./SearchAutocomplete";
import { Button } from 'react-bootstrap';
import { Box, TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import 'assets/styles/filters.css';

export default function RadioButtonDropdown({label, reset, onChange}) {

    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const autocompleteRef = useRef(null);


    useEffect(() => {
      function handleClickOutside(event) {
        const inDropdown = containerRef.current?.contains(event.target);
        const inAutocomplete = autocompleteRef.current?.contains(event.target);

        // detect MUI select portal
        const inMuiMenu = event.target.closest(".MuiMenu-paper");

        if (!inDropdown && !inAutocomplete && !inMuiMenu) {
          setOpen(false);
        }
      }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      setMode(false)

    }, [reset])

    const [mode, setMode] = useState("");


  const handleModeChange = (e) => {
    const value = e.target.value;
    setMode(value);
    // Inform parent
    onChange(value) && onChange({});
  };

  
  return (
    <div ref={containerRef} className='filter-box'>

        <Button
            size="sm"
            className={`${mode == '1' ? "btn-filter-active" : "btn-filter"}`}
            onClick={() => setOpen((prev) => !prev)}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
            {label}

            {mode == '1' && (
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
                {1}
                </span>
            )}
        </Button>


      {open && (
        
        <div className='dropdown-box'>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontWeight: "bold", fontSize: "12px" }}>Find Excluded Sequences</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize:'12px' }}>
                  <input
                    className='filter-radio'
                    type="radio"
                    name="lengthMode"
                    value="1"
                    checked={mode === "1"}
                    onChange={handleModeChange}
                  />
                  Yes
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize:'12px' }}>
                  <input
                    className='filter-radio'
                    type="radio"
                    name="lengthMode"
                    value="0"
                    checked={mode === "0"}
                    onChange={handleModeChange}
                  />
                  No
                </label>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}