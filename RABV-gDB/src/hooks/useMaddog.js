import useFetch from "./useFetch";


function useMaddog() {
    
    const url = `/api/lineages/maddog`;

    const { data, ...rest } = useFetch(url);
    const maddogTree = data ? data : null;

    return { maddogTree, ...rest };

};

export default useMaddog;