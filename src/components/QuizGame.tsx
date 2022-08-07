import React from 'react';
import { useSelector } from 'react-redux';

import { QUESTIONS_PER_ROUND } from '../consts';
import { selectQuiz, startPlayingQuiz } from '../redux/actions/ui.actions';
import { AnswerType } from '../redux/interfaces/IGameRoundState';
import { userSelector } from '../redux/selectors/entities.selectors';
import { selectedQuizQuestionsSelector, selectedQuizRoundStateSelector, selectedQuizSelector } from '../redux/selectors/ui.selectors';
import { useThunkDispatch } from '../redux/store';

import Avatar from './Avatar';
import { Button } from './Button';
import GameRounds from './GameRounds';
import { Interrogation } from './Interrogation';
import { Modal } from './modals/Modal';
import { ModalDialog } from './modals/ModalDialog';
import './QuizGame.css';

function QuizGame(): React.ReactElement {
    const quizRound = useSelector(selectedQuizRoundStateSelector);
    const quiz = useSelector(selectedQuizSelector);
    const user = useSelector(userSelector);

    const dispatch = useThunkDispatch();
    const onBack = React.useCallback(() => dispatch(selectQuiz(null)), [dispatch]);
    const onPlay = React.useCallback((quizId: string) => dispatch(startPlayingQuiz(quizId, Date.now())), [dispatch]);

    const [showQuestion, setShowQuestion] = React.useState<[number, number] | null>(null);

    if (!quiz) {
        return <div></div>;
    }

    const yourCorrectAnswers = quizRound.reduce((sum, r) => sum + r.yourAnswers.filter(a => a === AnswerType.CORRECT).length, 0);
    const opponentCorrectAnswers = quizRound.reduce((sum, r) => sum + r.opponentAnswers.filter(a => a === AnswerType.CORRECT).length, 0);
    return <div>
        <Button onClick={onBack}>Zurück</Button>
        <div className="qd-quiz-game_header">
            <div className="qd-quiz-game_user"><Avatar avatarCode={user ? user.avatar_code : null} /> Ich</div>
            <div className="qd-quiz-game_points">{yourCorrectAnswers} - {opponentCorrectAnswers}</div>
            <div className="qd-quiz-game_user">{quiz.name}</div>
        </div>
        <GameRounds gameRound={quizRound} onQuestionClick={(round, question) => setShowQuestion([round, question])} />
        <div className="qd-quiz-game_footer">
            <Button
                className="qd-quiz-game_play"
                onClick={() => onPlay(quiz.quiz_id)}
                disabled={quiz.your_answers.finish_date != null}
            >Spielen</Button>
        </div>
        {showQuestion == null ? null :
            <Modal>
                <ModalDialog>
                    <ShowQuestion
                        round={showQuestion[0]}
                        question={showQuestion[1]}
                    ></ShowQuestion>
                    <Button className="qd-game_close-modal" onClick={() => setShowQuestion(null)}>Schließen</Button>
                </ModalDialog>
            </Modal>}
    </div >;
}

function ShowQuestion({ round, question: questionIndex }: { round: number; question: number }): React.ReactElement | null {
    const quiz = useSelector(selectedQuizSelector);
    const quizQuestions = useSelector(selectedQuizQuestionsSelector);
    const quizRound = useSelector(selectedQuizRoundStateSelector);
    if (!quiz || !quizQuestions) {
        return null;
    }

    const question = quizQuestions[round * QUESTIONS_PER_ROUND + questionIndex];

    return <Interrogation
        answeredTimestamp={0}
        showSelectedAnswerIndex={quizRound[round].yourAnswers[questionIndex] ?? null}
        showCorrectAnswerIndex={0}
        opponentAnswerIndex={quizRound[round].opponentAnswers[questionIndex] ?? null}
        question={question.question}
        answers={[question.correct, question.wrong1, question.wrong2, question.wrong3]}
        category={null}
        firstShownTimestamp={0}
        opponentName="Quiz"
        timeLimit={0}
        imageUrl={question.image_url}
    ></Interrogation>;
}
export default QuizGame;
