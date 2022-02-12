import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UILanguagesService } from '../apis/rest.app';

export const UILanguagesContext = createContext([null, (user) => user]);

UILanguagesContext.displayName = 'UILanguages';

export const UILanguagesProvider = ({ children }) => {
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        // setUser(value);
        UILanguagesService.find().then((response) => {
            setLanguages(response);
        });
    }, []);

    return <UILanguagesContext.Provider value={[languages, setLanguages]}>{children}</UILanguagesContext.Provider>;
};

UILanguagesProvider.propTypes = {
    children: PropTypes.any.isRequired,
    // value: PropTypes.object,
};

export const useUILanguages = () => useContext(UILanguagesContext);
