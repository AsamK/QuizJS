import React from 'react';
import { connect } from 'react-redux';

import { IApiOpponent } from '../api/IApiOpponent';
import { showCreateNewGame } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IUser } from '../redux/interfaces/IUser';
import { foundUserSelector, friendsSelector } from '../redux/selectors/entities.selectors';
import { AppThunkDispatch, createGame, createRandomGame, searchUser } from '../redux/thunks';

interface INewGameStateProps {
    foundUser: IApiOpponent | null;
    friends: IUser[];
}
interface INewGameDispatchProps {
    onBack: () => void;
    onCreateGame: (userId: string) => void;
    onRandomGame: () => void;
    onSearchUser: (name: string) => void;
}

interface INewGameProps extends INewGameStateProps, INewGameDispatchProps {
}

const NewGame = ({ friends, foundUser, onBack, onCreateGame, onRandomGame, onSearchUser }: INewGameProps) => {
    const friendElements = friends.map(friend =>
        <div
            key={friend.user_id}
            className="qd-new-game_friend"
            onClick={() => onCreateGame(friend.user_id)}
        >
            {friend.name} {friend.email}
        </div>,
    );
    return <div className="qd-new-game">
        <button onClick={onBack}>Zurück</button>
        <button
            onClick={onRandomGame}
        >Beliebiger Spieler</button>
        <div className="qd-new-game_search-user">
            <input onChange={e => onSearchUser(e.target.value)} />
            {!foundUser ? null :
                <div
                    key={foundUser.user_id}
                    className="qd-new-game_searchUser"
                    onClick={() => onCreateGame(foundUser.user_id)}
                >
                    {foundUser.name} {foundUser.avatar_code}
                </div>
            }
        </div>
        <div className="qd-new-game_friends">
            {friendElements}
        </div>
    </div>;
};

const mapStateToProps = (state: IAppStore): INewGameStateProps => ({
    foundUser: foundUserSelector(state),
    friends: friendsSelector(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch): INewGameDispatchProps => {
    return {
        onBack: () => dispatch(showCreateNewGame(false)),
        onCreateGame: userId => dispatch(createGame(userId)),
        onRandomGame: () => dispatch(createRandomGame()),
        onSearchUser: name => dispatch(searchUser(name)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
