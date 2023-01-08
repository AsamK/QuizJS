import React from 'react';
import { useSelector } from 'react-redux';

import { GameState } from '../api/IApiGame';
import {
    selectGame,
    selectQuiz,
    showCreateNewGame,
    showProfile,
} from '../redux/actions/ui.actions';
import type { IGame } from '../redux/interfaces/IGame';
import type { IQuiz } from '../redux/interfaces/IQuiz';
import {
    gamesSelector,
    quizzesSelector,
    userSelector,
} from '../redux/selectors/entities.selectors';
import { useThunkDispatch } from '../redux/store';
import { loadData } from '../redux/thunks';

import Avatar from './Avatar';
import { Button } from './Button';
import './Start.css';
import { Time } from './Time';
import { useRefresh } from './utils';

interface IStartElementProps {
    game: IGame;
    onGameSelected: (gameId: number) => void;
}

function StartElement({
    game,
    onGameSelected,
}: IStartElementProps): React.ReactElement<IStartElementProps> {
    const yourCorrect = game.your_answers.filter(a => a === 0).length;
    const opponentCorrect = game.opponent_answers
        .slice(0, game.your_answers.length)
        .filter(a => a === 0).length;
    return (
        <div className="qd-start_entry" onClick={() => onGameSelected(game.game_id)}>
            <div className="qd-start_entry_opponent">
                <Avatar avatarCode={game.opponent.avatar_code} />
                {game.opponent.name}
                <div className="qd-start_entry_info">
                    {game.state === GameState.ELAPSED
                        ? 'Abgelaufen'
                        : game.state === GameState.GAVE_UP
                        ? 'Aufgegeben'
                        : game.state === GameState.REQUESTED
                        ? 'Anfrage'
                        : game.state === GameState.FINISHED
                        ? yourCorrect > opponentCorrect
                            ? 'Gewonnen'
                            : yourCorrect < opponentCorrect
                            ? 'Verloren'
                            : 'Unentschieden'
                        : null}
                </div>
            </div>
            <div className="qd-start_entry_points">
                {yourCorrect} - {opponentCorrect}
            </div>
            <div className="qd-start_entry_time">
                {!game.timestamp ? null : (
                    <Time timestamp={game.timestamp} showSeconds={false} showDays={false} />
                )}
            </div>
        </div>
    );
}

interface IStartQuizElementProps {
    quiz: IQuiz;
    onQuizSelected: (quizId: string) => void;
}

function StartQuizElement({
    quiz,
    onQuizSelected,
}: IStartQuizElementProps): React.ReactElement<IStartQuizElementProps> {
    const yourCorrect = quiz.your_answers.answers.filter(a => a.answer === 0).length;
    const answersCount = quiz.your_answers.answers.length;
    return (
        <div className="qd-start_entry" onClick={() => onQuizSelected(quiz.quiz_id)}>
            <div className="qd-start_entry_opponent">
                {quiz.name}
                <div className="qd-start_entry_info"></div>
            </div>
            <div className="qd-start_entry_points">
                {yourCorrect}/{answersCount}
            </div>
            <div className="qd-start_entry_time">
                {!quiz.pub_daterange.lower ? null : (
                    <Time
                        timestamp={new Date(quiz.pub_daterange.lower).getTime()}
                        showSeconds={false}
                        showDays={true}
                    />
                )}
            </div>
        </div>
    );
}

function Start(): React.ReactElement {
    useRefresh(() => {
        dispatch(loadData());
    }, []);

    const games = useSelector(gamesSelector);
    const quizzes = useSelector(quizzesSelector);
    const user = useSelector(userSelector);

    const dispatch = useThunkDispatch();
    const onGameSelected = React.useCallback(
        (gameId: number | null) => dispatch(selectGame(gameId)),
        [dispatch],
    );
    const onNewGame = React.useCallback(() => dispatch(showCreateNewGame()), [dispatch]);
    const onQuizSelected = React.useCallback(
        (quizId: string | null) => dispatch(selectQuiz(quizId)),
        [dispatch],
    );
    const onShowProfile = React.useCallback(() => dispatch(showProfile()), [dispatch]);

    const requestedGames = games
        .filter(game => game.your_turn && game.state === GameState.REQUESTED)
        .map(g => <StartElement key={g.game_id} game={g} onGameSelected={onGameSelected} />);
    const runningGames = games
        .filter(
            game =>
                game.your_turn &&
                (game.state === GameState.ACTIVE || game.state === GameState.NEW_RANDOM_GAME),
        )
        .map(g => <StartElement key={g.game_id} game={g} onGameSelected={onGameSelected} />);
    const waitingGames = games
        .filter(
            game =>
                !game.your_turn &&
                game.state !== GameState.FINISHED &&
                game.state !== GameState.ELAPSED &&
                game.state !== GameState.GAVE_UP,
        )
        .map(g => <StartElement key={g.game_id} game={g} onGameSelected={onGameSelected} />);
    const finishedGames = games
        .filter(
            game =>
                game.state === GameState.FINISHED ||
                game.state === GameState.GAVE_UP ||
                game.state === GameState.ELAPSED,
        )
        .map(g => <StartElement key={g.game_id} game={g} onGameSelected={onGameSelected} />);
    const runningQuizElements = quizzes
        .filter(quiz => quiz.your_answers.finish_date == null)
        .map(quiz => (
            <StartQuizElement key={quiz.quiz_id} quiz={quiz} onQuizSelected={onQuizSelected} />
        ));
    const finishedQuizElements = quizzes
        .filter(quiz => quiz.your_answers.finish_date != null)
        .map(quiz => (
            <StartQuizElement key={quiz.quiz_id} quiz={quiz} onQuizSelected={onQuizSelected} />
        ));
    return (
        <div className="qd-start">
            Eingeloggt als:{' '}
            <span onClick={onShowProfile}>
                {user == null ? null : <Avatar avatarCode={user.avatar_code} />}
                {!user ? 'Unbekannt' : user.name}
            </span>
            <div className="qd-start_new-game">
                <Button onClick={onNewGame}>Neues Spiel starten</Button>
            </div>
            <div className="qd-start_running">
                {runningQuizElements}
                {runningGames}
            </div>
            {requestedGames.length === 0 ? null : (
                <div className="qd-start_requested">
                    <div className="qd-start_requested-title">Anfragen</div>
                    {requestedGames}
                </div>
            )}
            {waitingGames.length === 0 ? null : (
                <div className="qd-start_waiting">
                    <div className="qd-start_waiting-title">Warten auf</div>
                    {waitingGames}
                </div>
            )}
            {finishedGames.length === 0 ? null : (
                <div className="qd-start_finished">
                    <div className="qd-start_finished-title">Beendete Spiele</div>
                    {finishedQuizElements}
                    {finishedGames}
                </div>
            )}
        </div>
    );
}

export default Start;
