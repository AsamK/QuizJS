import { createSelector } from 'reselect';

import { GameState } from '../../api/IApiGame';
import { CATEGORIES_PER_ROUND, QUESTIONS_PER_ROUND } from '../../consts';
import { addFriendAction, createGameAction, declineGameAction, giveUpGameAction, removeFriendAction, sendGameMessageAction, uploadRoundAction } from '../actions/entities.actions';
import { LoadingState } from '../actions/requests.utils';
import { IAppStore, IGameState, IQuizState } from '../interfaces/IAppStore';
import { ICategory } from '../interfaces/ICategory';
import { AnswerType, IGameRoundState } from '../interfaces/IGameRoundState';
import { IMessage } from '../interfaces/IMessage';
import { IQuestion } from '../interfaces/IQuestion';
import { IQuizAnswer } from '../interfaces/IQuizAnswer';
import { MainView } from '../MainView';
import { getGameStateOrDefault, getOpponentAnswerIndexByPercentage, getQuizStateOrDefault } from '../utils';
import { categoriesSelector, friendsSelector, gameImageQuestionsSelector, gameQuestionsSelector, gamesSelector, loadingSelector, messagesSelector, questionsSelector, quizQuestionsSelector, quizzesSelector } from './entities.selectors';

const uiSelector = (state: IAppStore) => state.ui;

export const loggedInSelector = createSelector(uiSelector, ui => ui.loggedIn);

export const showCreateNewGameSelector = createSelector(uiSelector, ui => ui.showCreateNewGame);

export const showProfileSelector = createSelector(uiSelector, ui => ui.showProfile);

export const selectedGameIdSelector = createSelector(uiSelector, ui => ui.selectedGameId);

export const selectedGameSelector = createSelector(selectedGameIdSelector, gamesSelector,
    (gameId, games) => games.find(g => g.game_id === gameId) || null,
);

export const selectedGameQuestionsSelector = createSelector(
    selectedGameSelector,
    gameQuestionsSelector,
    gameImageQuestionsSelector,
    questionsSelector,
    (game, gameToQuestionIds, gameToImageQuestions, questions): IQuestion[] | null => {
        if (!game) {
            return null;
        }

        const gameQuestionIds = gameToQuestionIds.get(game.game_id);
        if (!gameQuestionIds) {
            return null;
        }

        const gameImageQuestions = gameToImageQuestions.get(game.game_id);
        let invalidState = false;
        const gameQuestions = gameQuestionIds.map((id, index) => {
            const imageId = !gameImageQuestions ? null : gameImageQuestions.get(index);
            if (imageId != null) {
                id = imageId;
            }
            const q = questions.get(id);
            if (!q) {
                console.error(`INVALID STATE: Game question ${id} not found`);
                invalidState = true;
            }
            return q;
        });
        if (invalidState) {
            return null;
        }

        // cast the undefined away, as that's already checked by invalidState
        return gameQuestions as IQuestion[];
    },
);

export const isSelectedGameWithFriendSelector = createSelector(selectedGameSelector, friendsSelector,
    (game, friends): boolean => {
        if (!game) {
            return false;
        }
        return !!friends.find(f => f.user_id === game.opponent.user_id);
    },
);

export const selectedGameAddFriendLoadingSelector = createSelector(selectedGameSelector, loadingSelector,
    (game, loadingStates): boolean => {
        if (!game) {
            return false;
        }
        return addFriendAction.getLoadingState(loadingStates, game.opponent.user_id) === LoadingState.LOADING;
    },
);

export const selectedGameRemoveFriendLoadingSelector = createSelector(selectedGameSelector, loadingSelector,
    (game, loadingStates): boolean => {
        if (!game) {
            return false;
        }
        return removeFriendAction.getLoadingState(loadingStates, game.opponent.user_id) === LoadingState.LOADING;
    },
);

export const selectedGameCreateLoadingSelector = createSelector(selectedGameSelector, loadingSelector,
    (game, loadingStates): boolean => {
        if (!game) {
            return false;
        }
        return createGameAction.getLoadingState(loadingStates, game.opponent.user_id) === LoadingState.LOADING;
    },
);

