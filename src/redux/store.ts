import { useDispatch } from 'react-redux';
import type { Middleware, Store } from 'redux';
import { applyMiddleware, compose, createStore } from 'redux';
import freeze from 'redux-freeze';
import thunkMiddleware from 'redux-thunk';

import { createRequestFn, QD_SERVER } from '../settings';

import type { AppAction } from './interfaces/AppAction';
import type { IAppStore } from './interfaces/IAppStore';
import { rootReducer } from './reducers';
import type { AppThunkDispatch, IExtraArgument } from './thunks';

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    return createStore<IAppStore, AppAction, { dispatch: AppThunkDispatch }, unknown>(
        rootReducer,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument , @typescript-eslint/no-unsafe-call
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
