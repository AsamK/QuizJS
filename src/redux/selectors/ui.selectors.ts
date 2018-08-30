import { createSelector } from 'reselect';

import { CATEGORIES_PER_ROUND, QUESTIONS_PER_ROUND } from '../../consts';
import { IAppStore, IGameState } from '../interfaces/IAppStore';
import { ICategory } from '../interfaces/ICategory';
import { IQuestion } from '../interfaces/IQuestion';
import { MainView } from '../MainView';
import { getGameStateOrDefault } from '../utils';
import { categoriesSelector, friendsSelector, gameImageQuestionsSelector, gameQuestionsSelector, gamesSelector, questionsSelector } from './entities.selectors';

const uiSelector = (state: IAppStore) => state.ui;

export const loggedInSelector = createSelector(uiSelector, ui => ui.loggedIn);

export const showCreateNewGameSelector = createSelector(uiSelector, ui => ui.showCreateNewGame);

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

export const selectedGameCategoriesForSelection = createSelector(
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

export const selectedGameQuestionIndex = createSelector(
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
    selectedGameQuestionIndex,
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

// Routing
export const mainViewSelector = createSelector(
    isPlayingSelector,
    selectedGameCategoryIndex,
    selectedGameSelector,
    showCreateNewGameSelector,
    (isPlaying, categoryIndex, game, showCreateNewGame) => {
        if (showCreateNewGame) {
            return MainView.CREATE_GAME;
        }
        if (!game || game.game_id == null) {
            return MainView.START;
        }
        if (!game.your_turn || !isPlaying) {
            return MainView.GAME;
        }
        if (categoryIndex == null) {
            return MainView.SELECT_CATEGORY;
        }
        return MainView.INTERROGATION;
    },
);
