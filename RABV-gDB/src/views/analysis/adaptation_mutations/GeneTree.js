import { useState, useEffect } from 'react';
import TreeView from 'components/trees//TreeView';
import TaxonomyFilter from 'views/analysis/adaptation_mutations/TaxonomyFilter'

const GeneTree = ({ onRegionSelect }) => {

    const [taxonomySelections, setTaxonomySelections] = useState({})
    const [selected, setSelected] = useState([])

    const geneTree = [{name:'transmembrane glycoprotein G', nodes:null, parent:null, text:'Glycoprotein'},
                    {name:'L protein', nodes:null, parent:null, text:'Large protein / RNA polymerase'},
                    {name:'M2 protein', nodes:null, parent:null, text:'Matrix protein'},
                    {name:'nucleoprotein N', nodes:null, parent:null, text:'Nucleoprotein'},
                    {name:'phosphoprotein M1', nodes:null, parent:null, text:'Phosphoroprotein'},

    ]

    const handleItemClick = (id) => {
        console.log(id)
        onRegionSelect(id[0])
        // var params = {};

        // if (id[1] === null) {
        //     params["EPA_major_clade"] = id[0]
        //     params["EPA_minor_clade"] = null
        // } else {
        //     params["EPA_minor_clade"] = id[0]
        //     params["EPA_major_clade"] = id[1]
            
        // }

        // onCladeSelect(params)
    }


    

    
    return (
        <div>
             <TreeView data={geneTree}
                    enableLinks={true}
                    expanded={true}
                    onClick={handleItemClick}
                    style={{
                        paddingLeft:0,
                        height: 240,
                        maxWidth: 400,
                        flexGrow: 1,
                    }} 
            />
        </div>
    );
};

export default GeneTree;