import React from 'react';
import { connect } from 'react-redux';

import { showProfile } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IUser } from '../redux/interfaces/IUser';
import { friendsSelector, userSelector } from '../redux/selectors/entities.selectors';
import { AppThunkDispatch, updateUser } from '../redux/thunks';
import './Profile.css';

interface IProfileStateProps {
    user: IUser | null;
    friends: IUser[];
}
interface IProfileDispatchProps {
    onBack: () => void;
    onUpdateUser: (name: string, email: string, password: string | null) => void;
}
interface IProfileProps extends IProfileStateProps, IProfileDispatchProps {
}

interface IProfileState {
    updatePassword: boolean;
    email: string | null;
    name: string | null;
    password: string | null;
    password2: string | null;
}

class Profile extends React.Component<IProfileProps, IProfileState> {

    public state = {
        email: null,
        name: null,
        password: null,
        password2: null,
        updatePassword: false,
    };

    public render(): React.ReactChild | null {
        const { friends, user, onBack, onUpdateUser } = this.props;
        if (!user) {
            return null;
        }
        const friendElements = friends.map(friend =>
            <div
                key={friend.user_id}
                className="qd-profile_friend"
            >
                {friend.name} &lt;{friend.email}&gt; ({friend.avatar_code})
            </div>,
        );
        return <div className="qd-profile">
            <button onClick={onBack}>Zurück</button>
            <h2>{user.name} ({user.user_id})</h2>
            {!user.avatar_code ? null : <div className="qd-profile_avatar">Avatar: {user.avatar_code}</div>}
            {this.state.updatePassword ?
                <form className="qd-profile_form" onSubmit={e => {
                    const password = this.state.password;
                    const { name, email } = this.state;
                    onUpdateUser(name === null ? user.name : name, email === null ? user.email || '' : email, password);
                    this.setState({ updatePassword: false });
                    e.preventDefault();
                }}>
                    <label>Name:
                        <input type="name"
                            value={this.state.name != null ? this.state.name || '' : user.name || ''}
                            onChange={e => this.setState({ name: e.target.value })}
                        />
                    </label>
                    <label>Email:
                        <input type="email"
                            value={this.state.email != null ? this.state.email || '' : user.email || ''}
                            onChange={e => this.setState({ email: e.target.value })}
                        />
                    </label>
                    <label>Passwort:
                            <input type="password"
                            value={this.state.password || ''}
                            onChange={e => this.setState({ password: e.target.value })}
                        />
                    </label>
                    <label>Passwort wiederholen:
                            <input type="password"
                            value={this.state.password2 || ''}
                            onChange={e => this.setState({ password2: e.target.value })}
                        />
                    </label>
                    <input type="submit" value="Ändern" disabled={this.state.password !== this.state.password2} />
                    <button type="reset" onClick={() => this.setState({ updatePassword: false })}>Abbrechen</button>
                </form>
                :
                <>
                    <div className="qd-profile_email">Email: {user.email}</div>
                    <div className="qd-profile_password">Passwort: ***
                        <button onClick={() => this.setState({ updatePassword: true })}>Ändern</button>
                    </div>
                </>
            }
            <div className="qd-profile_friends">Freunde:
            {friendElements}
            </div>
        </div>;
    }
}

const mapStateToProps = (state: IAppStore): IProfileStateProps => {
    return {
        friends: friendsSelector(state),
        user: userSelector(state),
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IProfileDispatchProps => {
    return {
        onBack: () => dispatch(showProfile(false)),
        onUpdateUser: (name, email, password) => dispatch(updateUser(name, email, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
