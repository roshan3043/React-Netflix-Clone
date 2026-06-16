import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function LoginScreen() {
  const [signIn, setSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const signInWithEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Netflix Logo */}
      <div style={{ padding: '20px 4%', zIndex: 2, position: 'relative' }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="Netflix"
          style={{ width: '150px', objectFit: 'contain' }}
        />
      </div>

      <div className="auth-body">
        <div className="auth-form">
          <h1>{signIn ? 'Sign In' : 'Sign Up'}</h1>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-input-group" onSubmit={signIn ? signInWithEmail : register}>
            {/* Email */}
            <div className="auth-input-wrapper">
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
              />
              <label className={`auth-input-label ${emailFocused || email ? 'active' : ''}`}>
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="auth-input-wrapper">
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />
              <label className={`auth-input-label ${passwordFocused || password ? 'active' : ''}`}>
                Password
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                signIn ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          {signIn && (
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          )}

          <div className="auth-link">
            {signIn ? 'New to Netflix?' : 'Already have an account?'}
            <span onClick={() => { setSignIn(!signIn); setError(''); }}>
              {signIn ? 'Sign up now.' : 'Sign in instead.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
