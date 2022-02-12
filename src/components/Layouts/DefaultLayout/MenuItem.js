import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import Link from '../../Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DynamicMenuIcon from '../../DynamicMenuIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../../../store/LanguageStore';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { useAdminMenuList } from '../../../store/AdminMenuListContext';

const useStyle = makeStyles((theme) => ({
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
    itemIcon: {
        minWidth: 'auto',
        marginLeft: theme.spacing(1),
        '& img': {
            height: 20,
            width: 'auto',
        },
    },
    itemPrimary: {
        fontSize: 'inherit',
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            paddingRight: theme.spacing(9),
        },
    },
    activeItem: {
        marginLeft: '-3px',
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

const MenuItem = ({ menu, handleClose }) => {
    const classes = useStyle();

    const Router = useRouter();

    const Language = useLanguage();

    const [openCollapse, setOpenCollapse] = React.useState(false);

    const [, open] = useAdminMenuList();

    const handleClick = () => {
        setOpenCollapse(!openCollapse);
    };

    if (menu.isGroup) {
        return (
            <Box>
                <Tooltip
                    TransitionComponent={Zoom}
                    arrow
                    placement="right"
                    title={!open ? Language.convert(menu.name) : ''}
                >
                    <ListItem
                        button
                        className={clsx(classes.item, Router.pathname === menu.href && classes.itemActiveItem)}
                        onClick={handleClick}
                    >
                        <ListItemIcon className={classes.itemIcon}>
                            <DynamicMenuIcon menu={menu} />
                        </ListItemIcon>
                        {open || window.innerWidth <= 500 ? (
                            <ListItemText
                                classes={{
                                    primary: classes.itemPrimary,
                                }}
                            >
                                {Language.convert(menu.name)}
                            </ListItemText>
                        ) : (
                            ''
                        )}
                        {openCollapse ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                </Tooltip>
                <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                    {menu.options.map((option) => (
                        <MenuItem handleClose={handleClose} key={option._id} menu={option} open={open} />
                    ))}
                </Collapse>
            </Box>
        );
    } else {
        return (
            <Box display="flex" key={menu._id}>
                <Tooltip
                    TransitionComponent={Zoom}
                    arrow
                    placement="right"
                    title={!open ? Language.convert(menu.name) : ''}
                >
                    <ListItem
                        as={menu.href}
                        button
                        className={clsx(classes.item, Router.pathname === menu.href && classes.itemActiveItem)}
                        component={Link}
                        href={menu.href}
                        onClick={handleClose}
                    >
                        <ListItemIcon className={classes.itemIcon}>
                            <DynamicMenuIcon menu={menu} />
                        </ListItemIcon>
                        {open || window.innerWidth <= 500 ? (
                            <ListItemText
                                classes={{
                                    primary: classes.itemPrimary,
                                }}
                            >
                                {Language.convert(menu.name)}
                            </ListItemText>
                        ) : (
                            ''
                        )}
                    </ListItem>
                </Tooltip>
                {Router.pathname === menu.href ? (
                    <div className={classes.activeItem} />
                ) : (
                    <div className={classes.unMarked} />
                )}
            </Box>
        );
    }
};

MenuItem.propTypes = {
    menu: PropTypes.object.isRequired,
    handleClose: PropTypes.func,
};
MenuItem.defaultProps = {
    handleClose: () => {},
};

export default MenuItem;
