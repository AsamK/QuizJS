import React from 'react';
import { useSelector } from 'react-redux';

import { userStatsSelector } from '../redux/selectors/entities.selectors';
import { useThunkDispatch } from '../redux/store';
import { loadUserStats } from '../redux/thunks';

import './UserStatistics.css';
import { useRefresh } from './utils';

function computePercentage(value: number, total: number): string {
    return total === 0
        ? '-'
        : formatPercentage(value / total);
}

function formatPercentage(value: number): string {
    return `${Math.trunc(value * 10000) / 100}%`;
}

export function UserStatistics(): React.ReactElement {
    const stats = useSelector(userStatsSelector);
    const dispatch = useThunkDispatch();
    useRefresh(() => { dispatch(loadUserStats()); }, []);

    if (stats == null) {
        return <div>Loading</div>;
    }

    const catStats = [...stats.cat_stats];
    catStats.sort((a, b) => b.percentCorrect - a.percentCorrect);

    return <div className="qd-user-statistics">
        <div className="qd-user-statistics_line">
            Punkte: {stats.rating}
        </div>
        <div className="qd-user-statistics_line">
            Spiele: {stats.n_games_played}
        </div>
        <div className="qd-user-statistics_line">
            Siege: {stats.n_games_won} ({computePercentage(stats.n_games_won, stats.n_games_played)})
        </div>
        <div className="qd-user-statistics_line">
            Unentschieden: {stats.n_games_tied} ({computePercentage(stats.n_games_tied, stats.n_games_played)})
        </div>
        <div className="qd-user-statistics_line">
            Niederlagen: {stats.n_games_lost} ({computePercentage(stats.n_games_lost, stats.n_games_played)})
        </div>
        <div className="qd-user-statistics_line">
            Perfekte Spiele: {stats.n_perfect_games} ({computePercentage(stats.n_perfect_games, stats.n_games_played)})
        </div>
        <div className="qd-user-statistics_line">
            Richtige Fragen: {stats.n_questions_correct} von {stats.n_questions_answered} (
                {computePercentage(stats.n_questions_correct, stats.n_questions_answered)})
        </div>
        <div className="qd-user-statistics_line">
            Rang: {stats.rank.toLocaleString()} von {stats.n_users.toLocaleString()}
        </div>
        <div className="qd-user-statistics_categories">
            <h4>Kategorien:</h4>
            {catStats.map(cat => <div className="qd-user-statistics_category">
                {cat.cat_name}: {formatPercentage(cat.percentCorrect)}
            </div>)}
        </div>
    </div>;
}
