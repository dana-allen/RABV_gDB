import { useState } from 'react';
import AdvancedMDFilter from 'components/filters/AdvancedMDFilter'

const SequenceDownload = ({filters}) => {
    console.log(filters)
    const [show, setShow] = useState(false)
    const handleClose = () => { setShow(false) }
    const [loading, setLoading] = useState(false)
    const download = async (params) => {
        try {
            setLoading(true);

            const query_params = new URLSearchParams(params).toString();

            const url = `/api/sequences/download_sequences/${
                query_params ? `?${query_params}` : ""
            }`;

            const res = await fetch(url);

            const blob = await res.blob();

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "sequences.fasta";
            link.click();

        } catch (err) {
            // setError(err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };


    const handleOnClick = () => {
        const final_params = { ...filters["filters"] };
        download(final_params);
    };

    return (
        <div>
            {/* <a onClick={handleOnClick}>Download Meta-data</a> */}
            {loading && <a onClick={() => setShow(true)}>Downloading</a> }
            {!loading && <a onClick={handleOnClick}>Download Sequences</a> }
        </div>

    );
};

export default SequenceDownload;