import React from 'react';
import { connect } from 'react-redux';

import { IAppStore } from '../redux/interfaces/IAppStore';
import { AppThunkDispatch, createUser } from '../redux/thunks';
import './CreateUser.css';

interface ICreateUserStateProps {
}
interface ICreateUserDispatchProps {
    onCreateUser: (name: string, email: string, password: string) => void;
}

interface ICreateUserProps extends ICreateUserStateProps, ICreateUserDispatchProps {
}

interface ICreateUserState {
    email: string;
    name: string;
    password: string;
    password2: string;
}

class CreateUser extends React.Component<ICreateUserProps, ICreateUserState> {
    public state: ICreateUserState = {
        email: '',
        name: '',
        password: '',
        password2: '',
    };

    public render(): React.ReactNode {
        const { name, email, password, password2 } = this.state;
        const { onCreateUser } = this.props;
        return <div className="qd-create-user">
            <form
                className="qd-create-user_form"
                onSubmit={e => {
                    onCreateUser(name, email, password);
                    e.preventDefault();
                }}
            >
                <label>Name: <input value={name} onChange={e => this.setState({ name: e.target.value })} /></label>
                <label>E-Mail: <input value={email} onChange={e => this.setState({ email: e.target.value })} /></label>
                <label>Password: <input
                    type="password"
                    value={password}
                    onChange={e => this.setState({ password: e.target.value })}
                /></label>
                <label>Passwort wiederholen: <input
                    type="password"
                    value={password2}
                    onChange={e => this.setState({ password2: e.target.value })}
                /></label>
                <button type="submit" disabled={!password || password !== password2}>Erstellen</button>
            </form>
        </div>;
    }
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
