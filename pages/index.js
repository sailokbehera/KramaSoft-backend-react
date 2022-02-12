import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import { useSnackbar } from 'notistack';
import TableContainer from '@material-ui/core/TableContainer';
import DocumentTableView from '../src/page-components/DocumentTableView';
import { useRouter } from 'next/router';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';
import InputBase from '@material-ui/core/InputBase';
import TableSkeleton from '../src/components/Skeleton/TableSkeleton';
import { getAllDocuments } from '../src/apis/transaction';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import { authCookieName } from '../src/apis/rest.app';
import services from '../src/apis/services.json';
import DocumentAddDialog from '../src/page-components/DocumentAddDialog';

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
}));

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: 20,
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#ebf5fc',
        fontSize: 12,
        color: theme?.palette?.primary?.main,
        padding: '4px 10px 4px 10px',
        transition: theme?.transitions?.create(['box-shadow']),
    },
}))(InputBase);

export default function Index() {
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [documentData, setDocumentData] = useState([]);
    const [value, setValue] = useState('all');
    const [open, setOpen] = useState(false);
    const [newDocuments, setNewDocuments] = useState([]);

    const data = [
        {
            name: 'W2 from',
            type: 1,
        },
        {
            name: 'DL',
            type: 2,
        },
    ];

    const LoadTransaction = () => {
        let data;
        data = {
            documentType: value === 'all' ? null : value,
        };
        getAllDocuments(documentData.length, data.documentType !== null && data)
            .then((response) => {
                const { data, total } = response;
                const result = [...documentData, ...data];
                setHasMore(result.length < total);
                setDocumentData(result);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', {
                    variant: 'error',
                });
            });
    };

    useEffect(() => {
        const token = localStorage.getItem(authCookieName);
        const socketClient = io(process.env.baseUrl);
        const socketApp = feathers();
        socketApp.configure(
            socketio(socketClient, {
                transports: ['websocket'],
            }),
        );
        socketClient.on('connect', () => {
            socketClient.emit(
                'create',
                'authentication',
                {
                    strategy: 'jwt',
                    accessToken: token,
                    fcmId: 'sifw73rwejsdfdsrowe7rweoiewresdkfdsy',
                },
                function (e) {
                    if (e) {
                    } else {
                        socketApp.service(services.document).on('created', (data) => {
                            setNewDocuments([data]);
                        });
                        socketApp.service(services.document).on('patched', (data) => {
                            setDocumentData((prev) =>
                                prev.map((each) => {
                                    if (each._id === data._id) return data;
                                    return each;
                                }),
                            );
                        });
                    }
                },
            );
        });
    }, []);
    useEffect(() => {
        if (newDocuments.length === 0) return;
        let _messageList = documentData;
        _messageList = [..._messageList, ...newDocuments];
        setDocumentData([..._messageList]);
    }, [newDocuments]);

    console.log('document Data', documentData);

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>{'Documents'}</Typography>
                        <Button
                            color={'primary'}
                            onClick={() => {
                                setOpen(true);
                            }}
                            size={'small'}
                            variant={'contained'}
                        >
                            {'Add Document'}
                        </Button>
                    </Box>
                    <Box display={'flex'} justifyContent={'flex-end'} mt={1}>
                        <Box alignItems={'center'} display={'flex'} mr={1}>
                            <Typography variant={'body1'}>{'Filter By'}</Typography>
                        </Box>
                        <FormControl margin="dense" variant="outlined">
                            <Select
                                input={<BootstrapInput />}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    setDocumentData([]);
                                    setHasMore(true);
                                }}
                                value={value}
                            >
                                <MenuItem value={'all'}>{'All'}</MenuItem>
                                {data &&
                                    data.map((each) => (
                                        <MenuItem key={each?.type} value={each?.type}>
                                            {each?.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
            </Grid>
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadTransaction}
                loader={<CircularProgress size={28} />}
                pageStart={0}
            >
                {documentData.length ? (
                    <div className={classes.mainDiv}>
                        <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">{'Sl.no'}</TableCell>
                                        <TableCell align="left">{'Image'}</TableCell>
                                        <TableCell align="left">{'Results'}</TableCell>
                                        <TableCell>{'Status'}</TableCell>
                                        <TableCell>{'Action'}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {documentData.map((each, index) => (
                                        <DocumentTableView
                                            documentData={documentData}
                                            each={each}
                                            key={each._id}
                                            position={index}
                                            setDocumentData={setDocumentData}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ) : hasMore ? (
                    <Box align={'center'} key={'allInstitute'} m={1} width={'100%'}>
                        <TableSkeleton />
                    </Box>
                ) : (
                    <Box
                        alignItems={'center'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        mt={5}
                    >
                        {/*<img alt={'image'} src={Image} />*/}
                        <Box mt={3} />
                        <Typography variant={'h2'}>{'No Documents found'}</Typography>
                        <Box mt={3} width={450}>
                            <Typography align={'center'} variant={'h3'}>
                                {'oops'}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </InfiniteScroll>
            <DocumentAddDialog open={open} setOpen={setOpen} />
        </React.Fragment>
    );
}
