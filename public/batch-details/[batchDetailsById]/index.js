import React, { useEffect, useState } from 'react';
// import Box from '@material-ui/core/Box';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import { Typography } from '@material-ui/core/index';
// import Translate from '../../../src/components/Translate';
import TopHeaderProfile from '../../../src/page-components/Batch-details/TopHeaderProfile';
import { BatchService } from '../../../src/apis/rest.app';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Grid from '@material-ui/core/Grid';
import AboutBatchDetails from '../../../src/page-components/Batch-details/AboutBatchDetails';
import Box from '@material-ui/core/Box';
// import BottomSectionProfile from '../../../src/page-components/InstituteProfile/BottomSectionProfile';

function BatchDetails() {
    const Router = useRouter();
    const { batchDetailsById } = Router.query;
    const { enqueueSnackbar } = useSnackbar();
    const [batchDetails, setBatchDetails] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!batchDetailsById) return;
        BatchService.get(batchDetailsById, {
            query: {
                $populate: ['instituteCourse', 'syllabuses'],
            },
        })
            .then((response) => {
                setBatchDetails(response);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [batchDetailsById]);
    return (
        <>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <TopHeaderProfile batchDetails={batchDetails} />
                </Grid>
            </Grid>
            <Box mt={2} />
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <AboutBatchDetails batchDetails={batchDetails} batchId={batchDetailsById} />
                </Grid>
            </Grid>
        </>
    );
}

export default BatchDetails;
