import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap, faGear, faCapsules, faVirus, faGlobe, faDna, faToolbox, faHexagonNodes } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import Button from 'react-bootstrap/Button';

import 'assets/styles/cards.css'


library.add(faSitemap, faGear, faCapsules, faVirus, faGlobe, faDna, faToolbox);

const tabs = ["Explore", "Analyse", "About"];

const exploreItems = [
  { title: "Sequences", description: "Browse metadata and alignments, arranged into major and minor clades.", icon: faSitemap, link:'/sequences' },
  { title: "Phylogentic Trees", description: "Explore evolutionary relationships of virus sequences", icon: faHexagonNodes, link:'/phylogeny' },
  { title: "Global Visualization", description: "Visualize the global distribution with an interactive map." , icon: faGlobe, link:'/global_overview'}
];

const analysisItems = [
  { title: "Phylogenetic Clade Submission", description: "Tool providing genotyping analysis and visualisation of submitted FASTA sequences.", icon: faGear, link:'/clade_assignment' },
//   { title: "Host Mutations", description: "Identify mutations among different hosts.", icon: faDna, link:'/mutations' }
];

const aboutItems = [
    { title: "Team", description: "Meet the team that created RABV-gDB", icon: faGear, link:'/team' },
    { title: "Statistics", description: "View the data statistics", icon: faDna, link:'/statistics' },
    { title: "Viral Genome Toolkit", description: "Checkout the software to build your own database", icon: faToolbox, link:'/statistics' }
  ];

const Cards = () => {
    const [activeTab, setActiveTab] = useState('');

    const renderCards = (items) => (

        <div className="row justify-content-center">
            {items.map((item, index) => (
                <div key={index} className="card function-card">
                    <a href={item.link} className="btn btn-main">
                        <FontAwesomeIcon icon={item.icon} size="3x" />
                        <div className="card-body">
                            <h4 className="card-title">{item.title}</h4>
                            <p className="card-text info-text-14">{item.description}</p>
                        </div>
                    </a>
                
                </div>

            ))}
        </div>
    );

  return (
    <div>
        <div className="container">
            <div className='row justify-content-center'>
                <nav className="d-flex justify-content-center bg-white rounded-pill overflow-hidden">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === tab;
                        return (
                            <Button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-fill border-0 py-2 px-3 btn btn-main card-size
                                    ${isActive ? 'btn-main-filled' : 'bg-white secondary-color'}
                                    ${index === 0 ? 'rounded-start-pill' : ''}
                                    ${index === tabs.length - 1 ? 'rounded-end-pill' : ''}
                                    ${index > 0 && index < tabs.length - 1 ? 'rounded-0' : ''}
                                    ${index !== 0 ? 'border-start border-secondary' : ''}`}
                                >
                                <h3>{tab}</h3>
                            </Button>

                        );
                    })}
                </nav>
            </div>
        </div>

        <div></div>
        <div className="container">
            {activeTab === "Explore" && renderCards(exploreItems)}
            {activeTab === "Analyse" && renderCards(analysisItems)}
            {activeTab === "About" && renderCards(aboutItems)}
        </div>
    </div>
  );
};

export default Cards;

