import React from 'react';

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

export function Interrogation({
    answers, category, imageUrl, question, showCorrectAnswerIndex, showSelectedAnswerIndex, onAnswerClick, onContinueClick,
    opponentAnswerIndex, opponentName, answeredTimestamp, timeLimit, firstShownTimestamp,
}: IInterrogationProps): React.ReactElement<IInterrogationProps> {
    const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

    function handleTimer(): void {
        if (timeLimit == null) {
            return;
        }
        const nextElapsedSeconds = getElapsedSeconds();
        if (nextElapsedSeconds >= timeLimit) {
            onAnswerClick(TIME_ELAPSED_ANSWER);
        }
        setElapsedSeconds(nextElapsedSeconds);
    }

    function getElapsedSeconds(): number {
        if (firstShownTimestamp == null) {
            return 0;
        }
        const endTimestamp = answeredTimestamp == null ? Date.now() : answeredTimestamp;
        return (endTimestamp - firstShownTimestamp) / 1000;
    }

    const timer = React.useRef<number | null>(null);
    React.useEffect(() => {
        function cleanUpTimer(): void {
            if (timer.current != null) {
                window.clearInterval(timer.current);
                timer.current = null;
            }
        }

        if (answeredTimestamp == null) {
            if (timer.current == null) {
                timer.current = window.setInterval(handleTimer, 200);
            }
        } else {
            cleanUpTimer();
        }

        return cleanUpTimer;
    }, [firstShownTimestamp, answeredTimestamp]);

    const answerOrder = React.useMemo(() => getRandomOrder(4), [question]);

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
    const remainingSeconds = timeLimit == null || timeLimit <= 0
        ? 0
        : (timeLimit - elapsedSeconds);
    return <div className="qd-interrogation">
        <div
            className="qd-interrogation_category"
            style={{ backgroundColor: !category ? undefined : category.color }}
        >{!category ? null : category.name}</div>
        <Question question={question} imageUrl={imageUrl} onClick={onContinueClick} />
        {shuffleArray(answerElements, answerOrder)}
        <ProgressBar
            progress={timeLimit == null ? 1 : remainingSeconds / timeLimit}
        />
    </div>;
}
