import React from 'react';
import { connect, Provider } from 'react-redux';
import { Store } from 'redux';
import './App.css';

import { STORAGE_KEY_COOKIE } from '../consts';
import { cookieLoaded } from '../redux/actions/ui.actions';
import { IAppAction } from '../redux/interfaces/IAppAction';
import { IAppStore } from '../redux/interfaces/IAppStore';
import { MainView } from '../redux/MainView';
import { loggedInSelector, mainViewSelector } from '../redux/selectors/ui.selectors';
import { AppThunkDispatch, loadData, login } from '../redux/thunks';
import { createRequestFn, extraThunkArgument, QD_SERVER } from '../settings';
import { assertUnreachable } from '../utils/utils';
import CategorySelection from './CategorySelection';
import CreateUser from './CreateUser';
import Game from './Game';
import Interrogation from './Interrogation';
import Login from './Login';
import NewGame from './NewGame';
import Start from './Start';

interface IAppStateProps {
  mainView: MainView;
  loggedIn: boolean;
}
interface IAppDispatchProps {
  cookieLoaded: (cookie: string) => void;
  loadData: () => void;
  login: (name: string, password: string) => void;
}

interface IAppProps extends IAppStateProps, IAppDispatchProps {
  store: Store<IAppStore, IAppAction>;
}

interface IAppState {
  createNewAccount: boolean;
}

class App extends React.Component<IAppProps, IAppState> {
  public state: IAppState = {
    createNewAccount: false,
  };

  public constructor(props: IAppProps) {
    super(props);
  }

  public componentDidMount(): void {
    const cookie = localStorage.getItem(STORAGE_KEY_COOKIE);
    if (cookie) {
      this.props.cookieLoaded(cookie);
      extraThunkArgument.requestFn = createRequestFn(QD_SERVER.host, cookie);
      this.refresh();
    }
  }

  public render(): React.ReactNode {
    let content;

    if (!this.props.loggedIn) {
      content = this.state.createNewAccount ? <div><CreateUser
      /><button onClick={() => this.setState({ createNewAccount: false })}>Bestehendes Konto verwenden</button></div> :
        <div><Login onLogin={(name, password) => {
          this.props.login(name, password);
        }} /><button onClick={() => this.setState({ createNewAccount: true })}>Neues Konto erstellen</button></div>;
    } else {
      content = this.renderContent();
      content = <>
        <button onClick={this.refresh}>Refresh</button>
        {content}
      </>;
    }
    return (
      <Provider store={this.props.store}>
        <div className="qd-app">
          {content}
        </div>
      </Provider>
    );
  }

  private refresh = () => {
    this.props.loadData();
  };

  private renderContent(): React.ReactNode {
    switch (this.props.mainView) {
      case MainView.CREATE_GAME:
        return <NewGame />;
      case MainView.START:
        return <Start />;
      case MainView.GAME:
        return <Game />;
      case MainView.SELECT_CATEGORY:
        return <CategorySelection />;
      case MainView.INTERROGATION:
        return <Interrogation />;
    }
    assertUnreachable(this.props.mainView);
  }
}

const mapStateToProps = (state: IAppStore): IAppStateProps => {
  return {
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
