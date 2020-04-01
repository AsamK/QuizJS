import { combineReducers } from 'redux';

import { IAppStore, IStoreEntities, IStoreUi } from './interfaces/IAppStore';
import * as entitiesReducers from './reducers/entities.reducers';
import * as uiReducers from './reducers/ui.reducers';

const entities = combineReducers<IStoreEntities>(entitiesReducers);

const ui = combineReducers<IStoreUi>(uiReducers);

export const rootReducer = combineReducers<IAppStore>({
    entities,
    ui,
});
