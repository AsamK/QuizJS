import React from 'react';
import { connect } from 'react-redux';

import { GameState } from '../api/IApiGame';
import { selectGame, showCreateNewGame } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IGame } from '../redux/interfaces/IGame';
import { IUser } from '../redux/interfaces/IUser';
import { gamesSelector, userSelector } from '../redux/selectors/entities.selectors';
import { AppThunkDispatch } from '../redux/thunks';
import './Start.css';

interface IStartStateProps {
    games: IGame[];
    user: IUser | null;
}
interface IStartDispatchProps {
    onGameSelected: (gameId: number) => void;
    onNewGame: () => void;
}

interface IStartProps extends IStartStateProps, IStartDispatchProps {
}

interface IStartElementProps {
    game: IGame;
    onGameSelected: (gameId: number) => void;
}

function StartElement({ game, onGameSelected }: IStartElementProps): React.ReactElement<IStartElementProps> {
    const yourCorrect = game.your_answers.filter(a => a === 0).length;
    const opponentCorrect = game.opponent_answers.filter(a => a === 0).length;
    return <div
        className="qd-start_entry"
        key={game.game_id}
        onClick={() => onGameSelected(game.game_id)}
    >
        <div className="qd-start_entry_opponent">
            {game.opponent.name}
            <div className="qd-start_entry_info">{
                game.state === GameState.ELAPSED ? 'Abgelaufen' :
                    game.state === GameState.GAVE_UP ? 'Aufgegeben' :
                        game.state === GameState.REQUESTED ? 'Anfrage' :
                            game.state === GameState.FINISHED ? (
                                yourCorrect > opponentCorrect ? 'Gewonnen' :
                                    yourCorrect < opponentCorrect ? 'Verloren' :
                                        'Unentschieden'
                            ) : null
            }</div>
        </div>
        <div className="qd-start_entry_points">
            {yourCorrect}-{opponentCorrect}
        </div>
        <div className="qd-start_entry_time">
            {new Date(game.timestamp).toISOString()}
        </div>
    </div>;
}

function Start({ games, user, onGameSelected, onNewGame }: IStartProps): React.ReactElement<IStartProps> {
    const requestedGames = games.filter(game => game.your_turn && game.state === GameState.REQUESTED)
        .map(g => <StartElement game={g} onGameSelected={onGameSelected} />);
    const runningGames = games.filter(game => game.your_turn && game.state === GameState.ACTIVE)
        .map(g => <StartElement game={g} onGameSelected={onGameSelected} />);
    const waitingGames = games.filter(game => !game.your_turn &&
        game.state !== GameState.FINISHED &&
        game.state !== GameState.ELAPSED &&
        game.state !== GameState.GAVE_UP)
        .map(g => <StartElement game={g} onGameSelected={onGameSelected} />);
    const finishedGames = games.filter(game => game.state === GameState.FINISHED ||
        game.state === GameState.GAVE_UP ||
        game.state === GameState.ELAPSED)
        .map(g => <StartElement game={g} onGameSelected={onGameSelected} />);
    return <div className="qd-start">
        Eingeloggt als: {!user ? 'Unbekannt' : user.name}
        <button onClick={onNewGame}>Neues Spiel starten</button>
        <div className="qd-start_running">
            {runningGames}
        </div>
        {requestedGames.length === 0 ? null :
            <div className="qd-start_requested">
                <div className="qd-start_requested-title">Anfragen</div>
                {requestedGames}
            </div>
        }
        {waitingGames.length === 0 ? null :
            <div className="qd-start_waiting">
                <div className="qd-start_waiting-title">Warten auf</div>
                {waitingGames}
            </div>
        }
        {finishedGames.length === 0 ? null :
            <div className="qd-start_finished">
                <div className="qd-start_finished-title">Beendete Spiele</div>
                {finishedGames}
            </div>
        }
    </div >;
}

const mapStateToProps = (state: IAppStore): IStartStateProps => {
    return {
        games: gamesSelector(state),
        user: userSelector(state),
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IStartDispatchProps => {
    return {
        onGameSelected: gameId => dispatch(selectGame(gameId)),
        onNewGame: () => dispatch(showCreateNewGame()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
