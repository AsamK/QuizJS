import React from 'react';

import './Button.css';

interface IButtonProps {
    disabled?: boolean;
    showLoadingIndicator?: boolean;
    highlighted?: boolean;
    dangerous?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
    children,
    className,
    disabled,
    onClick,
    showLoadingIndicator,
    highlighted,
    dangerous,
    type,
}: IButtonProps): React.ReactElement<IButtonProps> => {
    return <button
        className={'qd-button'
            + (showLoadingIndicator ? ' qd-button_loading' : '')
            + (highlighted ? ' qd-button_highlighted' : '')
            + (dangerous ? ' qd-button_dangerous' : '')
            + (className ? ' ' + className : '')
        }
        onClick={onClick}
        disabled={disabled}
        type={type}
    >{children}</button>;
};
