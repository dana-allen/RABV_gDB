import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Features } from './components/Features';
import { NumberLine } from './components/NumberLine';
import SequenceViewer from './SequenceViewer';
import MismatchBarRow from './components/MismatchBar';
import { getMismatches, getMultipleMismatches } from 'assets/javascript/sequenceViewerHelper'
import 'assets/styles/genome_viewer.css'
import AlignmentViewer from './AlignmentViewer';
import { Button } from "react-bootstrap";


const GenomeViewer = ({ data }) => {
    
    const [selectedFeature, setSelectedFeature] = useState(null);
    
    const reference_accession = data ? data["reference_accession"] : null
    const query_alignment_sequence = data ? data["query_alignment_sequence"] ? {"query_alignment_sequence":data["query_alignment_sequence"], "query_alignment_id":data["query_alignment_id"]} : null : null
    const query_aligned_sequences = data ? data["query_aligned_sequences"] : null
    const reference_alignment_sequence = data ? data["reference_alignment_sequence"] : null
    const features = data ? data["features"] : null
    const min = 1;
    const max = reference_alignment_sequence.length;
    const range = max - min;
    const positions_tmp = Array.from(new Set([].concat(...features.map(f => [f.cds_start, f.cds_end])))).sort((a, b) => a - b);
    const positions = [min, ...positions_tmp, max]


    const mismatches = query_alignment_sequence ? getMismatches(reference_alignment_sequence, query_alignment_sequence.query_alignment_sequence) :
                                                getMultipleMismatches(reference_alignment_sequence, query_aligned_sequences)

    const enrichedFeatures = features.map(feature => {
        const nucleotide_positions = mismatches.filter(
            pos => pos >= feature.cds_start && pos <= feature.cds_end
        );

        return {
            ...feature,
            nucleotide_positions,
        };
    });


    const onFeatureClick = (feature) => {
        setSelectedFeature(enrichedFeatures[feature])

    }
    const [viewOption, setViewOption] = useState('mismatched'); // default
    const [checked, setChecked] = useState(false)
    const onChange = (e) =>{
        if (e){ setViewOption('full') }
        else {setViewOption('mismatched')}
        setChecked(e)
    }

    return (
        <div className='genome-container'>
            {reference_accession && 
                <p>
                    Reference:&nbsp;
                    <Link className="custom-link" to={`/reference/${reference_accession}`}><b>{reference_accession}</b></Link>
                </p>
            }
            
            <NumberLine positions={positions} min={min} range={range} includeLabel={query_alignment_sequence ? false : true}/>

            <Features
                features={enrichedFeatures}
                min={min}
                range={range}
                selectedFeature={selectedFeature}
                // setSelectedFeature={setSelectedFeature}
                setSelectedFeature={onFeatureClick}
                includeLabel={query_alignment_sequence ? false : true}
            />
            { query_alignment_sequence ?
                <MismatchBarRow
                    // key={primary_a}
                    sequence={query_alignment_sequence}
                    reference_sequence={reference_alignment_sequence}
                    min={min}
                    max={max}
                    range={range}
                    includeLabel={false}
                /> 
                :
                query_aligned_sequences.map((query, i) => {
                    return (
                        <MismatchBarRow
                            // key={primary_a}
                            sequence={query}
                            reference_sequence={reference_alignment_sequence}
                            min={min}
                            max={max}
                            range={range}
                            includeLabel={true}
                        />
                    )

                }) 
            }
            

            {selectedFeature && (
                <div className='selected-feature'>
                    <h5 className='selected-feature-label'>{selectedFeature.product} ({selectedFeature.cds_start} - {selectedFeature.cds_end})</h5>
                    <ul className='selected-feature-label' style={{fontSize:"12px"}}>
                        <li><strong>region mismatches</strong> show only nucleotides and amino acids that differ from the reference in the {selectedFeature.product} region. </li>
                        <li><strong>full region alignment</strong> displays all nucleotides in the region, with mismatches highlighted</li>
                    </ul>
                     <p className='selected-feature-label'>
                        <em>view: &nbsp;</em>
                        <Button size='sm' className={`btn-table-sequence ${!checked ? 'show' : ''}`} onClick={()=>onChange(0)}>region mismatches</Button> 
                        <Button size='sm' className={`btn-table-sequence ${checked ? 'show' : ''}`} onClick={()=>onChange(1)}>full region alignment</Button>
                    
                    </p>
                    
                    <div>
            
                    </div>
                    
                    {viewOption === "mismatched" ?
                        <SequenceViewer start={selectedFeature.cds_start} 
                                        end={selectedFeature.cds_end} 
                                        refSequence={reference_alignment_sequence} 
                                        currentSequences={query_alignment_sequence ? [query_alignment_sequence.query_alignment_sequence] : query_aligned_sequences.map(item => item.query_alignment_sequence)} 
                                        nucPositions={selectedFeature.nucleotide_positions} />
                    
                        : 
                        <AlignmentViewer
                                        reference_sequence={reference_alignment_sequence} 
                                        query_sequence={query_alignment_sequence ? [query_alignment_sequence.query_alignment_sequence] : query_aligned_sequences.map(item => item.query_alignment_sequence)}
                                        nucleotidePositions={selectedFeature.nucleotide_positions}
                                        start={selectedFeature.cds_start}
                                        end={selectedFeature.cds_end}   />
                    }
                </div>
            )}


        </div>
    );



}

export default memo(GenomeViewer);