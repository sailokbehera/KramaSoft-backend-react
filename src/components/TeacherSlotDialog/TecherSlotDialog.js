import DialogTitle from '../DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import React, { useEffect, useState } from 'react';
import Confirm from '../Confirm';
import { startEndClassService, teacherSlotService, TimetableService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import { useSnackbar } from 'notistack';
import AddScheduleDialogDialog from './AddScheduleDialogDialog';
import Link from '../Link';
import moment from 'moment/moment';

export default function TeacherSlotDialog({
    openTimeTable,
    setOpenTimeTable,
    slotData,
    batchDataLoading,
    batchData,
    setBatchData,
    openTimeTableLoading,
    setOpenTimeTableLoading,
    slotList,
    setSlotList,
}) {
    const handleError = useHandleError();
    const [scheduleDialog, setScheduleDialog] = useState(false);
    const [time, setTime] = useState(new Date());
    const { enqueueSnackbar } = useSnackbar();
    const getTime = (time) => {
        let _time = time;
        let hh = Math.floor(_time / 60);
        let mm = _time % 60;

        let AMPM = hh >= 12 ? 'PM' : 'AM';
        hh = hh > 12 ? hh - 12 : hh;

        return `${hh}:${mm} ${AMPM}`;
    };

    const [scheduledClasses, setScheduledClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (slotData) {
            setLoading(true);
            startEndClassService
                .find({
                    query: {
                        status: { $in: [1, 2, 4] },
                        teacherSlot: slotData?._id,
                        '$sort[scheduledAt]': 1,
                        $populate: ['syllabus', 'subject', 'course', 'teacher'],
                    },
                })
                .then((res) => setScheduledClasses(res))
                .finally(() => setLoading(false));
        }
    }, [slotData]);

    const handleAcceptSlot = (data) => {
        Confirm(
            'Are you sure to accept?',
            'Are you sure to accept the current slot for time teacher',
            'Accept',
            '',
        ).then(() => {
            TimetableService.patch(data._id, {
                status: 2,
            })
                .then(() => {
                    enqueueSnackbar('Accepted successfully', { variant: 'success' });
                    setBatchData(
                        batchData
                            .map((each) => {
                                if (each._id === data._id) each.status = 2;
                                return each;
                            })
                            .filter((each) => each.status === 2 || each.subject._id === data.subject._id),
                    );
                    setSlotList(
                        slotList.map((each) => {
                            if (each._id === slotData._id) {
                                each.status = 2;
                                each.institutionsCount++;
                                each.course = data.course;
                                each.subject = data.subject;
                            }
                            return each;
                        }),
                    );
                })
                .catch((error) => {
                    handleError()(error);
                });
        });
    };
    const handleDeleteComplete = () => {
        Confirm(
            'Are you sure to delete?',
            'Are you sure to accept the current slot for time teacher',
            'Delete',
            '',
        ).then(() => {
            setOpenTimeTableLoading(true);
            teacherSlotService
                .remove(slotData._id)
                .then(() => {
                    enqueueSnackbar('Deleted successfully', { variant: 'success' });
                    setSlotList(slotList.filter((each) => each._id !== slotData?._id));
                    setOpenTimeTable(false);
                })
                .catch((error) => {
                    handleError()(error);
                })
                .finally(() => setOpenTimeTableLoading(false));
        });
    };
    const handleRejectSlot = (data) => {
        Confirm(
            'Are you sure to reject?',
            'Are you sure to reject the current slot for time teacher',
            'Reject',
            '',
        ).then(() => {
            TimetableService.patch(data._id, {
                status: 3,
            })
                .then(() => {
                    enqueueSnackbar('Rejected successfully', { variant: 'success' });
                    setBatchData(batchData.filter((each) => each._id !== data._id));
                })
                .catch((error) => {
                    handleError()(error);
                });
        });
    };
    const handleDeleteSlot = (data) => {
        Confirm(
            'Are you sure to reject?',
            'Are you sure to reject the current slot for time teacher',
            'Reject',
            '',
        ).then(() => {
            TimetableService.remove(data._id)
                .then(() => {
                    enqueueSnackbar('Rejected successfully', { variant: 'success' });
                    setBatchData(batchData.filter((each) => each._id !== data._id));
                })
                .catch((error) => {
                    handleError()(error);
                });
        });
    };

    const handleDeletePartiCularSlot = (data) => {
        Confirm('Are you sure to delete?', 'Are you sure to delete the class ', 'Delete', '').then(() => {
            startEndClassService
                .patch(data._id, { status: 5 })
                .then(() => {
                    enqueueSnackbar('Deleted successfully', { variant: 'success' });
                    setScheduledClasses(scheduledClasses.filter((each) => each._id !== data._id));
                })
                .catch((error) => {
                    handleError()(error);
                });
        });
    };
    const openScheduleDialog = () => {
        setScheduleDialog(true);
    };
    return (
        <>
            <Dialog
                fullWidth
                maxWidth={'md'}
                onClose={() => {
                    setOpenTimeTable(false);
                }}
                open={openTimeTable}
            >
                <DialogTitle
                    onClose={() => {
                        setOpenTimeTable(false);
                    }}
                >
                    {'Assign to the slot'}
                </DialogTitle>
                <DialogContent>
                    {slotData && slotData.course && (
                        <>
                            <Box display={'flex'}>
                                <Typography color={'textSecondary'} variant={'h3'}>
                                    {slotData && slotData.course && slotData.course.name}
                                </Typography>
                                <Box ml={1} />
                                {'-'}
                                <Box ml={1} />
                                <Typography color={'textSecondary'} variant={'h3'}>
                                    {slotData && slotData.subject && slotData.subject.name}
                                </Typography>
                            </Box>
                            <Box mt={2} />
                        </>
                    )}
                    <Typography>{'Timing'}</Typography>
                    <Box display={'flex'}>
                        <Typography variant={'body2'}>
                            {slotData && slotData?.startTime && getTime(slotData?.startTime)}
                        </Typography>
                        <Box ml={1} />
                        {'-'}
                        <Box ml={1} />
                        <Typography variant={'body2'}>
                            {slotData && slotData.endTime && getTime(slotData?.endTime)}
                        </Typography>
                    </Box>
                    <Box mt={1} />
                    {batchDataLoading ? (
                        'Please Wait'
                    ) : (
                        <>
                            {batchData.filter((each) => each.status === 2)?.length !== 0 && (
                                <>
                                    <Typography>{'Batches'}</Typography>
                                    {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
                                    <TableContainer component={Paper} style={{ minWidth: 0 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{'Institute'}</TableCell>
                                                    <TableCell>{'Batch'}</TableCell>
                                                    <TableCell>{'Subject'}</TableCell>
                                                    <TableCell>{'Course'}</TableCell>
                                                    <TableCell align="center">{'Action'}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {batchData
                                                    .filter((each) => each.status === 2)
                                                    .map((each) => (
                                                        <TableRow key={each._id}>
                                                            <TableCell component="th" scope="row">
                                                                {each?.institute?.name}
                                                            </TableCell>
                                                            <TableCell>{each?.instituteBatch?.name}</TableCell>
                                                            <TableCell>{each?.subject?.name}</TableCell>
                                                            <TableCell>{each?.course?.name}</TableCell>
                                                            <TableCell align="center">
                                                                <Button
                                                                    color={'secondary'}
                                                                    onClick={() => {
                                                                        handleDeleteSlot(each);
                                                                    }}
                                                                    size={'small'}
                                                                    variant={'contained'}
                                                                >
                                                                    {'Delete'}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                            <Box display={'flex'} flexDirection={'column'} mt={2}>
                                {slotData?.status !== 1 && (
                                    <Box display={'flex'} justifyContent={'flex-end'}>
                                        <Button color={'primary'} onClick={openScheduleDialog} variant={'contained'}>
                                            {'Schedule Live Class'}
                                        </Button>
                                    </Box>
                                )}

                                {scheduledClasses?.length !== 0 && (
                                    <>
                                        <Typography>{'All Classes'}</Typography>
                                        {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
                                        <TableContainer component={Paper} style={{ minWidth: 0 }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{'Teacher'}</TableCell>
                                                        <TableCell>{'Syllabus'}</TableCell>
                                                        <TableCell>{'Subject'}</TableCell>
                                                        <TableCell>{'Course'}</TableCell>
                                                        <TableCell>{'Date'}</TableCell>
                                                        <TableCell>{'Time'}</TableCell>
                                                        <TableCell align="center">{'Action'}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {scheduledClasses?.map((each, index) => (
                                                        <TableRow key={each._id}>
                                                            <TableCell component="th" scope="row">
                                                                {each?.teacher?.name}
                                                            </TableCell>
                                                            <TableCell>{each?.syllabus?.name}</TableCell>
                                                            <TableCell>{each?.subject?.name}</TableCell>
                                                            <TableCell>{each?.course?.name}</TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {moment(each?.scheduledAt)
                                                                    .utc(false)
                                                                    .format('DD-MM-YYYY')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {moment(each?.scheduledAt).utc(false).format('h:mm a')}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box display={'flex'} justifyContent={'center'}>
                                                                    <Button
                                                                        color={'secondary'}
                                                                        onClick={() => {
                                                                            handleDeletePartiCularSlot(each, index);
                                                                        }}
                                                                        size={'small'}
                                                                    >
                                                                        {'Delete'}
                                                                    </Button>
                                                                    <Box ml={1} />
                                                                    {each?.status === 2 && (
                                                                        <Button
                                                                            color={'primary'}
                                                                            component={Link}
                                                                            href={`/live-classes?liveClassId=${each._id}`}
                                                                            size={'small'}
                                                                            style={{ color: '#fff' }}
                                                                            variant={'contained'}
                                                                        >
                                                                            {'Join'}
                                                                        </Button>
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </>
                                )}
                            </Box>
                            {batchData.filter((each) => each.status === 1)?.length !== 0 && (
                                <>
                                    <Typography>{'Requests'}</Typography>
                                    {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
                                    <TableContainer component={Paper} style={{ minWidth: 0 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{'Institute'}</TableCell>
                                                    <TableCell>{'Batch'}</TableCell>
                                                    <TableCell>{'Subject'}</TableCell>
                                                    <TableCell>{'Course'}</TableCell>
                                                    <TableCell align="center">{'Action'}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {batchData
                                                    .filter((each) => each.status === 1)
                                                    .map((each, index) => (
                                                        <TableRow key={each._id}>
                                                            <TableCell component="th" scope="row">
                                                                {each?.institute?.name}
                                                            </TableCell>
                                                            <TableCell>{each?.instituteBatch?.name}</TableCell>
                                                            <TableCell>{each?.subject?.name}</TableCell>
                                                            <TableCell>{each?.course?.name}</TableCell>
                                                            <TableCell align="center">
                                                                <Box display={'flex'} justifyContent={'center'}>
                                                                    <Button
                                                                        color={'secondary'}
                                                                        onClick={() => {
                                                                            handleRejectSlot(each, index);
                                                                        }}
                                                                        size={'small'}
                                                                    >
                                                                        {'Reject'}
                                                                    </Button>
                                                                    <Box ml={1} />
                                                                    <Button
                                                                        color={'primary'}
                                                                        onClick={() => {
                                                                            handleAcceptSlot(each, index);
                                                                        }}
                                                                        size={'small'}
                                                                        variant={'contained'}
                                                                    >
                                                                        {'Accept'}
                                                                    </Button>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                        </>
                    )}

                    <Box mt={2} />
                    <Button
                        color={'secondary'}
                        disabled={openTimeTableLoading}
                        onClick={() => {
                            handleDeleteComplete();
                        }}
                        size={'small'}
                        variant={'contained'}
                    >
                        {openTimeTableLoading ? (
                            <CircularProgress color={'inherit'} size={17} />
                        ) : (
                            <Typography variant={'button'}>{'Delete Slot'}</Typography>
                        )}
                    </Button>
                    <Box mt={2} />
                </DialogContent>
            </Dialog>
            <AddScheduleDialogDialog
                scheduleDialog={scheduleDialog}
                scheduledClasses={scheduledClasses}
                setScheduleDialog={setScheduleDialog}
                setScheduledClasses={setScheduledClasses}
                setTime={setTime}
                slotData={slotData}
                time={time}
            />
        </>
    );
}
