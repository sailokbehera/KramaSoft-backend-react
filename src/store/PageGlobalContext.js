import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

export const PageGlobalContext = createContext([[], true]);

PageGlobalContext.displayName = 'PageGlobalStore';

export const PageGlobalStoreProvider = ({ children }) => {
    const [state, setState] = React.useState({});

    return <PageGlobalContext.Provider value={[state, setState]}>{children}</PageGlobalContext.Provider>;
};

PageGlobalStoreProvider.propTypes = {
    children: PropTypes.any.isRequired,
};

export const createPageStore = () => {
    const Router = useRouter();
    const [state, setState] = useContext(PageGlobalContext);

    const pageState = state[Router.pathname] ? state[Router.pathname] : {};

    return function (key, defaultState) {
        let keyState = defaultState;
        if (typeof pageState[key] !== 'undefined') keyState = pageState[key];
        else
            setState(({ ...state }) => {
                if (!state[Router.pathname]) state[Router.pathname] = {};
                state[Router.pathname][key] = defaultState;
                return state;
            });

        return [
            keyState,
            (newValue) =>
                setState(({ ...state }) => {
                    state[Router.pathname][key] =
                        typeof newValue === 'function' ? newValue(state[Router.pathname][key]) : newValue;
                    return state;
                }),
        ];
    };
};
