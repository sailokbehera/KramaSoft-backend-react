import { useSnackbar } from 'notistack';
import { useLanguage } from '../store/LanguageStore';

const useHandleError = () => {
    const { enqueueSnackbar } = useSnackbar();
    const Language = useLanguage();
    return (defaultMessage = Language.get('error.500')) => (error) => {
        enqueueSnackbar(error.message ? error.message : defaultMessage, { variant: 'error' });
    };
};

export default useHandleError;
