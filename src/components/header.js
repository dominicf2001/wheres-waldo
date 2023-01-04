import '../styles/header.css';
import SignInBtn from './signInBtn';

export default function Header(props) {

    return (
        <header className='container-fluid'>
            <button onClick={props.onLeaderboardClick} id='leaderboard-button'>Leaderboard</button>
            <img alt="Where's Walley" src='images/whereswally.png' />
            <SignInBtn {...props} />
            
        </header>
    )
}