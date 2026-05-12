import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import 'assets/styles/genome_viewer.css'

export const FeatureBtn = ({i, feature, min, range, onClick}) => {
    const leftPercent = ((feature.cds_start - min) / range) * 100;
    const widthPercent = ((feature.cds_end - feature.cds_start) / range) * 100;

    return (
      <OverlayTrigger
          key={i}
          placement="top"
          overlay={
            <Tooltip id={`tooltip-${i}`}>
            {feature.product} ({feature.cds_start}-{feature.cds_end})
            </Tooltip>
          }
          >
          <button 
            className='features-btn'
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
            onClick={() => onClick(feature)}
          >
            {feature.product}
          </button>
      </OverlayTrigger>
    );
}
const clamp = (v) => Math.max(0, Math.min(100, v));
export const FeatureBtnMultiple = ({ i, feature, min, range, onClick }) => {
  // compute overall bounds of the feature
  const minStart = Math.min(...feature.regions.map(r => r.cds_start));
  const maxEnd = Math.max(...feature.regions.map(r => r.cds_end));

    const overallLeft = clamp(((minStart - min) / range) * 100);
  const overallWidth = clamp(((maxEnd - minStart) / range) * 100);


  return (
    <OverlayTrigger
      key={i}
      placement="top"
      overlay={
        <Tooltip id={`tooltip-${i}`}>
          {feature.product} {feature.regions.map(r => `(${r.cds_start}-${r.cds_end})`).join(', ')}
        </Tooltip>
      }
    >
      <div className="features-btn-container" style={{ position: "absolute", left: `${overallLeft}%`, width: `${overallWidth}%`, top: `${feature.row * 35}px`, height: "30px", cursor: "pointer" }}
        onClick={() => onClick(feature)}>

        {/* Individual region blocks */}
        {feature.regions.map((region, idx) => {
          const relLeftPercent = clamp(((region.cds_start - minStart) / (maxEnd - minStart || 1)) * 100);
          const relWidthPercent = clamp(((region.cds_end - region.cds_start) / (maxEnd - minStart || 1)) * 100);

          return (
            <div
              key={idx}
              className="features-btn"
              style={{
                left: `${relLeftPercent}%`,
                width: `${relWidthPercent}%`,
                top: `${feature.row * 5}px`,
                height: "30px",
                position: "absolute",
                padding: "2px"
              }}
            >
              <strong>{feature.product}</strong>
            </div>
          );
        })}

        {/* Connector lines between regions */}
        {feature.regions.length > 1 &&
          feature.regions.slice(0, -1).map((region, idx) => {
            const next = feature.regions[idx + 1];
            const relLeft = clamp(((region.cds_end - minStart) / (maxEnd - minStart || 1)) * 100);
            const relWidth = clamp(((next.start - region.cds_end) / (maxEnd - minStart || 1)) * 100);


            return (
              <div
                key={`line-${idx}`}
                style={{
                  position: "absolute",
                  left: `${relLeft}%`,
                  width: `${relWidth}%`,
                  top: `${feature.row * 5 +5}px`,
                  borderTop: "1px dashed var(--feature-color, #008cba)"
                }}
              />
            );
          })}

      </div>
    </OverlayTrigger>
  );
};
function groupFeatures(features) {

  const grouped = {};

  features.forEach(f => {
    if (!grouped[f.product]) grouped[f.product] = { product: f.product, regions: [] };

    grouped[f.product].regions.push({
      cds_start: f.cds_start,
      cds_end: f.cds_end
    });
  });
  return Object.values(grouped);
}
export const Features = ({ features, min, range, setSelectedFeature, includeLabel=false }) => {

  var features2 = groupFeatures(features);

    // Assign rows to regions to avoid overlap
  const assignRows = (features) => {
    const rows = []; // each row is an array of regions already placed

    features.forEach((feature) => {
      if (feature.product != 'full'){ 
      let rowIndex = 0;

      for (; rowIndex <= rows.length; rowIndex++) {
        // ensure the row exists
        if (!rows[rowIndex]) rows[rowIndex] = [];

        // check if any of feature's regions overlap with regions in this row
        const overlap = feature.regions.some((region) =>
          rows[rowIndex].some(
            (r) => !(region.cds_end < r.cds_start || region.cds_start > r.cds_end) // overlap check
          )
        );

        if (!overlap) break; // found a row where this feature fits
      }

      // assign row to feature
      feature.row = rowIndex;

      // add all regions to that row
      feature.regions.forEach((region) => {
        rows[rowIndex].push(region);
      });
      }
    });
    return features;
  };

  features2 = assignRows(features2)

  const maxRow = Math.max(...features2.map(f => f.row || 0));
  const ROW_HEIGHT = 30;
  const ROW_GAP = 4;
  const totalHeight = (maxRow + 1) * (ROW_HEIGHT + ROW_GAP);

  return (
    <div className='row-style'>
      {includeLabel && <div className='label-style'></div>}
      {/* <div className='line-area-style features'> */}
      <div className='line-area-style features'
      style={{
          // position: 'relative',
          height: `${totalHeight}px`,   // <-- ensures space is reserved!
        }}
        >
      {/* <div> */}
        {features2.map((feature, i) => {
          if (feature.product === 'full') return null; 
          if (feature.regions.length > 1)
            return (
                
              <FeatureBtnMultiple
                key={i}
                i={i}
                feature={feature}
                min={min}
                range={range}
                onClick={() => setSelectedFeature(i)}
              />
              
            );
            else return (
               <FeatureBtnMultiple
                key={i}
                i={i}
                feature={feature}
                min={min}
                range={range}
                onClick={() => setSelectedFeature(i)}
              />

            )
        })}
      </div>
    </div>
  );
};
