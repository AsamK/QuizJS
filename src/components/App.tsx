import React from 'react';
import './App.css';

import { acceptGame, addFriend, BackendRequestFn, createGame, createRandomGame, createUser, findUser, giveUpGame, login, removeFriend, requestGames, requestState, requestUploadRound } from '../api/api';
import { GameState } from '../api/IApiGame';
import { IApiGamesResponse } from '../api/IApiGamesResponse';
import { IApiStateResponse } from '../api/IApiStateResponse';
import { createRequestFn, QD_SERVER } from '../settings';
import CategorySelection from './CategorySelection';
import CreateUser from './CreateUser';
import Game from './Game';
import Interrogation, { IQuizQuestion } from './Interrogation';
import Login from './Login';
import NewGame from './NewGame';
import Start from './Start';

interface IAppState {
  createNewAccount: boolean;
  createNewGame: boolean;
  foundUser: IApiOpponent | null;
  gamesResponse: IApiGamesResponse | null;
  isPlayingGame: boolean;
  loggedIn: boolean;
  roundAnswers: number[];
  selectedCategoryIndex: number | null;
  selectedGameId: number | null;
  showAnswer: boolean;
  stateResponse: IApiStateResponse | null;
  answerOrder: number[];
}

class App extends React.Component<{}, IAppState> {
  public state: IAppState = {
    answerOrder: getRandomOrder(4),
    createNewAccount: false,
    createNewGame: false,
    foundUser: null,
    gamesResponse: null,
    isPlayingGame: false,
    loggedIn: false,
    roundAnswers: [],
    selectedCategoryIndex: null,
    selectedGameId: null,
    showAnswer: false,
    stateResponse: null,
  };

  private apiRequest!: BackendRequestFn;

  public constructor(props: {}) {
    super(props);
  }

  public componentDidMount(): void {
    const cookie = localStorage.getItem('qd-cookie');
    if (cookie) {
      this.setState({ loggedIn: true });
      this.apiRequest = createRequestFn(QD_SERVER.host, cookie);
      this.refresh();
    } else {
      this.apiRequest = createRequestFn(QD_SERVER.host);
    }
  }

  public render(): React.ReactNode {
    const { loggedIn, selectedGameId, isPlayingGame, stateResponse, gamesResponse } = this.state;
    let content;

    if (!loggedIn) {
      return this.state.createNewAccount ? <div><CreateUser
        onCreateUser={(name, email, password) => {
          createUser(this.apiRequest, name, email, QD_SERVER.passwordSalt, password)
            .then(res => {
              if ('cookie' in res) {
                localStorage.setItem('qd-cookie', res.cookie);
                this.setState({ loggedIn: true, stateResponse: res.body });
                this.apiRequest = createRequestFn(QD_SERVER.host, res.cookie);
              }
            });
        }}
      /><button onClick={() => this.setState({ createNewAccount: false })}>Bestehendes Konto verwenden</button></div> :
        <div><Login onLogin={(name, password) => {
          login(this.apiRequest, name, QD_SERVER.passwordSalt, password)
            .then(res => {
              if ('cookie' in res) {
                localStorage.setItem('qd-cookie', res.cookie);
                this.setState({ loggedIn: true, stateResponse: res.body });
                this.apiRequest = createRequestFn(QD_SERVER.host, res.cookie);
              }
            });
        }} /><button onClick={() => this.setState({ createNewAccount: true })}>Neues Konto erstellen</button></div>;
    }
    if (!stateResponse) {
      content = 'Loading...';
    } else if (this.state.createNewGame) {
      content = <NewGame
        friends={stateResponse.user.friends || []}
        onRandomGame={() =>
          createRandomGame(this.apiRequest)
            .then(g => this.setState({ gamesResponse: { games: [g.game] }, createNewGame: false }))
        }
        onCreateGame={userId =>
          createGame(this.apiRequest, userId)
            .then(g => this.setState({ gamesResponse: { games: [g.game] }, createNewGame: false }))
        }
        onSearchUser={name => findUser(this.apiRequest, name).then(res => {
          if ('popup_mess' in res) {
            this.setState({ foundUser: null });
            return;
          }
          this.setState({ foundUser: res.qdOpponent });
        })}
        foundUser={this.state.foundUser}
      />;
    } else {
      content = this.renderContent(selectedGameId, isPlayingGame, stateResponse, gamesResponse);
    }
    return (
      <div className="qd-app">
        <button onClick={this.refresh}>Refresh</button>
        {content}
      </div>
    );
  }

  private refresh = () => {
    if (this.state.selectedGameId) {
      requestGames(this.apiRequest, [this.state.selectedGameId])
        .then(gamesResponse => {
          this.setState({ gamesResponse });
        });
    } else {
      requestState(this.apiRequest)
        .then(stateResponse => {
          this.setState({ stateResponse });
        });
    }
  };

