import React from 'react';
import { GameState } from '../api/IApiGame';
import { IApiStateResponse } from '../api/IApiStateResponse';
import './Start.css';

interface IStartProps {
    gameState: IApiStateResponse;
    onGameSelected: (gameId: number) => void;
    onNewGame: () => void;
}

function Start({ gameState, onGameSelected, onNewGame }: IStartProps): React.ReactElement<IStartProps> {
    const requestedGames = gameState.user.games.filter(game => game.your_turn && game.state === GameState.REQUESTED)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.opponent_answers.filter(a => a === 0).length} vs {g.your_answers.filter(a => a === 0).length}
            </div>;
        });
    const runningGames = gameState.user.games.filter(game => game.your_turn && game.state === GameState.ACTIVE)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.opponent_answers.filter(a => a === 0).length} vs {g.your_answers.filter(a => a === 0).length}
            </div>;
        });
    const waitingGames = gameState.user.games.filter(game => !game.your_turn &&
        game.state !== GameState.FINISHED &&
        game.state !== GameState.GAVE_UP)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.opponent_answers.filter(a => a === 0).length} vs {g.your_answers.filter(a => a === 0).length}
            </div>;
        });
    const finishedGames = gameState.user.games.filter(game => game.state === GameState.FINISHED || game.state === GameState.GAVE_UP)
        .map(g => {
            return <div key={g.game_id} onClick={() => onGameSelected(g.game_id)}>{g.opponent.name}:&nbsp;
              {g.opponent_answers.filter(a => a === 0).length} vs {g.your_answers.filter(a => a === 0).length}
            </div>;
        });
    return <div className="qd-start">
        Eingeloggt als: {gameState.user.name}
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

export default Start;
