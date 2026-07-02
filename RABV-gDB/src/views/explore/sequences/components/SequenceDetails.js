import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink} from '@fortawesome/free-solid-svg-icons'

// helpers
import { formatGenomeCoverage } from 'assets/javascript/formatHelper'

// Stylesheets
import 'assets/styles/sequence.css'
import 'assets/styles/tables.css'

const SequenceDetails = ({ meta_data, alignment }) => {
    
    return (
        <div>
            <h4 className="title-sub">Sequence Details</h4>	
            <table className="table table-striped table-bordered table-font-12">
                <tbody key={`tbody-sequence-details`}>
                    <tr>
                        <td><b>NCBI Primary Accession</b></td>
                        <td>
                            <Link className='custom-link' 
                                    to={`https://www.ncbi.nlm.nih.gov/nuccore/${meta_data.primary_accession}`} 
                                    target="_blank">
                                <FontAwesomeIcon icon={faLink} /> {meta_data.primary_accession}
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Clade</b></td>
                        <td>{meta_data["EPA_major_clade"] ? meta_data["EPA_major_clade"] : "" }  {meta_data["EPA_minor_clade"] ? meta_data["EPA_minor_clade"] : ""}</td>
                    </tr>
                    {meta_data["serotype"] &&
                        <tr>				
                            <td><b>Serotype</b></td>
                            <td>{meta_data["serotype"] ? meta_data["serotype"] : "-"}</td>
                        </tr>
                    }
                    {meta_data["segment"] && 
                        <tr>
                            <td><b>Segment</b></td>
                            <td>{meta_data["segment"] ? meta_data["segment"] : '-'}</td>
                        </tr> 
                    }
                    <tr>
                        <td><b>NCBI Entry Creation Date</b></td>
                        <td>{meta_data.create_date}</td>
                    </tr>
                    <tr>
                        <td><b>NCBI Last Update Date</b></td>
                        <td>{meta_data.update_date}</td>
                    </tr>
                    
                    <tr>
                        <td><b>Sequence Length</b></td>
                        <td>{meta_data["real_length"] ? meta_data["real_length"] : '-'}</td>
                    </tr>
                    <tr>
                        <td><b>Strand</b></td>
                        <td>{meta_data["strandedness"] ? meta_data["strandedness"] : "-"}</td>
                    </tr>
                    <tr>
                        <td><b>Topology</b></td>
                        <td>{meta_data["topology"] ? meta_data["topology"] : "-"}</td>
                    </tr>
                    <tr>
                        <td><b>Type</b></td>
                        <td>{meta_data["mol_type"] ? meta_data["mol_type"] : "-"}</td>
                    </tr>
                    {/* THIS WILL HAVE TO CHANGE BACK TO AN INTEGER AFTERWARDS */}
                    {meta_data["exclusion_status"] === "1" &&
                        <tr>
                            <td><b>Exclusion Criteria</b>
                            </td>
                            <td className='exclusion-td'>{meta_data["exclusion_criteria"]}</td>
                        </tr>
                    }
                    
                    {alignment &&
                        <tr>
                            <td><b>Coverage of Genome Region</b><br/>based on homology with<br/><Link className='custom-link' to={`/reference/${alignment.reference_accession}`}>{alignment.reference_accession}</Link></td>
                            <td><div>
                                {alignment.features.map((feature, featureIndex) => {
                                    console.log("start ", feature.cds_start, "end", feature.cds_end)
                                    let coverage = formatGenomeCoverage(alignment.query_alignment_sequence, feature.cds_start, feature.cds_end)
                                    return (
                                        <div key={`coverage-details-${featureIndex}`}>
                                            { coverage > 0 && 
                                                <a className='capitalize-text coverage'>{feature.product}: {coverage}%<br/></a>
                                            }
                                        </div>
                                    )
                                })}
                            </div></td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
};

export default SequenceDetails;