import React from 'react';

import { Button } from './Button';
import './Login.css';

interface ILoginProps {
    onLogin: (name: string, password: string) => void;
}

function Login({ onLogin }: ILoginProps): React.ReactElement<ILoginProps> {
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <div className="qd-login">
            <form
                className="qd-login_form"
                onSubmit={e => {
                    onLogin(name, password);
                    e.preventDefault();
                }}
            >
                <label>
                    Name:{' '}
                    <input
                        value={name}
                        autoComplete="username"
                        onChange={e => setName(e.target.value)}
                    />
                </label>
                <label>
                    Passwort:{' '}
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>
                <Button type="submit">Login</Button>
            </form>
        </div>
    );
}

export default Login;
