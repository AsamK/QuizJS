import React from 'react';
import { connect } from 'react-redux';
import { selectQuiz } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { IGameRoundState } from '../redux/interfaces/IGameRoundState';
import { IQuiz } from '../redux/interfaces/IQuiz';
import { IUser } from '../redux/interfaces/IUser';
import { userSelector } from '../redux/selectors/entities.selectors';
import { selectedQuizRoundStateSelector, selectedQuizSelector } from '../redux/selectors/ui.selectors';
import { AppThunkDispatch } from '../redux/thunks';
import Avatar from './Avatar';
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

class QuizGame extends React.PureComponent<IQuizGameProps> {

    public render(): React.ReactElement<IQuizGameProps> {
        const { quiz, gameRound, user,
            onBack, onPlay } = this.props;
        const yourCorrectAnswers = gameRound.reduce((sum, r) => sum + r.yourAnswers.filter(a => a === 0).length, 0);
        const opponentCorrectAnswers = gameRound.reduce((sum, r) => sum + r.opponentAnswers.filter(a => a === 0).length, 0);
        if (!quiz) {
            return <div></div>;
        }
        return <div>
            <button onClick={onBack}>Zurück</button>
            <div className="qd-quiz-game_header">
                <div className="qd-quiz-game_user"><Avatar avatarCode={user ? user.avatar_code : null} /> Ich</div>
                <div className="qd-quiz-game_points">{yourCorrectAnswers} - {opponentCorrectAnswers}</div>
                <div className="qd-quiz-game_user">{quiz.name}</div>
            </div>
            <GameRounds gameRound={gameRound} />
            <div className="qd-quiz-game_footer">
                <button
                    className="qd-quiz-game_play"
                    onClick={() => onPlay(quiz.quiz_id)}
                    disabled={quiz.your_answers.finish_date != null}
                >Spielen</button>
            </div>
        </div >;
    }
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
        onPlay: gameId => { /**/ },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizGame);
