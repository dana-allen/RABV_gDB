// Helpers
import { nucColors } from 'assets/javascript/sequenceViewerHelper';

// Stylesheets
import 'assets/styles/tables.css'

const InsertionDetails = ({ insertions }) => {

    
    return (
        <div className='row'>
            <div className="col-md-6">
                <h4 className='title-sub'>Insertions</h4>
            </div>
            <div>
                {[insertions].map((insertion, insertionIndex) => {
                    const row = insertion ? insertion.split(";") : null
                    return (
                        <>
                            {row &&
                                <table 
                                    key={`table-${insertionIndex}`}
                                    className="table table-striped table-bordered table-font-12 table-width-50" 
                                >
                                    <thead>
                                        <tr>
                                            <th>Nucleotide Position</th>
                                            <th>Insertions</th>
                                        </tr>
                                    </thead>
                                    {row.map((item, rowIndex) => {
                                        const k = item.split(":")
                                        return (
                                            <tbody key={`tbody-${rowIndex}`}>
                                                <tr>
                                                    <td><p>{k[0]}</p></td>
                                                    <td>
                                                        <div className='blocks'>
                                                            {k[1].split("").map((nuc, nucId) => (
                                                                <div className='block'
                                                                    key={nucId}
                                                                    style={{
                                                                        backgroundColor: nucColors[nuc],
                                                                        width:'15px'
                                                                    }}
                                                                ><b>{nuc}</b></div>
                                                            ))}
                                                        </div>

                                                    </td>
                                                    
                                                </tr>
                                            </tbody>
                                        )
                                    })}
                                </table>
                            }
                        </>
                    )
                })}
            </div>
        </div>
    );
};

export default InsertionDetails;