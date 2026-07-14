import { useState, useEffect } from 'react';

import TaxonomyFilter from 'views/analysis/adaptation_mutations/TaxonomyFilter'

const TaxonomyTree = ({ onTaxaSelect}) => {

    const [taxonomySelections, setTaxonomySelections] = useState({})
    const [selected, setSelected] = useState([])

    const taxonomyTree = [
                            {name:'phylum', nodes:null, parent:null, text:'Phylum'},
                            {name:'class', nodes:null, parent:null, text:'Class'},
                            // {name:'order_category', nodes:null, parent:null, text:'Order'},
                            {name:'family', nodes:null, parent:null, text:'Family'},
                            {name:'genus', nodes:null, parent:null, text:'Genus'},
                            {name:'species', nodes:null, parent:null, text:'Species'}
    ]


    

    const handleNodeIds = (nodeName) => (ids) => {
        setTaxonomySelections(prev => {
            if (!ids || ids.length === 0) {
                const copy = { ...prev }
                delete copy[nodeName]
                return copy
            }
            return {
                ...prev,
                [nodeName]: ids
            }
        })
    }


    const handleChange = (name) => {

        const wasSelected = selected.includes(name)

        setSelected(prev =>
            wasSelected
                ? prev.filter(item => item !== name)
                : [...prev, name]                      
        )

        if (wasSelected) {
            setTaxonomySelections(prev => {
                const copy = { ...prev }
                delete copy[name]
                return copy
            })
        }

        onTaxaSelect()
    }


    useEffect(() => {
        onTaxaSelect(taxonomySelections)
    }, [taxonomySelections]);
    
    return (
        <div>
            {taxonomyTree.map(node => (
                <div key={node.name} style={{ marginBottom: '5px' }}>
                    <label
                        style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(node.name)}
                            onChange={() => handleChange(node.name)}
                            style={{
                                width: '16px',
                                height: '16px',
                                cursor: 'pointer'
                            }}
                        />

                        <span style={{ fontWeight: 500 }}>{node.text}</span>
                    </label>

                    {selected.includes(node.name) && (
                    <div style={{padding: '5px 0px 0px 20px'}}>
                        <TaxonomyFilter label={node.name} 
                                        taxa_level={node.name} 
                                        idKey={node.name} 
                                        params={taxonomySelections} 
                                        handleId={handleNodeIds(node.name)} 
                        />
                    </div>
                    )}

                </div>
            ))}
        </div>
    );
};

export default TaxonomyTree;