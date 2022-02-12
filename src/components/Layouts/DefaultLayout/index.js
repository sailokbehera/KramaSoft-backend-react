import React, { useEffect } from 'react';
import TopHeader from './TopHeader';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '../../../assets/img/Menu.svg';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import MenuList from './MenuList';
import CloseIcon from '@material-ui/icons/Close';
import LogoImg from '../../../assets/img/Logo.svg';
import Link from '../../Link';
import { AdminMenuListProvider } from '../../../store/AdminMenuListContext';
import Typography from '@material-ui/core/Typography';

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
        marginRight: theme.spacing(1),
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
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    toolbar: {
        height: appbarHeight,
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.main,
        minHeight: '100vh',
    },
    menuIcon: {
        padding: theme.spacing(0.7),
    },
    logoImg: {
        maxHeight: 27,
        width: 'auto',
    },
}));

const DefaultLayout = ({ children, user }) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const handleDrawer = () => {
        setOpen(!open);
    };

    const [mobOpen, setMobOpen] = React.useState(false);

    const handleMobDrawer = () => {
        setMobOpen(!mobOpen);
    };

    useEffect(() => {
        if (window.innerWidth <= 800) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, []);

    return (
        <React.Fragment>
            <div className={classes.root}>
                <AppBar className={classes.appBar} position="fixed">
                    <Toolbar>
                        <Hidden xsDown>
                            <IconButton className={classes.menuButton} edge="start" onClick={handleDrawer}>
                                <img alt={'MenuIcon'} className={classes.menuIcon} src={MenuIcon} />
                            </IconButton>
                            <Box m={1.4} ml={1.5}>
                                <Link href="/">
                                    <Typography variant={'h4'}>{'Krama Soft'}</Typography>
                                </Link>
                            </Box>
                        </Hidden>
                        <Hidden smUp>
                            <IconButton className={clsx(classes.menuButton)} edge="start" onClick={handleMobDrawer}>
                                <img alt={'MenuIcon'} className={classes.menuIcon} src={MenuIcon} />
                            </IconButton>
                            <Box m={1.2} ml={1.5}>
                                <Typography variant={'h4'}>{'Krama Soft'}</Typography>
                            </Box>
                        </Hidden>
                        <TopHeader />
                    </Toolbar>
                </AppBar>
                <AdminMenuListProvider open={open}>
                    <Hidden smDown>
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
                            <Box className={classes.toolbar} display={'flex'}>
                                <Box m={0.7} ml={1.5} mt={0.9}>
                                    <IconButton className={classes.menuButton} onClick={handleDrawer}>
                                        <img alt={'MenuIcon'} className={classes.menuIcon} src={MenuIcon} />
                                    </IconButton>
                                </Box>
                                <Box m={1.4} ml={1.5}>
                                    <Typography variant={'h4'}>{'Krama Soft'}</Typography>
                                    {/*<img alt={'Logo Img'} className={classes.logoImg} src={LogoImg} />*/}
                                </Box>
                            </Box>
                            <Box mt={1.5} />
                            <MenuList user={user} />
                        </Drawer>
                    </Hidden>
                    <Hidden mdUp>
                        <Drawer onClose={handleMobDrawer} open={mobOpen}>
                            <Box display={'flex'} justifyContent={'space-around'}>
                                <Box alignSelf={'center'} dispaly={'flex'} my={2}>
                                    <img alt={'Logo Img'} className={classes.logoImg} src={LogoImg} />
                                </Box>
                                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                                    <IconButton onClick={handleMobDrawer} size={'small'}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <MenuList handleClose={() => setMobOpen(false)} user={user} />
                        </Drawer>
                    </Hidden>
                </AdminMenuListProvider>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>
            </div>
        </React.Fragment>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.node,
};

export default DefaultLayout;