export const selectedGameGiveUpLoadingSelector = createSelector(selectedGameSelector, loadingSelector,
    (game, loadingStates): boolean => {
        if (!game) {
            return false;
        }
        return declineGameAction.getLoadingState(loadingStates, game.game_id) === LoadingState.LOADING
            || giveUpGameAction.getLoadingState(loadingStates, game.game_id) === LoadingState.LOADING;
    },
);

export const isPlayingSelector = createSelector(uiSelector, ui => ui.isPlaying);
export const showAnswerSelector = createSelector(uiSelector, ui => ui.showAnswer);

export const gameIdToGameStateSelector = createSelector(uiSelector, ui => ui.gameState);

export const selectedGameStateSelector = createSelector(gameIdToGameStateSelector, selectedGameIdSelector,
    (map, gameId): IGameState => {
        return getGameStateOrDefault(map, gameId);
    },
);

export const selectedGameShouldUpload = createSelector(
    selectedGameSelector,
    selectedGameStateSelector,
    selectedGameQuestionsSelector,
    (game, gameState, questions) => {
        if (game == null || gameState.pendingAnswers.length === 0) {
            return false;
        }

        const questionsCount = questions == null ? QUESTIONS_PER_ROUND * 6 : questions.length;
        const pendingAnswersLength = gameState.pendingAnswers.length + (gameState.pendingSelectedAnswer === null ? 0 : 1);

        return game.opponent_answers.length + QUESTIONS_PER_ROUND <= game.your_answers.length + pendingAnswersLength ||
            game.your_answers.length + pendingAnswersLength >= questionsCount / CATEGORIES_PER_ROUND;
    },
);

export const selectedGameExistsRunningGameWithPlayer = createSelector(selectedGameSelector, gamesSelector,
    (game, games) => {
        if (game !== null && games.findIndex(g =>
            g.opponent.user_id === game.opponent.user_id
            && g.state !== GameState.FINISHED
            && g.state !== GameState.ELAPSED
            && g.state !== GameState.GAVE_UP) >= 0
        ) {
            return true;
        }
        return false;
    },
);

export const selectedGameYourAnswersIncludingPendingSelector = createSelector(
    selectedGameSelector,
    selectedGameStateSelector,
    (game, gameState): number[] => {
        if (!game) {
            return [];
        }
        return [...game.your_answers, ...gameState.pendingAnswers];
    },
);

export const roundIndexSelector = createSelector(selectedGameYourAnswersIncludingPendingSelector,
    yourAnswers => {
        return Math.trunc(yourAnswers.length / QUESTIONS_PER_ROUND);
    },
);

const questionRoundOffsetSelector = createSelector(roundIndexSelector,
    roundIndex => roundIndex == null ? null : roundIndex * QUESTIONS_PER_ROUND * CATEGORIES_PER_ROUND,
);

export const selectedGameCategoryIndicesSelector = createSelector(selectedGameSelector, selectedGameStateSelector,
    (game, gameState) => {
        if (game == null) {
            return null;
        }

        return gameState.selectedCategoryIndex == null
            ? game.cat_choices
            : [...game.cat_choices, gameState.selectedCategoryIndex];
    },
);

export const selectedGameCategoryIndex = createSelector(selectedGameCategoryIndicesSelector, roundIndexSelector,
    (catChoices, roundIndex) => {
        if (catChoices == null || roundIndex == null) {
            return null;
        }

        return catChoices[roundIndex];
    },
);

export const selectedGameCategoriesForSelectionSelector = createSelector(
    selectedGameQuestionsSelector,
    questionRoundOffsetSelector,
    categoriesSelector,
    (questions, questionRoundOffset, categories): ICategory[] | null => {
        if (questions == null || questionRoundOffset == null) {
            return null;
        }
        return [
            questions[questionRoundOffset + 0],
            questions[questionRoundOffset + 3],
            questions[questionRoundOffset + 6],
        ]
            // the categories do definitely exist here
            .map(q => categories.get(q.cat_id)!);
    },
);

export const selectedGameQuestionIndexForAnswersSelector = createSelector(
    selectedGameYourAnswersIncludingPendingSelector,
    selectedGameStateSelector,
    (yourAnswers, gameState): number => {
        return yourAnswers.length - 1 + (gameState.pendingSelectedAnswer === null ? 0 : 1);
    },
);

