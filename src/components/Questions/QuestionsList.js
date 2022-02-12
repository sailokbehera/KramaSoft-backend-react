import React, { useState } from 'react';
import DialogTitle from '../DialogTitle';
import Translate from '../Translate';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useLanguage } from '../../store/LanguageStore';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import { QuestionsService } from '../../apis/rest.app';
import useHandleError from '../../hooks/useHandleError';
import InfiniteScroll from 'react-infinite-scroller';
import QuestionListItem from './QuestionListItem';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

const QuestionsList = ({ entityType, entityId }) => {
    const Language = useLanguage('video-lecture/details/[videoId]');

    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [question, setQuestion] = useState('');
    const [answerType, setAnswerType] = useState(1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleError = useHandleError();

    const [choices, setChoices] = useState([
        {
            value: '',
            isCorrect: false,
        },
        {
            value: '',
            isCorrect: false,
        },
    ]);

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

    console.log(
        '>>>>>>>>>>>>>',
        choices.filter((each) => each.isCorrect === true),
    );

    const handleCreate = () => {
        if (validate()) {
            setCreating(true);
            QuestionsService.create({
                entityId,
                entityType,
                question,
                answer: {
                    answerOfQuestion: choices.filter((each) => each.isCorrect).map((each) => each.value),
                },
                answerType,
                choices: choices.map((each) => each.value),
            })
                .then((response) => {
                    setQuestions(([...qs]) => {
                        qs.push(response);
                        return qs;
                    });
                    setQuestion('');
                    setAnswerType(1);
                    setChoices([
                        {
                            value: '',
                            isCorrect: false,
                        },
                        {
                            value: '',
                            isCorrect: false,
                        },
                    ]);
                    setCreateModalOpen(false);
                })
                .catch(handleError())
                .finally(() => {
                    setCreateModalOpen(false);
                    setCreating(false);
                });
        }
    };

    const loadQuestions = () => {
        if (questionsLoading) return;
        setQuestionsLoading(true);
        QuestionsService.find({ query: { entityId } })
            .then((response) => {
                // const { total, data } = response;
                // const _questions = [...questions, ...data];
                setQuestions(response);
                setHasMore(false);
            })
            .catch(handleError())
            .finally(() => {
                setQuestionsLoading(false);
                setHasMore(false);
            });
    };

    const onDelete = ({ _id }) =>
        setQuestions(([...questions]) => {
            const index = questions.findIndex((each) => each._id === _id);
            if (index > -1) questions.splice(index, 1);
            return questions;
        });

    const onEdit = (updatedData) =>
        setQuestions(([...questions]) => {
            const { _id } = updatedData;
            const index = questions.findIndex((each) => each._id === _id);
            if (index > -1) questions[index] = updatedData;
            return questions;
        });

    return (
        <React.Fragment>
            <Box alignItems="center" display="flex" justifyContent="space-between">
                <Typography variant="h4">{Language.get('tabs.questions')}</Typography>
                <Button color="primary" onClick={() => setCreateModalOpen(true)} variant="outlined">
                    <Translate root="video-lecture/details/[videoId]">{'question.form.create'}</Translate>
                </Button>
            </Box>
            <InfiniteScroll
                container
                hasMore={hasMore}
                loadMore={loadQuestions}
                loader={<CircularProgress size={24} />}
            >
                {questions.map((each, index) => (
                    <QuestionListItem
                        index={index + 1}
                        key={each._id}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        question={each}
                    />
                ))}
                {!hasMore && !questions.length && (
                    <Box display="flex" justifyContent="center">
                        <Translate root={'video-lecture/details/[videoId]'}>{'messages.noQuestions'}</Translate>
                    </Box>
                )}
            </InfiniteScroll>
            <Dialog fullWidth maxWido onClose={() => setCreateModalOpen(false)} open={createModalOpen} th={'xs'}>
                <DialogTitle onClose={() => setCreateModalOpen(false)}>
                    <Translate root="video-lecture/details/[videoId]">{'question.form.create'}</Translate>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} pb={1}>
                        <TextField
                            autoFocus
                            label={
                                <Translate root="video-lecture/details/[videoId]">{'question.form.question'}</Translate>
                            }
                            margin={'dense'}
                            onChange={(e) => setQuestion(e.target.value)}
                            value={question}
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
                                                                // disabled={
                                                                //     choices.filter((each) => each.isCorrect === true)
                                                                //         ?.length !== 0
                                                                // }
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

                        <Button color={'primary'} disabled={creating} onClick={handleCreate} variant={'contained'}>
                            {creating ? (
                                <CircularProgress size={15} />
                            ) : (
                                <Translate root="video-lecture/details/[videoId]">
                                    {'question.form.createButton'}
                                </Translate>
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

QuestionsList.propTypes = {
    entityType: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired,
};

export default QuestionsList;
