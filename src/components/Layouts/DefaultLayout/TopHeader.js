import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { useUser } from '../../../store/UserContext';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Translate from '../../Translate';
import restApp, { authCookieName } from '../../../apis/rest.app';
import Confirm from '../../Confirm';

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
    profileButton: {
        '&:hover': {
            background: theme.palette.common.white,
        },
    },
}));

export default function TopHeader() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [user] = useUser();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const isMenuOpen = Boolean(anchorEl);

    const handleLogout = () => {
        Confirm('Are you sure ?', 'Do you really want to logout ? ', 'Ok').then(() => {
            restApp.logout();
            localStorage.removeItem(authCookieName);
            setTimeout(() => {
                window.location.href = '/login';
            }, 300);
        });
    };

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={'user-account'}
            keepMounted
            onClose={handleMenuClose}
            open={isMenuOpen}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <MenuItem onClick={handleLogout}>
                <Translate>{'appbar.logout'}</Translate>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.root}>
            <div className={classes.grow} />
            <Button className={classes.profileButton} onClick={handleProfileMenuOpen}>
                <div className={classes.profile}>{user?.name || 'Admin'}</div>
                <Avatar alt={'user-image'} className={classes.logo} src={user?.avatar || ''}>
                    {user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
                </Avatar>
            </Button>
            {renderMenu}
        </div>
    );
}
