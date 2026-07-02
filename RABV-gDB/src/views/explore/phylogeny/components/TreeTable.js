import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';
// Stylesheets
import 'assets/styles/tables.css'


const TreeTable = ( { data=null, onTreeClick } ) => {

    return (
        <table className="table table-striped table-bordered table-font-12">
          <thead>
            <tr>
              <th>Tree</th>
              <th>Description</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {data.map((tree, i) => (
              <tr>
                <td>
                  {tree.name}
                </td>
                <td>{tree.description}</td>
                <td><Button size='sm' className='btn-main-outline' onClick={() => onTreeClick(i)}><FontAwesomeIcon icon={faEye} /></Button></td>
            </tr>

            ))}
            
          </tbody>
        </table>
    );
};

export default TreeTable;
