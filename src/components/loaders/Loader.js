import React from 'react';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import loadingImage from '../../../public/Group 3.jpg';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

const useStyle = makeStyles(() => ({
    root: {
        width: '22%',
        marginTop: 10,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    img: {
        height: '10rem',
        marginTop: 140,
    },
}));
const Loader = () => {
    const classes = useStyle();

    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        // <div
        //     style={{
        //         position: 'absolute',
        //         width: '100%',
        //         height: '100%',
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         display: 'flex',
        //     }}
        // >
        //     <CircularProgress size={120} thickness={2.5} />
        // </div>
        <>
            <div className={classes.logo}>
                <Typography style={{ color: '#037FFB', fontWeight: 700 }} variant={'h2'}>
                    {'Krama Soft'}
                </Typography>
                <div className={classes.root}>
                    <LinearProgress value={progress} variant="determinate" />
                </div>
            </div>
        </>
    );
};

export default Loader;
