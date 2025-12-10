import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoading, signIn, signUp, hasRole } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Get the intended destination from location state or default based on role
  const from = (location.state as any)?.from?.pathname || '/';

  // Only allow redirect after successful form submission
  useEffect(() => {
    if (shouldRedirect && user && !isLoading) {
      const timer = setTimeout(() => {
        if (hasRole('admin')) {
          navigate('/admin', { replace: true });
        } else if (hasRole('pharmacist')) {
          navigate('/pharmacist', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, user, isLoading, navigate, from, hasRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);

        if (error) {
          let message = error.message;
          if (error.message.includes('User already registered')) {
            message = 'This email is already registered. Please sign in instead.';
          }
          
          toast({
            title: 'Sign Up Failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          // Show email confirmation message
          setEmailSent(true);
          toast({
            title: 'Check Your Email',
            description: 'We sent you a confirmation link. Please check your email to activate your account.',
          });
        }
      } else {
        const { error } = await signIn(email, password);

        if (error) {
          let message = error.message;
          if (error.message.includes('Invalid login credentials')) {
            message = 'Invalid email or password. Please try again.';
          } else if (error.message.includes('Email not confirmed')) {
            message = 'Please confirm your email before signing in. Check your inbox for the confirmation link.';
          }
          
          toast({
            title: 'Sign In Failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome Back!',
            description: 'You have signed in successfully.',
          });
          // Only trigger redirect after successful login
          setShouldRedirect(true);
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Email sent confirmation screen
  if (emailSent) {
    return (
      <>
        <Helmet>
          <title>Confirm Your Email - MediKart UG</title>
        </Helmet>

        <Layout>
          <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8">
            <div className="container max-w-md mx-auto px-4">
              <div className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground mb-6">
                  We've sent a confirmation link to <strong>{email}</strong>. 
                  Please check your inbox and click the link to activate your account.
                </p>
                
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-3 text-left">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Didn't receive the email?</p>
                      <ul className="space-y-1">
                        <li>• Check your spam/junk folder</li>
                        <li>• Make sure you entered the correct email</li>
                        <li>• Wait a few minutes and try again</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setEmailSent(false);
                    setIsSignUp(false);
                  }}
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Create Account' : 'Sign In'} - MediKart UG</title>
        <meta 
          name="description" 
          content="Sign in to your MediKart UG account to order medicines, upload prescriptions, and track your orders." 
        />
      </Helmet>

      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8">
          <div className="container max-w-md mx-auto px-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Login Card */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {isSignUp 
                    ? 'Sign up to start ordering medicines'
                    : 'Sign in to your MediKart account'
                  }
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      You'll receive an email to confirm your account before you can sign in.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                    : (isSignUp ? 'Create Account' : 'Sign In')
                  }
                </Button>
              </form>

              {/* Toggle Sign Up / Sign In */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-primary font-semibold"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </Button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
