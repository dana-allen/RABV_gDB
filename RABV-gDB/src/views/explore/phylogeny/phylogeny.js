import { useState, useEffect } from "react";
import Taxonium from "taxonium-component";
import { Button } from 'react-bootstrap';
import { useDownload, usePhylogenyTree } from 'hooks'
import { useLoadingWheelHandler, useErrorHandler } from 'contexts';

import TreeTable from "./components/TreeTable";
// Style Sheets 
import 'assets/styles/phylogeny.css' //VERY IMPORTANT This class controls the taxonium component tree height

const Phylogeny = () => {
  // Contexts
  const { triggerLoadingWheel } = useLoadingWheelHandler();
  const { triggerError } = useErrorHandler();
  const [sourceData, setSourceData] = useState(null);

  const [selectedTree, setSelectedTree] = useState()

  const { trees, meta_data, loading, error } = usePhylogenyTree();
  const { downloadFile } = useDownload();

  useEffect(() => {
    if (trees) {

      setSelectedTree(trees[0])
      
      const metadata = {
        filename: "metadata.csv",
        data: meta_data,
        status: "loaded",
        filetype: "meta_csv",
      };
      setSourceData({
              status: "loaded",
              filename: "tree.nwk",
              data: trees[0].newick,
              filetype: "nwk",
              metadata: metadata,
            });
    }
  }, [trees]);

  useEffect(() => {
    triggerLoadingWheel(loading)
    triggerError(error)
  }, [loading, error]);

  const handleTreeClick = (value) => {
    
    setSelectedTree(trees[value])
    const metadata = {
        filename: "metadata.csv",
        data: meta_data,
        status: "loaded",
        filetype: "meta_csv",
      };
    setSourceData({
              status: "loaded",
              filename: "tree.nwk",
              // data: tree,
              data: trees[value].newick,
              filetype: "nwk",
              metadata: metadata,
            });

  }

  const handleNodeSelect = (nodeId) => {
    console.log("Node selected:", nodeId);
  };

  const handleNodeDetailsLoaded = (nodeId, nodeDetails) => {
    console.log("Node details loaded:", nodeId, nodeDetails);
  };




  return (
    <div className="container" >
      <h2>Phylogenetic Tree</h2>

      <p>
        This provides an interactive phylogenic tree. Within a tree, the tips are named by primary accession and coloured by various metadata, 
        which may be chosen by selecting Colour by. The tree may be searched for tip names or metadata by entering text into the Search box.
      </p>
      <div>
        {trees && <TreeTable data={trees} onTreeClick={handleTreeClick} />}
      </div>
      <div>
        {selectedTree && <h2>{selectedTree.tree_type}</h2> }
        {selectedTree &&
          <div style={{'textAlign':'right'}}> 
            <Button size='sm' className='btn-main-filled' onClick={() => downloadFile(selectedTree.newick, selectedTree.name+".newick", "newick")}>
              Download Tree
            </Button> 
          </div>
        }

        {sourceData && <Taxonium key={selectedTree.name} sourceData={sourceData} onNodeSelect={handleNodeSelect} onNodeDetailsLoaded={handleNodeDetailsLoaded}/> }

      </div>
      
    </div>
  );
};

export default Phylogeny;

