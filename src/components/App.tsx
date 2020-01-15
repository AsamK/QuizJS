import React from 'react';
import { connect } from 'react-redux';

import { STORAGE_KEY_COOKIE } from '../consts';
import { cookieLoaded } from '../redux/actions/ui.actions';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { MainView } from '../redux/MainView';
import { refreshLoadingSelector } from '../redux/selectors/entities.selectors';
import { loggedInSelector, mainViewSelector } from '../redux/selectors/ui.selectors';
import { extraThunkArgument } from '../redux/store';
import { AppThunkDispatch, loadData, login } from '../redux/thunks';
import { createRequestFn, QD_SERVER } from '../settings';
import { assertUnreachable } from '../utils/utils';
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

interface IAppStateProps {
    isRefreshing: boolean;
    mainView: MainView;
    loggedIn: boolean;
}

interface IAppDispatchProps {
    cookieLoaded: (cookie: string) => void;
    loadData: () => void;
    login: (name: string, password: string) => void;
}

interface IAppProps extends IAppStateProps, IAppDispatchProps {
}

function App(props: IAppProps): React.ReactElement<IAppProps> {
    const [createNewAccount, setCreateNewAccount] = React.useState(false);

    React.useEffect(() => {
        const cookie = localStorage.getItem(STORAGE_KEY_COOKIE);
        if (cookie) {
            props.cookieLoaded(cookie);
            extraThunkArgument.requestFn = createRequestFn(QD_SERVER.host, cookie);
            props.loadData();
        }
    }, []);

    let content;

    if (!props.loggedIn) {
        content = createNewAccount ? <div><CreateUser
        /><Button onClick={() => setCreateNewAccount(false)}>Bestehendes Konto verwenden</Button></div> :
            <div><Login onLogin={(name, password) => {
                props.login(name, password);
            }} /><Button onClick={() => setCreateNewAccount(true)}>Neues Konto erstellen</Button></div>;
    } else {
        content = renderContent(props.mainView);
        content = <>
            <Button
                className="qd-app_refresh"
                onClick={props.loadData}
                showLoadingIndicator={props.isRefreshing}
                disabled={props.isRefreshing}
            >Refresh</Button>
            {content}
        </>;
    }
    return (
        <div className="qd-app">
            {content}
        </div>
    );
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
    assertUnreachable(mainView);
}

const mapStateToProps = (state: IAppStore): IAppStateProps => {
    return {
        isRefreshing: refreshLoadingSelector(state),
        loggedIn: loggedInSelector(state),
        mainView: mainViewSelector(state),
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): IAppDispatchProps => {
    return {
        cookieLoaded: cookie => dispatch(cookieLoaded(cookie)),
        loadData: () => dispatch(loadData()),
        login: (name, password) => dispatch(login(name, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
