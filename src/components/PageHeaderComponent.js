/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description Header Component for admin pages
 * @createdOn 28-Dec-20 11:13 AM
 */

import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Translate from './Translate';
import FormControl from '@material-ui/core/FormControl';

const PageHeaderComponent = ({ title, search, onChange, setOpenCreate, addButtonText, searchPlaceholder }) => {
    return (
        <React.Fragment>
            <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'}>
                <Typography variant={'h3'}>{title}</Typography>
            </Box>
            <Box
                display={'flex'}
                flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
                justifyContent={'space-between'}
                my={2}
            >
                {searchPlaceholder ? (
                    <Box
                        alignItems={'center'}
                        bgcolor={'common.white'}
                        borderRadius={'borderRadius'}
                        boxShadow={1}
                        display={'flex'}
                        height={{ xs: '40px' }}
                        justifyContent={'space-between'}
                        mb={{ xs: 2, sm: 0, md: 0 }}
                        p={1.5}
                        width={{ xs: 1, sm: 300, md: 300 }}
                    >
                        <InputBase autoFocus onChange={onChange} placeholder={searchPlaceholder} value={search} />

                        <Box alignItems={'center'} color={'primary.main'} display={'flex'} fontSize={19} ml={1}>
                            <SearchIcon />
                        </Box>
                    </Box>
                ) : (
                    <div />
                )}
                {/*<FormControl margin="dense" variant="outlined">*/}
                {/*    <Select*/}
                {/*        input={<BootstrapInput />}*/}
                {/*        onChange={(e) => {*/}
                {/*            setCourseId(e.target.value);*/}
                {/*            setAllSyllabuses([]);*/}
                {/*            loadSyllabuses();*/}
                {/*        }}*/}
                {/*        value={courseId}*/}
                {/*    >*/}
                {/*        <MenuItem value={'all'}>*/}
                {/*            <Translate root={'institute-attendance/[id]'}>{'All'}</Translate>*/}
                {/*        </MenuItem>*/}
                {/*        {course &&*/}
                {/*        course.map((each) => (*/}
                {/*            <MenuItem key={each?.Type} value={each?._id}>*/}
                {/*                {each?.name}*/}
                {/*            </MenuItem>*/}
                {/*        ))}*/}
                {/*    </Select>*/}
                {/*</FormControl>*/}
                {Boolean(addButtonText) && (
                    <Button color={'primary'} onClick={() => setOpenCreate(true)} size="large" variant="contained">
                        <Typography variant={'button'}>{addButtonText}</Typography>
                    </Button>
                )}
            </Box>
        </React.Fragment>
    );
};

PageHeaderComponent.propTypes = {
    title: PropTypes.any.isRequired,
    value: PropTypes.any,
    search: PropTypes.any,
    onChange: PropTypes.func,
    setSearch: PropTypes.func,
    setOpenCreate: PropTypes.func,
    addButtonText: PropTypes.any,
    searchPlaceholder: PropTypes.any.isRequired,
};

export default PageHeaderComponent;
