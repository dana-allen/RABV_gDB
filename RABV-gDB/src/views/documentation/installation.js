import { Tab, Nav } from "react-bootstrap";

import Version from "views/about/version";

import 'assets/styles/installation.css';


const Installation = () => {
  return (
    <div className="container">
      <h2>Installation</h2>
      {/* <p>
        This module is currently under construction. Please check back soon!
      </p> */}
   
      <Tab.Container defaultActiveKey="overview">
        <div className="d-flex">

          <Nav variant="pills" className="flex-column me-4 vert-nav" >
            <Nav.Item>
              <Nav.Link eventKey="overview">Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="rabv">RABV-gDB Web Resource</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="local">Offline RABV-gDB</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="version">Version Information</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="flex-grow-1">
            <Tab.Pane eventKey="overview">
              <p>
                RABV-gDB is built using a modular architecture to promote code reusability across multiple projects. 
                The web resource consists of two main parts:
              </p>

              <ol>
                <li>
                  <h4>Rabies front-end GUI</h4>
                  <ul>
                    <li>This app acts as the primary web interface that connects to the V-gDB API and displays the data.</li>
                    <li>It handles the overall page layout, routing, and major API requests.</li>
                  </ul>
                </li>
                <li>
                  <h4>V-gDB</h4>
                  <ul>
                    <li>This allows you to connect your own viral genome databases, customize API endpoints, and integrate with your tools or GUIs.</li>
                  </ul>
                </li>
              </ol>
            </Tab.Pane>

            <Tab.Pane eventKey="local">
              <h4>Offline RABV-gDB</h4>
              <p>
                The RABV-gDB resource can be used "offline" to organize and analyse sequence data on your personal computer. 
              </p>
                Offline RABV-gDB can either:
              <ul>
                <li><a className="custom-link" href="#install_rabv">connect to our instance of RABV-gDB</a>, or</li>
                <li><a className="custom-link" href="#install_custom">connect to custom V-gDB database*</a></li>
              </ul> 
              <p className='size-12-font'>
                *This requires installation of the V-gTK toolkit
              </p>

              <h4>
                Connect to RABV-gDB instance
              </h4>
              <p>
                #TODO: add in instructions
              </p>
              <ol id="install_rabv">
                <li>
                  <div className="code-block">$ git clone git@github.com:dana-allen/RABV_gDB.git</div>
                </li>
                <li>
                  <div className="code-block">$ cd RABV_gDB</div>
                </li>
                <li>
                  <div className="code-block">$ python3 manage.py runserver</div>
                </li>
                <li>
                  <div className="code-block">$ cd RABV-gDB</div>
                </li>
                <li>
                  <div className="code-block">$ npm install</div>
                </li>
                <li>
                  <div className="code-block">$ npm start</div>
                </li>
              </ol>

              <h4>
                Connect to custom V-gDB database
              </h4>
              <p>
                Before using a local version of V-gDB, you need to create your own database. Please follow the instructions on V-gTK. 
                Once you have your virus database, follow the instructions below to link to your own GUI and API.
              </p>
              <ol id="install_custom">
                <li>
                  <div className="code-block">$ git clone git@github.com:dana-allen/RABV_gDB.git</div>
                </li>
                <li>
                  <div className="code-block">$ cd RABV_gDB</div>
                </li>
                <li>
                  <div className="code-block">$ python3 manage.py runserver</div>
                </li>
                <li>
                  <div className="code-block">$ cd RABV-gDB</div>
                </li>
                <li>
                  <div className="code-block">$ npm install</div>
                </li>
                <li>
                  <div className="code-block">$ npm start</div>
                </li>
              </ol>

            </Tab.Pane>

            <Tab.Pane eventKey="rabv">
              <h4>RABV-gDB Web Resource</h4>
              <p>This is the React web-app that runs the RABV-gDB GUI. You need Node.js installed.</p>
              <div className="code-block">$ git clone git@github.com:dana-allen/RABV-gDB.git</div>
              <div className="code-block">$ cd RABV-gDB</div>
              <div className="code-block">$ npm install</div>
              <div className="code-block">$ npm start</div>
              <p>Navigate to <a href="http://localhost:3000">http://localhost:3000</a> to explore!</p>
            </Tab.Pane>

            
            <Tab.Pane eventKey="version">
              <h4>V-gDB Version</h4>
              <Version />
              </Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
    </div>
  );
};

export default Installation;
