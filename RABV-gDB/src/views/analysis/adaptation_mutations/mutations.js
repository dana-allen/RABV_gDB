import TaxonomyTree from 'views/analysis/adaptation_mutations/TaxonomyTree';
import GeneTree from 'views/analysis/adaptation_mutations/GeneTree';
import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button } from "react-bootstrap";
import { BarChart } from "@mui/x-charts";
import { RotatingLines } from 'react-loader-spinner'
import { useHostMutation } from 'hooks'
import ProteinSequence from './protein_sequence';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function groupByHost(translated_sequences, residue, selectedRegion) {

    const counts = {};

    const data = translated_sequences.filter(
        item => item.region === selectedRegion
    );

    // Count unique accessions per host per amino acid
    data.forEach(({ primary_accession, host, protein }) => {
        if (!protein || protein.length < residue || !host) return;

        const aa = protein[residue - 1];

        if (!counts[host]) counts[host] = {};
        if (!counts[host][aa]) counts[host][aa] = new Set();

        counts[host][aa].add(primary_accession);
    });

    const hosts = Object.keys(counts);

    const xLabels = hosts.map(host => ({ label: host }));

    // Collect all amino acids observed
    const aminoAcids = new Set();
    hosts.forEach(host => {
        Object.keys(counts[host]).forEach(aa => aminoAcids.add(aa));
    });

    // Calculate total sequences per host
    const hostTotals = {};
    hosts.forEach(host => {
        hostTotals[host] = Object.values(counts[host])
            .reduce((sum, set) => sum + set.size, 0);
    });

    // Frequency table: host -> { aa: freq }
    const freqByHost = {};

    hosts.forEach(host => {
        freqByHost[host] = {};

        aminoAcids.forEach(aa => {
            const count = counts[host][aa] ? counts[host][aa].size : 0;
            const total = hostTotals[host] || 1;
            freqByHost[host][aa] = (count / total) * 100;
        });
    });

    // Determine per-host keep sets
    const keepByHost = {};

    hosts.forEach(host => {

        const entries = Object.entries(freqByHost[host])
            .filter(([_, v]) => v > 0)
            .sort((a, b) => b[1] - a[1]); // descending freq

        let cumulative = 0;
        keepByHost[host] = new Set();

        for (const [aa, freq] of entries) {
            keepByHost[host].add(aa);
            cumulative += freq;
            if (cumulative >= 80) break;
        }
    });

    // Union of all amino acids that appear in any host keep set
    const globalKeep = new Set();
    hosts.forEach(host => {
        keepByHost[host].forEach(aa => globalKeep.add(aa));
    });

    // Build series
    const seriesMap = {};

    // Initialize kept amino acids
    globalKeep.forEach(aa => {
        seriesMap[aa] = new Array(hosts.length).fill(0);
    });

    const otherData = new Array(hosts.length).fill(0);

    hosts.forEach((host, hostIndex) => {

        Object.entries(freqByHost[host]).forEach(([aa, freq]) => {

            if (keepByHost[host].has(aa)) {
                if (!seriesMap[aa]) {
                    seriesMap[aa] = new Array(hosts.length).fill(0);
                }
                seriesMap[aa][hostIndex] = freq;
            } else {
                otherData[hostIndex] += freq;
            }
        });
    });

    // Convert to series array
    const series = Object.entries(seriesMap).map(([aa, data]) => ({
        label: aa,
        stack: "total",
        data
    }));

    // Add Other
    if (otherData.some(v => v > 0)) {
        series.push({
            label: "Other",
            stack: "total",
            data: otherData
        });
    }

    return { xLabels, series };
}

const Mutations = () => {

    // const { triggerLoadingWheel } = useLoadingWheelHandler();
    const [mutationsData, setMutationsData] = useState([]);
    const [queryParams, setQueryParams] = useState(null)
    const [params, setParams] = useState(null)
    const [selectedResidue, setSelectedResidue] = useState(1)
    const [selectedRegion, setSelectedRegion] = useState('nucleoprotein N')
    const [reset, setReset] = useState(false)

    const { translated_reference_sequences, translated_sequences, loading, error } = useHostMutation('1', queryParams);

    const handleTaxonomySelection = (data) => { setParams(data) };
    

    const handleReset = () => {  };

    const handleSubmit = () => { setQueryParams(params) };

    const {xLabels, series} = translated_sequences ? groupByHost(translated_sequences, selectedResidue, selectedRegion) : {}

    const [referenceProtein, setReferenceProtein] = useState(null)

    useEffect(() => {
        if (translated_reference_sequences) {
            setReferenceProtein(translated_reference_sequences.filter( item => item.region === selectedRegion)[0])
        }
    }, [translated_reference_sequences, selectedRegion]);


    return (
        <div className='container'>
            <h2>Host Mutations Explorer</h2>
            <p>
                The Host Mutations Explorer provides detection and analysis of mutations in 
                an amino acid sequence. Click on a table row to visualise an interactive chart of the 
                frequencies of amino acids aligned at that position across our dataset of cluster 
                representative sequences.
            </p>
            <div className='row'>
              <div className='col-3'>
                <TaxonomyTree onTaxaSelect={handleTaxonomySelection}></TaxonomyTree>
                    <div className="d-flex justify-content-between mt-3">
                        <ButtonGroup>
                            <Button className="btn-main" onClick={handleReset}> Reset </Button>
                            <Button
                                className={`btn ${loading ? "btn-main-outline" : "btn-main-filled"}`}
                                onClick={handleSubmit}
                                >
                                {loading ? (
                                        <>
                                        <FontAwesomeIcon
                                            icon={["fas", "cog"]}
                                            spin
                                            style={{ marginRight: "6px" }}
                                        />
                                        Running...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                
              <div className='col-9'>
                <Typography>
                  Frequency of amino acids at consensus position
                </Typography>
                <Typography style={{'fontSize':'10px'}} marginBottom={2}>
                  {selectedRegion} Position {selectedResidue}
                </Typography>
                {!loading ? 
                  <div>
                  
                    {xLabels &&
                        <BarChart
                
                        //   onItemClick={(event, d) => clickHandler(event, d, series)}
                            xAxis={[
                            {
                                scaleType: "band",
                                data: xLabels.map(({ label }) => label),
                                label: "Amino Acid",
                            },
                            ]}
                            yAxis={[{ label: "Frequency (%)" }]} // Ensure Y-axis is 0-100%
                            series={series}
                            height={400}
                            slotProps={{
                            legend: {
                            sx: {
                                fontSize: 14,
                            
                                
                            },
                            },
                        }}
                        /> 
                      }
                      
                  </div>
                  :
                  <div style={{ display:'flex',
                                'justify-content':'center', 
                                'align-items':'center',
                                'height':'100%'  }}>
                    <div className='align-center'>

                      <RotatingLines visible={true}
                            height="45"
                            width="45"
                            strokeColor="var(--primary)"
                            strokeWidth="5"
                            animationDuration="1"
                            ariaLabel="rotating-lines-loading"
                            wrapperStyle={{}}
                            wrapperClass=""/>
                    </div>
                  </div>

                }

   
            </div>
            </div>
        
            <div className='row'>
                {referenceProtein && 
                    <ProteinSequence reference_protein={referenceProtein.protein} 
                                        residueClick={setSelectedResidue} 
                                        regionClick={setSelectedRegion}/>
                }
            </div>
                
            <br></br>

        </div>
    );
};
 
export default Mutations;