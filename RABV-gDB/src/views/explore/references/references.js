import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BarFilter from 'components/filters/BarFilter';
// Hooks & Contexts
import { useSequences } from 'hooks'
import { useLoadingWheelHandler, useErrorHandler } from 'contexts'; 

// Custom Components
import SequencesTable from "../sequences/SequencesTable"

// Generic Components
import PagingButtonsWithCursor from 'components/buttons/PagingButtonsWithCursor';

// Styling 
import 'assets/styles/sequences.css'

const References = ({  } ) => {

    const { triggerError } = useErrorHandler();
    const { triggerLoadingWheel } = useLoadingWheelHandler();
    const [filters, setFilters] = useState({"items_per_page":10, "accession_type":"reference"})

    const [params, setParams] = useState({"items_per_page":10, "accession_type":"reference"});

    const { sequences, nextCursor, prevCursor, totalCount, loading, error } = useSequences(params);
    const [cursorReset, setCursorReset] = useState(false)

    const handleCursorChange = (newCursors) => {

        console.log(newCursors)

        Object.keys(newCursors).forEach(key => {
        if (newCursors[key] === undefined) {
            delete newCursors[key];
        }
        });
        setParams(prev => {
            const next = { ...prev };
            if (newCursors.items_per_page ){
                delete next.items_per_page
            }
                
            delete next.next_cursor;
            delete next.prev_cursor;
            return {...newCursors, ...next};
        });

    }


    useEffect(() => {

        triggerLoadingWheel(loading)
        if(error) triggerError(error);

    }, [loading, error]);

    return (
        <div className="container">
            <h2 >References</h2>
             <p className='tight-text'>
                This dataset contains all the {process.env.REACT_APP_VIRUS_NAME} virus reference sequences.
                View all sequences <Link className='custom-link' to='/sequences' >here</Link>.
            </p>
            {/* <ul className='size-12-font tight-list'>
                <li>Click on a clade to view the references within that clade.</li>
                <li>Use the <em>Filters</em> button to view advanced filtering options.</li>
    
            </ul> */}
            <div className='col-3'>
                {/* <CladeTree onCladeSelect={handleFiltersChange}/> */}
            </div>
            {/* <FilterBar onApplyFilter={handleFiltersChange}/> */}
            <hr></hr>
        
            {sequences && 
            <div className='padding-table'>
                <PagingButtonsWithCursor
                    filters={{...filters}}
                    totalCount={totalCount}
                    nextCursor={nextCursor}
                    prevCursor={prevCursor}
                    onCursorChange={handleCursorChange}
                    cursorReset={cursorReset}
                />


              <SequencesTable data={sequences} type={'reference'} />
          </div>
        }
        </div>
       
    );
};
 
export default References;