import React from 'react';

import { useThunkDispatch } from '../redux/store';
import { createUser } from '../redux/thunks';

import { Button } from './Button';
import './CreateUser.css';

function CreateUser(): React.ReactElement {
    const dispatch = useThunkDispatch();

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');

    return <div className="qd-create-user">
        <form
            className="qd-create-user_form"
            onSubmit={e => {
                dispatch(createUser(name, email, password));
                e.preventDefault();
            }}
        >
            <label>Name: <input value={name} autoComplete="username" onChange={e => setName(e.target.value)} /></label>
            <label>E-Mail: <input value={email} type="email" autoComplete="email" onChange={e => setEmail(e.target.value)} /></label>
            <label>Password: <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            /></label>
            <label>Passwort wiederholen: <input
                type="password"
                autoComplete="new-password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
            /></label>
            <Button type="submit" disabled={!password || password !== password2}>Erstellen</Button>
        </form>
    </div>;
}

export default CreateUser;
