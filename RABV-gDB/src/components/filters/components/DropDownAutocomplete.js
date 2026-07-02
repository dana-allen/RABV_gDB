import { useState, useEffect, useMemo } from "react";
import useFetch from "hooks/useFetch";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import "assets/styles/filters.css";


const DropDownAutocomplete = ({ref, url, label, idKey, params, handleId, preSelected = []}) => {

  const [ids, setIds] = useState([]) 
  const newParams = params && params.split(',')

  const handleChange = (event, value) => {
    console.log(value)
    setSelectedOptions(value)
    handleId(`${value}`)
  }

  const { data, loading, error } = useFetch(url);

  useEffect(() => {
    if (data){ setIds(data) }
  }, [data]);

  const [selectedOptions, setSelectedOptions] = useState(newParams)

  return (
    <div ref={ref}>
      <Autocomplete
        disablePortal
        defaultValue={[]} // Pre-filled options
        value={selectedOptions}
        multiple
        size="small"
        onChange={handleChange}
        options={[... new Set(ids.map(x => x[idKey]))]}
        // loading={isPending}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`Find ${label}`}
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
          )}
          sx={{
            width: 220,
            "& .MuiOutlinedInput-root": {
              minHeight: 25,
              fontSize: "0.75rem",
            },
            "& .MuiAutocomplete-tag": {
              height: 20,
              fontSize: "0.75rem",
            },
          }}
      />
    </div>
  );
};

export default DropDownAutocomplete;