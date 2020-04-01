import { createSelector } from 'reselect';

import { appDataAction } from '../actions/entities.actions';
import { LoadingState } from '../actions/requests.utils';
import { IAppStore } from '../interfaces/IAppStore';

const entitiesSelector = (state: IAppStore) => state.entities;

export const loadingSelector = createSelector(entitiesSelector, entities => entities.loadingStates);

export const refreshLoadingSelector = createSelector(
    loadingSelector,
    loadingStates => appDataAction.getLoadingState(loadingStates) === LoadingState.LOADING,
);

export const userSelector = createSelector(entitiesSelector, entities => entities.user);

export const foundUserSelector = createSelector(entitiesSelector, entities => entities.foundUser);

export const gamesSelector = createSelector(entitiesSelector, entities => entities.games);

export const friendsSelector = createSelector(entitiesSelector, entities => entities.friends);

export const gameQuestionsSelector = createSelector(entitiesSelector, entities => entities.gameQuestions);

export const gameImageQuestionsSelector = createSelector(entitiesSelector, entities => entities.gameImageQuestions);

export const questionsSelector = createSelector(entitiesSelector, entities => entities.questions);

export const categoriesSelector = createSelector(entitiesSelector, entities => entities.categories);

export const quizzesSelector = createSelector(entitiesSelector, entities => entities.quizzes);

export const quizQuestionsSelector = createSelector(entitiesSelector, entities => entities.quizQuestions);

export const messagesSelector = createSelector(entitiesSelector, entities => entities.messages);
