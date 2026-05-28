import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

import { useRegion } from 'hooks';
import 'assets/styles/filters.css';

const RegionFilter = ({
  ref,
  label,
  region_level,
  params,
  handleId
}) => {

  const [ids, setIds] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const { data, loading } = useRegion(region_level, params);

  // load options
  useEffect(() => {
    if (data) {
      setIds(data);
    }
  }, [data]);

  // sync preselected values when params change
  useEffect(() => {
    if (ids.length && params?.[region_level]) {
      const selectedIds = params[region_level];

      const preselectedObjects = ids.filter(item =>
        selectedIds.includes(item.id)
      );

      setSelectedOptions(preselectedObjects);
    }
  }, [ids, params, region_level]);

  const handleChange = (event, value) => {
    setSelectedOptions(value);

    // send ONLY ids upward
    handleId(value.map(v => v.id));
  };

  return (
    <div ref={ref}>
      <Autocomplete
        disablePortal
        multiple
        size="small"
        options={ids}
        value={selectedOptions}
        onChange={handleChange}
        getOptionLabel={(option) => option.display_name || ""}

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