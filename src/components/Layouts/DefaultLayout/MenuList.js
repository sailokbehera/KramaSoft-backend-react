/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description Menu List
 * @createdOn 25/12/20 9:45 PM
 */

import React from 'react';
import PropTypes from 'prop-types';
import menus from '../../../assets/json/menu.json';
import MenuItem from './MenuItem';

// eslint-disable-next-line react/prop-types
const MenuList = ({ handleClose, user }) => {
    return (
        <React.Fragment>
            {getMenu(user).map((menu) => (
                <MenuItem handleClose={handleClose} key={menu._id} menu={menu} />
            ))}
        </React.Fragment>
    );
};

export const getMenu = (user) => {
    if (user?.role === 2) return menus;
    return menus
        .filter((menu) => {
            const { isGroup, options, meta_name } = menu;
            if (isGroup) {
                return user?.modules?.some((each) => options.find((option) => option.meta_name === each.meta_name));
            } else {
                return user?.modules?.some((each) => each.meta_name === meta_name);
            }
        })
        .map((each) => {
            if (each.isGroup) {
                each.options = each.options.filter((menu) =>
                    user?.modules?.some((each) => each.meta_name === menu.meta_name),
                );
            }
            return each;
        });
};

MenuList.propTypes = {
    handleClose: PropTypes.func,
};
MenuList.defaultProps = {
    handleClose: () => {},
};

export default MenuList;
