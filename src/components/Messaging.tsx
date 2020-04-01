import React from 'react';

import { IMessage } from '../redux/interfaces/IMessage';
import './Messaging.css';

interface IMessagesProps {
    messages: IMessage[];
    ownUserId: string;
    sendMessage: (message: string) => void;
}

export function Messages({ messages, ownUserId, sendMessage }: IMessagesProps): React.ReactElement<IMessagesProps> {
    const [newMessage, setNewMessage] = React.useState('');

    const sortedMessages = [...messages];
    sortedMessages.sort((a, b) => a.created_at > b.created_at ? -1
        : b.created_at > a.created_at ? 1 : 0);

    return <div className="qd-messaging">
        <form onSubmit={e => { sendMessage(newMessage); setNewMessage(''); e.preventDefault(); }}>
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
            <input type="submit" value="Senden" />
        </form>
        <div className="qd-messaging_messages">
            {sortedMessages.map(message => <div className={ownUserId === message.from ? 'self' : ''} key={message.id}>
                {message.text} <small className="qd-messaging_time">{message.created_at}</small>
            </div>)}
        </div>
    </div>;
}