export const selectedGameQuestionIndexSelector = createSelector(
    questionRoundOffsetSelector,
    selectedGameCategoryIndex,
    selectedGameStateSelector,
    (questionRoundOffset, categoryIndex, gameState) => {
        if (questionRoundOffset == null || categoryIndex == null) {
            return null;
        }
        return questionRoundOffset + categoryIndex * QUESTIONS_PER_ROUND +
            (gameState.pendingAnswers.length % QUESTIONS_PER_ROUND);
    },
);

export const selectedGameQuestionSelector = createSelector(
    selectedGameQuestionIndexSelector,
    selectedGameQuestionsSelector,
    (questionIndex, questions) => {
        if (questionIndex == null || questions == null) {
            return null;
        }

        return questions[questionIndex] || null;
    },
);

export const selectedGameCategory = createSelector(
    selectedGameQuestionSelector,
    categoriesSelector,
    (question, categories): ICategory | null => {
        if (categories == null || question == null) {
            return null;
        }
        return categories.get(question.cat_id) || null;
    },
);

function getAnswerType(answer: number): AnswerType {
    switch (answer) {
        case 0: return AnswerType.CORRECT;
        case 1: return AnswerType.WRONG1;
        case 2: return AnswerType.WRONG2;
        case 3: return AnswerType.WRONG3;
        default: throw Error("Illegal answer index")
    }
}

export const selectedGameRoundStateSelector = createSelector(
    selectedGameSelector,
    selectedGameCategoryIndicesSelector,
    selectedGameYourAnswersIncludingPendingSelector,
    selectedGameQuestionsSelector,
    categoriesSelector,
    (game, catChoices, allYourAnswers, questions, categories): IGameRoundState[] => {
        if (!game || !catChoices) {
            return [];
        }
        const result = [];
        const roundCount = !questions
            ? Math.max(catChoices.length, 6)
            : Math.ceil(questions.length / QUESTIONS_PER_ROUND / CATEGORIES_PER_ROUND);
        for (let i = 0; i < roundCount; i++) {
            const catId = !questions || catChoices.length <= i ? null :
                questions[i * QUESTIONS_PER_ROUND * CATEGORIES_PER_ROUND + catChoices[i] * CATEGORIES_PER_ROUND].cat_id;
            const yourAnswers = allYourAnswers.slice(i * QUESTIONS_PER_ROUND, i * QUESTIONS_PER_ROUND + QUESTIONS_PER_ROUND)
                .map(getAnswerType);
            result.push({
                category: catId == null ? null : categories.get(catId) || null,
                opponentAnswers: game.opponent_answers.slice(i * QUESTIONS_PER_ROUND, i * QUESTIONS_PER_ROUND + QUESTIONS_PER_ROUND)
                    .map((answer, index) => index >= yourAnswers.length ? AnswerType.HIDDEN : getAnswerType(answer)),
                yourAnswers,
            });
        }
        return result;
    },
);

export const selectedGameMessagesSelector = createSelector(
    selectedGameSelector,
    messagesSelector,
    (game, messages): IMessage[] => {
        if (!game) {
            return [];
        }
        const opponentId = game.opponent.user_id;
        return messages.filter(m => m.from === opponentId || m.to === opponentId);
    }
);

export const sendMessageLoadingSelector = createSelector(loadingSelector, selectedGameIdSelector,
    (loadingStates, gameId) => gameId == null
        ? false
        : sendGameMessageAction.getLoadingState(loadingStates, gameId.toString()) === LoadingState.LOADING,
);

export const selectedQuizIdSelector = createSelector(uiSelector, ui => ui.selectedQuizId);

export const selectedQuizSelector = createSelector(selectedQuizIdSelector, quizzesSelector,
    (quizId, quizzes) => quizzes.find(q => q.quiz_id === quizId) || null,
);

export const selectedQuizQuestionsSelector = createSelector(
    selectedQuizSelector,
    quizQuestionsSelector,
    (quiz, questions): IQuestion[] | null => {
        if (!quiz) {
            return null;
        }

        let invalidState = false;
        const quizQuestions = quiz.questions.map(id => {
            const q = questions.get(id);
            if (!q) {
                console.error(`INVALID STATE: Quiz question ${id} not found`);
                invalidState = true;
            }
            return q;
        });
        if (invalidState) {
            return null;
        }

        // cast the undefined away, as that's already checked by invalidState
        return quizQuestions as IQuestion[];
    },
);

export const quizIdToQuizStateSelector = createSelector(uiSelector, ui => ui.quizState);

