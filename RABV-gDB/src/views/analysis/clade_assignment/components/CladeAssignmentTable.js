import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faDownload } from '@fortawesome/free-solid-svg-icons'

import 'assets/styles/tables.css'

import { useDownload } from 'hooks';

import { formatGenomeCoverage } from 'assets/javascript/formatHelper';

const CladeAssignmentTable = ( { tableRows=null, onGenomeClick } ) => {
    
    const { downloadFile } = useDownload();

    const featuresList = ['nucleoprotein N', 'phosphoprotein M1', 'M2 protein', 'transmembrane glycoprotein G', 'L protein']

    return (
        <div>

            <table className="table table-striped table-bordered table-font-12 ">
                <thead >
                    <tr>
                        <th colSpan={4}></th>
                        <th colSpan={5}>Coding Region Coverage</th>
                        <th colSpan={2}>Alignment</th>
                    </tr>

                    <tr>
                        <th rowSpan={2}>Query Accession</th>
                        <th>Closest Reference Sequence (Identity %)</th>
                        <th>
                            Major Clade (LWR*)
                            <div className="th-subtext">
                                *likelihood weight assigned to this exact taxonomic path
                            </div>
                        </th>
                        <th>
                            Minor Clade (LWR*)
                            <div className="th-subtext">
                                *likelihood weight assigned to this exact taxonomic path
                            </div>
                        </th>
                        
                        <th>N</th>
                        <th>P</th>
                        <th>M</th>
                        <th>G</th>
                        <th>L</th>
                        <th>View</th>
                        <th>Download</th>
                    </tr>
                    
                </thead>
                <tbody>
                    
                    {tableRows.map((row, i) => (
                        <tr key={row.accession}>
                            <td>{row.accession}</td>
                            <td><Link className='gdb-link' to={`/reference/${row.blast_ref}` }>{row.blast_ref}</Link> ({row.blast_identity} %)</td>
                            <td>{row.epa_ng.major} ({row.epa_ng.major_lwr})</td>
                            <td>{row.epa_ng.minor} ({row.epa_ng.minor_lwr})</td>

                            {featuresList.map((product) => {
                                const feature = row.features.find(r => r.product == product);

                                return (
                                    <td key={product}>
                                        {feature ? 
                                            `${Math.round(formatGenomeCoverage(
                                                row.alignment,
                                                feature.cds_start,
                                                feature.cds_end
                                            ))}%`
                                            : "-"}
                                    </td>
                                    );
                                })}
                           
                            <td><Button size='sm' className='btn-main-outline' onClick={() => onGenomeClick(row.accession)}><FontAwesomeIcon icon={faEye} /></Button></td>
                            <td>
                                {row.alignment ? 
                                <Button 
                                    size='sm' 
                                    className='btn-main-filled' 
                                    onClick={() => downloadFile('>'+row.accession+'\n'+row.alignment, row.accession+"_aligned.fasta", "fasta")}
                                >
                                <FontAwesomeIcon icon={faDownload} />
                                </Button> : "N/A"
                                }
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CladeAssignmentTable;
