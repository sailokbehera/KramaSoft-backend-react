import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ResultTableDialog from './ResultTableDialog';
import Confirm from '../components/Confirm';
import { DocumentService } from '../apis/rest.app';
import { useSnackbar } from 'notistack';

function DocumentTableView({ each, position, documentData, setDocumentData }) {
    const { enqueueSnackbar } = useSnackbar();
    const [openDialog, setOpenDialog] = useState(false);

    const deleteDocument = () => {
        Confirm('Are you sure ?', 'Do you really want to delete this ?', 'Yes', 'No')
            .then(() => {
                DocumentService.remove(each._id)
                    .then(() => {
                        let _allExam = documentData;
                        _allExam.splice(position, 1);
                        setDocumentData([]);
                        setDocumentData(_allExam);
                        enqueueSnackbar('Deleted SuccessFully', {
                            variant: 'success',
                        });
                    })
                    .catch((error) => {
                        enqueueSnackbar(error.message ? error.message : 'Something went wrong', {
                            variant: 'error',
                        });
                    });
            })
            .catch(() => {});
    };

    return (
        <>
            <TableRow key={position}>
                <TableCell>{position + 1}</TableCell>
                <TableCell>
                    <img alt={'Image'} src={each?.document} style={{ width: 'auto', height: 80 }} />
                </TableCell>
                <TableCell>
                    <Button
                        color={'primary'}
                        disabled={each?.result?.length === 0}
                        onClick={() => {
                            setOpenDialog(true);
                        }}
                        size={'small'}
                        variant={'contained'}
                    >
                        {'Data'}
                    </Button>
                </TableCell>
                <TableCell>
                    {each?.status === 1 ? (
                        <Chip label="Processing..." style={{ backgroundColor: '#ccbb00' }} variant="outlined" />
                    ) : each?.status === 2 ? (
                        <Chip label="Completed" style={{ backgroundColor: '#66CD00' }} variant="outlined" />
                    ) : (
                        <Chip label="Failed" style={{ backgroundColor: '#ff7f50' }} variant="outlined" />
                    )}
                </TableCell>
                <TableCell>
                    <Button
                        color={'secondary'}
                        onClick={() => {
                            deleteDocument();
                        }}
                        size={'small'}
                        variant={'contained'}
                    >
                        {'Delete'}
                    </Button>
                </TableCell>
                <ResultTableDialog each={each} open={openDialog} setOpen={setOpenDialog} />
            </TableRow>
        </>
    );
}

DocumentTableView.propTypes = {
    each: PropTypes.any,
    documentData: PropTypes.any,
    setDocumentData: PropTypes.any,
    position: PropTypes.number,
};

export default DocumentTableView;
