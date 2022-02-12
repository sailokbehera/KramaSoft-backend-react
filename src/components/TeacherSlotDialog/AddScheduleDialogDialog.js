import DialogTitle from '../DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import React, { useState } from 'react';
import useHandleError from '../../hooks/useHandleError';
import { useSnackbar } from 'notistack';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { startEndClassService } from '../../apis/rest.app';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
// import { DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme?.spacing(1),
        marginRight: theme?.spacing(1),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

export default function AddScheduleDialogDialog({
    setTime,
    setScheduleDialog,
    scheduleDialog,
    time,
    slotData,
    scheduledClasses,
    setScheduledClasses,
}) {
    const handleError = useHandleError();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const scheduledAt = moment(time).utc(true);
    const schedule = () => {
        setScheduleLoading(true);
        startEndClassService
            .create(
                {
                    teacher: slotData?.teacher,
                    teacherSlot: slotData?._id,
                    scheduledAt: moment(time).utc(true).toDate(),
                },
                {
                    query: {
                        $populate: ['syllabus', 'subject', 'course', 'teacher'],
                    },
                },
            )
            .then((res) => {
                setScheduledClasses([...scheduledClasses, res]);
                enqueueSnackbar('Class Scheduled Successfully', { variant: 'success' });
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something Went Wrong!', { variant: 'error' });
            })
            .finally(() => {
                setScheduleLoading(false);
                setScheduleDialog(false);
            });
    };

    function disableRandomDates(date) {
        return date.getDay() !== slotData?.day;
    }

    return (
        <Dialog
            fullWidth
            maxWidth={'xs'}
            onClose={() => {
                setScheduleDialog(false);
            }}
            open={scheduleDialog}
        >
            <DialogTitle
                onClose={() => {
                    setScheduleDialog(false);
                }}
            >
                {'Schedule'}
            </DialogTitle>
            <DialogContent>
                {/*<form className={classes.container} noValidate>*/}
                {/*    <TextField*/}
                {/*        InputLabelProps={{*/}
                {/*            shrink: true,*/}
                {/*        }}*/}
                {/*        // className={classes.textField}*/}
                {/*        defaultValue={new Date()}*/}
                {/*        fullWidth*/}
                {/*        id="datetime-local"*/}
                {/*        label="Schedule"*/}
                {/*        onChange={(e) => setTime(e.target.value)}*/}
                {/*        size={'large'}*/}
                {/*        type="datetime-local"*/}
                {/*        value={time}*/}
                {/*        variant={'outlined'}*/}
                {/*    />*/}
                {/*</form>*/}
                <MuiPickersUtilsProvider noValidate utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        format="MM/dd/yyyy"
                        id="date-picker-dialog"
                        label="Schedule time"
                        margin="normal"
                        onChange={(date) => setTime(date)}
                        shouldDisableDate={disableRandomDates}
                        style={{ width: '100%' }}
                        value={time}
                        variant={'outlined'}
                    />
                </MuiPickersUtilsProvider>
                <Box display={'flex'} justifyContent={'flex-end'} mt={2}>
                    <Button color={'primary'} disabled={scheduleLoading} onClick={schedule} variant={'contained'}>
                        {scheduleLoading ? <CircularProgress /> : 'Schedule'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
