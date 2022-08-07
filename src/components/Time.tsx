import React from 'react';

import './Time.css';
import { useRefresh } from './utils';

export interface ITimeProps {
    timestamp: number;
    showSeconds: boolean;
    showDays: boolean;
}

export function Time(props: ITimeProps): React.ReactElement<ITimeProps> {
    const [timerInterval, setTimerInterval] = React.useState<number | null>(null);
    const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

    const timer = React.useRef<number | null>(null);
    useRefresh(() => {
        function cleanUpTimer(): void {
            if (timer.current != null) {
                window.clearInterval(timer.current);
                timer.current = null;
            }
        }

        if (timerInterval != null) {
            forceUpdate();
            timer.current = window.setInterval(forceUpdate, timerInterval);
        } else {
            cleanUpTimer();
        }

        return cleanUpTimer;
    }, [timerInterval]);

    const { showSeconds, showDays, timestamp } = props;
    let diff = new Date().valueOf() - new Date(timestamp).valueOf();
    if (diff < 0) {
        // Future date shouldn't happen
        diff = 0;
    }
    let age;
    const seconds = Math.trunc(diff / 1000);
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.trunc(minutes / 60);
    const days = Math.trunc(hours / 24);
    let nextInterval;
    if (days > 0 && showDays) {
        age = `${days}d`;
        nextInterval = 1000 * 60 * 60;
    } else if (hours > 0) {
        age = `${hours}h`;
        nextInterval = 1000 * 60 * 15;
    } else if (minutes > 0 || !showSeconds) {
        age = `${minutes}min`;
        nextInterval = (1000 * 15);
    } else {
        age = `${seconds}s`;
        nextInterval = 1000;
    }
    if (nextInterval !== timerInterval) {
        setTimerInterval(nextInterval);
    }

    return (
        <div className="qd-time" title={new Date(timestamp).toString()}>
            {age}
        </div>
    );
}
