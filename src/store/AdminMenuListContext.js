import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UIMenuService } from '../apis/rest.app';

export const AdminMenuListContext = createContext([[], true]);

AdminMenuListContext.displayName = 'Language';

export const AdminMenuListProvider = ({ children, open }) => {
    const [menus, setMenu] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // useEffect(() => {
    //     UIMenuService.find({ query: { type: 'ADMIN', status: 1 } })
    //         .then((menu) => {
    //             setMenu(menu);
    //             setLoading(false);
    //         })
    //         .catch();
    // }, []);

    return <AdminMenuListContext.Provider value={[menus, open, loading]}>{children}</AdminMenuListContext.Provider>;
};

AdminMenuListProvider.propTypes = {
    children: PropTypes.any.isRequired,
    open: PropTypes.bool.isRequired,
};

export const useAdminMenuList = () => useContext(AdminMenuListContext);
