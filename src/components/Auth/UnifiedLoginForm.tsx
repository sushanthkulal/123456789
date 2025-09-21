import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { Card } from '../Common/Card';
import { Building2, Eye, EyeOff } from 'lucide-react';

export const UnifiedLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Signed in:", data);
      
      // Get user profile to determine role and redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();
      
      if (profile) {
        // Redirect based on role
        switch (profile.role) {
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'patient':
            navigate('/patient/dashboard');
            break;
          case 'hospital':
            navigate('/hospital/dashboard');
            break;
          case 'pharmacist':
            navigate('/pharmacy/dashboard');
            break;
          case 'lab_technician':
            navigate('/lab/dashboard');
            break;
          default:
            navigate('/patient/dashboard');
        }
      } else {
        // Default redirect if no profile found
        navigate('/patient/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 border border-black flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-black" />
          </div>
          <h1 className="text-2xl font-medium text-black mb-2">Hospital Management System</h1>
          <p className="text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" fullWidth className="mt-6" loading={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <FormField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isSignUp && (
            <div className="relative">
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={credentials.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}

          <FormField
            label="Select Role"
            name="role"
            type="select"
            value={credentials.role}
            onChange={handleChange}
            options={roleOptions}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <Button type="submit" fullWidth className="mt-6" loading={loading}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-2 text-black font-medium hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};