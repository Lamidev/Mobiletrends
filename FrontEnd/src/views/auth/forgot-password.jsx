'use client';

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/auth-slice/index";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ email: "" });
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Email is required!",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await dispatch(
        forgotPassword({ email: formData.email })
      ).unwrap();
      toast({
        title: "Success",
        description: response.message,
        variant: "success",
      });
      setIsSubmitted(true);
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to send reset password email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full font-body">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="font-manrope text-[26px] sm:text-[28px] font-bold text-[#0f172a] tracking-[-0.7px] leading-tight">
          Forgot password
        </h1>
        <p className="text-[13px] text-[#64748b] mt-1">
          Enter your email address and we&apos;ll send you a password reset link
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
            >
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              placeholder="you@example.com"
              className="w-full h-[46px] rounded-[6px] px-4 bg-[#f4f5f7] focus:bg-white text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[46px] rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white font-manrope font-semibold text-[13px] shadow-[0_6px_16px_rgba(17,19,68,0.18)] transition-all flex items-center justify-center disabled:opacity-60 cursor-pointer mt-2"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      ) : (
        <div className="p-5 bg-green-50 rounded-[6px] border border-green-100 text-center">
          <p className="text-green-800 text-[13px] font-semibold">
            Check your inbox! We&apos;ve sent a recovery link to{" "}
            <span className="underline">{formData.email}</span>.
          </p>
        </div>
      )}

      <p className="text-[12.5px] text-[#64748b] text-center mt-7">
        Remember your password?{" "}
        <Link
          to="/auth/login"
          className="text-[#111344] font-semibold underline underline-offset-2 hover:text-[#DF5E00] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default ForgotPasswordPage;
