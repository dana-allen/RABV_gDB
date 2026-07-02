import useFetch from "./useFetch";


function usePhylogenyTree() {
    
    const url = `/api/phylogeny/tree/`;
    const { data, ...rest } = useFetch(url);

    const trees = data && data.tree
    console.log(data)
    //  Convert to CSV text
    const csvHeader = "primary_accession,major_clade,minor_clade,collection_year,country,phylum,class,order,family,genus,species\n";
    const csvBody = data && data.meta_data
      .map(row => `${row.primary_accession},${row.EPA_major_clade},${row.EPA_minor_clade}, ${row.collection_year}, ${row.country}, ${row.phylum}, ${row.class}, ${row.order_category}, ${row.family}, ${row.genus}, ${row.species}`)
      .join("\n");

    const meta_data = csvHeader + csvBody;
    // const meta_data = null

    return {trees, meta_data, ...rest };

};

export default usePhylogenyTree;