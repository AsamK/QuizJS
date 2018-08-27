import React from 'react';

interface ILoginProps {
    onLogin: (name: string, password: string) => void;
}

interface ILoginState {
    name: string;
    password: string;
}

class Login extends React.Component<ILoginProps, ILoginState> {
    public state: ILoginState = {
        name: '',
        password: '',
    };

    public render(): React.ReactNode {
        const { name, password } = this.state;
        const { onLogin } = this.props;
        return <div>
            <form onSubmit={e => {
                onLogin(name, password);
                e.preventDefault();
            }}>
                <label>Name: <input value={name} onChange={e => this.setState({ name: e.target.value })} /></label>
                <label>Passwort: <input value={password} onChange={e => this.setState({ password: e.target.value })} /></label>
                <button type="submit">Login</button>
            </form>
        </div>;
    }
}

export default Login;
