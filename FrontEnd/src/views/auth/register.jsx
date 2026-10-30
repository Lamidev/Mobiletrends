'use client';

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/store/auth-slice";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const combinedUserName = `${formData.firstName} ${formData.lastName}`.trim();
    const payload = {
      userName: combinedUserName || formData.firstName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    dispatch(registerUser(payload))
      .then((data) => {
        if (data?.payload?.success) {
          toast({ title: data?.payload?.message || "Account created!" });
          navigate("/auth/verify-email");
          setFormData(initialState);
        } else {
          toast({
            title: data?.payload?.message || "Registration failed",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="w-full font-body">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="font-manrope text-[26px] sm:text-[28px] font-bold text-[#0f172a] tracking-[-0.7px] leading-tight">
          Create an account
        </h1>
        <p className="text-[13px] text-[#64748b] mt-1">
          Enter your details to create an account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label
              htmlFor="register-first-name"
              className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
            >
              First name <span className="text-red-500">*</span>
            </label>
            <input
              id="register-first-name"
              type="text"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="First name"
              className="w-full h-[44px] sm:h-[46px] rounded-[6px] px-3.5 sm:px-4 bg-[#f4f5f7] focus:bg-white text-[13px] sm:text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="register-last-name"
              className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
            >
              Last name
            </label>
            <input
              id="register-last-name"
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Last name"
              className="w-full h-[44px] sm:h-[46px] rounded-[6px] px-3.5 sm:px-4 bg-[#f4f5f7] focus:bg-white text-[13px] sm:text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="register-email"
            className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
          >
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="register-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="you@example.com"
            className="w-full h-[46px] rounded-[6px] px-4 bg-[#f4f5f7] focus:bg-white text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
          />
        </div>

        {/* Phone Number (Optional) */}
        <div>
          <label
            htmlFor="register-phone"
            className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
          >
            Phone number (Optional)
          </label>
          <input
            id="register-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+234 812 345 6789"
            className="w-full h-[46px] rounded-[6px] px-4 bg-[#f4f5f7] focus:bg-white text-[13.5px] text-[#0f172a] placeholder:text-[#94a3b8] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="register-password"
            className="block text-[12px] font-medium text-[#1e293b] mb-1.5"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="register-password"
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[46px] rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white font-manrope font-semibold text-[13px] shadow-[0_6px_16px_rgba(17,19,68,0.18)] transition-all flex items-center justify-center disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-[12.5px] text-[#64748b] text-center mt-7">
        Already have an account?{" "}
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

export default AuthRegister;
