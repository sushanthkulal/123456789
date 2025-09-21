import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { Card } from '../Common/Card';
import { Building2, Eye, EyeOff } from 'lucide-react';

export const UnifiedLoginForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    'Patient',
    'Doctor',
    'Receptionist',
    'Pharmacist',
    'Lab Technician'
  ];

  const roleConfig = {
    'Doctor': {
      dashboardPath: '/doctor/dashboard',
      role: 'doctor' as const
    },
    'Patient': {
      dashboardPath: '/patient/dashboard',
      role: 'patient' as const
    },
    'Receptionist': {
      dashboardPath: '/hospital/dashboard',
      role: 'hospital' as const
    },
    'Pharmacist': {
      dashboardPath: '/pharmacy/dashboard',
      role: 'pharmacist' as const
    },
    'Lab Technician': {
      dashboardPath: '/lab/dashboard',
      role: 'lab_technician' as const
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!credentials.role) {
      setError('Please select a role');
      return;
    }
    
    if (isSignUp) {
      // Validation for sign up
      if (credentials.password !== credentials.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (credentials.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      if (!credentials.name.trim()) {
        setError('Name is required');
        return;
      }
      
      const config = roleConfig[credentials.role as keyof typeof roleConfig];
      const result = await signUp(credentials.email, credentials.password, {
        name: credentials.name,
        role: config.role
      });
      
      if (result.success) {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setIsSignUp(false);
        setCredentials({
          email: credentials.email,
          password: '',
          confirmPassword: '',
          name: '',
          role: credentials.role
        });
      } else {
        setError(result.error || 'Failed to create account');
      }
    } else {
      // Sign in
      const result = await signIn(credentials.email, credentials.password);
      
      if (result.success) {
        const config = roleConfig[credentials.role as keyof typeof roleConfig];
        navigate(config.dashboardPath);
      } else {
        setError(result.error || 'Failed to sign in');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError('');
    setSuccess('');
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setCredentials({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: ''
    });
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
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <FormField
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={credentials.name}
              onChange={handleChange}
              required
            />
          )}

          <FormField
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