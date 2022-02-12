import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CropperDialog from '../components/cropper/CropperDialog';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DocumentService, uploadFile } from '../apis/rest.app';
import withStyles from '@material-ui/core/styles/withStyles';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    mainContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    captionText: {
        color: '#808080',
        fontSize: 14,
        margin: theme.spacing(0.8, 0),
    },
    imageDiv: {
        height: '200px',
        width: 'auto',
    },
    iconSize: {
        height: 40,
        width: 40,
    },
    fromControl: {
        width: 150,
    },
}));

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: 20,
        },
    },
    input: {
        border: '1px solid #037FFB',
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#fff',
        fontSize: 12,
        color: '#037FFB',
        padding: '4px 10px 4px 10px',
        transition: theme?.transitions?.create(['box-shadow']),
    },
}))(InputBase);

function DocumentAddDialog({ open, setOpen }) {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);

    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [src, setSrc] = useState(null);
    const [show, setShow] = useState(false);
    const [docType, setDocType] = useState('all');

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const validate = () => {
        if (image === '') {
            enqueueSnackbar("Banner can't be empty", { variant: 'error' });
            return false;
        }
        if (docType === 'all') {
            enqueueSnackbar("Doctype can't be empty", {
                variant: 'error',
            });
            return false;
        }
        return true;
    };

    const { enqueueSnackbar } = useSnackbar();

    const handleNext = async () => {
        if (validate()) {
            let _image = image;
            if (imageFile) {
                await uploadFile(imageFile)
                    .then((response) => {
                        _image = response.path;
                    })
                    .catch((err) => {
                        enqueueSnackbar(err.message, {
                            variant: 'error',
                        });
                    });
            }
            setLoading(true);
            await DocumentService.create({
                document: _image,
                documentType: docType,
            })
                .then(() => {
                    enqueueSnackbar('Create Successfully', {
                        variant: 'success',
                    });
                    setLoading(false);
                    setOpen(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', {
                        variant: 'error',
                    });
                    setLoading(false);
                });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    return (
        <>
            <Dialog fullWidth maxWidth={'xs'} onClose={handleClose} open={open}>
                <DialogTitle
                    onClose={() => {
                        handleClose();
                    }}
                >
                    <Typography variant="h4">{'Add Documents'}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box pb={2}>
                        <Typography>{'Select A Image'}</Typography>
                        <Box mb={2} />
                        {image !== '' ? (
                            <>
                                <Box
                                    alignItems={'center'}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                >
                                    <Box
                                        border={'1px dashed black'}
                                        display={'flex'}
                                        height={'200px'}
                                        onClick={() => setShow(true)}
                                        width={'auto'}
                                    >
                                        <img alt={'image'} className={classes.imageDiv} src={image} />
                                        <Box ml={-5}>
                                            <IconButton>
                                                <CancelIcon
                                                    color={'secondary'}
                                                    onClick={() => {
                                                        setImage('');
                                                        setSrc('');
                                                    }}
                                                />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Box
                                alignItems={'center'}
                                display={'flex'}
                                flexDirection={'column'}
                                justifyContent={'center'}
                            >
                                <Box
                                    alignItems={'center'}
                                    bgcolor={'#E5E9FF'}
                                    border={'1px dashed #037FFB'}
                                    borderRadius={5}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    height={'200px'}
                                    justifyContent={'center'}
                                    onClick={() => setShow(true)}
                                    p={4}
                                    width={'60%'}
                                >
                                    <CropOriginalIcon className={classes.iconSize} />
                                    <Typography color={'primary'} component={Box} mt={1.5} variant={'body2'}>
                                        {'Drag & drop to Upload'}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} mt={2}>
                            <Typography variant={'body2'}>{'Document Type'}</Typography>
                            <Box display={'flex'}>
                                <FormControl className={classes.fromControl} margin="dense" variant="outlined">
                                    <Select
                                        input={<BootstrapInput />}
                                        onChange={(e) => {
                                            setDocType(e.target.value);
                                        }}
                                        value={docType}
                                    >
                                        <MenuItem value={'all'}>{'Select A DocumentType'}</MenuItem>
                                        {data &&
                                            data.map((each) => (
                                                <MenuItem key={each?.type} value={each?.type}>
                                                    {each?.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <DialogActions>
                            <Button
                                color={'secondary'}
                                onClick={() => {
                                    handleClose();
                                }}
                                size={'small'}
                                variant={'contained'}
                            >
                                {'Cancel'}
                            </Button>
                            <Button
                                color="primary"
                                disabled={loading}
                                onClick={handleNext}
                                size={'small'}
                                variant="contained"
                            >
                                {loading ? <CircularProgress size={24} /> : 'Add'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
            <CropperDialog
                aspectRatio={1}
                cancel={() => {
                    setShow(false);
                    setSrc(null);
                }}
                cancelLabel={'Cancel'}
                dismiss={() => {
                    setShow(false);
                }}
                okLabel={'Save'}
                onCropped={(data) => {
                    setShow(false);
                    setImage(data);
                    setImageFile(dataURLtoFile(data, 'imageToUpload.png'));
                }}
                onSelected={(s) => {
                    setSrc(s);
                }}
                show={show}
                src={src}
            />
        </>
    );
}
DocumentAddDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};
export default DocumentAddDialog;
