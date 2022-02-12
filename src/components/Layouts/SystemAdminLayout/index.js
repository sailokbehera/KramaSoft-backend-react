import React, { useEffect } from 'react';
import TopHeader from './TopHeader';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { useRouter } from 'next/router';
import Link from '../../Link';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { UILanguagesProvider } from '../../../store/UILanguagesContext';
import { UIIconsProvider } from '../../../store/UIIconsContext';

const drawerWidth = 240;
const appbarHeight = 55;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        background: theme.palette.common.white,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
        color: theme.palette.common.drawer,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        height: appbarHeight,
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    item: {
        height: '45px',
        marginLeft: theme.spacing(1),
        borderRadius: '50px 0px 0px 50px',
        color: theme.palette.common.drawer,
        '&:hover,&:focus': {
            backgroundColor: theme.palette.background.drawer,
        },
    },
    itemActiveItem: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.background.drawer,
    },
    itemPrimary: {
        fontSize: 'inherit',
        marginLeft: theme.spacing(1),
    },
    itemIcon: {
        minWidth: 'auto',
        margin: theme.spacing(1.2),
        marginLeft: theme.spacing(2),
    },
    activeItem: {
        width: '6px',
        background: theme.palette.primary.main,
    },
    unMarked: {
        width: '0px',
        background: theme.palette.primary.main,
        transitionProperty: 'width',
        transitionDuration: '.4s',
        '&:hover': {
            width: '6px',
        },
    },
}));

const SystemAdminLayout = ({ children }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    useEffect(() => {
        if (window.innerWidth <= 800) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, []);

    const handleDrawer = () => {
        setOpen(!open);
    };

    const Router = useRouter();

    const categories = [
        {
            id: 'List Items',
            children: [
                {
                    id: 'Dashboard',
                    icon: <InboxIcon />,
                    active: Router.pathname === '/@__system-admin',
                    href: '/@__system-admin',
                },
                // {
                //     id: 'UI Institute Menu',
                //     icon: <InboxIcon />,
                //     active: Router.pathname === '/',
                //     href: '/',
                // },
                {
                    id: 'UI Admin Menu',
                    icon: <InboxIcon />,
                    active: Router.asPath === '/@__system-admin/ui-menus/ADMIN',
                    href: '/@__system-admin/ui-menus/ADMIN',
                },
                {
                    id: 'UI Institute Admin Menu',
                    icon: <InboxIcon />,
                    active: Router.asPath === '/@__system-admin/ui-menus/INSTITUTE_ADMIN',
                    href: '/@__system-admin/ui-menus/INSTITUTE_ADMIN',
                },
                {
                    id: 'UI Student Menu',
                    icon: <InboxIcon />,
                    active: Router.asPath === '/@__system-admin/ui-menus/STUDENT',
                    href: '/@__system-admin/ui-menus/STUDENT',
                },
                {
                    id: 'UI Teacher Menu',
                    icon: <InboxIcon />,
                    active: Router.asPath === '/@__system-admin/ui-menus/TEACHER',
                    href: '/@__system-admin/ui-menus/TEACHER',
                },
                {
                    id: 'UI Icons',
                    icon: <InboxIcon />,
                    active: Router.pathname === '/@__system-admin/ui-icons',
                    href: '/@__system-admin/ui-icons',
                },
                {
                    id: 'UI Languages',
                    icon: <InboxIcon />,
                    active: Router.pathname === '/@__system-admin/ui-languages',
                    href: '/@__system-admin/ui-languages',
                },
            ],
        },
    ];

    return (
        <UILanguagesProvider>
            <UIIconsProvider>
                <div className={classes.root}>
                    <AppBar
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: open,
                        })}
                        position="fixed"
                    >
                        <Toolbar>
                            <IconButton
                                className={clsx(classes.menuButton, {
                                    [classes.hide]: open,
                                })}
                                edge="start"
                                onClick={handleDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                            <TopHeader />
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            }),
                        }}
                        variant="permanent"
                    >
                        <div className={classes.toolbar}>
                            <IconButton className={classes.menuButton} onClick={handleDrawer}>
                                <MenuIcon />
                            </IconButton>
                        </div>
                        <Box mt={0.5} />
                        {categories.map(({ id, children }) => (
                            <React.Fragment key={id}>
                                {children.map(({ id: childId, icon, href, active }) => (
                                    <div key={childId} style={{ display: 'flex' }}>
                                        <Tooltip
                                            TransitionComponent={Zoom}
                                            arrow
                                            placement="right"
                                            title={!open ? childId : ''}
                                        >
                                            <ListItem
                                                as={href}
                                                button
                                                className={clsx(classes.item, active && classes.itemActiveItem)}
                                                component={Link}
                                                href={href}
                                                key={childId}
                                            >
                                                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                                                {open ? (
                                                    <ListItemText
                                                        classes={{
                                                            primary: classes.itemPrimary,
                                                        }}
                                                    >
                                                        {childId}
                                                    </ListItemText>
                                                ) : (
                                                    ''
                                                )}
                                            </ListItem>
                                        </Tooltip>
                                        {active ? (
                                            <div className={classes.activeItem} />
                                        ) : (
                                            <div className={classes.unMarked} />
                                        )}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {children}
                    </main>
                </div>
            </UIIconsProvider>
        </UILanguagesProvider>
    );
};

SystemAdminLayout.propTypes = {
    children: PropTypes.node,
};

export default SystemAdminLayout;
