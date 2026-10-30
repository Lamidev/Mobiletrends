'use client';

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "../../store/auth-slice/index";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { toast } = useToast();

  const { isLoading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(
        resetPassword({ token, formData: { password: formData.password } })
      ).unwrap();

      toast({
        title: "Success",
        description: "Password reset successfully, redirecting to login...",
      });

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Error resetting password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full font-body">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="font-manrope text-[26px] sm:text-[28px] font-bold text-[#0f172a] tracking-[-0.7px] leading-tight">
          Set new password
        </h1>
        <p className="text-[13px] text-[#64748b] mt-1">
          Create a strong new password for your account
        </p>
      </div>

      {error && (
        <p className="text-red-600 text-[12.5px] font-medium mb-4 text-center bg-red-50 py-2.5 px-4 rounded-[6px] border border-red-100">
          {error}
        </p>
      )}

      {message && (
        <p className="text-green-700 text-[12.5px] font-medium mb-4 text-center bg-green-50 py-2.5 px-4 rounded-[6px] border border-green-100">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
          >
            New password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••••••"
              className="w-full h-[46px] rounded-[6px] pl-4 pr-11 bg-[#f4f5f7] focus:bg-white text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
          >
            Confirm password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="••••••••••••"
              className="w-full h-[46px] rounded-[6px] pl-4 pr-11 bg-[#f4f5f7] focus:bg-white text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[46px] rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white font-manrope font-semibold text-[13px] shadow-[0_6px_16px_rgba(17,19,68,0.18)] transition-all flex items-center justify-center disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Update Password"
          )}
        </button>
      </form>

      <p className="text-[12.5px] text-[#64748b] text-center mt-7">
        Back to{" "}
        <Link
          to="/auth/login"
          className="text-[#111344] font-semibold underline underline-offset-2 hover:text-[#DF5E00] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
