import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#63a4ff',
            dark: '#004ba0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff5c8d',
            dark: '#9b0026',
            contrastText: '#fff',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
            contrastText: '#fff',
        },
    },
});

export default theme;
