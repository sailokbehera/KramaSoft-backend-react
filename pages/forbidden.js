import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Image from '../src/assets/403.svg';

const useStyle = makeStyles(() => ({
    typo1: {
        fontSize: '10px',
        fontWeight: 400,
    },
}));

const Forbidden = () => {
    const classes = useStyle();

    return (
        <React.Fragment>
            <Box
                alignItems={'center'}
                bgcolor={'#fff'}
                display={'flex'}
                flexDirection={'column'}
                height={'84vh'}
                justifyContent={'center'}
                width={'auto'}
            >
                <Box>
                    <img alt={'Image'} src={Image} style={{ height: 'auto', width: '650px' }} />
                </Box>
                <Typography style={{ fontSize: '37px', fontWeight: 600, color: '#585680' }}>
                    {'We are Sorry...'}
                </Typography>
                <Box mt={1} />
                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                    <Typography style={{ color: '#C4C3D0' }}>
                        {'The page you are trying to access has restricted access'}
                    </Typography>
                </Box>
                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                    <Typography style={{ color: '#C4C3D0' }}>{'please refer to your SuperAdmin. '}</Typography>
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default Forbidden;
