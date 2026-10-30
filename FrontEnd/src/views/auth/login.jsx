'use client';

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/auth-slice";

function AuthLogin() {
  const initialState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
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
          description: "Welcome back!",
        });
        setFormData(initialState);
      } else {
        toast({
          title: result?.message || "Login failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errMsg =
        typeof err === "string"
          ? err
          : err?.message || "An error occurred. Please try again.";
      setError(errMsg);
      toast({
        title: errMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.isVerified) {
        navigate("/auth/verify-email");
        return;
      }

      const fromCheckout = sessionStorage.getItem("fromCheckout");
      if (fromCheckout) {
        sessionStorage.removeItem("fromCheckout");
        navigate("/shop/checkout");
      } else {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/shop/home");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="w-full max-w-full font-body">
      {/* Heading */}
      <div className="mb-6 sm:mb-7">
        <h1 className="font-manrope text-[25px] sm:text-[28px] font-bold text-[#0f172a] tracking-[-0.7px] leading-tight">
          Welcome back
        </h1>
        <p className="text-[13px] text-[#64748b] mt-1">
          Enter your email and password to sign in
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4 w-full">
        <div className="min-w-0">
          <label
            htmlFor="login-email"
            className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="you@example.com"
            className="w-full min-w-0 max-w-full box-border h-[46px] rounded-[6px] px-3.5 sm:px-4 bg-[#f4f5f7] focus:bg-white text-[16px] sm:text-[13.5px] text-[#0f172a] placeholder:text-[13px] placeholder:text-[#94a3b8] placeholder:truncate border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="login-password"
            className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
          >
            Password
          </label>
          <div className="relative w-full min-w-0">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••••••"
              className="w-full min-w-0 max-w-full box-border h-[46px] rounded-[6px] pl-3.5 sm:pl-4 pr-11 bg-[#f4f5f7] focus:bg-white text-[16px] sm:text-[13.5px] text-[#0f172a] placeholder:text-[13px] placeholder:text-[#94a3b8] placeholder:truncate border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <Link
              to="/auth/forgot-password"
              className="text-[12px] font-medium text-[#1e293b] hover:text-[#0C1172] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-[12.5px] font-medium text-center bg-red-50 py-2.5 px-4 rounded-[6px] border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[46px] rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white font-manrope font-semibold text-[13px] shadow-[0_6px_16px_rgba(17,19,68,0.18)] transition-all flex items-center justify-center disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-[12.5px] text-[#64748b] text-center mt-6 sm:mt-7">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/register"
          className="text-[#111344] font-semibold underline underline-offset-2 hover:text-[#DF5E00] transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
