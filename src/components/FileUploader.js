import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from '@uppy/react/lib/Dashboard';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import PropTypes from 'prop-types';
import restApp, { apiPath } from '../apis/rest.app';

const FileUploader = ({ onUpload, options, path, responseUrlFieldName, fieldName, uppyRef, ...props }) => {
    const [token, setToken] = useState();

    const uppy = useMemo(() => {
        const upy = Uppy({
            allowMultipleUploads: true,
            ...options,
        });

        upy.use(XHRUpload, {
            endpoint: apiPath + path,
            fieldName,
            responseUrlFieldName: responseUrlFieldName,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        upy.on('complete', (result) => {
            const data = result.successful.map((each) => {
                return {
                    type: each.data.type,
                    name: each.data.name,
                    path: each.uploadURL,
                    response: each.response.body,
                };
            });
            if (onUpload) onUpload(data);
        });

        return upy;
    }, [token]);

    React.useEffect(() => {
        restApp.get('authentication').then(({ accessToken }) => setToken(accessToken));
        return () => uppy.close();
    }, []);

    useEffect(() => {
        if (uppyRef) uppyRef.current = uppy;
    }, [uppy]);

    return (
        <Dashboard
            locale={{
                strings: {
                    dropPaste: 'Drop video here, paste or %{browse}',
                },
            }}
            showLinkToFileUploadResult={false}
            showProgressDetails
            uppy={uppy}
            {...props}
        />
    );
};

FileUploader.propTypes = {
    onUpload: PropTypes.func,
    options: PropTypes.object,
    path: PropTypes.string,
    responseUrlFieldName: PropTypes.string,
    fieldName: PropTypes.string,
    uppyRef: PropTypes.any,
};

FileUploader.defaultProps = {
    onUpload: () => {},
    options: {},
    path: '/upload-video',
    responseUrlFieldName: '_id',
    fieldName: 'video',
};

export default FileUploader;
