import React from 'react';

import { IMessage } from '../redux/interfaces/IMessage';
import './Messaging.css';

interface IMessagesProps {
    messages: IMessage[];
    ownUserId: string;
}

export function Messages({ messages, ownUserId }: IMessagesProps): React.ReactElement<IMessagesProps> {
    return <div className="qd-messaging">
        {messages.map(message => <div className={ownUserId === message.from ? 'self' : ''}>
            {message.text} <small>{message.created_at}</small>
        </div>)}
    </div>;
}
