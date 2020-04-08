import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectQuiz, startPlayingQuiz } from '../redux/actions/ui.actions';
import { userSelector } from '../redux/selectors/entities.selectors';
import { selectedQuizRoundStateSelector, selectedQuizSelector } from '../redux/selectors/ui.selectors';
import Avatar from './Avatar';
import { Button } from './Button';
import GameRounds from './GameRounds';
import './QuizGame.css';

function QuizGame(): React.ReactElement {
    const gameRound = useSelector(selectedQuizRoundStateSelector);
    const quiz = useSelector(selectedQuizSelector);
    const user = useSelector(userSelector);

    const dispatch = useDispatch();
    const onBack = React.useCallback(() => dispatch(selectQuiz(null)), [dispatch]);
    const onPlay = React.useCallback(quizId => dispatch(startPlayingQuiz(quizId, Date.now())), [dispatch]);

    if (!quiz) {
        return <div></div>;
    }

    const yourCorrectAnswers = gameRound.reduce((sum, r) => sum + r.yourAnswers.filter(a => a === 0).length, 0);
    const opponentCorrectAnswers = gameRound.reduce((sum, r) => sum + r.opponentAnswers.filter(a => a === 0).length, 0);
    return <div>
        <Button onClick={onBack}>Zurück</Button>
        <div className="qd-quiz-game_header">
            <div className="qd-quiz-game_user"><Avatar avatarCode={user ? user.avatar_code : null} /> Ich</div>
            <div className="qd-quiz-game_points">{yourCorrectAnswers} - {opponentCorrectAnswers}</div>
            <div className="qd-quiz-game_user">{quiz.name}</div>
        </div>
        <GameRounds gameRound={gameRound} />
        <div className="qd-quiz-game_footer">
            <Button
                className="qd-quiz-game_play"
                onClick={() => onPlay(quiz.quiz_id)}
                disabled={quiz.your_answers.finish_date != null}
            >Spielen</Button>
        </div>
    </div >;
}

export default QuizGame;
