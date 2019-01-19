import { createSelector } from 'reselect';

import { CATEGORIES_PER_ROUND, QUESTIONS_PER_ROUND } from '../../consts';
import { uploadRoundAction } from '../actions/entities.actions';
import { LoadingState } from '../actions/requests.utils';
import { IAppStore, IGameState, IQuizState } from '../interfaces/IAppStore';
import { ICategory } from '../interfaces/ICategory';
import { IGameRoundState } from '../interfaces/IGameRoundState';
import { IQuestion } from '../interfaces/IQuestion';
import { MainView } from '../MainView';
import { getGameStateOrDefault, getOpponentAnswerIndexByPercentage, getQuizStateOrDefault } from '../utils';
import { categoriesSelector, friendsSelector, gameImageQuestionsSelector, gameQuestionsSelector, gamesSelector, loadingSelector, questionsSelector, quizQuestionsSelector, quizzesSelector } from './entities.selectors';

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

export const isPlayingSelector = createSelector(uiSelector, ui => ui.isPlaying);
export const showAnswerSelector = createSelector(uiSelector, ui => ui.showAnswer);

export const gameIdToGameStateSelector = createSelector(uiSelector, ui => ui.gameState);

export const selectedGameStateSelector = createSelector(gameIdToGameStateSelector, selectedGameIdSelector,
    (map, gameId): IGameState => {
        return getGameStateOrDefault(map, gameId);
    },
);

export const roundIndexSelector = createSelector(selectedGameSelector, selectedGameStateSelector, showAnswerSelector,
    (game, gameState, showAnswer) => {
        if (game == null) {
            return null;
        }

        return Math.trunc((game.your_answers.length + gameState.pendingAnswers.length - (showAnswer ? 1 : 0)) / QUESTIONS_PER_ROUND);
    },
);

const questionRoundOffsetSelector = createSelector(roundIndexSelector,
    roundIndex => roundIndex == null ? null : roundIndex * QUESTIONS_PER_ROUND * CATEGORIES_PER_ROUND,
);

export const selectedGameCategoryIndex = createSelector(selectedGameSelector, selectedGameStateSelector, roundIndexSelector,
    (game, gameState, roundIndex) => {
        if (game == null || roundIndex == null) {
            return null;
        }

        return roundIndex < game.cat_choices.length
            ? game.cat_choices[roundIndex]
            : gameState.selectedCategoryIndex;
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
    roundIndexSelector,
    selectedGameStateSelector,
    showAnswerSelector,
    (roundIndex, gameState, showAnswer) => {
        if (roundIndex == null) {
            return null;
        }
        return roundIndex * QUESTIONS_PER_ROUND + ((gameState.pendingAnswers.length - (showAnswer ? 1 : 0)) % QUESTIONS_PER_ROUND);
    },
);

export const selectedGameQuestionIndexSelector = createSelector(
    questionRoundOffsetSelector,
    selectedGameCategoryIndex,
    selectedGameStateSelector,
    showAnswerSelector,
    (questionRoundOffset, categoryIndex, gameState, showAnswer) => {
        if (questionRoundOffset == null || categoryIndex == null) {
            return null;
        }
        return questionRoundOffset + categoryIndex * QUESTIONS_PER_ROUND +
            ((gameState.pendingAnswers.length - (showAnswer ? 1 : 0)) % QUESTIONS_PER_ROUND);
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

export const selectedGameRoundStateSelector = createSelector(
    selectedGameSelector,
    selectedGameStateSelector,
    selectedGameQuestionsSelector,
    categoriesSelector,
    (game, gameState, questions, categories): IGameRoundState[] => {
        if (!game) {
            return [];
        }
        const result = [];
        const catChoices = gameState.selectedCategoryIndex == null
            ? game.cat_choices
            : [...game.cat_choices, gameState.selectedCategoryIndex];
        const roundCount = !questions
            ? Math.max(catChoices.length, 6)
            : Math.ceil(questions.length / QUESTIONS_PER_ROUND / CATEGORIES_PER_ROUND);
        const yourAnswers = [...game.your_answers, ...gameState.pendingAnswers];
        for (let i = 0; i < roundCount; i++) {
            const catId = !questions || catChoices.length <= i ? null :
                questions[i * QUESTIONS_PER_ROUND * CATEGORIES_PER_ROUND + catChoices[i] * CATEGORIES_PER_ROUND].cat_id;
            result.push({
                category: catId == null ? null : categories.get(catId) || null,
                opponentAnswers: game.opponent_answers.slice(i * QUESTIONS_PER_ROUND, i * QUESTIONS_PER_ROUND + QUESTIONS_PER_ROUND),
                yourAnswers: yourAnswers.slice(i * QUESTIONS_PER_ROUND, i * QUESTIONS_PER_ROUND + QUESTIONS_PER_ROUND),
            });
        }
        return result;
    },
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
    (map, gameId): IQuizState => {
        return getQuizStateOrDefault(map, gameId);
    },
);

export const quizRoundIndexSelector = createSelector(selectedQuizSelector, selectedQuizStateSelector, showAnswerSelector,
    (quiz, quizState, showAnswer) => {
        if (quiz == null) {
            return null;
        }

        const answersLength = quiz.your_answers.answers.length + quizState.pendingAnswers.length;
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
    categoriesSelector,
    (quiz, quizState, questions, categories): IGameRoundState[] => {
        if (!quiz || !questions) {
            return [];
        }
        const result = [];
        const roundCount = questions.length / QUESTIONS_PER_ROUND;
        const yourAnswers = [...quiz.your_answers.answers, ...quizState.pendingAnswers].map(a => a.answer);
        const opponentAnswers = questions.map(q => {
            return getOpponentAnswerIndexByPercentage(q);
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
