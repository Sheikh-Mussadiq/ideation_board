import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState('local');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ideation');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(email, password, authType);
      if (success) {
        toast.success('Login successful!');
        navigate('/ideation');
      } else {
        setError('Invalid credentials');
        toast.error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-light to-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              setAuthType('local');
              setError(null);
            }}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              authType === 'local'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-primary'
            }`}
          >
            Local Auth
          </button>
          <button
            onClick={() => {
              setAuthType('socialhub');
              setError(null);
            }}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              authType === 'socialhub'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-primary-light hover:text-primary'
            }`}
          >
            SocialHub
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-semantic-error-light p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-semantic-error" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-semantic-error">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="label">
                {authType === 'local' ? 'Email address' : 'SocialHub Username'}
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete={authType === 'local' ? 'email' : 'username'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder={authType === 'local' ? 'Email address' : 'SocialHub username'}
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  // No props needed as this is a top-level page component
};