
import { ReactSVG } from 'react-svg';
import Cards from './components/Cards'

// Style Sheets 
import 'assets/styles/home.css'

const Home = () => {

    return (  
        <div>  
            <div className="banner banner-gradient-spots">
                <img 
                    className='banner-logo'
                    src="/static/imgs/icons/vgdb_logo.svg"
                    alt="Viral Genome Database logo"
                />
                <div className='banner-text-container'>
                    <h2 className='banner-title'><b>RABV-gDB</b></h2>
                    <h2 className='banner-subtitle'>A Rabies Virus Genome Database Resource</h2>
                </div>
                <ReactSVG className="banner-svg" src="/static/imgs/icons/home_background.svg" />
            </div>

            <Cards></Cards>
            
            <hr></hr>

            <div className="container">
                <div className='info-container'>
                    <h4 className='primary-color'>What is Rabies?</h4>
                    <p>
                        Rabies virus (RABV) is a neglected zoonotic disease that causes around 59,000
                        human deaths each year, with a near 100% mortality rate after the onset of symptoms. 
                        The virus is a member of the Lyssavirus genus, within the Rhabdoviridae family, which
                        is characterised by a single stranded, negative-sense RNA genome.
                    </p>
                    <p>         
                        Infection with RABV can occur in all species of mammal, but up to 99% of human
                        rabies cases arise from bites from infected domestic dogs. Vaccinating dogs
                        to interrupt transmission is therefore paramount, and a major focus of the
                        ‘Zero by 30’ global strategy to eliminate human deaths from dog-mediated rabies
                        by 2030.
                    </p>
                </div>
                <div className='info-container'>
                    <h4 className='primary-color'>Why RABV-gDB?</h4>
                    <p>
                        RABV-{process.env.REACT_APP_WEB_RESOURCE} is a data-centric bioinformatics resource which organises RABV genome sequence data along evolutionary lines. 
                        RABV-{process.env.REACT_APP_WEB_RESOURCE} aims to leverage new and existing RABV sequences in order to improve our understanding of the epidemiology and pathology of RABV.
                    </p>
                    
                    <p>
                        The web version of RABV-{process.env.REACT_APP_WEB_RESOURCE} can be used for basic analysis. An offline version of the resource 
                        can be used for more advanced work.
                    </p>
                
                </div>
            </div>
      </div> 
    );
};
 
export default Home;