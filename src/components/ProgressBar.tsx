import React from 'react';

import './ProgressBar.css';

interface IProgressBarProps {
    /**
     * A number between 0 and 1.
     */
    progress: number;
}

function ProgressBar({ progress }: IProgressBarProps): React.ReactElement<IProgressBarProps> {
    return (
        <div className="qd-progress-bar">
            <div className="qd-progress-bar_progress" style={{ width: `${progress * 100}%` }}></div>
        </div>
    );
}

export default ProgressBar;
