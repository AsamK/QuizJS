import React from 'react';
import { IApiUser } from '../api/IApiUser';

interface INewGameProps {
    friends: IApiUser[];
    foundUser: IApiOpponent | null;
    onRandomGame: () => void;
    onCreateGame: (userId: string) => void;
    onSearchUser: (name: string) => void;
}

const NewGame = ({ friends, foundUser, onCreateGame, onRandomGame, onSearchUser }: INewGameProps) => {
    const friendElements = friends.map(friend =>
        <div
            key={friend.user_id}
            className="qd-new-game_friend"
            onClick={() => onCreateGame(friend.user_id)}
        >
            {friend.name} {friend.email} {friend.facebook_id}
        </div>,
    );
    return <div className="qd-new-game">
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
                    {foundUser.name} {foundUser.avatar_code} {foundUser.rating}
                </div>
            }
        </div>
        <div className="qd-new-game_friends">
            {friendElements}
        </div>
    </div>;
};

export default NewGame;
