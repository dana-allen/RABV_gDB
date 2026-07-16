import useFetch from "./useFetch";


function usePhylogenyTree(params) {

  // const query_params = new URLSearchParams(Object.entries(params).sort()).toString();
    
  // const url = `/api/phylogeny/trees/${query_params ? `?${query_params}` : ''}`;
  const url = `/api/phylogeny/trees/`
  const { data, ...rest } = useFetch(url);

  const trees = data && data.tree

  console.log("META_DATA", data)

  //  Convert to CSV text
  const csvHeader = "primary_accession,major_clade,minor_clade,collection_year,country\n";
  const csvBody = data && data.meta_data
    .map(row => `${row.primary_accession}, ${row.EPA_major_clade}, ${row.EPA_minor_clade}, ${row.collection_year}, ${row.country}`)
    .join("\n");

  const meta_data = csvHeader + csvBody;
  // const meta_data = null

  return {trees, meta_data, ...rest };

};

export default usePhylogenyTree;