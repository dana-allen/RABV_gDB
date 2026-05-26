import { useState } from 'react';
import { Button } from 'react-bootstrap';

// Stylesheets
import 'assets/styles/filters.css';

import AccessionDropdown from './components/AccessionDropDown';
import Dropdown from './components/DropDown';
import HostDropdown from './components/HostDropDown';
import InputDropdown from './components/InputDropDown';
import RadioButtonDropdown from './components/RadioButtonDropDown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import CladeCheckboxes from './components/CladeCheckboxes';

const BarFilter = ({ onApplyFilter, onClickReset }) => {

  const [filters, setFilters] = useState({});
  const [reset, setReset] = useState(false);

  const updateFilterKey = (key, value, exclude=false) => {
    setFilters((prev) => {
      const normalKey = key;
      const excludeKey = `exclude_${key}`;

      const updated = { ...prev };

      // remove both versions first
      delete updated[normalKey];
      delete updated[excludeKey];

      // add back the correct one if value exists
      if (value && value.length > 0) {
        updated[exclude ? excludeKey : normalKey] = value;
      }

      return updated;
    });

  };


  const handleNucleotideId = (value, exclude) => updateFilterKey("primary_accession", value, exclude);
  const handleIsolateId = (value, exclude) => updateFilterKey("isolate", value, exclude);
  const handleCountry = (value, exclude) => updateFilterKey("country", value, exclude);
  const handleExclusion = (value) => updateFilterKey("exclusion_status", value); 

  const handleClades = (value, exclude = false) => {

    const flattenClades = (clades = []) => {
      const EPA_major_clade = [];
      const EPA_minor_clade = [];

      clades.forEach(({ parent, children }) => {
        // always add parent
        EPA_major_clade.push(parent);

        // add children if they exist
        if (Array.isArray(children) && children.length > 0) {
          EPA_minor_clade.push(...children);
        }
      });

      return {
        EPA_major_clade,
        EPA_minor_clade,
      };
    }
      
    const flattened = flattenClades(value)

    console.log("FLATTENED", flattened)
    setFilters((prev) => {
      const updated = { ...prev };

      delete updated.EPA_major_clades;
      delete updated.EPA_minor_clades;
      delete updated.exclude_clades;

      if (value && value.length > 0) {
        // updated[exclude ? excludeKey : normalKey] = value;
        updated["EPA_major_clade"] = flattened.EPA_major_clade;
        updated["EPA_minor_clade"] = flattened.EPA_minor_clade;
      }

      // if(exclude){
      //   updated.exclude_clades == 
      // }

      return updated;
    });
  };

  const handleTaxonomySelections = (value, exclude) => {
    
    setFilters(prev => {
      const updated = { ...prev };
      delete updated.phylum;
      delete updated.class;
      delete updated.order_category;
      delete updated.family;
      delete updated.genus;
      delete updated.species;
      if (exclude) {
        updated.exclude_taxa = true
      } else {
        delete updated.exclude_taxa
      }
      return { ...updated, ...value };
    });
  };

  const handleSequenceLength = (value) => {
    setFilters(prev => {
      const updated = { ...prev };

      if (value?.min) {
        updated["length_lower"] = value.min;
      } else {
        delete updated["length_lower"];
      }

      if (value?.max) {
        updated["length_upper"] = value.max;
      } else {
        delete updated["length_upper"];
      }

      return updated;
    });
  };

  const handleCollectionYear = (value) => {
    setFilters(prev => {
      const updated = { ...prev };

      if (value?.min) {
        updated["collection_year_lower"] = value.min;
      } else {
        delete updated["collection_year_lower"];
      }

      if (value?.max) {
        updated["collection_year_upper"] = value.max;
      } else {
        delete updated["collection_year_upper"];
      }

      return updated;
    });
  };

  const updateFilters = () => {
    onApplyFilter(filters);
  };

  const resetFilters = () => {
    setFilters({});
    setReset(prev => !prev);
    onApplyFilter({"exclusion_status":"0"});
    onClickReset(true)
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span><strong>FILTERS:</strong></span>

        {/* <CladeCheckboxes 
          label={'Clades'}
          id={'primary_accession'}
          url={'/api/filters/search_primary_accession_ids/'}
          handleParams={handleClades}
          reset={reset}
        /> */}

        <AccessionDropdown
          label={'Primary Accession'}
          id={'primary_accession'}
          url={'/api/filters/search_primary_accession_ids/'}
          handleParams={handleNucleotideId}
          reset={reset}
        />

        <AccessionDropdown
          label={'Isolate'}
          id={'isolate'}
          url={'/api/filters/search_isolate_ids/'}
          handleParams={handleIsolateId}
          reset={reset}
        />

        <Dropdown
          label={'Country'}
          id={'display_name'}
          url={'/api/filters/search_country/'}
          handleParams={handleCountry}
          reset={reset}
        />

        <HostDropdown
          label={'Host'}
          handleParams={handleTaxonomySelections}
          reset={reset}
        />

        <InputDropdown
          label={'Sequence Length'}
          options={['Less than', 'Greater than', 'In-between']}
          onChange={handleSequenceLength}
          reset={reset}
        />

        <InputDropdown
          label={'Collection Year'}
          options={['Earlier than', 'Later than', 'In-between']}
          onChange={handleCollectionYear}
          reset={reset}
        />

        <RadioButtonDropdown
          label={'Exclusion'}
          id={'primary_accession'}
          options={['Yes', 'No']}
          onChange={handleExclusion}
          reset={reset}
        />

        <div style={{ display: "flex", gap: "5px"}}>
          <Button size="sm" className="btn-main-filled" onClick={updateFilters}>
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
          </Button>
          <Button size="sm" className="btn-main-no-outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      <div className='size-12-font'>
        <ul>
          <li>click on various filters to view the different options</li>
          <li>options will show in drop-down once you start entering search</li>
          <li>click <em>Search</em> button to update sequences list with selected filters</li>
        </ul>
      </div>
    </div>
  );
};

export default BarFilter;