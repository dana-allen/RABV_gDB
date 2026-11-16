import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink} from '@fortawesome/free-solid-svg-icons'

// Stylesheets
import 'assets/styles/tables.css'


const SequencesTable = ( { data=null, type=null } ) => {

    if (!Array.isArray(data) || data.length === 0) {
        return <div>No data found...</div>; // or a loader / empty state
    }

    return (
        <table className="table table-striped table-bordered table-font-12">
            <thead >
                <tr>
                    <th>NCBI Primary Accession</th>
                    <th>{process.env.REACT_APP_VIRUS_LEVEL}</th>
                    <th>MADDOG</th>
                    <th>NCBI Entry Creation Date</th>
                    <th>NCBI Last Update Date</th>
                    <th>Sequence Length</th>
                    <th>Isolate ID</th>
                    <th>Country of Origin</th>
                    <th>Host Species</th>
                    <th>Collection Year</th>
                    <th>Reference</th>
                </tr>
            </thead>
            <tbody>
                
                {data.map((sequence, i) => (
                    <tr key={i} id={i}>

                        <td><b><Link className='gdb-link' to={type=='sequence' ? `/sequence/${sequence.primary_accession}`:`/reference/${sequence.primary_accession}` }> {sequence.primary_accession} </Link> </b></td>
                        <td>{sequence["EPA_major_clade"]} {sequence["EPA_minor_clade"]}</td>
                        <td>{sequence.maddog_lineage}</td>
                        <td>{sequence.create_date}</td>
                        <td>{sequence.update_date}</td>
                        <td>{sequence.real_length}</td>
                        <td>{sequence.isolate ? `${sequence.isolate}`:"-"}</td>
                        <td>{sequence.country ? `${sequence.country}` :"-"}</td>
                        <td><em>{sequence.host ? `${sequence.host}`:"-"}</em></td>
                        <td>{sequence.collection_year}</td>
                        <td >
                            { sequence.pubmed_id ? <Link className='gdb-link' to={`https://www.ncbi.nlm.nih.gov/pubmed/${sequence.pubmed_id}`} target="_blank"> <FontAwesomeIcon icon={faLink} /> PubMed {sequence.pubmed_id} </Link>:"-" }
                        </td>
                        
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SequencesTable;
