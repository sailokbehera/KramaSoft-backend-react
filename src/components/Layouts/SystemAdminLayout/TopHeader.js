import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '55px',
        padding: '5px',
        alignItems: 'center',
    },
    grow: {
        flexGrow: 1,
    },
    search: {
        display: 'flex',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.background.other, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.background.other, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
    },
    searchIcon: {
        backgroundColor: theme.palette.background.other,
        height: '100%',
        width: '30px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0px 6px 6px 0px',
    },
    inputInput: {
        fontSize: '12px',
        padding: theme.spacing(1.3, 0, 1.4, 0),
        backgroundColor: theme.palette.background.other,
        paddingLeft: `calc(1em + ${theme.spacing(0.1)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '350px',
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '230px',
        },
    },
    color: {
        backgroundColor: theme.palette.background.other,
    },
    menuList: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    dropDown: {
        fontSize: '15px',
        paddingLeft: '15px',
        backgroundColor: theme.palette.background.other,
        '&:hover': {
            boxShadow: 'none',
        },
    },
    profile: {
        background: theme.palette.background.other,
        borderRadius: '6px',
        height: '33px',
        paddingRight: '40px',
        paddingLeft: '15px',
        marginRight: '-25px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,
        fontSize: '13px',
        textTransform: 'capitalize',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    logo: {
        height: '40px',
    },
    profileButton: {
        '&:hover': {
            background: theme.palette.common.white,
        },
    },
    buttonGroup: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
}));

export default function TopHeader() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
        // console.info(`You clicked ${options[selectedIndex]}`);
        setOpen((prevOpen) => !prevOpen);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const options = ['All', 'Institute', 'Teacher'];

    const placeholder = [
        'Search institutions, teachers, students, courses',
        'Search Institute by name',
        'Search Teacher by name',
    ];

    return (
        <div className={classes.root}>
            <div className={classes.grow} />
            <ButtonGroup className={classes.buttonGroup} ref={anchorRef} variant="contained">
                <Button className={classes.dropDown} onClick={handleClick}>
                    {options[selectedIndex]}
                    <ArrowDropDownIcon />
                </Button>
                <div className={classes.search}>
                    <InputBase
                        classes={{
                            input: classes.inputInput,
                        }}
                        placeholder={placeholder[selectedIndex]}
                    />
                    <div className={classes.searchIcon}>
                        <SearchIcon color="primary" />
                    </div>
                </div>
            </ButtonGroup>
            <Popper
                anchorEl={anchorRef.current}
                open={open}
                placement="bottom-start"
                // disablePortal
                transition
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            className={classes.menuList}
                                            key={option}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                            selected={index === selectedIndex}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <div className={classes.grow} />
            <div className={classes.grow} />
            <Button className={classes.profileButton}>
                <div className={classes.profile}>{'Akash Mohapatra'}</div>
                {/*<img src={ProfileLogo} alt="Profile Logo" className={classes.logo} />*/}
            </Button>
        </div>
    );
}
