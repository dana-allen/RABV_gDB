
import useFetch from "./useFetch";

function useHostMutation(segment, params) {

    // if (params) {
    //     params.master_accession = process.env.MASTER_ACCESSION
    // } else {
    //     params = { "master_accession":process.env.MASTER_ACCESSION }
    // }
    console.log(process.env.REACT_APP_MASTER_ACCESSION)
    params = {
        ...(params || {}),
        master_accession: process.env.REACT_APP_MASTER_ACCESSION
    };

    
    const query_params = new URLSearchParams(params).toString();
    const url = `${`/api/mutations/host_adaptation/1`}${query_params ? `?${query_params}` : ''}`;
    const { data, ...rest } = useFetch(url);
    const translated_sequences = data ? data.translated_sequences : null
    const translated_reference_sequences = data ? data.reference_protein : null

    return { translated_reference_sequences, translated_sequences, ...rest };

};

export default useHostMutation;