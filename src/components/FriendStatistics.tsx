import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { friendStatsSelector } from '../redux/selectors/entities.selectors';
import { loadFriendStats } from '../redux/thunks';
import Avatar from './Avatar';
import './FriendStatistics.css';

export function FriendStatistics(): React.ReactElement {
    const stats = useSelector(friendStatsSelector);
    const dispatch = useDispatch();
    React.useEffect(() => { dispatch(loadFriendStats()); }, []);

    if (stats == null) {
        return <div>Loading</div>;
    }

    const friendStats = [...stats.game_stats];
    friendStats.sort((a, b) => b.n_games_won + b.n_games_tied + b.n_games_lost - a.n_games_won - a.n_games_tied - a.n_games_lost);

    return <div className="qd-friend-statistics">
        {friendStats.map(friend => <div className="qd-friend-statistics_friend">
            <Avatar avatarCode={friend.avatar_code} />
            <div className="qd-friend-statistics_name">{friend.name}</div>
            <div className="qd-friend-statistics_stats">
                <div className="qd-friend-statistics_won">
                    {friend.n_games_won}
                </div>
                <div className="qd-friend-statistics_tied">
                    {friend.n_games_tied}
                </div>
                <div className="qd-friend-statistics_lost">
                    {friend.n_games_lost}
                </div>
            </div>
        </div>)}
    </div >;
}
