import React from 'react';

import './ModalDialog.css';

interface IModalDialogProps {
    children: React.ReactNode;
}

export const ModalDialog = ({
    children,
}: IModalDialogProps): React.ReactElement<IModalDialogProps> => {
    return <div className="qd-modal-dialog">{children}</div>;
};
