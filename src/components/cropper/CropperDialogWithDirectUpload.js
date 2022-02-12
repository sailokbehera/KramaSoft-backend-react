import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { ThemeProvider } from '@material-ui/core/styles';
import Cropper from 'react-cropper';
import DragAndDrop from './DragAndDrop';
import theme from '../../theme';
import PropTypes from 'prop-types';
import DialogTitle from '../DialogTitle';
import Box from '@material-ui/core/Box';

function CropperDialog({
    okLabel = 'Edit',
    cancelLabel = 'Cancel',
    show,
    dismiss,
    cancel,
    onCropped,
    onSelected,
    src,
    isSquare,
    aspectRatio,
}) {
    const [cropper, setCropper] = useState();
    const cropImage = () => {
        if (typeof cropper.getCroppedCanvas() === 'undefined' || !cropper.getCroppedCanvas()) {
            // console.log('hiii');
            return;
        }
        onCropped(cropper.getCroppedCanvas().toDataURL());
    };

    const handleDrop = (files) => {
        const reader = new FileReader();
        reader.onload = () => {
            onSelected(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    CropperDialog.propTypes = {
        okLabel: PropTypes.any,
        cancelLabel: PropTypes.any,
        show: PropTypes.any,
        dismiss: PropTypes.any.isRequired,
        cancel: PropTypes.any.isRequired,
        onCropped: PropTypes.any.isRequired,
        onSelected: PropTypes.any.isRequired,
        src: PropTypes.any,
        isSquare: PropTypes.any,
        aspectRatio: PropTypes.any,
    };

    CropperDialog.defaultProps = {
        okLabel: 'Edit',
        cancelLabel: 'Cancel',
        isSquare: 1,
        aspectRatio: 1,
    };

    return (
        <ThemeProvider theme={theme}>
            {/*theme={getTheme(themeColors.primary, themeColors.secondary)}*/}
            <Dialog fullWidth maxWidth="xs" onClose={dismiss} open={show}>
                <DialogTitle onClose={dismiss}>{'Upload Photo'}</DialogTitle>
                <DialogContent>
                    <Box width={'100%'}>
                        {!src ? (
                            <DragAndDrop handleDrop={handleDrop}>
                                <div style={{ height: 400, width: 400 }} />
                            </DragAndDrop>
                        ) : (
                            <Cropper
                                aspectRatio={aspectRatio ? aspectRatio : 1}
                                guides={true}
                                preview=".img-preview"
                                ref={(c) => {
                                    setCropper(c);
                                }}
                                src={src}
                                style={{ height: 400, width: '100%' }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={cancel}>
                        {cancelLabel}
                    </Button>
                    {src ? (
                        <Button color="primary" onClick={() => cropImage()} variant="contained">
                            {okLabel}
                        </Button>
                    ) : (
                        <Button color="primary" disabled variant="contained">
                            {okLabel}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default CropperDialog;
