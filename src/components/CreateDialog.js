/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description Common Dialog To Create Data
 * @createdOn 26-Dec-20 3:05 PM
 */

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Translate from './Translate';

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        color: theme.palette.primary.main,
    },
}));

const CreateDialog = ({ show, dismiss }) => {
    const classes = useStyle();

    return (
        <Dialog className={classes.root} fullWidth maxWidth={'xs'} onClose={dismiss} open={show}>
            <Box display={'flex'} flexDirection={'column'} p={2}>
                <TextField label={<Translate>{'courses.nameLabel'}</Translate>} variant={'outlined'} />
                <Box mb={2} />
                <TextField label={<Translate>{'courses.shortNameLabel'}</Translate>} variant={'outlined'} />
                <Box mb={2} />
                <Button color={'primary'} size={'large'} variant={'contained'}>
                    <Typography variant={'button'}>
                        <Translate>{'courses.createButton'}</Translate>
                    </Typography>
                </Button>
            </Box>
        </Dialog>
    );
};

export default CreateDialog;
