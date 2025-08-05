'use client'

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { showToast } from "@/hooks/show-toast";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form"
import { on } from "events";
// import { showToast } from "../../../hooks/show-toast";
// import { Button } from "../../../components/ui/button";

type Inputs = {
    email: string
    password: string
    rememberMe: boolean;
}

function Login() {

  const server_url = process.env.NEXT_PUBLIC_API_URL
  console.log(server_url)

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors}
  } = useForm<Inputs>()

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {  
    setLoading(true)  
    try{ 
        const response = await fetch(server_url + "login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password
            }),
        });

        if(response.ok){
         showToast({
            title: "Login Successful",
            description: "Welcome back to EduSpark!",
            type: "success",
            position: "top-right"
         });
        } else {
             // showToast for error
            showToast({
                title: "Login Failed",
                description: "An unexpected error occurred.",
                type: "error",
                position: "top-right"
              });
        };
    } catch(e){
        
      console.error("Login failed:", e);
      // showToast for error
      showToast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        type: "error",
        position: "top-right"
      });
    }
    finally {
        setLoading(false)
    }   
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <GraduationCap className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">EduSpark</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="control">
                <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent focus:ring-2 focus:ring-orange-500  transition-colors"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Incorrect email format",
                            },
                        })} 
                        />
                </div>   
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}             
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                <Button
                  variant="outline"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              variant={"default"}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              size={"lg"}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Social Login Buttons */}
          <div className="mb-6 pt-5">
            <Button
              variant={"default"}
              onClick={() => window.location.href = server_url + "login/google"}
              className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 mb-3 hover:bg-gray-50 transition-colors"
            >
              <img src="/google.svg" alt="Google" className="h-5 w-5 mr-2" />
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </Button>
            {/* <Button
              variant={"default"}
              onClick={() => window.location.href = server_url + "login/facebook"}
              className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 mb-3 hover:bg-gray-50 transition-colors"
            >
              <img src="/facebook.svg" alt="Facebook" className="h-5 w-5 mr-2" />
              <span className="text-gray-700 font-medium">Sign in with Facebook</span>
            </Button> */}
          </div>

          {/* Divider */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="text-orange-500 hover:text-orange-600 transition-colors font-semibold"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
