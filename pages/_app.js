import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import DefaultLayout from '../src/components/Layouts/DefaultLayout';
import { LanguageProvider } from '../src/store/LanguageStore';
import restApp, { authCookieName } from '../src/apis/rest.app';
import { UserProvider } from '../src/store/UserContext';
import Loader from '../src/components/loaders/Loader';
import { SnackbarProvider } from 'notistack';
import Translate from '../src/components/Translate';
import { useRouter } from 'next/router';
import 'cropperjs/dist/cropper.css';
import { PageGlobalStoreProvider } from '../src/store/PageGlobalContext';
import '../src/components/TimeTable/plugin.sass';
import '../src/components/Zoom/react-select.css';
import '../src/components/Zoom/bootstrap.css';
import '../src/components/zoom.css';
import '../src/components/controls.css';

export default function MyApp(props) {
    const { Component, pageProps } = props;

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // console.log('user', user);

    const Router = useRouter();

    let Layout = DefaultLayout;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }

        const token = localStorage.getItem(authCookieName);
        if (token) {
            restApp
                .authenticate({
                    strategy: 'jwt',
                    accessToken: token,
                    fcmId: '123456',
                })
                .then((response) => {
                    if (response?.user?.role !== 2) {
                        Router.push('/login');
                        setLoading(false);
                    } else {
                        // console.log('Responsed user', response);
                        setUser(response.user);
                        setLoading(false);
                        localStorage.setItem(authCookieName, response.accessToken);
                        Router.push('/');
                    }
                })
                .catch(() => {
                    restApp.logout();
                    Router.push('/login');
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                });
        } else {
            Router.push('/login');
            if (Router.pathname === '/login') {
                setLoading(false);
            } else {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        }
    }, []);

    if (Component.layout === null) Layout = React.Fragment;
    else if (Component.layout) Layout = Component.layout;

    return (
        <UserProvider value={[user, setUser]}>
            <LanguageProvider local="en">
                <Head>
                    <title>
                        <Translate>{'Krama Soft'}</Translate>
                    </title>
                    <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
                </Head>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider>
                        <PageGlobalStoreProvider>
                            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                            <CssBaseline />
                            {loading ? (
                                <Loader />
                            ) : (
                                <Layout user={user}>
                                    <Component {...pageProps} />
                                </Layout>
                            )}
                        </PageGlobalStoreProvider>
                    </SnackbarProvider>
                </ThemeProvider>
            </LanguageProvider>
        </UserProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
