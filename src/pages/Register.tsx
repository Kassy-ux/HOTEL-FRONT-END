import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useForm } from "react-hook-form";
import { userApi } from "../features/api/userApi";
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "sonner";
import { FaUserPlus, FaPhone, FaHome, FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { motion } from "framer-motion";

type UserRegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone: string;
  address: string;
}

export const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserRegisterFormValues>();
  const [registerUser, { isLoading }] = userApi.useRegisterUserMutation()
  const navigate = useNavigate();

  const onSubmit = async (data: UserRegisterFormValues) => {
    const loadingToastId = toast.loading("Creating your account...");
    try {
      const res = await registerUser(data).unwrap()
      toast.success("Account created successfully!", { 
        id: loadingToastId,
        description: "You can now log in to your account"
      });
      navigate('/login', { 
        state: { email: data.email, password: data.password }, 
        replace: true 
      });
    } catch (err: any) {
      toast.error('Registration failed', { 
        id: loadingToastId,
        description: err.data?.message || err.message || err.error || "Please try again"
      });
    }
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center py-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 gap-0 bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-6xl"
        >
          {/* Form Section */}
          <div className="flex items-center justify-center p-8 sm:p-12">
            <form 
              className="w-full max-w-md space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-indigo-600 mb-2 flex items-center justify-center gap-2">
                  <FaUserPlus className="inline-block" />
                  Create Account
                </h1>
                <p className="text-gray-500">Join us today and start your journey</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserPlus className="text-gray-400" />
                    </div>
                    <input
                      className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                      placeholder="John"
                      {...register("firstName", { required: "First name is required" })}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserPlus className="text-gray-400" />
                    </div>
                    <input
                      className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      type="text"
                      placeholder="Doe"
                      {...register("lastName", { required: "Last name is required" })}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register("contactPhone")}
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHome className="text-gray-400" />
                  </div>
                  <input
                    className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    type="text"
                    placeholder="123 Main St, City, Country"
                    {...register("address")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Register Now
                  </>
                )}
              </motion.button>

              {/* Links */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm">
                <Link 
                  to="/login" 
                  className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 mb-2 sm:mb-0"
                >
                  <FaSignInAlt />
                  Already have an account? Login
                </Link>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-800 hover:underline flex items-center gap-1"
                >
                  ← Return to Home
                </Link>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden sm:flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500 opacity-10"></div>
            <div className="relative z-10 p-8 w-full h-full flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=720&q=80" 
                alt="Registration" 
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