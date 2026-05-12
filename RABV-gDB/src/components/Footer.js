import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/js/dist/dropdown.js';

import 'assets/styles/footer.css'

const Footer = () => {
  return (
    <div>
      <hr></hr>
      <div className="row footer-font-12">
        <div className="col-md-2">
            <a target="_blank" href="http://www.gla.ac.uk/researchinstitutes/iii/cvr/">
              <img className='cvr-logo' alt="CVR logo" src="/static/imgs/footer/cvrBioinformatics.png"/>
            </a>
        </div>

        <div className="col-md-10">
          <p><small>{process.env.REACT_APP_VIRUS_ABB}-{process.env.REACT_APP_WEB_RESOURCE} is based on the <a className='custom-link' target="_blank" href="https://github.com/centre-for-virus-research/V-gTK">Viral Genome Toolkit</a> software framework. 
            Contact <a className='custom-link' href="mailto:cvr-webresource-support@lists.cent.gla.ac.uk">Web Resource Support</a> with questions or feedback.
            <br/><span className='beta-text'>Please note this is beta software, still undergoing development and testing before its official release.</span></small>
          </p> 
        </div>
      </div>
    </div>
  );
};

export default Footer;