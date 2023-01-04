import "./styles/app.css";
import React from "react";
import PopUp from "./components/popUp";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Timer from "./components/timer";
import firebaseConfig from './firebase-config.js';
import { initializeApp } from 'firebase/app'; 
import { getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Header from "./components/header";
import SignInBtn from './components/signInBtn.js';
import SignInForm from "./components/signInForm";
import Leaderboard from "./components/leaderboard.js"

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const firestore = getFirestore(app);
class App extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      waldoClicked: false,
      leaderboardOpen: false,
      popUpOpen: false,
      currentUser: undefined,
      userWon: false,
      signInOpen: false,
      emailValue: '',
      passwordValue: '',
      isValid: true,
      signUp: false,
      time: 0,
      started: false,
      intervalID: 0,
      sortedUserScores: []
    }

    this.updatePopUpLocation = this.updatePopUpLocation.bind(this);
    this.onCharSelectClick = this.onCharSelectClick.bind(this);
    this.onSignInClick = this.onSignInClick.bind(this);
    this.onWinMenuCloseClick = this.onWinMenuCloseClick.bind(this);
    this.onSignInCloseClick = this.onSignInCloseClick.bind(this);
    this.onSignInSubmitClick = this.onSignInSubmitClick.bind(this);
    this.onSignUpSubmitClick = this.onSignUpSubmitClick.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.changeToSignUp = this.changeToSignUp.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.tick = this.tick.bind(this);
    this.onLeaderboardClick = this.onLeaderboardClick.bind(this);
  }

  componentDidMount() {
    const document = getDoc(doc(firestore, "wheres-waldo", "userScores"));
    document.then(doc=>{
      this.setState({
        sortedUserScores: Object.entries(doc.data()).sort((a, b)=> a[1] - b[1])
      });
    });
  }

  onLeaderboardClick() {
    this.setState({
      leaderboardOpen: !this.state.leaderboardOpen,
    });
  }

  onStartClick(e) {
    this.setState({
      started: true,
    });
    this.tick();
  }

  tick(e) {
    let start = new Date();
    let interval = null;
    interval = setInterval(()=>{
      let current = new Date();
      this.setState({
        time: +current - +start
      });
    }, 10);
    this.setState({
      intervalID: interval,
    });
  }

  onEmailChange(e) {
    this.setState({
      emailValue: e.target.value,
    });
  }

  onPasswordChange(e) {
  this.setState({
    passwordValue: e.target.value,
  });
  }

  onSignInCloseClick(e) {
    this.setState({
      signInOpen: false,
    });
  }

  changeToSignUp() {
    this.setState({
      signUp: true,
    });
  }

  onCharSelectClick(e) {
    this.setState({
      popUpOpen: false
    }); 
    if (this.state.waldoClicked) {
      this.setState({
        userWon: true,
      });
      if (this.state.currentUser) {
        const newScore = {};
        newScore[this.state.currentUser] = ("0" + Math.floor((this.state.time / 1000) % 60)).slice(-2);
        setDoc(doc(firestore, "wheres-waldo", "userScores"), newScore, {merge:true});
      }
      clearInterval(this.state.intervalID);
    }
  }

  async onSignUpSubmitClick(e) {
    createUserWithEmailAndPassword(auth, this.state.emailValue, this.state.passwordValue)
      .then(result => {
        this.setState({
          currentUser: result.user.email,
          isValid: true,
          signInOpen: false,
        });
        if (this.state.userWon) {
          const newScore = {};
          newScore[result.user.email] = ("0" + Math.floor((this.state.time / 1000) % 60)).slice(-2);
          setDoc(doc(firestore, "wheres-waldo", "userScores"), newScore, {merge:true});
        }
      })
      .catch(error => {
        this.setState({
          isValid: false,
        });
      });
  }

  async onSignInSubmitClick(e) {
    signInWithEmailAndPassword(auth, this.state.emailValue, this.state.passwordValue)
      .then(result => {
        this.setState({
          currentUser: result.user.email,
          isValid: true,
          signInOpen: false,
        });
        if (this.state.userWon) {
          const newScore = {};
          newScore[result.user.email] = ("0" + Math.floor((this.state.time / 1000) % 60)).slice(-2);
          doc(firestore, "wheres-waldo", "userScores").set({newScore}, {merge: true});
        }
      })
      .catch(error => {
        this.setState({
          isValid: false,
        });
      });
  }

  onSignInClick() {
    this.setState({
      signInOpen: true,
    });
  }

  onWinMenuCloseClick() {
    this.setState({
      userWon: false,
      waldoClicked: false,
      time: 0,
    });
    this.tick();
  }

  updatePopUpLocation(e) {
    if (e.target === document.querySelector('.waldo-location')) {
      this.setState({
        waldoClicked: true,
      });
    }
    if (this.state.popUpOpen) {
      this.setState({
        popUpOpen: false,
        waldoClicked: false,
      });
    } else if (!this.state.popUpOpen && !this.state.signInOpen && !this.state.userWon && this.state.started && !this.state.leaderboardOpen) {
      this.setState({
        popUpOpen: true,
      });
      const popUp = document.querySelector('.popup');
      popUp.style.left = (e.pageX + e.currentTarget.scrollLeft - e.currentTarget.offsetLeft) + 'px';
      popUp.style.top = (e.pageY + e.currentTarget.scrollTop - e.currentTarget.offsetTop) + 'px';
    }
  }


  render() {
    
    return (
      <div>
        <Header onLeaderboardClick={this.onLeaderboardClick} signInOpen={this.state.signInOpen} currentUser={this.state.currentUser} onSignInClick={this.onSignInClick} />
        <Timer time={this.state.time}/>
        <div onClick={this.updatePopUpLocation} className="container mx-auto scene-container">
          <PopUp onCharSelectClick={this.onCharSelectClick} popUpOpen={this.state.popUpOpen} />
          {this.state.userWon && !this.state.signInOpen ? <div id="win-display">
            <div className="container">
              <h2>Your Time: <span id="win-time">{("0" + Math.floor((this.state.time / 1000) % 60)).slice(-2)} seconds</span></h2>  
            </div>
            {
              this.state.currentUser ? undefined : <div className="container sign-in-win-container">
                <p>Sign in to save your score:</p>
                <div id="win-display-button-div">
                  <SignInBtn currentUser={this.state.currentUser} onSignInClick={this.onSignInClick}/>
                  <button onClick={this.onWinMenuCloseClick} id="close-button">Close</button>
                </div>
              </div>
            }
          </div> : undefined }
          {!this.state.started ? <div id="scene-cover"></div> : null}
          {this.state.leaderboardOpen ? <Leaderboard onLeaderboardClick={this.onLeaderboardClick} sortedUserScores={this.state.sortedUserScores} /> : null}
          {this.state.started || this.state.leaderboardOpen ? null : 
          <div id="start-menu" className={this.state.signInOpen ? 'hidden' : 'container'}>
            
            <h2>Click start to begin the timer.</h2>
            <button onClick={this.onStartClick} id="start-button">start</button>
          </div>}
          <div className="container waldo-location"></div>
          <img alt="scene" id="scene" src="images/whereiswaldo.jpg" />
          <SignInForm onSignInCloseClick={this.onSignInCloseClick} signInOpen={this.state.signInOpen} 
                      onEmailChange={this.onEmailChange} onPasswordChange={this.onPasswordChange}
                      emailValue={this.state.emailValue} passwordValue={this.state.passwordValue}
                      isValid={this.state.isValid} onSignInSubmitClick={this.onSignInSubmitClick}
                      onSignUpSubmitClick={this.onSignUpSubmitClick}
                      signUp={this.state.signUp} changeToSignUp={this.changeToSignUp} />
        </div>
      </div>
    );    
  }
}

export default App;
