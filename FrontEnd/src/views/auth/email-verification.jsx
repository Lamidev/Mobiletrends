'use client';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, checkAuth } from "../../store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth); // Adjust path if necessary
  const { toast } = useToast(); // Using the custom toast from use-toast

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return; // Stop if already processing

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) return;

    try {
      await dispatch(verifyEmail({ code: verificationCode })).unwrap();
      toast({ description: "Email verified successfully, login to continue", variant: "success" });

      // Re-fetch auth state
      await dispatch(checkAuth());
      navigate("/auth/login");
    } catch (error) {
      toast({
        description: error || "Verification failed",
        variant: "destructive",
      });
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && !isLoading) {
      handleSubmit();
    }
  }, [code]); // Watch the code array directly


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden"
    >
      <div className="p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-peach-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-peach-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
            Verify Email
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Enter the 6-digit code sent to your inbox to activate your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full h-14 sm:h-16 text-center text-2xl font-black bg-gray-50 text-gray-900 border-2 border-gray-100 rounded-xl focus:border-peach-500 focus:bg-white focus:outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 font-bold text-center text-sm bg-red-50 py-2 rounded-lg border border-red-100"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-peach-500 to-peach-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-peach-100 hover:shadow-peach-200 transition-all focus:outline-none focus:ring-4 focus:ring-peach-500 focus:ring-opacity-20 disabled:opacity-50 disabled:grayscale"
          >
            {isLoading ? "Verifying..." : "Verify & Join"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Didn't receive the code?{" "}
          <button className="text-peach-600 font-black hover:underline transition-all">Resend Code</button>
        </p>
      </div>
    </motion.div>
  );
};
export default EmailVerificationPage;
