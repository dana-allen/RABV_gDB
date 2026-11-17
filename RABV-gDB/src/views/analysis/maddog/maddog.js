import { useEffect } from "react";
import RabvTree from "./rabv_tree_react_modernized/RabvTrees";

import { useMaddog } from 'hooks'
import { useLoadingWheelHandler, useErrorHandler } from 'contexts';

const Maddog = () => {

    const { triggerLoadingWheel } = useLoadingWheelHandler();
    const { triggerError } = useErrorHandler();


    const { maddogTree, loading, error } = useMaddog();

    useEffect(() => {
        triggerLoadingWheel(loading)
        triggerError(error)
    }, [loading, error]);

    return (
        <div className="container" >
        <h2>MADDOG-V2 Lineages</h2>

        <p>
            MADDOG (Method for Assignment, Definition and Designation Of Global lineages) is a phylogenetic tool 
            for classifying rabies virus and other virus genomes into a consistent, hierarchical lineage nomenclature.
        </p>
        <p>
            The module is stil under development. Please check back soon for more updates.
        </p>

        <hr/>

        {maddogTree && 
                <RabvTree
                    data={maddogTree}
                    title="Rabies Virus Phylogeny"
                />
            }
        </div>
        
    );
};

export default Maddog;