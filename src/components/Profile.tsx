import React from 'react';
import { connect } from 'react-redux';

import { showProfile } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IUser } from '../redux/interfaces/IUser';
import { friendsSelector, userSelector } from '../redux/selectors/entities.selectors';
import { AppThunkDispatch, updateUser } from '../redux/thunks';
import Avatar from './Avatar';
import { Button } from './Button';
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

function Profile({ friends, user, onBack, onUpdateUser }: IProfileProps): React.ReactElement<IProfileProps> | null {
    const [name, setName] = React.useState<string | null>(null);
    const [email, setEmail] = React.useState<string | null>(null);
    const [password, setPassword] = React.useState<string | null>(null);
    const [password2, setPassword2] = React.useState<string | null>(null);
    const [updatePassword, setUpdatePassword] = React.useState(false);

    if (!user) {
        return null;
    }

    const friendElements = friends.map(friend =>
        <div
            key={friend.user_id}
            className="qd-profile_friend"
        >
            <Avatar avatarCode={friend.avatar_code} />{friend.name}<span className="qd-profile_friend-email">{friend.email}</span>
        </div>,
    );

    return <div className="qd-profile">
        <Button onClick={onBack}>Zurück</Button>
        <h2>{user.name}</h2>
        <div className="qd-profile_user-id">Benutzer ID: {user.user_id}</div>
        <div className="qd-profile_avatar">Avatar: <Avatar avatarCode={user.avatar_code} /></div>
        {updatePassword ?
            <form className="qd-profile_form" onSubmit={e => {
                onUpdateUser(name === null ? user.name : name, email === null ? user.email || '' : email, password);
                setUpdatePassword(false);
                e.preventDefault();
            }}>
                <label>Name:
                    <input type="name"
                        autoComplete="username"
                        value={name != null ? name || '' : user.name || ''}
                        onChange={e => setName(e.target.value)}
                    />
                </label>
                <label>Email:
                    <input type="email"
                        value={email != null ? email || '' : user.email || ''}
                        onChange={e => setEmail(e.target.value)}
                    />
                </label>
                <label>Passwort:
                    <input type="password"
                        autoComplete="new-password"
                        value={password || ''}
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>
                <label>Passwort wiederholen:
                    <input type="password"
                        autoComplete="new-password"
                        value={password2 || ''}
                        onChange={e => setPassword2(e.target.value)}
                    />
                </label>
                <Button type="submit" disabled={password !== password2}>Ändern</Button>
                <Button type="reset" onClick={() => setUpdatePassword(false)}>Abbrechen</Button>
            </form>
            :
            <>
                <div className="qd-profile_email">Email: {user.email}</div>
                <div className="qd-profile_password">Passwort: ***
                        <Button onClick={() => setUpdatePassword(true)}>Ändern</Button>
                </div>
            </>
        }
        <h3>Freunde:</h3>
        <div className="qd-profile_friends">
            {friendElements}
        </div>
    </div>;
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
