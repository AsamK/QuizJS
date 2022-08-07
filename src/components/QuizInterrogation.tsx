import { connect } from 'react-redux';

import type { IAppStore } from '../redux/interfaces/IAppStore';
import { selectedQuizQuestionSelector, selectedQuizStateSelector, showAnswerSelector } from '../redux/selectors/ui.selectors';
import type { AppThunkDispatch} from '../redux/thunks';
import { nextQuestionSelectedQuiz, selectAnswerForSelectedQuiz } from '../redux/thunks';
import { getOpponentAnswerIndexByPercentage } from '../redux/utils';

import type { IInterrogationDispatchProps, IInterrogationStateProps} from './Interrogation';
import { Interrogation } from './Interrogation';

const mapStateToProps = (state: IAppStore): IInterrogationStateProps => {
    const question = selectedQuizQuestionSelector(state);
    const quizState = selectedQuizStateSelector(state);
    const showAnswer = showAnswerSelector(state);

    const answers: [string, string, string, string] = !question
        ? ['', '', '', '']
        : [
            question.correct,
            question.wrong1,
            question.wrong2,
            question.wrong3,
        ];
    return {
        answeredTimestamp: quizState.answeredTimestamp,
        answers,
        category: null,
        firstShownTimestamp: quizState.firstShownTimestamp,
        imageUrl: !question ? undefined : question.image_url,
        opponentAnswerIndex: !showAnswer || !question ? null : getOpponentAnswerIndexByPercentage(question),
        opponentName: 'Quiz',
        question: !question ? '' : question.question,
        showCorrectAnswerIndex: !showAnswer ? null : 0,
        showSelectedAnswerIndex: !showAnswer || quizState.pendingAnswers.length === 0
            ? null
            : quizState.pendingAnswers[quizState.pendingAnswers.length - 1].answer,
        timeLimit: !question ? null : question.answer_time,
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IInterrogationDispatchProps => {
    return {
        onAnswerClick: (answerIndex: number) => dispatch(selectAnswerForSelectedQuiz(answerIndex)),
        onContinueClick: () => dispatch(nextQuestionSelectedQuiz()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Interrogation);
