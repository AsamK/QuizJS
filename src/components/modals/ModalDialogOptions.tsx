import React from 'react';

import { Button } from '../Button';
import './ModalDialogOptions.css';

export interface IOption {
    text: string;
    dangerous?: boolean;
    highlighted?: boolean;
}

interface IModalDialogOptionsProps {
    title: string;
    text?: string;
    options: (string | IOption)[];
    onOptionClick: (optionIndex: number) => void;
}

export const ModalDialogOptions = ({
    title,
    text,
    onOptionClick,
    options,
}: IModalDialogOptionsProps): React.ReactElement<IModalDialogOptionsProps> => {
    return <div className="qd-modal-dialog-options">
        <div className="qd-modal-dialog-options_title">{title}</div>
        {text == null ? null :
            <div className="qd-modal-dialog-options_text">{text}</div>
        }
        <div className="qd-modal-dialog-options_options">
            {options.map((o, i) => {
                const option = typeof o === 'string' ? { text: o } : o;
                return <Button
                    key={i}
                    className="qd-modal-dialog-options_option"
                    highlighted={option.highlighted}
                    dangerous={option.dangerous}
                    onClick={() => onOptionClick(i)}
                >{option.text}</Button>;
            })}
        </div>
    </div>;
};
