import { useState, useRef, useEffect } from "react";
import { Button } from 'react-bootstrap';
import RegionFilter from "../RegionFilter";
import 'assets/styles/filters.css';
import { Box, TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
export default function GenomeCoverageDropdown({label, handleParams, reset, alwaysOpen=false}) {

    const [open, setOpen] = useState(alwaysOpen);
    const [exclude, setExclude] = useState(false)
    const containerRef = useRef(null);
    const autocompleteRef = useRef(null);

    const [selectedValue, setSelectedValue ] = useState()

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

    const [regionSelections, setRegionSelections] = useState({})
    const [selected, setSelected] = useState(null)

    const regionTree = [
                          // {name:'full_genome', display_name: 'full genome', nodes:null, parent:null, text:'Full genome', label:'display_name'},
                          {name:'nucleoprotein', display_name: 'Nucleoprotein', nodes:null, parent:null, text:'nucleoprotein N', label:'display_name'},
                          {name:'phosphoprotein', display_name: 'Phosphoprotein', nodes:null, parent:null, text:'phosphoprotein M1', label:'display_name'},
                          {name:'m2_protein', display_name: "M2 protein", nodes:null, parent:null, text:'M2 protein', label:'display_name'},
                          {name:'glycoprotein', display_name: "Glycoprotein", nodes:null, parent:null, text:'transmembrane glycoprotein G', label:'display_name'},
                          {name:'l_protein', display_name: "L protein", nodes:null, parent:null, text:'L protein', label:'display_name'}
                        ]

  const handleChange = (name) => {

    const alreadySelected = selected === name

    setSelected(alreadySelected ? null : name)

    if (alreadySelected) {
      setRegionSelections({})
    } else {
      setRegionSelections({})
    }
  }

    const clearInputs = () => {
      setRegionSelections({})
      setSelected([])
      setSelectedValue(false)
      setExclude(false)
    };

    const handleInputChange = (type, value) => {

      setRegionSelections(prev => {
          if (!value || value === 0) {
              const copy = { ...prev }
              delete copy[type]
              return copy
          }
          return {
              ...prev,
              [type]: value
          }
      })   
    };

    useEffect(() => {
      setSelectedValue(
        Object.keys(regionSelections).length > 0 ? 1 : false
      )
      handleParams(regionSelections, exclude)
    }, [regionSelections, exclude])

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
        <div
          style={{
            position: "absolute",
            top: "100%",
            marginTop: "6px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "12px",
            width: "260px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 2,
          }}
        >
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


          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Find {label}
            </label>
            {regionTree.map(node => (
              <div key={node.name} style={{ marginBottom: '5px' }}>
                  <label
                      style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      }}
                  >
                    <input
                        type="radio"
                        name="coverage-region"
                        checked={selected === node.name}
                        onChange={() => handleChange(node.name)}
                        style={{
                          appearance: "none",
                          width: "16px",
                          height: "16px",
                          border: "1px solid #767676",
                          borderRadius: "50%",
                          backgroundColor: selected === node.name
                              ? "var(--primary)"
                              : "white",
                          cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize:"12px" }}>{node.text}</span>
                  </label>

                  {selected === node.name && (
                    <div style={{padding: '5px 0px 0px 20px'}}>
                      <TextField
                        placeholder={`Enter minimum coverage (%)`}
                        size="small"
                        // value={max}
                        onChange={(e) => handleInputChange(node.name, e.target.value)}
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
            ))}
          </div>
          {/* <hr className='exclude-hr'/>
          <div style={{ marginBottom: "10px" }}>
            <label className='exclude-label'>
              <input
                className='exclude-checkbox'
                type="checkbox"
                checked={exclude}
                onChange={(e) => setExclude(e.target.checked)}
              />
              Exclude selected coverage
            </label>            
          </div> */}
        </div>
      )}
    </div>
  );
}