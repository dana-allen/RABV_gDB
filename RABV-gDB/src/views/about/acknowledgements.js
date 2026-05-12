import React from "react";

import 'assets/styles/about.css'

const Acknowledgments = () => {
    return (
        <div className="container ">
            <h2>Acknowledgments</h2>
            <p>
                {process.env.REACT_APP_VIRUS_ABB}-{process.env.REACT_APP_WEB_RESOURCE} is based on the {" "}
                <a className='custom-link' target="_blank" href="https://github.com/centre-for-virus-research/V-gTK">Viral Genome Toolkit (V-gTK)</a> software framework, developed by the 
                <a className='custom-link' target="_blank" href="http://www.gla.ac.uk/researchinstitutes/iii/cvr/"> MRC-University of Glasgow Centre for Virus Research</a>, 
                in collaboration with the <a className='custom-link' href="https://www.gla.ac.uk/schools/bohvm/"> University of Glasgow 
                School of Biodiversity One Health and Veterinary Medicine</a>, and the US Centers for Disease Control and Prevention.  
            </p>

            <p>We thank Rob Gifford and Josh Singer for the inspiration of {process.env.REACT_APP_VIRUS_ABB}-{process.env.REACT_APP_WEB_RESOURCE} from GLUE. </p>

            <div className="row">
                <div className="col-md-3">
                    <div className="card h-100 border-0 team-card">
                        <div className="d-flex align-items-center p-2">
                            <a target="_blank" href="http://www.gla.ac.uk/researchinstitutes/iii/cvr/">
                                <img className='mrc-logo' alt="MRC logo" src="/static/imgs/footer/MRC1.png"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card h-100 border-0 team-card">
                        <div className="d-flex align-items-center p-2">
                            <a target="_blank" href="https://www.gla.ac.uk/schools/bohvm/">
                                <img className='bohvm-logo' alt="IBAHCM logo" src="/static/imgs/footer/UoG_keyline_BiodiversityOneHealthVetMedicine_colour.png"></img>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default Acknowledgments;
