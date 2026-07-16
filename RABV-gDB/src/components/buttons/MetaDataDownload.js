import { useState } from 'react';
import AdvancedMDFilter from 'components/filters/AdvancedMDFilter'

const MetaDataDownload = ({filters}) => {
    console.log(filters)
    const [show, setShow] = useState(false)
    const handleClose = () => { setShow(false) }
    const [loading, setLoading] = useState(false)
    const download = async (params) => {
        try {
            setLoading(true);

            const query_params = new URLSearchParams(params).toString();

            const url = `/api/sequences/download_sequences_meta_data/${
                query_params ? `?${query_params}` : ""
            }`;

            const res = await fetch(url, {headers: { database: process.env.REACT_APP_DATABASE }});

            const blob = await res.blob();

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "meta_data.csv";
            link.click();

        } catch (err) {
            // setError(err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };


    const handleOnClick = () => {
        download({...filters});
    };

    const handleApplyFilter = (e) => {
        console.log("alignment filters", e)
        const final_params = { ...filters["filters"], ...e };
        download(final_params);
    };
    return (
        <div>
            {/* <a onClick={handleOnClick}>Download Meta-data</a> */}
            {loading && <a onClick={() => setShow(true)}>Downloading</a> }
            {!loading && <a onClick={() => setShow(true)}>Download Meta-data</a> }
            <AdvancedMDFilter 
                show={show} 
                onClose={handleClose} 
                onApplyFilter={handleApplyFilter} 
            />
        </div>

    );
};

export default MetaDataDownload;