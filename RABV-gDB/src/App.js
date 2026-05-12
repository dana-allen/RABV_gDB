import './App.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'assets/styles/gdb-app-custom.css'
import 'assets/styles/buttons.css'
import 'assets/styles/modals.css'
import 'assets/styles/tooltips.css'
import ReactGA from 'react-ga4';
import React, {useEffect} from 'react';
import { Router, BrowserRouter, Routes, Route } from "react-router-dom";


import NavBar from './components/NavBar';
import Footer from "./components/Footer";


import Home from "./views/home/home";
import HowToCite from "./views/about/howToCite";
import Team from "./views/about/team";
import Sequences from "./views/explore/sequences/sequences";
import Sequence from "./views/explore/sequences/sequence";
import References from "./views/explore/references/references";
import Reference from "./views/explore/references/reference";
import Mutations from './views/analysis/adaptation_mutations/mutations';
import Maddog from './views/analysis/maddog/maddog';

import GlobalOverview from './views/explore/global_overview/global_overview';

import CladeAssignment from './views/analysis/clade_assignment/clade_assignment';



import ApiEndpoints from './views/documentation/api/api_endpoints';
import ApiEndpoint from './views/documentation/api/api_endpoint';
import Help from './views/documentation/help';
import MetaData from './views/documentation/meta_data';

import Installation from './views/documentation/installation';

// import AdvancedSearch from './views/explore/advanced_search/advanced_search';
import { LoadingWheelProvider } from './contexts/LoadingWheelContext';
import LoadingWheel from './components/LoadingWheel';

import { ErrorHandlerProvider } from './contexts/ErrorHandlerContext';
import ErrorMessage from './components/ErrorMessage';

import Phylogeny from './views/explore/phylogeny';
import Acknowledgments from 'views/about/acknowledgements';
import VGdb from 'views/about/v_gdb';

function App() {

  useEffect(() => {
    ReactGA.initialize('G-EFWP5TC9Y0');
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);


  return (
    <div className="App">
      
      {
        <ErrorHandlerProvider>
          <LoadingWheelProvider>
            <BrowserRouter>
              <NavBar /> 
            
              <Routes>

                {/* Homepage */}
                <Route exact path="/"               element={<Home />} />

                {/* Explore */}
                <Route exact path="/sequences"      element={<Sequences />} />
                <Route exact path="/sequence/:id"   element={<Sequence />} />
                <Route exact path="/references"     element={<References />} />
                <Route exact path="/reference/:id"  element={<Reference />} />
                <Route path="/global_overview"      element={<GlobalOverview />} />
                <Route path="/phylogeny"            element={<Phylogeny />} />

                

                {/* About */}
                 <Route path="/howToCite"           element={<HowToCite />} />
                <Route path="/team"                 element={<Team />} />
                <Route path="/help"                 element={<Help />} /> 
                <Route path="/acknowledgments"      element={<Acknowledgments />} /> 
                <Route path="/v_gdb"                element={<VGdb />} />

                {/* API */}
                <Route path="/api_endpoints"       element={<ApiEndpoints />} />
                <Route path="/api_endpoint/:id"    element={<ApiEndpoint />} />
                

                {/* Analysis */}
                <Route path="/clade_assignment"     element={<CladeAssignment />} />
                <Route path="/maddog"               element={<Maddog />} />


                {/* Other */}
                <Route path="/installation"        element={<Installation />} />
                {/* <Route path="/advanced_search"      element={<AdvancedSearch />} /> */}
                <Route path="/meta_data"          element={<MetaData />} />
                

              </Routes>
            </BrowserRouter>
            <LoadingWheel />
            <ErrorMessage/>
          </LoadingWheelProvider>
        </ErrorHandlerProvider>
      }
      <div className="container"> 
        <Footer />
      </div>
    </div>
  );
}

export default App;
