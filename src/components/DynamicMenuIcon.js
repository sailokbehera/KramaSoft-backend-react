import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { useLanguage } from '../store/LanguageStore';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles(() => ({
    root: {
        height: '20px',
        width: '20px',
    },
}));

const DynamicMenuIcon = ({ menu, ...props }) => {
    const { icon = {}, materialIconName, isMaterialIcon, name } = menu;
    const classes = useStyle();

    const [icons, setIcons] = useState(null);

    const Language = useLanguage();

    useEffect(() => {
        import('@material-ui/icons').then((icons) => {
            setIcons(icons);
        });
        // .catch(console.log);
    }, []);

    if (isMaterialIcon) {
        if (!icons) return '';
        const Icon = icons[materialIconName] || null;
        if (!Icon) return <Avatar alt={name ? Language.convert(name) : 'menu-image'} src={undefined} {...props} />;
        return <Icon {...props} />;
    }

    return (
        <Avatar
            alt={name ? Language.convert(name) : 'menu-image'}
            className={classes.root}
            src={icon.path}
            {...props}
        />
    );
};

DynamicMenuIcon.propTypes = {
    menu: PropTypes.object.isRequired,
};

export default DynamicMenuIcon;
