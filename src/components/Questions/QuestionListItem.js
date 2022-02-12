import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useLanguage } from '../../store/LanguageStore';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { QuestionsService } from '../../apis/rest.app';
import { useConfirm } from '../Confirm';
import useHandleError from '../../hooks/useHandleError';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../DialogTitle';
import Translate from '../Translate';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
        borderBottom: '1px solid #EEEEEE',
        marginBottom: theme.spacing(2),
    },
}));

const QuestionListItem = ({ question, index, onDelete, onEdit }) => {
    const [deleting, setDeleting] = useState(false);

    const [questionTitle, setQuestionTitle] = useState(question.question);
    // eslint-disable-next-line no-unused-vars
    const [answerType, setAnswerType] = useState(question.answerType);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    const [choices, setChoices] = useState(
        question.choices.map((value) => {
            const isCorrect = Boolean(question.answer.answerOfQuestion.find((answer) => answer === value));
            return {
                value,
                isCorrect,
            };
        }),
    );
    const { enqueueSnackbar } = useSnackbar();

    const Language = useLanguage('video-lecture/details/[videoId]');

    const classes = useStyles();

    const Confirm = useConfirm();

    const handleError = useHandleError();

    const handleDelete = () =>
        Confirm().then(() => {
            setDeleting(true);
            QuestionsService.remove(question._id)
                .then(onDelete)
                .catch(handleError())
                .finally(() => setDeleting(false));
        });
    const validate = () => {
        if (question.trim() === '') {
            enqueueSnackbar('Enter a Question', { variant: 'warning' });
            return false;
        }
        if (choices[0]?.value === '') {
            enqueueSnackbar('Option1 can' + "'" + 't be empty', { variant: 'warning' });
            return false;
        }
        if (choices[1]?.value === '') {
            enqueueSnackbar('Option2 can' + "'" + 't be empty', { variant: 'warning' });
            return false;
        }
        if (choices[choices?.length - 1]?.value === '') {
            enqueueSnackbar(`Option${choices?.length} can` + "'" + 't be empty ', { variant: 'warning' });
            return false;
        }
        if (choices.filter((each) => each.isCorrect === true)?.length === 0) {
            enqueueSnackbar('Please provide a correct answer', { variant: 'warning' });
            return false;
        }
        if (choices.filter((each) => each.isCorrect === true)?.length > 1) {
            enqueueSnackbar('You can' + "'" + 't select more than one correct answer', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleCreate = () => {
        if (validate()) {
            setEditing(true);
            QuestionsService.patch(question._id, {
                question: questionTitle,
                answer: {
                    answerOfQuestion: choices.filter((each) => each.isCorrect).map((each) => each.value),
                },
                answerType,
                choices: choices.map((each) => each.value),
            })
                .then((res) => {
                    onEdit(res);
                    setCreateModalOpen(false);
                })
                .catch(handleError())
                .finally(() => setEditing(false));
        }
    };

    return (
        <div className={classes.root}>
            <Box display="flex" justifyContent="space-between" my={1}>
                <Typography variant="h4">{`Q.${index}: ${question.question}`}</Typography>
                <div>
                    <Button color="primary" onClick={setCreateModalOpen} size="small" startIcon={<EditIcon />}>
                        {Language.get('labels.edit')}
                    </Button>
                    <Button
                        color="secondary"
                        disabled={deleting}
                        endIcon={deleting && <CircularProgress color="secondary" size={15} />}
                        onClick={handleDelete}
                        size="small"
                        startIcon={<DeleteIcon />}
                    >
                        {Language.get('labels.delete')}
                    </Button>
                </div>
            </Box>
            {question.answerType === 1 && (
                <Box mb={2} mt={1}>
                    <Grid container spacing={2}>
                        {question.choices.map((each) => {
                            const isCorrect = Boolean(
                                question.answer.answerOfQuestion.find((answer) => answer === each),
                            );
                            return (
                                <Grid item key={each} md={6} sm={12} xs={12}>
                                    <Box
                                        alignItems="center"
                                        bgcolor={isCorrect ? '#e8fbec' : '#eeeeee'}
                                        border={1}
                                        borderColor={isCorrect ? '#71c158' : 'transparent'}
                                        borderRadius={5}
                                        color={isCorrect ? '#71c158' : 'inherit'}
                                        display="flex"
                                        fontSize={16}
                                        minHeight={56}
                                        px={2}
                                        py={1}
                                    >
                                        {each}
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}

            <Dialog fullWidth maxWido onClose={() => setCreateModalOpen(false)} open={createModalOpen} th={'xs'}>
                <DialogTitle onClose={() => setCreateModalOpen(false)}>
                    <Translate root="video-lecture/details/[videoId]">{'question.form.update'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            autoFocus
                            label={
                                <Translate root="video-lecture/details/[videoId]">{'question.form.question'}</Translate>
                            }
                            margin={'dense'}
                            onChange={(e) => setQuestionTitle(e.target.value)}
                            value={questionTitle}
                            variant={'outlined'}
                        />
                        <Box mt={2} />

                        {answerType === 1 && (
                            <React.Fragment>
                                {choices.map((each, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Box border={1} borderColor="grey.500" borderRadius={12} key={index} my={0.5} p={1}>
                                        <TextField
                                            autoFocus
                                            fullWidth
                                            label={`${Language.get('question.form.option')} ${index + 1}`}
                                            margin={'dense'}
                                            onChange={(e) =>
                                                setChoices(([...chs]) => {
                                                    chs[index].value = e.target.value;
                                                    return chs;
                                                })
                                            }
                                            value={each.value}
                                            variant={'outlined'}
                                        />
                                        <Box display="flex" justifyContent="space-between" my={1}>
                                            <FormControl component="fieldset">
                                                <FormGroup aria-label="position" row>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={each.isCorrect}
                                                                color="primary"
                                                                onChange={() =>
                                                                    setChoices(([...chs]) => {
                                                                        chs[index].isCorrect = !each.isCorrect;
                                                                        return chs;
                                                                    })
                                                                }
                                                                size="small"
                                                            />
                                                        }
                                                        label={Language.get('question.form.isCorrect')}
                                                        labelPlacement="start"
                                                        value="start"
                                                    />
                                                </FormGroup>
                                            </FormControl>
                                            <Button
                                                color="secondary"
                                                disabled={choices.length <= 2}
                                                onClick={() =>
                                                    setChoices(([...chs]) => {
                                                        chs.splice(index, 1);
                                                        return chs;
                                                    })
                                                }
                                                size="small"
                                                variant="outlined"
                                            >
                                                <Translate root="video-lecture/details/[videoId]">
                                                    {'question.form.removeOption'}
                                                </Translate>
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                                <Box display="flex" justifyContent="flex-end" my={1}>
                                    <Button
                                        color="primary"
                                        onClick={() =>
                                            setChoices(([...chs]) => {
                                                chs.push({ value: '', isCorrect: false });
                                                return chs;
                                            })
                                        }
                                        size="small"
                                        variant="outlined"
                                    >
                                        <Translate root="video-lecture/details/[videoId]">
                                            {'question.form.addChoice'}
                                        </Translate>
                                    </Button>
                                </Box>
                            </React.Fragment>
                        )}

                        <Button color={'primary'} disabled={editing} onClick={handleCreate} variant={'contained'}>
                            {editing ? (
                                <CircularProgress size={15} />
                            ) : (
                                <Translate root="video-lecture/details/[videoId]">{'labels.done'}</Translate>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
};

QuestionListItem.propTypes = {
    question: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default QuestionListItem;
