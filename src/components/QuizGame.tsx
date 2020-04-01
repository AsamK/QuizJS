import React from 'react';
import { connect } from 'react-redux';

import { selectQuiz, startPlayingQuiz } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IGameRoundState } from '../redux/interfaces/IGameRoundState';
import { IQuiz } from '../redux/interfaces/IQuiz';
import { IUser } from '../redux/interfaces/IUser';
import { userSelector } from '../redux/selectors/entities.selectors';
import { selectedQuizRoundStateSelector, selectedQuizSelector } from '../redux/selectors/ui.selectors';
import { AppThunkDispatch } from '../redux/thunks';
import Avatar from './Avatar';
import { Button } from './Button';
import GameRounds from './GameRounds';
import './QuizGame.css';

interface IQuizGameStateProps {
    quiz: IQuiz | null;
    gameRound: IGameRoundState[];
    user: IUser | null;
}

interface IQuizGameDispatchProps {
    onBack: () => void;
    onPlay: (quizId: string) => void;
}

interface IQuizGameProps extends IQuizGameStateProps, IQuizGameDispatchProps {
}

function QuizGame({ quiz, gameRound, user, onBack, onPlay }: IQuizGameProps): React.ReactElement<IQuizGameProps> {
    const yourCorrectAnswers = gameRound.reduce((sum, r) => sum + r.yourAnswers.filter(a => a === 0).length, 0);
    const opponentCorrectAnswers = gameRound.reduce((sum, r) => sum + r.opponentAnswers.filter(a => a === 0).length, 0);
    if (!quiz) {
        return <div></div>;
    }
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

const mapStateToProps = (state: IAppStore): IQuizGameStateProps => {
    return {
        gameRound: selectedQuizRoundStateSelector(state),
        quiz: selectedQuizSelector(state),
        user: userSelector(state),
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IQuizGameDispatchProps => {
    return {
        onBack: () => dispatch(selectQuiz(null)),
        onPlay: quizId => dispatch(startPlayingQuiz(quizId, Date.now())),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizGame);
