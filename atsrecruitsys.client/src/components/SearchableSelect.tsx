import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Chip,
  Typography,
  AutocompleteRenderOptionState,
  AutocompleteOwnerState,
  AutocompleteRenderGetTagProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SyntheticEvent } from 'react';
import { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete';

const StyledAutocomplete = styled(Autocomplete<Option, boolean, boolean, boolean>)(({ theme }) => ({
  '& .MuiAutocomplete-tag': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiChip-deleteIcon': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

interface Option {
  label: string;
  value: string;
  isOther?: boolean;
  category?: string;
}

interface SearchableSelectProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: Option[];
  multiple?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  allowCustom?: boolean;
  customLabel?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onChange,
  options,
  multiple = false,
  placeholder,
  icon,
  allowCustom = true,
  customLabel = "Other (please specify)",
  helperText,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Check if "Other" is selected
  useEffect(() => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      setShowCustomInput(values.some(v => 
        options.find(opt => opt.value === v)?.isOther
      ));
    } else {
      const selectedOption = options.find(opt => opt.value === value);
      setShowCustomInput(selectedOption?.isOther || false);
    }
  }, [value, options, multiple]);

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: Option | Option[] | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Option>
  ) => {
    if (multiple) {
      const selectedValues = (newValue as Option[] || []).map(option => option.value);
      onChange(selectedValues);
    } else {
      const selectedValue = (newValue as Option)?.value || '';
      onChange(selectedValue);
    }
  };

  const handleCustomValueChange = (customVal: string) => {
    setCustomValue(customVal);
    
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      const otherIndex = values.findIndex(v => 
        options.find(opt => opt.value === v)?.isOther
      );
      
      if (otherIndex >= 0) {
        const newValues = [...values];
        if (customVal.trim()) {
          newValues[otherIndex] = customVal.trim();
        } else {
          newValues.splice(otherIndex, 1);
          setShowCustomInput(false);
        }
        onChange(newValues);
      }
    } else {
      onChange(customVal.trim());
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      return values.map(val => {
        const option = options.find(opt => opt.value === val);
        return option || { label: val, value: val };
      });
    } else {
      const option = options.find(opt => opt.value === value);
      return option || null;
    }
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: Option,
    state: AutocompleteRenderOptionState,
    ownerState: AutocompleteOwnerState<Option, boolean, boolean, boolean>
  ) => (
    <Box component="li" {...props} key={option.value}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {icon && (
          <Box sx={{ mr: 1, color: 'text.secondary' }}>
            {icon}
          </Box>
        )}
        <Box>
          <Typography variant="body1">
            {option.label}
          </Typography>
          {option.category && (
            <Typography variant="caption" color="text.secondary">
              {option.category}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );

  const renderTags = (
    tagValue: Option[], 
    getTagProps: AutocompleteRenderGetTagProps,
    ownerState: AutocompleteOwnerState<Option, boolean, boolean, boolean>
  ) =>
    tagValue.map((option, index) => (
      <Chip
        {...getTagProps({ index })}
        key={option.value}
        label={option.label}
        size="small"
        color="primary"
        variant="filled"
      />
    ));

  return (
    <Box>
      <StyledAutocomplete<Option, boolean, boolean, boolean>
        multiple={multiple as boolean}
        value={getDisplayValue()}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        options={options}
        getOptionLabel={(option: Option) => option.label}
        isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
        renderOption={renderOption}
        renderTags={multiple ? renderTags : undefined}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            helperText={error ? errorMessage : helperText}
            required={required}
            disabled={disabled}
            error={error}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {icon && (
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>
                      {icon}
                    </Box>
                  )}
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={disabled}
        filterOptions={(options: Option[], params) => {
          const filtered = options.filter(option =>
            option.label.toLowerCase().includes(params.inputValue.toLowerCase())
          );
          return filtered;
        }}
      />
      
      {/* Custom input for "Other" option */}
      {allowCustom && showCustomInput && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={customLabel}
            value={customValue}
            onChange={(e) => handleCustomValueChange(e.target.value)}
            placeholder="Please specify..."
            size="small"
            helperText="Please provide specific details"
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchableSelect;