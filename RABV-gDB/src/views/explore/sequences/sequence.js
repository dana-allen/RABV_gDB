import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

// Hooks and Contexts
import { useDownload, useSequence } from 'hooks';
import { useLoadingWheelHandler, useErrorHandler  } from "contexts"

// Specific Components
import SampleDetails from './components/SampleDetails';
import SequenceDetails  from './components/SequenceDetails';
import InsertionDetails from './components/InsertionDetails';
import PubMedRefDetails from './components/PubMedRefDetails'

// Generic Components
import GenomeViewer from 'components/genomeViewer/GenomeViewer';

// Helpers
import { downloadPng } from "utils/downloadHelper";

// Importing stylesheets
import 'assets/styles/sequence.css';

const Sequence = () => {

    const { id } = useParams();
    const viewerRef = useRef(null);
    const { downloadFile } = useDownload();
    
    // Contexts
    const { triggerLoadingWheel } = useLoadingWheelHandler();
    const { triggerError } = useErrorHandler();


    // Hooks
    const { meta_data, 
            sequence,
            alignment,  
            insertions,
            formatted_regions,
            taxanomic_info,
            loading, error } = useSequence(id);

    useEffect(() => {
    
        triggerLoadingWheel(loading)
        if (error) triggerError(error);
    
    }, [loading, error]);
    console.log("alignment", alignment)

    const pubmedId = meta_data?.pubmed_id;

    return (
        <div className='container'>

        
            <div className="row col-md-6">
                <h2> Sequence {id} </h2>
            </div>

            { meta_data && 
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <SequenceDetails meta_data={meta_data} 
                                            alignment={alignment ? alignment : null} />
                                <div style={{'textAlign':'right'}}>
                                    <Button size='sm' 
                                            className='btn-main-filled' 
                                            onClick={() => downloadFile('>'+id+'\n'+sequence.toUpperCase(), id+".fasta", "fasta")}>
                                        Download Sequence
                                    </Button>
                                </div> 
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div>
                                    <SampleDetails meta_data={meta_data} regions={formatted_regions} taxanomic_info={taxanomic_info}/>
                                </div> 
                                
                                <br></br>
                                <br></br>
                                
                            </div> 
                        <div>
                            
                        </div>
                        </div>
                    </div>
                    <div className='row'>
                        

                    </div>
                    <br></br>
    

                    { meta_data.exclusion_status === 0 && alignment &&
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className='title-sub'>Alignment</h4>
                            </div>
                            <div className="col-md-6 text-end">
                                <Button size='sm' className='btn-main-filled' onClick={() => downloadFile('>'+id+'\n'+alignment["query_alignment_sequence"], id+"_aligned.fasta", "fasta")}>
                                    Download Alignment
                                </Button>
                                <Button size='sm' className='btn-main-filled ms-2' onClick={() => downloadPng(viewerRef, id)}>
                                    Download PNG
                                </Button>
                            </div>
                            
                            {alignment && 

                                <div ref={viewerRef}>
                                    <GenomeViewer data={alignment}/>
                                </div>
                             
                            }
                        </div>
                    }
                    <br></br>

                    { insertions &&
                        <InsertionDetails insertions={insertions} />
                    }

                    { pubmedId && 
                        <PubMedRefDetails pubmedId={pubmedId} />
                    }
                </div>
            }

            <br></br>

        </div>
    );
};
 
export default Sequence;