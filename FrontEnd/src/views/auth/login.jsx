'use client';


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { loginFormControls } from "@/config";

function AuthLogin() {
  const initialState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      if (result?.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back!"
        });

        setFormData(initialState);
      } else {
        toast({
          title: result?.message || "Login failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error || "An error occurred. Please try again.");
      toast({
        title: error || "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      const fromCheckout = sessionStorage.getItem('fromCheckout');

      if (fromCheckout) {
        sessionStorage.removeItem('fromCheckout');
        navigate("/shop/checkout");
      } else {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/shop/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden"
    >
      <div className="p-8 sm:p-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-medium">Log in to manage your premium gadgets</p>
        </div>

        <CommonForm
          formControls={loginFormControls}
          buttonText={isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          disabled={isLoading}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-bold mt-4 text-center bg-red-50 py-2 rounded-lg border border-red-100"
          >
            {error}
          </motion.p>
        )}

        <div className="flex flex-col space-y-4 mt-8">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-peach-600 hover:text-peach-700 font-bold text-center transition-colors"
          >
            Forgot your password?
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-400 font-bold tracking-widest">or</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center font-medium">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-peach-600 hover:underline font-black transition-colors"
            >
              Explore Membership
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default AuthLogin;