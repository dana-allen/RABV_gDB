import React from "react";
import { Link } from "react-router-dom"; 

const VGdb = () => {
    return (
        <div className="container ">
            <h2>Viral Genome Toolkit and Database</h2>
            <br></br>
            <h4 className='primary-color'>What is the Viral Genome Toolkit?</h4>
            <br></br>
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.5rem",
                }}
                >
                    <div className="card h-100 border-0 team-card" style={{ width: "40%"}}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/centre-for-virus-research/V-gTK "
                    >
                        <img
                        src="/static/imgs/icons/V-gTK.png"
                        alt="Viral Genome Toolkit logo"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            padding:"5px"
                        }}
                        />
                    </a>
                    </div>
                
                <div>
                    <p style={{ margin: 0 }}>
                        The Virus Genome Toolkit (V-gTK) and Virus Genome
                        Database (V-gDB) is a modular and reproducible ecosystem for managing and
                        interpreting viral genome data with a focus on biologically meaningful
                        mutations. V-gTK provides tools for end-to-end management of viral
                        genomes, including: 
                    </p>
                    <p>

                        <ul>
                            
                            <li>data retrieval</li>
                            <li>metadata validation</li>
                            <li>sequence filtering</li>
                            <li>alignment</li>
                            <li>and phylogenetic analysis</li>
                        </ul>
                        
                    </p>
                </div>
                
            </div>
            <p>
                The framework
                emphasizes reproducibility through standardized input formats, version
                control, and transparent data provenance, while enabling collaborative
                curation by virologists and bioinformaticians. V-gDB complements this
                infrastructure by supporting the creation of searchable databases
                linking genome sequences with curated mutation data, reference
                phylogenies, and contextual metadata.
            </p>
            <p>
                The framework is implemented in Python and integrates established bioinformatics tools including BLAST, MAFFT, NextAlign, IQ-TREE, and EPA-NG. 
                Metadata validation incorporates controlled vocabularies such as United Nations M49 country codes and the National Center for Biotechnology 
                Information Taxonomy database to ensure consistent and high-quality datasets. 
            </p>
           
            
        </div>
    );
};
 
export default VGdb;
