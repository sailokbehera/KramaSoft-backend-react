import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDebounce from '../../hooks/useDebounce';
import { CourseService } from '../../apis/rest.app';

function CourseAutoComplete({
    label,
    helperText,
    error,
    onChange,
    onSelect,
    selected,
    setSelected,
    value = '',
    ...others
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState('');
    const [searchValue, setSearchValue] = useState({ name: value });
    const [onLoad, setOnLoad] = useState(false);

    const debouncedSearchTerm = useDebounce(searchValue.name);

    useEffect(() => {
        CourseService.find({
            query: {
                $limit: 10,
                $skip: 0,
            },
        })
            .then((response) => {
                setOptions([...response.data]);
                setLoading(false);
            })
            .catch((error) => {
                console.log('error', error);
            });
    }, []);

    const onSearch = (searchValue) => {
        if (searchValue === key) return true;
        setKey(searchValue);
        setOptions([]);
        setLoading(true);
        CourseService.find({
            query: {
                name: {
                    $regex: `.*${searchValue}.*`,
                    $options: 'i',
                },
            },
        })
            .then((response) => {
                setOptions([...response.data]);
                setLoading(false);
            })
            .catch((error) => {
                console.log('error', error);
            });
    };

    useEffect(() => {
        if (onLoad) {
            onSearch(searchValue && searchValue.name ? searchValue.name.trim() : '');
        } else setOnLoad(true);
    }, [debouncedSearchTerm]);

    return (
        <Autocomplete
            filterSelectedOptions
            freeSolo
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
                if (newValue) {
                    onSelect(newValue ? newValue : null);
                    //setSearchValue({name:""})
                }
            }}
            options={options}
            renderInput={(params) => (
                <TextField
                    error={error}
                    fullWidth
                    helperText={helperText}
                    // margin="normal"
                    label={label}
                    placeholder="Start typing to see suggestions"
                    value={value}
                    variant="outlined"
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    onChange={(event) => {
                        const _searchInput = event && event.target && event.target.value ? event.target.value : '';
                        setSearchValue({ name: _searchInput });
                        onChange(event);
                    }}
                />
            )}
            value={searchValue}
            {...others}
        />
    );
}

CourseAutoComplete.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    handleClear: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
};

CourseAutoComplete.defaultProps = {
    type: 'global',
    onChange: () => {},
    onSelect: () => {},
    handleClear: () => {},
    error: false,
    helperText: '',
    label: 'Vendor',
};

export default CourseAutoComplete;
