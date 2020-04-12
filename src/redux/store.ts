import { useDispatch } from 'react-redux';
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux';
import freeze from 'redux-freeze';
import thunkMiddleware from 'redux-thunk';

import { createRequestFn, QD_SERVER } from '../settings';
import { AppAction } from './interfaces/AppAction';
import { IAppStore } from './interfaces/IAppStore';
import { rootReducer } from './reducers';
import { AppThunkDispatch, IExtraArgument } from './thunks';

export function useThunkDispatch(): AppThunkDispatch {
    return useDispatch<AppThunkDispatch>();
}

export function createAppStore(): Store<IAppStore, AppAction> {
    const reduxMiddlewares: Middleware[] = [
        thunkMiddleware.withExtraArgument(extraThunkArgument), // lets us use dispatch() functions
    ];

    if (process.env.NODE_ENV !== 'production') {
        // Freeze redux state in development to prevent accidental modifications
        // Disabled in production to improve performance
        reduxMiddlewares.push(freeze);
    }

    const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    return createStore<IAppStore, AppAction, { dispatch: AppThunkDispatch }, {}>(
        rootReducer,
        composeEnhancers(
            applyMiddleware(
                ...reduxMiddlewares,
            ),
        ),
    );
}
export const extraThunkArgument: IExtraArgument = {
    requestFn: createRequestFn(QD_SERVER.host),
};
