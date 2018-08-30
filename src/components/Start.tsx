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

function Start({ games, user, onGameSelected, onNewGame }: IStartProps): React.ReactElement<IStartProps> {
    const requestedGames = games.filter(game => game.your_turn && game.state === GameState.REQUESTED)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.your_answers.filter(a => a === 0).length} vs {g.opponent_answers.filter(a => a === 0).length}
            </div>;
        });
    const runningGames = games.filter(game => game.your_turn && game.state === GameState.ACTIVE)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.your_answers.filter(a => a === 0).length} vs {g.opponent_answers.filter(a => a === 0).length}
            </div>;
        });
    const waitingGames = games.filter(game => !game.your_turn &&
        game.state !== GameState.FINISHED &&
        game.state !== GameState.ELAPSED &&
        game.state !== GameState.GAVE_UP)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.your_answers.filter(a => a === 0).length} vs {g.opponent_answers.filter(a => a === 0).length}
            </div>;
        });
    const finishedGames = games.filter(game => game.state === GameState.FINISHED ||
        game.state === GameState.GAVE_UP ||
        game.state === GameState.ELAPSED)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.your_answers.filter(a => a === 0).length} vs {g.opponent_answers.filter(a => a === 0).length}
            </div>;
        });
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
