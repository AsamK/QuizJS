import React from 'react';
import { connect } from 'react-redux';

import { createSelector } from 'reselect';
import { IApiCategory } from '../api/IApiCategory';
import { TIME_ELAPSED_ANSWER } from '../consts';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { selectedGameCategory, selectedGameQuestionIndexForAnswersSelector, selectedGameQuestionSelector, selectedGameSelector, selectedGameStateSelector, showAnswerSelector } from '../redux/selectors/ui.selectors';
import { AppThunkDispatch, nextQuestionSelectedGame, selectAnswerForSelectedGame } from '../redux/thunks';
import { getRandomOrder, shuffleArray } from '../utils/utils';
import Answer, { AnswerState } from './Answer';
import './Interrogation.css';
import ProgressBar from './ProgressBar';
import Question from './Question';

interface IInterrogationStateProps {
    answers: [string, string, string, string];
    firstShownTimestamp: number | null;
    answeredTimestamp: number | null;
    timeLimit: number;
    category: IApiCategory | null;
    question: string;
    imageUrl?: string;
    showCorrectAnswerIndex: number | null;
    showSelectedAnswerIndex: number | null;
    opponentAnswerIndex: number | null;
    opponentName: string | null;
}
interface IInterrogationDispatchProps {
    onAnswerClick: (index: number) => void;
    onContinueClick: () => void;
}

interface IInterrogationProps extends IInterrogationStateProps, IInterrogationDispatchProps {
}

class Interrogation extends React.Component<IInterrogationProps> {
    private answerOrder = createSelector(question => question, () => getRandomOrder(4));
    private timer: number | undefined;

    public componentDidMount(): void {
        this.timer = window.setInterval(this.handleTimer, 200);
    }

    public componentDidUpdate(): void {
        if (this.props.answeredTimestamp == null) {
            if (this.timer == null) {
                this.timer = window.setInterval(this.handleTimer, 200);
            }
        } else {
            if (this.timer != null) {
                window.clearInterval(this.timer);
                this.timer = undefined;
            }
        }
    }

    public componentWillUnmount(): void {
        if (this.timer != null) {
            window.clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    public render(): React.ReactElement<IInterrogationProps> {
        const {
            answers, category, imageUrl, question, showCorrectAnswerIndex, showSelectedAnswerIndex, onAnswerClick, onContinueClick,
            opponentAnswerIndex, opponentName,
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
                info={
                    opponentAnswerIndex !== i ? undefined : opponentName || undefined
                }
                onClick={() => onAnswerClick(i)}
            />);
        const remainingSeconds = this.props.timeLimit <= 0
            ? 0
            : (this.props.timeLimit - this.getElapsedSeconds());
        return <div className="qd-interrogation">
            <div
                className="qd-interrogation_category"
                style={{ backgroundColor: !category ? undefined : category.color }}
            >{!category ? null : category.name}</div>
            <Question question={question} imageUrl={imageUrl} onClick={onContinueClick} />
            {shuffleArray(answerElements, this.answerOrder(question))}
            <ProgressBar
                progress={remainingSeconds / this.props.timeLimit}
            />
        </div>;
    }

    private handleTimer = () => {
        if (this.getElapsedSeconds() >= this.props.timeLimit) {
            this.props.onAnswerClick(TIME_ELAPSED_ANSWER);
        } else {
            this.forceUpdate();
        }
    };

    private getElapsedSeconds(): number {
        if (this.props.firstShownTimestamp == null) {
            return 0;
        }
        const endTimestamp = this.props.answeredTimestamp == null ? Date.now() : this.props.answeredTimestamp;
        return (endTimestamp - this.props.firstShownTimestamp) / 1000;
    }
}

const mapStateToProps = (state: IAppStore): IInterrogationStateProps => {
    const game = selectedGameSelector(state);
    const questionIndex = selectedGameQuestionIndexForAnswersSelector(state);
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
        answeredTimestamp: gameState.answeredTimestamp,
        answers,
        category: selectedGameCategory(state),
        firstShownTimestamp: gameState.firstShownTimestamp,
        imageUrl: !question ? undefined : question.image_url,
        opponentAnswerIndex: !showAnswer || !game || questionIndex == null ? null : questionIndex >= game.opponent_answers.length
            ? null
            : game.opponent_answers[questionIndex],
        opponentName: !showAnswer || !game ? null : game.opponent.name,
        question: !question ? '' : question.question,
        showCorrectAnswerIndex: !showAnswer ? null : 0,
        showSelectedAnswerIndex: !showAnswer || gameState.pendingAnswers.length === 0
            ? null
            : gameState.pendingAnswers[gameState.pendingAnswers.length - 1],
        timeLimit: !question ? 0 : question.answer_time,
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IInterrogationDispatchProps => {
    return {
        onAnswerClick: (answerIndex: number) => dispatch(selectAnswerForSelectedGame(answerIndex)),
        onContinueClick: () => dispatch(nextQuestionSelectedGame()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Interrogation);
