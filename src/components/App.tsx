import React from 'react';
import { useSelector } from 'react-redux';

import { STORAGE_KEY_COOKIE } from '../consts';
import { cookieLoaded } from '../redux/actions/ui.actions';
import { MainView } from '../redux/MainView';
import { refreshLoadingSelector } from '../redux/selectors/entities.selectors';
import { loggedInSelector, mainViewSelector } from '../redux/selectors/ui.selectors';
import { extraThunkArgument, useThunkDispatch } from '../redux/store';
import { loadData, login } from '../redux/thunks';
import { createRequestFn, QD_SERVER } from '../settings';

import './App.css';
import { Button } from './Button';
import CategorySelection from './CategorySelection';
import CreateUser from './CreateUser';
import Game from './Game';
import GameInterrogation from './GameInterrogation';
import Login from './Login';
import NewGame from './NewGame';
import Profile from './Profile';
import QuizGame from './QuizGame';
import QuizInterrogation from './QuizInterrogation';
import Start from './Start';
import { useRefresh } from './utils';

function App(): React.ReactElement {
    const isRefreshing = useSelector(refreshLoadingSelector);
    const loggedIn = useSelector(loggedInSelector);
    const mainView = useSelector(mainViewSelector);

    const dispatch = useThunkDispatch();

    const [createNewAccount, setCreateNewAccount] = React.useState(false);

    React.useEffect(() => {
        const cookie = localStorage.getItem(STORAGE_KEY_COOKIE);
        if (cookie) {
            dispatch(cookieLoaded(cookie));
            extraThunkArgument.requestFn = createRequestFn(QD_SERVER.host, cookie);
        }
    }, [dispatch]);

    useRefresh(() => {
        if (loggedIn) {
            dispatch(loadData());
        }
    }, [loggedIn]);

    let content;

    if (!loggedIn) {
        content = createNewAccount ? (
            <div>
                <CreateUser />
                <Button onClick={() => setCreateNewAccount(false)}>
                    Bestehendes Konto verwenden
                </Button>
            </div>
        ) : (
            <div>
                <Login
                    onLogin={(name, password) => {
                        dispatch(login(name, password));
                    }}
                />
                <Button onClick={() => setCreateNewAccount(true)}>Neues Konto erstellen</Button>
            </div>
        );
    } else {
        content = renderContent(mainView);
        content = (
            <>
                <Button
                    className="qd-app_refresh"
                    onClick={() => dispatch(loadData())}
                    showLoadingIndicator={isRefreshing}
                    disabled={isRefreshing}
                >
                    Refresh
                </Button>
                {content}
            </>
        );
    }
    return <div className="qd-app">{content}</div>;
}

function renderContent(mainView: MainView): React.ReactNode {
    switch (mainView) {
        case MainView.CREATE_GAME:
            return <NewGame />;
        case MainView.PROFILE:
            return <Profile />;
        case MainView.START:
            return <Start />;
        case MainView.GAME:
            return <Game />;
        case MainView.QUIZ:
            return <QuizGame />;
        case MainView.SELECT_CATEGORY:
            return <CategorySelection />;
        case MainView.GAME_INTERROGATION:
            return <GameInterrogation />;
        case MainView.QUIZ_INTERROGATION:
            return <QuizInterrogation />;
    }
}

export default App;
