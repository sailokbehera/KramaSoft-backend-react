import ConfirmDialog from './confirmDialog';
import { createConfirmation } from 'react-confirm';
import { useLanguage } from '../../store/LanguageStore';

const confirm = createConfirmation(ConfirmDialog);

/**
 *
 * @param title {string}
 * @param message {string}
 * @param okLabel {string}
 * @param options {{}}
 * @returns {*}
 * @constructor
 */
const Confirm = (title, message, okLabel, options = {}) =>
    confirm({ ...options, title, confirmation: message, okLabel });

/**
 *
 * @param root {string=}
 * @returns {function(title:string=, message:string=, okLabel:string=, options:{cancelLabel:string}=): Promise<T>}
 */
export const useConfirm = (root = undefined) => {
    const Language = useLanguage(root);
    return (
        title = Language.get('common.confirm.default'),
        message,
        okLabel = Language.get('common.confirm.yes'),
        options = { cancelLabel: Language.get('common.confirm.cancel') },
    ) => confirm({ ...options, title, confirmation: message, okLabel });
};

export default Confirm;
