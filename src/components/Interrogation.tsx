import React from 'react';
import { connect } from 'react-redux';

import { createSelector } from 'reselect';
import { IApiCategory } from '../api/IApiCategory';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { selectedGameCategory, selectedGameQuestionSelector, selectedGameStateSelector, showAnswerSelector } from '../redux/selectors/ui.selectors';
import { AppThunkDispatch, nextQuestionSelectedGame, selectAnswerForSelectedGame } from '../redux/thunks';
import { getRandomOrder, shuffleArray } from '../utils/utils';
import Answer, { AnswerState } from './Answer';
import './Interrogation.css';
import Question from './Question';

interface IInterrogationStateProps {
    answers: [string, string, string, string];
    category: IApiCategory | null;
    question: string;
    imageUrl?: string;
    showCorrectAnswerIndex: number | null;
    showSelectedAnswerIndex: number | null;
}
interface IInterrogationDispatchProps {
    onAnswerClick: (index: number) => void;
    onContinueClick: () => void;
}

interface IInterrogationProps extends IInterrogationStateProps, IInterrogationDispatchProps {
}

export interface IQuizQuestion {
}

class Interrogation extends React.Component<IInterrogationProps> {
    private answerOrder = createSelector(question => question, () => getRandomOrder(4));

    public render(): React.ReactElement<IInterrogationProps> {
        const {
            answers, category, imageUrl, question, showCorrectAnswerIndex, showSelectedAnswerIndex, onAnswerClick, onContinueClick,
        } = this.props;
        const answerElements = answers
            .map((answer, i) => <Answer
                key={i}
                state={showCorrectAnswerIndex !== i && i === showSelectedAnswerIndex ? AnswerState.WRONG :
                    showCorrectAnswerIndex === i && i === showSelectedAnswerIndex ? AnswerState.CORRECT :
                        showCorrectAnswerIndex === i && i !== showSelectedAnswerIndex ? AnswerState.CORRECT_BUT_NOT_SELECTED :
                            AnswerState.NEUTRAL
                }
                answer={answer}
                onClick={() => onAnswerClick(i)}
            />);
        return <div className="qd-interrogation">
            <div
                className="qd-interrogation_category"
                style={{ backgroundColor: !category ? undefined : category.color }}
            >{!category ? null : category.name}</div>
            <Question question={question} imageUrl={imageUrl} onClick={onContinueClick} />
            {shuffleArray(answerElements, this.answerOrder(question))}
        </div>;
    }
}

const mapStateToProps = (state: IAppStore): IInterrogationStateProps => {
    const question = selectedGameQuestionSelector(state);
    const gameState = selectedGameStateSelector(state);
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
        answers,
        category: selectedGameCategory(state),
        imageUrl: !question ? undefined : question.image_url,
        question: !question ? '' : question.question,
        showCorrectAnswerIndex: !showAnswer ? null : 0,
        showSelectedAnswerIndex: !showAnswer || gameState.pendingAnswers.length === 0
            ? null
            : gameState.pendingAnswers[gameState.pendingAnswers.length - 1],
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IInterrogationDispatchProps => {
    return {
        onAnswerClick: (answerIndex: number) => dispatch(selectAnswerForSelectedGame(answerIndex)),
        onContinueClick: () => dispatch(nextQuestionSelectedGame()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Interrogation);
