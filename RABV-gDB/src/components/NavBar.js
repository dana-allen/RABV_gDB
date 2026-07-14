
import { ReactSVG } from 'react-svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/js/dist/dropdown.js';
import 'assets/styles/navBar.css';


const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-nav" >
      
      <a className="navbar-brand custom-toggle" href="/" >
        <ReactSVG src="/static/imgs/icons/icon.svg" width="30" height="30" className="d-inline-block align-top my-svg"/>
        {process.env.REACT_APP_VIRUS_ABB}-{process.env.REACT_APP_WEB_RESOURCE}</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false">
          <span className="navbar-toggler-icon"></span>
        </button>

      <div className=" collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle custom-toggle"  href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Explore</a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="/sequences">Sequences</a>
              <a className="dropdown-item" href="/references">References</a>
              <a className="dropdown-item" href="/global_overview">Global Overview</a>
              {/* <a className="dropdown-item" href="/phylogeny">Phylogenetic Trees</a> */}
              {/* <a className="dropdown-item" href="/advanced_search">Advanced Search</a> */}
            </div>
          </li>


          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle custom-toggle" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Analyse</a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="/clade_assignment">Phylogenetic Clade Submission</a>
              <a className="dropdown-item" href="/mutation_explorer">Host Mutations </a>
              <a className="dropdown-item" href="/maddog">MADDOG</a>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle custom-toggle" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">About</a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="/v_gdb">V-gDB</a>
              <a className="dropdown-item" href="/acknowledgments">Acknowledgments</a>
              <a className="dropdown-item" href="/team">Team</a>
              <a className="dropdown-item" href="/howToCite">How to Cite</a>
            </div>
          </li>
          
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle custom-toggle" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Documentation</a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="/api_endpoints">API</a>
              {/* <a className="dropdown-item" href="/installation"> Installation </a> */}
              {/* <a className="dropdown-item" href="/help">Help</a> */}
              <a className="dropdown-item" href="/meta_data">Meta Data</a>
            </div>
          </li>

          {/* 
          <li className="nav-item"> <a className="nav-link custom-toggle" href="/help"> Help </a></li>
          <li className="nav-item"> <a className="nav-link custom-toggle" href="/api"> API </a></li>
          <li className="nav-item"> <a className="nav-link custom-toggle" href="/documentation"> Documentation </a></li> 
          */}

        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

