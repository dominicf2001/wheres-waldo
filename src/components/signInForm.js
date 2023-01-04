import '../styles/signInForm.css';


export default function SignInForm(props) {

    const submitButton = props.signUp ? <button type='button' onClick={props.onSignUpSubmitClick} className='btn btn-primary'>Sign up</button>
                                        : <button type='button' onClick={props.onSignInSubmitClick} className='btn btn-primary'>Sign in</button>
    return (
        <form id="sign-in-form" className={props.signInOpen ? null : 'hidden'}>
            <button onClick={props.onSignInCloseClick} type='button' className='close' aria-label='Close'>
                <span aria-hidden="true">&times;</span>
            </button>
            <div className='form-group'>
                <label htmlFor="inputEmail">Email: </label>
                <input type="email" className='form-control' onChange={props.onEmailChange} id="inputEmail" aria-label="email" placeholder="Enter email" value={props.emailValue} />
            </div>
            <div className='form-group'>
                <label htmlFor='inputPassword'>Password: </label>
                <input className='form-control' id='inputPassword' onChange={props.onPasswordChange} type="password" placeholder="Password" value={props.passwordValue} />
            </div>
            <small className={props.isValid ? 'hidden' : 'form-text text-muted'} id="invalid-text">Invalid email or Password</small>
            {submitButton}
            <small onClick={props.changeToSignUp} className={props.signUp ? 'hidden' : null} id="sign-up-link">Click to Sign Up</small> 
        </form>
    );
}