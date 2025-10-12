import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SearchableSelect from './SearchableSelect';

// South African locations - 4 biggest cities + other major cities
export const SOUTH_AFRICAN_LOCATIONS = [
  // Big 4 Cities
  { label: 'Johannesburg, Gauteng', value: 'Johannesburg, Gauteng', category: 'Major Cities' },
  { label: 'Cape Town, Western Cape', value: 'Cape Town, Western Cape', category: 'Major Cities' },
  { label: 'Durban, KwaZulu-Natal', value: 'Durban, KwaZulu-Natal', category: 'Major Cities' },
  { label: 'Pretoria, Gauteng', value: 'Pretoria, Gauteng', category: 'Major Cities' },
  
  // Other Major Cities
  { label: 'Port Elizabeth, Eastern Cape', value: 'Port Elizabeth, Eastern Cape', category: 'Other Cities' },
  { label: 'Bloemfontein, Free State', value: 'Bloemfontein, Free State', category: 'Other Cities' },
  { label: 'East London, Eastern Cape', value: 'East London, Eastern Cape', category: 'Other Cities' },
  { label: 'Pietermaritzburg, KwaZulu-Natal', value: 'Pietermaritzburg, KwaZulu-Natal', category: 'Other Cities' },
  { label: 'Nelspruit, Mpumalanga', value: 'Nelspruit, Mpumalanga', category: 'Other Cities' },
  { label: 'Kimberley, Northern Cape', value: 'Kimberley, Northern Cape', category: 'Other Cities' },
  { label: 'Polokwane, Limpopo', value: 'Polokwane, Limpopo', category: 'Other Cities' },
  { label: 'Mahikeng, North West', value: 'Mahikeng, North West', category: 'Other Cities' },
  
  // Remote/Other Options
  { label: 'Remote Work', value: 'Remote Work', category: 'Work Arrangements' },
  { label: 'Hybrid (Multiple Locations)', value: 'Hybrid (Multiple Locations)', category: 'Work Arrangements' },
  { label: 'Other Location', value: 'Other Location', isOther: true, category: 'Custom' },
];

// Common South African job departments
export const JOB_DEPARTMENTS = [
  // Core Business Functions
  { label: 'Human Resources', value: 'Human Resources', category: 'Core Business' },
  { label: 'Information Technology', value: 'Information Technology', category: 'Core Business' },
  { label: 'Finance & Accounting', value: 'Finance & Accounting', category: 'Core Business' },
  { label: 'Sales & Marketing', value: 'Sales & Marketing', category: 'Core Business' },
  { label: 'Operations', value: 'Operations', category: 'Core Business' },
  
  // Specialized Departments
  { label: 'Engineering', value: 'Engineering', category: 'Technical' },
  { label: 'Research & Development', value: 'Research & Development', category: 'Technical' },
  { label: 'Quality Assurance', value: 'Quality Assurance', category: 'Technical' },
  { label: 'Product Management', value: 'Product Management', category: 'Technical' },
  
  // Support Functions
  { label: 'Customer Service', value: 'Customer Service', category: 'Support' },
  { label: 'Legal & Compliance', value: 'Legal & Compliance', category: 'Support' },
  { label: 'Procurement', value: 'Procurement', category: 'Support' },
  { label: 'Administration', value: 'Administration', category: 'Support' },
  
  // Industry Specific (South Africa)
  { label: 'Mining & Resources', value: 'Mining & Resources', category: 'Industry Specific' },
  { label: 'Agriculture & Farming', value: 'Agriculture & Farming', category: 'Industry Specific' },
  { label: 'Healthcare', value: 'Healthcare', category: 'Industry Specific' },
  { label: 'Education & Training', value: 'Education & Training', category: 'Industry Specific' },
  { label: 'Banking & Financial Services', value: 'Banking & Financial Services', category: 'Industry Specific' },
  { label: 'Tourism & Hospitality', value: 'Tourism & Hospitality', category: 'Industry Specific' },
  { label: 'Manufacturing', value: 'Manufacturing', category: 'Industry Specific' },
  { label: 'Retail & FMCG', value: 'Retail & FMCG', category: 'Industry Specific' },
  
  // Other
  { label: 'Other Department', value: 'Other Department', isOther: true, category: 'Custom' },
];

interface LocationSelectProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  label = 'Location',
}) => {
  return (
    <SearchableSelect
      label={label}
      value={value}
      onChange={onChange}
      options={SOUTH_AFRICAN_LOCATIONS}
      multiple={multiple}
      placeholder={multiple ? "Select locations..." : "Select a location..."}
      icon={<LocationOnIcon />}
      allowCustom={true}
      customLabel="Specify Other Location"
      helperText={multiple 
        ? "Select one or more locations, or choose 'Other' to specify"
        : "Choose from major South African cities or specify other location"
      }
      required={required}
      disabled={disabled}
      error={error}
      errorMessage={errorMessage}
    />
  );
};

interface DepartmentSelectProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

export const DepartmentSelect: React.FC<DepartmentSelectProps> = ({
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  label = 'Department',
}) => {
  return (
    <SearchableSelect
      label={label}
      value={value}
      onChange={onChange}
      options={JOB_DEPARTMENTS}
      multiple={multiple}
      placeholder={multiple ? "Select departments..." : "Select a department..."}
      icon={<BusinessIcon />}
      allowCustom={true}
      customLabel="Specify Other Department"
      helperText={multiple 
        ? "Select one or more departments, or choose 'Other' to specify"
        : "Choose from common departments or specify other department"
      }
      required={required}
      disabled={disabled}
      error={error}
      errorMessage={errorMessage}
    />
  );
};

export default { LocationSelect, DepartmentSelect };