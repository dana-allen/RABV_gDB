
import useFetch from "./useFetch";

function useHostMutation(segment, params) {

    const query_params = new URLSearchParams(params).toString();
    const url = `${`/api/host_mutation/1`}${query_params ? `?${query_params}` : ''}`;
    const { data, ...rest } = useFetch(url);
    const translated_sequences = data ? data.translated_sequences : null
    const translated_reference_sequences = data ? data.reference_protein : null

    return { translated_reference_sequences, translated_sequences, ...rest };

};

export default useHostMutation;