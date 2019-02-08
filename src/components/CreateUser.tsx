import React from 'react';
import { connect } from 'react-redux';

import { IAppStore } from '../redux/interfaces/IAppStore';
import { AppThunkDispatch, createUser } from '../redux/thunks';
import { Button } from './Button';
import './CreateUser.css';

interface ICreateUserStateProps {
}
interface ICreateUserDispatchProps {
    onCreateUser: (name: string, email: string, password: string) => void;
}

interface ICreateUserProps extends ICreateUserStateProps, ICreateUserDispatchProps {
}

function CreateUser({ onCreateUser }: ICreateUserProps): React.ReactElement<ICreateUserProps> {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');

    return <div className="qd-create-user">
        <form
            className="qd-create-user_form"
            onSubmit={e => {
                onCreateUser(name, email, password);
                e.preventDefault();
            }}
        >
            <label>Name: <input value={name} onChange={e => setName(e.target.value)} /></label>
            <label>E-Mail: <input value={email} onChange={e => setEmail(e.target.value)} /></label>
            <label>Password: <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            /></label>
            <label>Passwort wiederholen: <input
                type="password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
            /></label>
            <Button type="submit" disabled={!password || password !== password2}>Erstellen</Button>
        </form>
    </div>;
}

const mapStateToProps = (state: IAppStore): ICreateUserStateProps => {
    return {
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): ICreateUserDispatchProps => {
    return {
        onCreateUser: (name, email, password) => dispatch(createUser(name, email, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
