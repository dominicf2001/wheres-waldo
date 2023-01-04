import '../styles/signInBtn.css';

export default function SignInBtn(props) {
  return (
    <button className={(props.signInOpen || props.currentUser) ? 'invisible' : null} onClick={props.onSignInClick} id='sign-in-button'>Sign in</button>
  )
}