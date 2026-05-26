import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import { FormControl, TextField } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useCladeSubmission from "hooks/useCladeSubmission";

import "assets/styles/fastaAnalysis.css";

const SequenceSubmission = ({ onJobFinished }) => {
  const { submitClade, data, loading, error } = useCladeSubmission();
  const fileInputRef = useRef(null);

  const [sequence, setSequence] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      setFiles([e.target.files[0]]);
    }
  };

  const handleResetButton = () => {
    setSequence("");
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateSequence = (event) => {
    setSequence(event.target.value);
  };

  const handleLoadExampleButton = async () => {
    const filePath = "/static/examples/seqAlign.txt";

    try {
      const response = await fetch(filePath);
      const text = await response.text();
      setSequence(text);
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };

    const handleSubmitButton = async () => {
      let payload;

      if (files.length > 0) {
          const formData = new FormData();
          formData.append("file", files[0]);
          payload = formData;
      } else {
          payload = JSON.stringify({ fasta: sequence });
      }

      const result = await submitClade(payload); // submitClade calls postData(url, payload)

      if (result) {
          onJobFinished(result);
      }
    };

  return (
    <div>
      <h4>Sequence(s) Submission</h4>

      <div className="row input-container">
        <div className="col-2">
          <p>
            <b>Enter query sequence(s)</b>
          </p>
        </div>

        <div className="col-7">
          <FormControl fullWidth>
            <TextField
              value={sequence}
              size="small"
              fullWidth
              placeholder="paste sequence in the format of >header"
              multiline
              rows={6}
              variant="outlined"
              InputProps={{
                style: { fontSize: "12px" },
              }}
              onChange={updateSequence}
            />
          </FormControl>
        </div>
      </div>

      <div className="row">
        <div className="col-2">
          <p>
            <b>or, upload FASTA file</b>
          </p>
        </div>

        <div className="col-9">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} />
        </div>
      </div>

      <div>
        <Button
          className="btn-main-filled"
          size="sm"
          onClick={handleResetButton}
        >
          Reset
        </Button>
      </div>

        <div className="float-right">
            <Button
                className="btn-main-filled example-btn"
                onClick={handleLoadExampleButton}
                >
                Load Example
            </Button>

            <Button
                className={`btn ${loading ? "btn-main-outline" : "btn-main-filled"}`}
                  disabled={!sequence && files.length === 0 || loading}
                onClick={handleSubmitButton}
                >
                {loading ? (
                        <>
                        <FontAwesomeIcon
                            icon={["fas", "cog"]}
                            spin
                            style={{ marginRight: "6px" }}
                        />
                        Running...
                        </>
                    ) : (
                        "Submit"
                    )}
            </Button>
        </div>

      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};

export default SequenceSubmission;