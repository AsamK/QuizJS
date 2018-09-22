import React from 'react';

import { createSelector } from 'reselect';
import { IApiCategory } from '../api/IApiCategory';
import { TIME_ELAPSED_ANSWER } from '../consts';
import { getRandomOrder, shuffleArray } from '../utils/utils';
import Answer, { AnswerState } from './Answer';
import './Interrogation.css';
import ProgressBar from './ProgressBar';
import Question from './Question';

export interface IInterrogationStateProps {
    answers: [string, string, string, string];
    firstShownTimestamp: number | null;
    answeredTimestamp: number | null;
    timeLimit: number | null;
    category: IApiCategory | null;
    question: string;
    imageUrl?: string;
    showCorrectAnswerIndex: number | null;
    showSelectedAnswerIndex: number | null;
    opponentAnswerIndex: number | null;
    opponentName: string | null;
}
export interface IInterrogationDispatchProps {
    onAnswerClick: (index: number) => void;
    onContinueClick: () => void;
}

interface IInterrogationProps extends IInterrogationStateProps, IInterrogationDispatchProps {
}

export class Interrogation extends React.Component<IInterrogationProps> {
    private answerOrder = createSelector(question => question, () => getRandomOrder(4));
    private timer: number | undefined;

    public componentDidMount(): void {
        this.componentDidUpdate();
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
        const remainingSeconds = this.props.timeLimit == null || this.props.timeLimit <= 0
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
                progress={this.props.timeLimit == null ? 1 : remainingSeconds / this.props.timeLimit}
            />
        </div>;
    }

    private handleTimer = () => {
        if (this.props.timeLimit == null) {
            return;
        }
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
