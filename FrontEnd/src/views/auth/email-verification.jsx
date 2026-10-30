'use client';

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, checkAuth } from "../../store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) return;

    try {
      await dispatch(verifyEmail({ code: verificationCode })).unwrap();
      toast({
        description: "Email verified successfully, login to continue",
        variant: "success",
      });

      await dispatch(checkAuth());
      navigate("/auth/login");
    } catch (err) {
      toast({
        description: err || "Verification failed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && !isLoading) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="w-full font-body">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="font-manrope text-[26px] sm:text-[28px] font-bold text-[#0f172a] tracking-[-0.7px] leading-tight">
          Verify your email
        </h1>
        <p className="text-[13px] text-[#64748b] mt-1">
          Enter the 6-digit verification code sent to your email address
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2.5">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-full h-14 text-center font-manrope text-xl font-bold bg-[#f4f5f7] focus:bg-white text-[#0f172a] border border-[#e2e8f0] focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 rounded-[6px] outline-none transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-[12.5px] font-medium text-center bg-red-50 py-2.5 px-4 rounded-[6px] border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || code.some((digit) => !digit)}
          className="w-full h-[46px] rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white font-manrope font-semibold text-[13px] shadow-[0_6px_16px_rgba(17,19,68,0.18)] transition-all flex items-center justify-center disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Verify Account"
          )}
        </button>
      </form>

      <p className="text-[12.5px] text-[#64748b] text-center mt-7">
        Already verified?{" "}
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

export default EmailVerificationPage;
