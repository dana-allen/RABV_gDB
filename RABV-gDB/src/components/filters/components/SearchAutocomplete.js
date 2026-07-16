import { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, InputAdornment } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import 'assets/styles/filters.css';

// Debounce utility
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SearchAutocomplete = ({ ref, label, url, idKey, handleId, preSelected = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(preSelected.map(id => ({ [idKey]: id })));

  // Memoized fetch function
  const fetchOptions = useMemo(
    () =>
      debounce(async (query) => {
        if (!query) return;
        if (query.length > 2) {
          setLoading(true);
          try {
            const res = await fetch(`${url}${query}`, {headers: { database: process.env.REACT_APP_DATABASE }});
            const data = await res.json() || [];

            // Merge with already selected options so chips are visible
            const merged = [
              ...selectedOptions,
              ...data.filter(d => !selectedOptions.find(s => s[idKey] === d[idKey]))
            ];

            setOptions(merged);
          } catch (err) {
            console.error('Error fetching options:', err);
          } finally {
            setLoading(false);
          }
        }
      }, 300),
    [url, selectedOptions, idKey]
  );

  const handleInputChange = async (value) => {
    setInputValue(value);

    

    const ids = value
      .split(/[,\t\r\n| ]+/)
      .map(v => v.replace(/\|/g, "").trim())
      .filter(v => v && !/^[-]+$/.test(v));

    if (ids.length  <= 1){
      return
    } else {

    setLoading(true);

    try {
      const results = await Promise.all(
        ids.map(async id => {
          const res = await fetch(`${url}${id}`, {headers: { database: process.env.REACT_APP_DATABASE }});
          const data = await res.json();

          // adjust depending on your API
          return Array.isArray(data) ? data[0] : data;
        })
      );

      const selected = results.filter(Boolean);

      setSelectedOptions(selected);
      setOptions(selected);

      handleId?.(selected.map(x => x[idKey]));
    } finally {
      setLoading(false);
    }
    }
  };
  // const handleInputChange = (value) => {
  //   const tmp_value = value.split(',')
  //   console.log("TEMP VALUE", tmp_value)
  //   if (tmp_value.length > 0){
  //     setInputValue(tmp_value)
  //     setOptions(tmp_value)
  //   } else {
  //     setInputValue(value)
  //   }
  //   // AB009601,AB009663
  // }

  useEffect(() => {
    if (inputValue) {
      fetchOptions(inputValue);
    } else {
      // Ensure pre-selected items are still shown when input is empty
      setOptions(selectedOptions);
    }
  }, [inputValue, fetchOptions, selectedOptions]);

  return (
    <div ref={ref}>
      <Autocomplete
        disablePortal
        multiple
        size="small"
        options={options}
        value={selectedOptions}
        getOptionLabel={(option) => option[idKey] || ""}
        loading={loading}
        filterOptions={(x) => x} // prevent filtering out selected items
        // onInputChange={(event, value) => setInputValue(value)}
        onInputChange={(event, value) => handleInputChange(value)}
        onChange={(e, value) => {
          setSelectedOptions(value);
          handleId?.(value.map(v => v[idKey]));
        }}
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

export default SearchAutocomplete;