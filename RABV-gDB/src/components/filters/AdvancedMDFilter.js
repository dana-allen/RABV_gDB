import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

import Tooltip from "@mui/material/Tooltip";
import 'assets/styles/filters.css'
import { metaDataTableRows } from "utils/metaDataHelper";

const AdvancedMDFilter = ({show, onClose, onApplyFilter}) => {


    const [filters, setFilters] = useState({})
    const [advancedDownload, setAdvancedDownload] = useState(false)
    const [basic, setBasic] = useState(true)
    const [advanced, setAdvanced] = useState(false)
    const [selectedColumns, setSelectedColumns] = useState({});

    const closeFilter = () => { onClose(false) }

    const resetFilter = () => { 
        setFilters({});
        setAdvanced(false)
        setBasic(true)
    }
    
    const handleColumnToggle = (key) => {
        setSelectedColumns((prev) => {
            const updated = { ...prev };

            if (updated[key]) {
            delete updated[key];
            } else {
            updated[key] = true;
            }

            return updated;
        });
    };

    const updateFilters = () => {
        const metadata_columns = Object.keys(selectedColumns);

        const updatedFilters = {};

        // only add if something selected
        if (metadata_columns.length > 0) {
            updatedFilters.metadata_columns = metadata_columns;
        }

        onApplyFilter(updatedFilters);
        onClose(false);
    };

    const toggleAdvanced = () => {
        setBasic(prev => !prev)
        setAdvanced(prev => !prev)
        setAdvancedDownload(prev => !prev)
    }

    const toggleBasic = () => {
        setBasic(true)
        setAdvanced(false)
        setAdvancedDownload(false)
        setFilters({})
        setSelectedColumns({})
    }
    
    return (
        <Modal show={show} size="lg" >
            <Modal.Header>
                <Modal.Title>Download Meta-data</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <p className='info-text'>
                    This will download the meta-data for the selected sequences. If you have applied filtering to 
                    the sequences, those filters will be applied when downloading the meta-data.  
                </p>
                <hr></hr>
                <div>
                    <label
                        key="basic"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer"
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={basic}
                            onChange={toggleBasic}
                            className="accent-color-primary w-4 h-4"
                        />

                        <span>Basic Download:</span>
                    </label>
                    
                    <p className='info-text'>
                        Download full meta-data for all selected sequences. View the 
                        <Link className='custom-link' target="_blank" to='/meta_data'> full list of meta-data available.</Link>
                    </p>

                    <div
                        key="advanced"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={advanced}
                            onChange={toggleAdvanced}
                            className="accent-color-primary w-4 h-4"
                        />

                        <span
                            onClick={toggleAdvanced}
                            style={{ cursor: "pointer" }}
                        >
                            Advanced Download:
                        </span>

                        <Button
                            type="button"
                            className="btn-secondary-outline download-btn"
                            size="sm"
                            onClick={toggleAdvanced}
                        >

                        </Button>
                    </div>

                    <p className='info-text'>
                        Select specific columns to be included in meta-data download.
                        <br/>
                        Hover over each option to see more information about the meta-data.
                    </p>

                    {advancedDownload && (
                        <div
                            style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "10px 20px",
                            maxHeight: "300px",
                            overflowY: "auto",
                            padding: "10px 0",
                            }}
                        >
                            {metaDataTableRows.map((row) => (
                            <label key={row.key || row.label} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", cursor: "pointer", }} >
                                <input
                                type="checkbox"
                                checked={!!selectedColumns[row.label]}
                                onChange={() => handleColumnToggle(row.label)}
                                />

                                <Tooltip title={row.description} arrow>
                                <span style={{ fontWeight: 600 }}>
                                    {row.display_name}
                                </span>
                                </Tooltip>
                            </label>
                            ))}
                        </div>
                        )}
                </div>
                <br></br>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={resetFilter}>Reset</Button>
                <Button variant="secondary" onClick={closeFilter} >Cancel</Button>
                <Button className='btn-main' onClick={updateFilters}>Download</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdvancedMDFilter;
