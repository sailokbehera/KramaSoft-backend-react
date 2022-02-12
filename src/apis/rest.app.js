import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import { CookieStorage } from 'cookie-storage';
import rest from '@feathersjs/rest-client';
import Axios from 'axios';
import services from './services.json';

export const authCookieName = 'ticket';

/**
 * CookieStorage
 * @type {CookieStorage}
 */
export const cookieStorage = new CookieStorage();

export const apiPath = process.env.baseUrl;

const restClient = rest(apiPath);

/**
 * Feathers application
 * @type {createApplication.Application<any>}
 */
const restApp = feathers();

restApp.configure(restClient.axios(Axios));

restApp.configure(
    auth({
        path: services.authentication,
        // cookie: process.env.NEXT_COOKIE_NAME,
        cookie: authCookieName,
        // storageKey: process.env.NEXT_COOKIE_NAME,
        storageKey: authCookieName,
        storage: cookieStorage,
    }),
);

export default restApp;

export const UILanguagesService = restApp.service(services['ui-languages']);
export const UIIconsService = restApp.service(services['ui-icons']);
export const UIMenuService = restApp.service(services['ui-menu']);
export const UserService = restApp.service(services['users']);
export const DocumentService = restApp.service(services['document']);

export const uploadService = restApp.service(services.upload);

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('uri[]', file);
    return uploadService.create(formData);
};
