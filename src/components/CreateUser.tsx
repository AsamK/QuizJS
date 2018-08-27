import React from 'react';

interface ICreateUserProps {
    onCreateUser: (name: string, email: string, password: string) => void;
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
        return <div>
            <form onSubmit={e => {
                onCreateUser(name, email, password);
                e.preventDefault();
            }}>
                <label>Name: <input value={name} onChange={e => this.setState({ name: e.target.value })} /></label>
                <label>E-Mail: <input value={email} onChange={e => this.setState({ email: e.target.value })} /></label>
                <label>Password: <input value={password} onChange={e => this.setState({ password: e.target.value })} /></label>
                <label>Passwort wiederholen: <input value={password2} onChange={e => this.setState({ password2: e.target.value })}
                /></label>
                <button type="submit" disabled={!password || password !== password2}>Erstellen</button>
            </form>
        </div>;
    }
}

export default CreateUser;
