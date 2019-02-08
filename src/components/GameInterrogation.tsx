import { connect } from 'react-redux';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { selectedGameCategory, selectedGameQuestionIndexForAnswersSelector, selectedGameQuestionSelector, selectedGameSelector, selectedGameStateSelector } from '../redux/selectors/ui.selectors';
import { AppThunkDispatch, nextQuestionSelectedGame, selectAnswerForSelectedGame } from '../redux/thunks';
import { IInterrogationDispatchProps, IInterrogationStateProps, Interrogation } from './Interrogation';

const mapStateToProps = (state: IAppStore): IInterrogationStateProps => {
    const game = selectedGameSelector(state);
    const questionIndex = selectedGameQuestionIndexForAnswersSelector(state);
    const question = selectedGameQuestionSelector(state);
    const gameState = selectedGameStateSelector(state);

    const answers: [string, string, string, string] = !question
        ? ['', '', '', '']
        : [
            question.correct,
            question.wrong1,
            question.wrong2,
            question.wrong3,
        ];
    return {
        answeredTimestamp: gameState.answeredTimestamp,
        answers,
        category: selectedGameCategory(state),
        firstShownTimestamp: gameState.firstShownTimestamp,
        imageUrl: !question ? undefined : question.image_url,
        opponentAnswerIndex:
            gameState.pendingSelectedAnswer == null || !game || questionIndex == null || questionIndex >= game.opponent_answers.length
                ? null
                : game.opponent_answers[questionIndex],
        opponentName: gameState.pendingSelectedAnswer == null || !game ? null : game.opponent.name,
        question: !question ? '' : question.question,
        showCorrectAnswerIndex: gameState.pendingSelectedAnswer == null ? null : 0,
        showSelectedAnswerIndex: gameState.pendingSelectedAnswer,
        timeLimit: !question ? null : question.answer_time,
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IInterrogationDispatchProps => {
    return {
        onAnswerClick: (answerIndex: number) => dispatch(selectAnswerForSelectedGame(answerIndex)),
        onContinueClick: () => dispatch(nextQuestionSelectedGame()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Interrogation);
