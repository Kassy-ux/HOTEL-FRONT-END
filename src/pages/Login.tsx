import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useForm } from "react-hook-form";
import { userApi } from "../features/api/userApi";
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from "sonner";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useEffect } from "react";

type UserLoginFormValues = {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UserLoginFormValues>();
  const [loginUser, { isLoading }] = userApi.useLoginUserMutation();

  useEffect(() => {
    if (location.state?.email) setValue('email', location.state.email);
    if (location.state?.password) setValue('password', location.state.password);
  }, [location.state, setValue]);

  const onSubmit = async (data: UserLoginFormValues) => {
    const loadingToastId = toast.loading("Authenticating...");
    try {
      const res = await loginUser(data).unwrap();
      dispatch(setCredentials(res));
      toast.success("Login successful!", { id: loadingToastId, description: "Welcome back!" });
      if (res.role === "admin") navigate("/admindashboard/analytics");
      else navigate("/dashboard/me");
    } catch (err: any) {
      toast.error('Login failed', { 
        id: loadingToastId,
        description: err.data?.message || err.message || err.error || "Invalid credentials"
      });
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-pink-100 flex items-center justify-center py-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl"
        >
          {/* Form Section */}
          <div className="flex items-center justify-center p-8 sm:p-12">
            <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
                  <FaSignInAlt className="inline-block" />
                  Welcome Back
                </h1>
                <p className="text-gray-500">Sign in to your account</p>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
                <div className="text-right mt-1">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-pink-600 hover:text-pink-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </motion.button>

              {/* Links */}
              <div className="text-center mt-6 text-sm">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-pink-600 hover:text-pink-800 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden sm:flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-pink-400 opacity-10"></div>
            <div className="relative z-10 p-8 w-full h-full flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

                alt="Login" 
                className="rounded-xl shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};