  private renderContent(
    selectedGameId: number | null, isPlayingGame: boolean,
    stateResponse: IApiStateResponse, gamesResponse: IApiGamesResponse | null): React.ReactNode {
    const gameId = this.state.selectedGameId;
    if (gameId == null) {
      return <Start
        gameState={stateResponse}
        onGameSelected={gId => this.setState({ selectedGameId: gId, isPlayingGame: false })}
        onNewGame={() => this.setState({ createNewGame: true })}
      />;
    }
    const game = !gamesResponse ? null : gamesResponse.games.find(g => selectedGameId === g.game_id) || null;
    if (!game) {
      requestGames(this.apiRequest, [gameId])
        .then(games => {
          this.setState({ gamesResponse: games });
        });
      return 'Loading game';
    }
    if (!isPlayingGame) {
      const friends = stateResponse.user.friends;
      return <Game
        game={game}
        isFriend={friends ? !!friends.find(f => f.user_id === game.opponent.user_id) : false}
        onBack={() => this.setState({ selectedGameId: null })}
        onPlay={() => this.setState({ isPlayingGame: true })}
        onAddFriend={() => addFriend(this.apiRequest, game.opponent.user_id)}
        onRemoveFriend={() => removeFriend(this.apiRequest, game.opponent.user_id)}
        onNewGame={() => createGame(this.apiRequest, game.opponent.user_id)}
        onGiveUp={() => {
          if (game.state === GameState.REQUESTED) {
            acceptGame(this.apiRequest, game.game_id, false)
              .then(() => this.refresh());
          } else {
            giveUpGame(this.apiRequest, game.game_id)
              .then(g => this.setState({ gamesResponse: { games: [g] } }));
          }
        }}
      />;
    }

    const QUESTIONS_PER_ROUND = 3;
    const CATEGORIES_PER_ROUND = 3;
    const roundIndex = Math.trunc((game.your_answers.length + this.state.roundAnswers.length - (this.state.showAnswer ? 1 : 0))
      / QUESTIONS_PER_ROUND);

    const questionRoundOffset = roundIndex * QUESTIONS_PER_ROUND * CATEGORIES_PER_ROUND;

    const selectedCategoryIndex = roundIndex < game.cat_choices.length ? game.cat_choices[roundIndex] : this.state.selectedCategoryIndex;

    if (selectedCategoryIndex == null) {
      const selectableCategories = [
        game.questions[questionRoundOffset + 0],
        game.questions[questionRoundOffset + 3],
        game.questions[questionRoundOffset + 6],
      ]
        .map(q => q.category);
      return <CategorySelection
        categories={selectableCategories}
        onCategorySelected={index => this.setState({ selectedCategoryIndex: index })}
      />;
    }

    const questionIndex = questionRoundOffset + selectedCategoryIndex * QUESTIONS_PER_ROUND +
      ((this.state.roundAnswers.length - (this.state.showAnswer ? 1 : 0)) % QUESTIONS_PER_ROUND);

    const imageQuestion = game.image_questions.find(q => q.index === questionIndex);
    const apiQuestion = imageQuestion ? imageQuestion.question : game.questions[questionIndex];

    if (!apiQuestion) {
      return 'Missing question!!!';
    }
    const question: IQuizQuestion = {
      answers: shuffleArray([
        apiQuestion.correct,
        apiQuestion.wrong1,
        apiQuestion.wrong2,
        apiQuestion.wrong3,
      ], this.state.answerOrder) as [string, string, string, string],
      category: apiQuestion.category,
      imageUrl: apiQuestion.image_url,
      question: apiQuestion.question,
    };
    return <Interrogation question={question}
      showCorrectAnswerIndex={this.state.showAnswer ? this.state.answerOrder[0] : null}
      showSelectedAnswerIndex={!this.state.showAnswer || this.state.roundAnswers.length === 0 ? null :
        this.state.answerOrder[this.state.roundAnswers[this.state.roundAnswers.length - 1]]}
      onAnswerClick={i => {
        if (this.state.showAnswer) {
          return;
        }
        const answerIndex = this.state.answerOrder.indexOf(i);
        const roundAnswers = [...this.state.roundAnswers, answerIndex];
        this.setState({ roundAnswers, showAnswer: true });
      }}
      onContinueClick={() => {
        if (!this.state.showAnswer) {
          return;
        }
        if (game.opponent_answers.length + QUESTIONS_PER_ROUND <= game.your_answers.length + this.state.roundAnswers.length ||
          game.your_answers.length + this.state.roundAnswers.length >= game.questions.length / CATEGORIES_PER_ROUND) {
          const roundIsImage = this.state.roundAnswers.map((_, i) => {
            const qIndex = questionRoundOffset + selectedCategoryIndex * QUESTIONS_PER_ROUND + i;
            return game.image_questions.find(q => q.index === qIndex) ? 1 : 0;
          });
          requestUploadRound(this.apiRequest, game.game_id, 0, selectedCategoryIndex,
            [...game.your_answers, ...this.state.roundAnswers], [...game.your_question_types, ...roundIsImage])
            .then(g => this.setState({ gamesResponse: { games: [g] } }));
          this.setState({ isPlayingGame: false, roundAnswers: [], selectedCategoryIndex: null, showAnswer: false });
        } else if (this.state.roundAnswers.length % QUESTIONS_PER_ROUND === 0) {
          this.setState({ isPlayingGame: false, selectedCategoryIndex: null, showAnswer: false });
        } else {
          this.setState({ showAnswer: false });
        }
        this.setState({ answerOrder: getRandomOrder(4) });
      }} />;
  }
}

/**
 * Get a random list of numbers, where each number is unique and in interval [0..length)
 *
 * @param length Number of elements in result array
 */
function getRandomOrder(length: number): number[] {
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    let j;
    do {
      j = Math.trunc(Math.random() * length);
    } while (result[j] != null);
    result[j] = i;
  }
  return result;
}

function shuffleArray<T>(array: T[], targetIndices: number[]): typeof array {
  const n = array.length;
  if (targetIndices.length < n) {
    throw new Error('shuffleArray: targetIndices.length is lower array.length');
  }
  const result = new Array<T>(n);
  array.forEach((entry, i) => {
    result[targetIndices[i]] = entry;
  });
  return result;
}

export default App;
