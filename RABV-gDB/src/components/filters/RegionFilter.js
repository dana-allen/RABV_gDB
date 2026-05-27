import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, InputAdornment } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

import { useRegion } from 'hooks';

import 'assets/styles/filters.css'

const RegionFilter = ({ref, label, region_level, idKey, params, handleId}) => {

  const [ids, setIds] = useState([]) 
  const newParams = params[idKey] && params[idKey].split(',')

  const handleChange = (event, value) => {
    setSelectedOptions(value)
    handleId(`${value}`)
  }
  const { data, loading, error} = useRegion(region_level, params)
  

  useEffect(() => {
    if (data){
      setIds(data)
    }
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

export default RegionFilter;