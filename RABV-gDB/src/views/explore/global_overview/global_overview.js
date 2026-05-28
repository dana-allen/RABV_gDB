import { useRef, useState, useCallback, useEffect } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { toPng } from 'html-to-image';
import BarFilter from 'components/filters/BarFilter';
// Hooks and Contexts
import {  useDownload, useMap } from "hooks"
import { useLoadingWheelHandler, useErrorHandler  } from "contexts"

// Specific Components
import Map from "./components/Map"
import RegionDetails from "./components/RegionDetails";

// Generic Components
import CladeTree from "components/trees/CladeTree"

// Helpers
import { formatMetaDataRegions } from 'assets/javascript/formatHelper'



const GlobalOverview = () => {
  const mapRef = useRef(null);

  const [content, setContent] = useState("")
  const [country, setCountry] = useState("")
  const [countryCode, setCountryCode] = useState(null)

  // Contexts & Hooks
  const { triggerLoadingWheel } = useLoadingWheelHandler();
  const { triggerError } = useErrorHandler();

  const { downloadFile } = useDownload();
  const [params, setParams] = useState();
  
  const {countryData, maxCount, minCount, loading, error} = useMap(params)
  
  // When filters are applied, just update params -> triggers hook
  const handleFiltersChange = useCallback((data) => {
    const keysToRemove = ["exclusion_status"];

    setParams((prev) => {

      const filteredPrev = data
        ? Object.fromEntries(
            Object.entries(data).filter(([key]) => !keysToRemove.includes(key))
          )
        : {};

      if (!data || Object.keys(data).length === 0) { return filteredPrev; }

      return {
        ...filteredPrev,
        ...data,
      };
    });

  }, []);

  const downloadMapAsPNG = (mapRef) => {
    if (!mapRef.current) return;
    toPng(mapRef.current, { backgroundColor: '#fff', cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        downloadFile(dataUrl, "map-with-legend.png", "png");
      })
      .catch((err) => {
          console.error('Failed to export map:', err);
    });
  };

  const handleCountryClicked = (value) => {
    if (countryData[value]){
      const formatted_regions = formatMetaDataRegions(countryData[value])
      countryData[value]["status"] = formatted_regions["status"] 
    }
    setCountryCode(value)
    setCountry(countryData[value])
  }

  useEffect(() => {

    triggerLoadingWheel(loading)
    if(error) triggerError(error);

  }, [loading, error]);

  const handleReset = useCallback((data) => {}, []);

   
  return (
    <div className="container">
      <h2>Global Overview</h2>
      <p>
        This map shows the global distribution of sequences by country. You can filter the data using various criteria, 
        and the map will update to reflect the selected subset.
        Click on a country to view detailed information about that country and explore the sequences.
      </p>
      <BarFilter onApplyFilter={handleFiltersChange} onClickReset={handleReset}/>
      {!loading &&
        <div>
          <div className="row">
            <div className='col-9'>
              <div className='tree-wrapper'>
                <div ref={mapRef}>
                    <Map 
                        setTooltipContent={setContent} 
                        countryCounts={countryData} 
                        maxCount={maxCount} 
                        minCount={minCount} 
                        countryClicked={(e) => handleCountryClicked(e)}>
                    </Map>
                </div>
              </div>
            </div>
            

            <div className='col-3'>
              {/* <CladeTree onCladeSelect={handleFiltersChange}/> */}
              
              <div className="col right-align" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  className="btn-main-filled"
                  style={{ marginRight: '2px' }}
                  onClick={() => downloadMapAsPNG(mapRef)}
                >
                  Download Map
                </Button>
              </div>

              <hr />

              {country && 
                <div style={{ marginTop:'5px'}}>
                  <RegionDetails country={country} />

                  <Link to="/sequences" state={{
                                                filters: {
                                                  ...params,
                                                  ...(countryCode && { country_validated: countryCode })
                                                }
                                              }}>
                    <Button className="btn-main-filled " size='sm'> Explore sequences </Button>
                  </Link>

                </div> 
              }
            </div>
          </div>
          
          <ReactTooltip id="map-tooltip">{content}</ReactTooltip>
      </div>
    }
    </div>
    

  )
}

export default GlobalOverview