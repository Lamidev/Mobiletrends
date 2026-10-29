'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../store/auth-slice/index';
import { useToast } from '@/components/ui/use-toast';
import { Mail, ArrowLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CommonForm from '@/components/common/form';

const forgotPasswordControls = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
];

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ email: "" });
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast({ title: "Error", description: "Email is required!", variant: "destructive" });
      return;
    }
    try {
      const response = await dispatch(forgotPassword({ email: formData.email })).unwrap();
      toast({ title: "Success", description: response.message, variant: "success" });
      setIsSubmitted(true);
    } catch (err) {
      toast({ title: "Error", description: error || "Failed to send reset password email", variant: "destructive" });
    }
  };

  return (
    <motion.div
      className="w-full bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-peach-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-peach-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
            Reset Password
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Enter your email address and we'll send you a link to restore access.
          </p>
        </div>

        {!isSubmitted ? (
          <CommonForm
            formControls={forgotPasswordControls}
            buttonText={isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Request Access"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isBtnDisabled={isLoading}
          />
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-6 bg-green-50 rounded-2xl border border-green-100"
          >
            <p className="text-green-700 font-bold">
              Success! Check your email for the recovery link.
            </p>
          </motion.div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-100">
          <Link
            to={"/auth/login"}
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
          >
            <ArrowLeft size={18} /> Back to Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


export default ForgotPasswordPage;
