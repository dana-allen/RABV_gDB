import { useState, useRef, useEffect } from "react";
import { Button } from 'react-bootstrap';
import RegionFilter from "../RegionFilter";
import 'assets/styles/filters.css';

export default function RegionDropdown({label, handleParams, reset}) {

    const [open, setOpen] = useState(false);
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

    const [taxonomySelections, setTaxonomySelections] = useState({})
    const [selected, setSelected] = useState([])

    const regionTree = [
                            {name:'m49_region_id', nodes:null, parent:null, text:'Global Region'},
                            {name:'m49_intermediate_region', nodes:null, parent:null, text:'Intermediate Region'},
                            {name:'m49_sub_region_id', nodes:null, parent:null, text:'Sub Region'},
                            {name:'country', nodes:null, parent:null, text:'Country'}
    ]


    const handleChange = (name) => {

      const wasSelected = selected.includes(name)

      setSelected(prev =>
        wasSelected
            ? prev.filter(item => item !== name)
            : [...prev, name]                      
      )

      if (wasSelected) {
        setTaxonomySelections(prev => {
            const copy = { ...prev }
            delete copy[name]
            return copy
        })
      }

    }

    const handleNodeIds = (nodeName) => (ids) => {
      setTaxonomySelections(prev => {
          if (!ids || ids.length === 0) {
              const copy = { ...prev }
              delete copy[nodeName]
              return copy
          }
          return {
              ...prev,
              [nodeName]: ids
          }
      })   
    }

    const clearInputs = () => {
      setTaxonomySelections({})
      setSelected([])
      setSelectedValue(false)
      setExclude(false)
    };



    useEffect(() => {
      Object.keys(taxonomySelections).length > 0 ? setSelectedValue(Object.keys(taxonomySelections).length) : setSelectedValue(false)
      handleParams(taxonomySelections, exclude)
    }, [taxonomySelections, exclude]);

    useEffect(() => {
      clearInputs()

    }, [reset])

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
    >

        <Button
            size="sm"
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
            // border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "12px",
            width: "260px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 2,
          }}
        >
          {/* <button
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
          </button> */}

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
                        type="checkbox"
                        checked={selected.includes(node.name)}
                        onChange={() => handleChange(node.name)}
                        style={{
                            appearance: "none",
                            width: "16px",
                            height: "16px",
                            border: "1px solid #767676",
                            borderRadius: "3px",
                            backgroundColor: selected.includes(node.name)
                              ? "var(--primary)"
                              : "white",
                            cursor: "pointer",
                        }}
                    />
                    <span style={{ fontSize:"12px" }}>{node.text}</span>
                  </label>

                  {selected.includes(node.name) && (
                    <div style={{padding: '5px 0px 0px 20px'}}>
                        <RegionFilter ref={autocompleteRef}
                                        label={node.name} 
                                        region_level={node.name} 
                                        idKey={node.name} 
                                        params={taxonomySelections} 
                                        handleId={handleNodeIds(node.name)} 
                        />
                    </div>
                  )}

              </div>
            ))}
          </div>
          <hr style={{margin:'5px'}}></hr>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginTop:"2px" }}>
              <input
                type="checkbox"
                checked={exclude}
                onChange={(e) => setExclude(e.target.checked)}
              />
              Exclude selected accessions
            </label>            
          </div>
        </div>
      )}
    </div>
  );
}