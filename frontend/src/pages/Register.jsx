import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    
    // Pass undefined role to register function - let backend handle assignment
    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
       {/* Left Decoration Side */}
       <div className="hidden lg:flex lg:w-1/2 bg-primary-900 text-white flex-col justify-center px-12 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-6">Join the Network</h1>
          <p className="text-xl text-primary-100 mb-8">
            Collaborate with health professionals to monitor and prevent disease outbreaks across the region.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary-800/50 rounded-lg backdrop-blur-sm border border-primary-700">
              <span className="block text-xl font-bold">Real-time</span>
              <span className="text-sm text-primary-300">Data Visualization</span>
            </div>
            <div className="p-4 bg-primary-800/50 rounded-lg backdrop-blur-sm border border-primary-700">
              <span className="block text-xl font-bold">Secure</span>
              <span className="text-sm text-primary-300">Data Processing</span>
            </div>
             <div className="p-4 bg-primary-800/50 rounded-lg backdrop-blur-sm border border-primary-700">
              <span className="block text-xl font-bold">Predictive</span>
              <span className="text-sm text-primary-300">Analytics</span>
            </div>
             <div className="p-4 bg-primary-800/50 rounded-lg backdrop-blur-sm border border-primary-700">
              <span className="block text-xl font-bold">Alerts</span>
              <span className="text-sm text-primary-300">Instant Notification</span>
            </div>
          </div>
        </div>
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-700 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-primary-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>


      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                   <div className="bg-risk-50 border-l-4 border-risk-500 p-4 rounded-r" role="alert">
                   <div className="flex">
                     <div className="flex-shrink-0">
                       <svg className="h-5 w-5 text-risk-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                       </svg>
                     </div>
                     <div className="ml-3">
                       <p className="text-sm text-risk-700">{error}</p>
                     </div>
                   </div>
                 </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                      placeholder="doctor@hospital.org"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                 <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors transform active:scale-95"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
