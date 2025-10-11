# Client Dependencies for ATS Recruitment System

This document lists all the dependencies required for the client-side application. Make sure to run the appropriate installation commands to get all the necessary packages.

## Installation Guide

To install all required dependencies at once, run:

```bash
npm install
```

If you get TypeScript errors while building the client, you may need to modify the tsconfig.app.json file to temporarily disable strict type checking during development:

```json
// In tsconfig.app.json, set these options:
{
  "compilerOptions": {
    // ...other options
    "verbatimModuleSyntax": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitAny": false
  }
}
```

## Dependency Details

### Core Dependencies
- **React**: UI library
- **React Router DOM**: Routing for React applications
- **Axios**: HTTP client for API requests
- **MUI (Material-UI)**: React component library for UI
  - `@mui/material`: Core components
  - `@mui/icons-material`: Material Design icons
  - `@mui/x-date-pickers`: Date/time pickers
  - `@emotion/react` & `@emotion/styled`: Styling engines for MUI

### Form Handling
- **Formik**: Form management library
- **Yup**: Schema validation library

### Data Visualization
- **Chart.js**: Chart library
- **React-ChartJS-2**: React wrapper for Chart.js

### Utilities
- **date-fns**: Modern JavaScript date utility library

## Development Dependencies

- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **ESLint**: Code linting
- **@types packages**: TypeScript type definitions for libraries

## Troubleshooting

If you encounter issues with missing dependencies:

1. First, make sure you've run `npm install`
2. Check for any errors in the console
3. Make sure you're using compatible versions of the dependencies (see package.json)
4. Try deleting the node_modules folder and package-lock.json, then run `npm install` again

If you get TypeScript errors that are blocking your development, you can temporarily use a less strict TypeScript configuration as mentioned above, but make sure to fix the type issues before production deployment.