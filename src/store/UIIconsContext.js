import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UIIconsService } from '../apis/rest.app';

export const UIIconsContext = createContext([null, (user) => user]);

UIIconsContext.displayName = 'UILanguages';

export const UIIconsProvider = ({ children }) => {
    const [icons, setIcons] = useState([]);

    useEffect(() => {
        // setUser(value);
        UIIconsService.find().then((response) => {
            setIcons(response);
        });
    }, []);

    return <UIIconsContext.Provider value={[icons, setIcons]}>{children}</UIIconsContext.Provider>;
};

UIIconsProvider.propTypes = {
    children: PropTypes.any.isRequired,
    // value: PropTypes.object,
};

export const useUIIcons = () => useContext(UIIconsContext);
