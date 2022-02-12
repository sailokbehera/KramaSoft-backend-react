import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
let theme = createMuiTheme({
    palette: {
        type: 'light',
        common: {
            black: '#000',
            white: '#fff',
            drawer: '#2F415E',
        },
        primary: {
            main: '#037FFB',
        },
        other: {
            subTextColor: '#878787',
            backgroundMenuColor: '#e9f5ff',
            textField: '#eeeeee',
        },
        // secondary: {
        //     main: '#2F415E',
        // },
        text: {
            primary: '#000000',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)',
            other: '#757575',
        },
        background: {
            paper: '#ffffff',
            default: '#ffffff',
            other: '#F3F3F3',
            drawer: 'rgba(3, 127, 251, 0.05)',
            stepper: '#9A9A9A',
            main: '#f3f3f3',
            common: '#E8E8E8',
            cropper: '#EEF7FF',
            lock: 'rgba(0, 0, 0, 0.7)',
            correctQuestion: '#DEFFE1',
        },
        divider: 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
        fontFamily: 'SFProDisplay',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontWeight: 300,
            fontSize: '6rem',
            lineHeight: 1.167,
            letterSpacing: '"-0.01562em',
        },
        h2: {
            fontWeight: 300,
            fontSize: '3.57rem',
            lineHeight: 1.2,
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '22px',
            lineHeight: '26px',
            letterSpacing: '0rem',

            '@media(max-width: 500px)': {
                fontSize: '18px',
            },
        },
        h4: {
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '21.5px',
            letterSpacing: '0rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '19px',
            letterSpacing: 'normal',
        },
        h6: {
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '19px',
            letterSpacing: 'normal',
        },
        subtitle1: {
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.75,
            letterSpacing: '0.00938em',
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: 2,
            letterSpacing: '0.00714em',
        },
        body1: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.00938em',
        },
        body2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.43,
            letterSpacing: '0.01071em',
        },
        button: {
            fontWeight: 600,
            fontSize: '16px',
            // lineHeight: '19px',
            letterSpacing: '0.02857em',
            // textTransform: 'uppercase',
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 6,
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
});

theme = {
    ...theme,
    overrides: {
        MuiDrawer: {
            paperAnchorDockedLeft: {
                borderRight: 'none',
            },
        },
        MuiButton: {
            root: {
                padding: '6px 10px',
            },
            label: {
                textTransform: 'none',
            },
            contained: {
                boxShadow: 'none',
                '&:active': {
                    boxShadow: 'none',
                },
            },
        },
        MuiIconButton: {
            root: {
                padding: theme.spacing(1),
            },
        },
        MuiTooltip: {
            tooltip: {
                borderRadius: 4,
            },
        },
        MuiDivider: {
            root: {
                backgroundColor: '#404854',
            },
        },
        MuiListItemText: {
            primary: {
                fontWeight: theme.typography.fontWeightMedium,
            },
        },
        MuiListItemIcon: {
            root: {
                color: 'inherit',
                marginRight: 0,
                '& svg': {
                    fontSize: 20,
                },
            },
        },
        MuiAvatar: {
            root: {
                width: 32,
                height: 32,
            },
        },
        MuiListItem: {
            // gutters: {
            //     paddingRight: '0px',
            //     paddingLeft: '0px',
            // },
        },
        MuiPaper: {
            elevation4: {
                boxShadow:
                    '0px 2px 4px -1px rgb(0 0 0 / 0%), 0px 4px 5px 0px rgb(0 0 0 / 0%), 12px 0px 10px 0px rgb(0 0 0 / 10%)',
            },
        },
        MuiButtonGroup: {
            contained: {
                boxShadow: 'none',
            },
            groupedContainedHorizontal: {
                borderRight: 'none',
            },
        },
        MuiStepper: {
            root: {
                padding: '0px',
            },
        },
        MuiFormHelperText: {
            root: {
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '10px',
                letterSpacing: 'normal',
            },
        },
        MuiTableHead: {
            root: {
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
            },
        },
        MuiTableCell: {
            root: {
                wordBreak: 'break-all',
            },
        },
        MuiTableContainer: {
            root: {
                minWidth: '400px',
            },
        },
    },
};

export default theme;
