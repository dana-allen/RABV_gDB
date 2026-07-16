import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';
// Stylesheets
import 'assets/styles/tables.css'


const TreeTable = ( { data=null, onTreeClick } ) => {

  const [currentTree, setCurrentTree] = useState(0)

  const handleTreeClick = (treeId) => {

    setCurrentTree(treeId)

    onTreeClick(treeId)

  }

    return (
        <table className="table table-striped table-bordered table-font-12">
          <thead>
            <tr>
              <th>Tree</th>
              <th>Type of Tree</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {data.map((tree, i) => (
              <tr key={i} >
                <td>
                  <input type='radio'  
                          checked={currentTree === i}
                          style={{
                            appearance: "none",
                            width: "16px",
                            height: "16px",
                            border: "1px solid #767676",
                            borderRadius: "50%",
                            backgroundColor: currentTree === i
                                ? "var(--primary)"
                                : "white",
                            cursor: "pointer",
                        }}
                      onClick={() => handleTreeClick(i)}>
                      
                  </input>
                </td>
                <td>
                  {tree.tree_type}
                </td>
                <td>{tree.description}</td>
                
            </tr>
            ))}
            
          </tbody>
        </table>
    );
};

export default TreeTable;
