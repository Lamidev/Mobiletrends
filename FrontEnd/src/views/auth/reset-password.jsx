'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "../../store/auth-slice/index";
import CommonForm from "@/components/common/form";

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
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Error resetting password",
        variant: "destructive",
      });
    }
  };

  const formControls = [
    {
      name: "password",
      label: "New Password",
      type: showPassword ? "text" : "password",
      placeholder: "Enter new password",
      componentType: "input",
      icon: showPassword ? EyeOff : Eye,
      toggleVisibility: () => setShowPassword((prev) => !prev),
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Confirm new password",
      componentType: "input",
      icon: showConfirmPassword ? EyeOff : Eye,
      toggleVisibility: () => setShowConfirmPassword((prev) => !prev),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden"
    >
      <div className="p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
            Secure Your Account
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Create a strong new password to regain access to your account.
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-bold mb-6 text-center bg-red-50 py-2 rounded-lg border border-red-100"
          >
            {error}
          </motion.p>
        )}

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-sm font-bold mb-6 text-center bg-green-50 py-2 rounded-lg border border-green-100"
          >
            {message}
          </motion.p>
        )}

        <CommonForm
          formControls={formControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText={isLoading ? "Updating Security..." : "Confirm New Password"}
          isBtnDisabled={isLoading}
        />
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