export const selectedQuizStateSelector = createSelector(quizIdToQuizStateSelector, selectedQuizIdSelector,
    (map, quizId): IQuizState => {
        return getQuizStateOrDefault(map, quizId);
    },
);
export const selectedQuizYourAnswersIncludingPendingSelector = createSelector(
    selectedQuizSelector,
    selectedQuizStateSelector,
    (quiz, quizState): IQuizAnswer[] => {
        if (!quiz) {
            return [];
        }
        return [...quiz.your_answers.answers, ...quizState.pendingAnswers];
    },
);

export const quizRoundIndexSelector = createSelector(
    selectedQuizYourAnswersIncludingPendingSelector,
    showAnswerSelector,
    (yourAnswers, showAnswer) => {
        const answersLength = yourAnswers.length;
        return Math.trunc((answersLength - (showAnswer ? 1 : 0)) / QUESTIONS_PER_ROUND);
    },
);

const quizQuestionRoundOffsetSelector = createSelector(quizRoundIndexSelector,
    roundIndex => roundIndex == null ? null : roundIndex * QUESTIONS_PER_ROUND,
);

export const selectedQuizQuestionIndexSelector = createSelector(
    quizQuestionRoundOffsetSelector,
    selectedQuizStateSelector,
    showAnswerSelector,
    (questionRoundOffset, quizState, showAnswer) => {
        if (questionRoundOffset == null) {
            return null;
        }
        return questionRoundOffset +
            ((quizState.pendingAnswers.length - (showAnswer ? 1 : 0)) % QUESTIONS_PER_ROUND);
    },
);

export const selectedQuizQuestionSelector = createSelector(
    selectedQuizQuestionIndexSelector,
    selectedQuizQuestionsSelector,
    (questionIndex, questions) => {
        if (questionIndex == null || questions == null) {
            return null;
        }

        return questions[questionIndex] || null;
    },
);

export const selectedQuizRoundStateSelector = createSelector(
    selectedQuizSelector,
    selectedQuizStateSelector,
    selectedQuizQuestionsSelector,
    (quiz, quizState, questions): IGameRoundState[] => {
        if (!quiz || !questions) {
            return [];
        }
        const result = [];
        const roundCount = questions.length / QUESTIONS_PER_ROUND;
        const yourAnswers = [...quiz.your_answers.answers, ...quizState.pendingAnswers].map(a => getAnswerType(a.answer));
        const opponentAnswers = questions.map((q, index) => {
            return index >= yourAnswers.length
                ? AnswerType.HIDDEN
                : getAnswerType(getOpponentAnswerIndexByPercentage(q));
        });
        for (let i = 0; i < roundCount; i++) {
            result.push({
                category: null,
                opponentAnswers: opponentAnswers.slice(i * QUESTIONS_PER_ROUND, i * QUESTIONS_PER_ROUND + QUESTIONS_PER_ROUND),
                yourAnswers: yourAnswers.slice(i * QUESTIONS_PER_ROUND, i * QUESTIONS_PER_ROUND + QUESTIONS_PER_ROUND),
            });
        }
        return result;
    },
);

// Routing
export const mainViewSelector = createSelector(
    isPlayingSelector,
    selectedGameCategoryIndex,
    selectedGameSelector,
    selectedQuizSelector,
    showCreateNewGameSelector,
    showProfileSelector,
    (isPlaying, categoryIndex, game, quiz, showCreateNewGame, showProfile) => {
        if (showCreateNewGame) {
            return MainView.CREATE_GAME;
        }
        if (showProfile) {
            return MainView.PROFILE;
        }
        if (game && game.game_id != null) {
            if (!game.your_turn || !isPlaying) {
                return MainView.GAME;
            }
            if (categoryIndex == null) {
                return MainView.SELECT_CATEGORY;
            }
            return MainView.GAME_INTERROGATION;
        } else if (quiz) {
            if (!isPlaying) {
                return MainView.QUIZ;
            }
            return MainView.QUIZ_INTERROGATION;
        } else {
            return MainView.START;
        }
    },
);

export const uploadRoundLoadingSelector = createSelector(loadingSelector, selectedGameIdSelector,
    (loadingStates, gameId) => gameId == null
        ? false
        : uploadRoundAction.getLoadingState(loadingStates, gameId.toString()) === LoadingState.LOADING,
);
