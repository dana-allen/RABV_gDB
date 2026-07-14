
import {useState} from 'react'
import { DialogContent, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import "assets/styles/protein_sequence.css";

import { aaColors, nucColors } from 'assets/javascript/sequenceViewerHelper';
import GeneTree from './GeneTree';
import GeneSelector from './GeneSelector'

export default function ProteinSequence({reference_protein, residueClick, regionClick}) {

    // const mutatedResidues = [...new Set(mutations.map(m => Number(m.position)))];
    console.log(reference_protein)
    const BLOCK_SIZE = 10;
    const BLOCKS_PER_ROW = 8; // 80 AAs per row
    const AAS_PER_ROW = BLOCK_SIZE * BLOCKS_PER_ROW;

    const blocks = reference_protein.match(/.{1,10}/g) || [];

    const rows = [];
    for (let i = 0; i < blocks.length; i += BLOCKS_PER_ROW) {
        rows.push(blocks.slice(i, i + BLOCKS_PER_ROW));
    }

    const handleRegionSelection = (region) => {
        regionClick(region)
    }
    // const mutatedSet = new Set(mutatedResidues);


    const onResidueClick = (position) => {

        residueClick(position)
    };

    return (
        <div>
            <ul style={{fontSize:"12px"}}>
                <li>Click on residue to visualise an interactive chart of the frequencies of amino acids aligned at that position across the selected host dataset sequences.</li>
                <li>All sequences are mapped to their closest reference sequence </li>
                {/* <Link className='custom-link' to={`/sequence/${selectedSegement}`}>NC_007800</Link>. */}
            </ul>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div>
            </div>
            <Button size="sm">Download PNG</Button>
            </div>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {/* <GeneTree onRegionSelect={handleRegionSelection} ></GeneTree> */}
                <GeneSelector onRegionSelect={handleRegionSelection} ></GeneSelector>
                <div className="protein-sequence">
                    
                    {rows.map((row, rowIndex) => {
                        const rowStart = rowIndex * AAS_PER_ROW + 1;
                        const rowEnd = Math.min(
                        rowStart + row.length * BLOCK_SIZE - 1,
                        reference_protein.length
                        );

                        return (
                            <div key={rowIndex} className="aa-row">
                                {/* Left label */}
                                <div className="position-label left">{rowStart}</div>

                                {/* Sequence */}
                                <div className="aa-row-content">
                                    {row.map((block, blockIndex) => (
                                        <div key={blockIndex} className="aa-block">
                                        {block.split("").map((aa, aaIndex) => {
                                            const globalPos =
                                            rowIndex * AAS_PER_ROW +
                                            blockIndex * BLOCK_SIZE +
                                            aaIndex +
                                            1;


                                        

                                            const residueSpan = (
                                                <span
                                                    key={aaIndex}
                                                    className={`aa-box aa-mutated clickable`}
                                                    onClick={() => onResidueClick(globalPos, aa) }
                                                >
                                                {aa}
                                                </span>
                                            );

                                            return  (
                                                <Tooltip
                                                    key={aaIndex}
                                                    title={
                                                        <div style={{ fontSize: 12 }}>
                                                        <strong>Position {globalPos}</strong>
                                                        </div>
                                                    }
                                                    arrow
                                                    placement="top"
                                                > {residueSpan}
                                                </Tooltip>
                                            ) 
                                        })}
                                        </div>
                                    ))}
                                </div>

                                {/* Right label */}
                                <div className="position-label right">{rowEnd}</div>
                            </div>
                        );
                    })}
                </div>

                 
                
            </div>
        </div>
    );
}