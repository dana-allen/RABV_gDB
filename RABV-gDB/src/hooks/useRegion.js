
import useFetch from "./useFetch";

function useRegion(region_level, params) {
    
    const query_params = new URLSearchParams(params).toString();
    // /api/filters/search_country/
    const url = `${`/api/filters/search_${region_level}`}/${query_params ? `?${query_params}` : ''}`;
    const { data, ...rest } = useFetch(url);
    // console.log(data)
    return { data, ...rest };

};

export default useRegion;