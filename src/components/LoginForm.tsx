import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Loader } from 'lucide-react';
import { UserData } from './ChatWidget';

interface LoginFormProps {
  onLogin: (userData: UserData) => void;
  isMaximized?: boolean;
}

export default function LoginForm({ onLogin, isMaximized = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { loginUser, handleApiError } = await import('../utils/api');
      const result = await loginUser(formData);

      if (result.status === 'success' && result.user_info) {
        onLogin(result.user_info);
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      const { handleApiError } = await import('../utils/api');
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(''); // Clear error when user types
  };

  // Adjust container height based on maximize state
  const containerClass = isMaximized 
    ? "p-6 h-full max-h-[calc(100vh-4rem)] overflow-y-auto"
    : "p-6 h-full max-h-[calc(100vh-12rem)] overflow-y-auto";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto tm-gradient rounded-full flex items-center justify-center mb-4"
          >
            <LogIn className="text-white" size={24} />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Welcome to TM AI Day
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in with your TM credentials to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          {/* Username/Staff ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Staff ID / Username
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              placeholder="Enter your staff ID"
              className={`
                w-full px-4 py-3 rounded-xl
                bg-white/50 dark:bg-gray-800/50
                border border-gray-200 dark:border-gray-700
                focus:border-tm-blue focus:ring-2 focus:ring-tm-blue/20
                ios-transition outline-none
                text-gray-800 dark:text-white
                placeholder-gray-500
              `}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className={`
                  w-full px-4 py-3 pr-12 rounded-xl
                  bg-white/50 dark:bg-gray-800/50
                  border border-gray-200 dark:border-gray-700
                  focus:border-tm-blue focus:ring-2 focus:ring-tm-blue/20
                  ios-transition outline-none
                  text-gray-800 dark:text-white
                  placeholder-gray-500
                `}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 ios-transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded-xl font-medium
              tm-gradient text-white
              flex items-center justify-center space-x-2
              ios-transition
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}
            `}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-tm-blue/5 rounded-xl"
        >
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Use your TM corporate login credentials. 
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}