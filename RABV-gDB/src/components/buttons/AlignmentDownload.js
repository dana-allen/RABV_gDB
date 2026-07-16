import { useState } from 'react';

import AlignmentFilter from '../filters/AlignmentFilter'


const AlignmentDownload = ({filters, sequences_count}) => {

    const [show, setShow] = useState(false)
    const handleClose = () => { setShow(false) }
    // const download = () => { setShow(true)}

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const download = async (params) => {
        try {
            setLoading(true);

            const query_params = new URLSearchParams(params).toString();

            const url = `/api/alignments/download${
                query_params ? `?${query_params}` : ""
            }`;

            const res = await fetch(url, {headers: { database: process.env.REACT_APP_DATABASE }});

            const blob = await res.blob();

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "alignments.fasta";
            link.click();

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    const handleApplyFilter = (e) => {
        const final_params = { ...filters["filters"], ...e };
        download(final_params);
    };

    return (
        <div>
            <a onClick={() => setShow(true)}>Download Alignments</a>
            <AlignmentFilter show={show} 
                            onClose={handleClose} 
                            // params={params} 
                            sequences_count={sequences_count}
                            onApplyFilter={handleApplyFilter} />
        </div>

    );
};

export default AlignmentDownload;