import { useState, useRef, useEffect } from "react";
import SearchAutocomplete from "./SearchAutocomplete";
import { Button } from 'react-bootstrap';
import { Box, TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import 'assets/styles/filters.css';

export default function InputDropdown({label, id, options, handleParams, reset, onChange}) {

    const [open, setOpen] = useState(false);
    const [exclude, setExclude] = useState(false);
    const containerRef = useRef(null);
    const autocompleteRef = useRef(null);

    const [selectedValue, setSelectedValue ] = useState()
    const [preSelected, setPreselected] = useState()

    
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
    setPreselected()
    setSelectedValue(false)

  }, [reset])

  const [mode, setMode] = useState(""); // 'gt', 'lt', 'between'
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const handleModeChange = (e) => {
    const value = e.target.value;
    setMode(value);

    // Reset values when mode changes
    setMin("");
    setMax("");

    // Inform parent
    onChange && onChange({});
  };

  const handleInputChange = (type, value) => {
    let newMin = min;
    let newMax = max;

    if (type === "min") {
      newMin = value;
      setMin(value);
    }

    if (type === "max") {
      newMax = value;
      setMax(value);
    }

    let filter = {};

    if (mode === "gt" && newMin) { filter = { min: Number(newMin) }; }

    if (mode === "lt" && newMax) { filter = { max: Number(newMax) }; }

    if (mode === "between" && newMin && newMax) {
      filter = { min: Number(newMin), max: Number(newMax) };
    }
    if (newMin && newMax) {
     setSelectedValue(2) 
    } else if (newMin || newMax){
      setSelectedValue(1)
    } else {
      setSelectedValue(false)
    }

    onChange && onChange(filter);
  };

  const clearInputs = () => {
    setMode("");
    setMin("");
    setMax("");
    setSelectedValue(false);
    setExclude(false);

    onChange && onChange({});
  };

  useEffect(() => {
      clearInputs()

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
          <button
            onClick={clearInputs}
            style={{
              position: "absolute",
              top: "6px",
              right: "8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#888"
            }}
          >
            ×
          </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontWeight: "bold", fontSize: "12px" }}>Find {label}</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize:'12px' }}>
                  <input
                    className='filter-radio'
                    type="radio"
                    name="lengthMode"
                    value="gt"
                    checked={mode === "gt"}
                    onChange={handleModeChange}
                  />
                  {options[0]}
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize:'12px' }}>
                  <input
                    className='filter-radio'
                    type="radio"
                    name="lengthMode"
                    value="lt"
                    checked={mode === "lt"}
                    onChange={handleModeChange}
                  />
                  {options[1]} 
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize:'12px'}}>
                  <input
                    className='filter-radio'
                    type="radio"
                    name="lengthMode"
                    value="between"
                    checked={mode === "between"}
                    onChange={handleModeChange}
                  />
                  {options[2]}
                </label>
              </div>

              {(mode === "gt" || mode === "lt") && (
                            <TextField
                placeholder={`Enter length`}
                value={mode === "gt" ? min : max}
                size="small"
                sx={{
                    width: 220,
                    "& .MuiOutlinedInput-root": {
                      minHeight: 25,
                      fontSize: "0.75rem",
                    },
                    "& .MuiAutocomplete-tag": {
                      height: 20,
                      fontSize: "0.75rem",
                    },
                  }}
                onChange={(e) =>
                handleInputChange(mode === "gt" ? "min" : "max", e.target.value)
                }
                InputProps={{

                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    </>
                  ),
                  endAdornment: (
                    <>
                      
                    </>
                  ),
                }}
              />
              )}

              {mode === "between" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <TextField
                placeholder={`Enter lower length`}
                size="small"
                value={max}
                onChange={(e) => handleInputChange("max", e.target.value)}
                sx={{
                  width: 220,
                  "& .MuiOutlinedInput-root": {
                    minHeight: 25,
                    fontSize: "0.75rem",
                  },
                  "& .MuiAutocomplete-tag": {
                    height: 20,
                    fontSize: "0.75rem",
                  },
                }}
                InputProps={{

                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    </>
                  ),
                  endAdornment: (
                    <>
                      
                    </>
                  ),
                }}
              />
                            <TextField
                placeholder={`Enter upper length`}
                size="small"
                value={min}
                onChange={(e) => handleInputChange("min", e.target.value)}
                sx={{
                  width: 220,
                  "& .MuiOutlinedInput-root": {
                    minHeight: 25,
                    fontSize: "0.75rem",
                  },
                  "& .MuiAutocomplete-tag": {
                    height: 20,
                    fontSize: "0.75rem",
                  },
                }}
                InputProps={{

                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    </>
                  ),
                  endAdornment: (
                    <>
                      
                    </>
                  ),
                }}
              />
                </div>
              )}
            </div>
          
        </div>
      )}
    </div>
  );
}