import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useUser } from '../../store/UserContext';

export const PermissionHandler = ({ modules = [], strict = true, children }) => {
    const [user] = useUser();
    const { role, modules: userModules } = user;
    const router = useRouter();

    if (role === 512 || userModules.some((userModule) => modules.find((module) => userModule.meta_name === module)))
        return children;
    else {
        if (strict) {
            router.replace('/forbidden');
        }
        return <div />;
    }
};

export const withPermission = (Component, modules = [], strict = true) => (props) => {
    return (
        <PermissionHandler modules={modules} strict={strict}>
            <Component {...props} />
        </PermissionHandler>
    );
};

PermissionHandler.propTypes = {
    children: PropTypes.any.isRequired,
    strict: PropTypes.bool,
    modules: PropTypes.array,
};
