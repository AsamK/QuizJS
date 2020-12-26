import React from 'react';

import './Modal.css';

interface IModalProps {
    children: React.ReactNode;
}

export const Modal = ({
    children,
}: IModalProps): React.ReactElement<IModalProps> => {
    return <div className="qd-modal">
        <div className="qd-modal-backdrop"></div>
        {children}
    </div>;
};
