import React, { useState, useRef } from 'react';
import { useDownload } from 'hooks'
import Taxonium from "taxonium-component";
import { Button } from 'react-bootstrap';
import CladeAssignmentTable from './components/CladeAssignmentTable';
import SequenceSubmission from './components/SequenceSubmission';
import GenomeViewer from 'components/genomeViewer/GenomeViewer';


const CladeAssignment = () => {

    const [sourceData, setSourceData] = useState(null);

    const [tableRows, setTableRows] = useState(null)
    const [alignment, setAlignment] = useState(null)
    const [genome, setGenome] = useState(null)
    const { downloadFile } = useDownload();

    const viewerRef = useRef(null);

    const handleJobFinished = (e) => {
        // 
        const data = e["results"]

        if (data) {

            const tmp_data = Object.entries(data["queries"]).map(([accession, genomeData]) => ({
                accession: accession,
                blast_ref: genomeData.blast_results?.ref ?? "",
                blast_identity: genomeData.blast_results?.identity ?? "",
                epa_ng: genomeData["epa-ng"] ? genomeData["epa-ng"] : "",
                alignment: genomeData.aligned_sequence? genomeData.aligned_sequence : "",
                features: genomeData.blast_results?.features
            }));

            const tmp_alignment = Object.entries(data["queries"]).map(([accession, genomeData]) => ({
                query_accession: accession,
                reference_accession: genomeData.blast_results?.ref ?? "",
                query_alignment_sequence: genomeData.aligned_sequence ?? "",
                reference_alignment_sequence: genomeData.blast_results?.reference_alignment,
                features: genomeData.blast_results?.features
            }));
            setAlignment(tmp_alignment)
            
            setTableRows(tmp_data)

            const tmp_tree = data["tree"]
            const csvHeader = "primary_accession,query\n";
            const csvBody = tmp_data.map(row => `${row.accession},query`).join("\n");

            const meta_data = csvHeader + csvBody;
            const metadata = {
              filename: "metadata.csv",
              data: meta_data,
              status: "loaded",
              filetype: "meta_csv",
            };
            setSourceData({
                    status: "loaded",
                    filename: "tree.nwk",
                    // data: tree,
                    data: tmp_tree,
                    filetype: "nwk",
                    metadata: metadata,
                    });
        }



    }

    const handleGenomeClick = (e) => {
        var selectedGenome
        if (genome != null && genome.query_accession == e){
            selectedGenome = null
        } else {
            selectedGenome = alignment.find(
                query => query.query_accession === e
            );
        }
        setGenome(selectedGenome)
    }

    return (
        <div className='container'>
            <div className='row'>
                <h2>Phylogenetic Clade Assignment</h2>

                <p>
                    Submit your sequence files in FASTA nucleotide format for automated
                    alignment and clade assignment against the {process.env.REACT_APP_VIRUS_ABB}-{process.env.REACT_APP_WEB_RESOURCE}&nbsp;
                    database.
                </p>
                <p>	   
                    <b>NOTE</b>: we do not store any sequences submitted to RABV-{process.env.REACT_APP_WEB_RESOURCE}!	   
                </p>

                <SequenceSubmission onJobFinished={handleJobFinished}/>
                {tableRows && 
                    <div>
                        <br></br>
                        <hr></hr>


                        <div className="row">
                            <div className="col-md-6">
                                <h4 className='title-sub'>Clade Assignment</h4>
                            </div>
                            <CladeAssignmentTable tableRows={tableRows} onGenomeClick={(e)=>handleGenomeClick(e)}/>
                        </div>

                        <div ref={viewerRef}>
                            
                            {genome && (
                                <div>
                                    <div className="col-md-6">
                                        <h4 className='title-sub'>Alignment</h4>
                                    </div>
                                    <GenomeViewer data={genome} />
                                </div>
                            )}
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className='title-sub'>Phylogenetic Tree</h4>
                            </div>
                            <div className="col-md-6">
                                {sourceData &&
                                    <div style={{'textAlign':'right'}}> 
                                        <Button size='sm' className='btn-main-filled' onClick={() => downloadFile(sourceData.data, sourceData.filename)}>
                                        Download Tree
                                        </Button> 
                                    </div>
                                }
                                
                            </div>
                            {sourceData && <Taxonium sourceData={sourceData}/> }

                        </div>

                        
                    </div>
                }
            </div>
        </div> 
    );
};
 
export default CladeAssignment;
