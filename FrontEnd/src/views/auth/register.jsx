'use client';
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast"; // For showing messages
import { registerFormControls } from "@/config"; // Fields to show in the form
import { registerUser } from "@/store/auth-slice"; // Action to save the user info
import { useState } from "react"; // To keep track of form data
import { useDispatch } from "react-redux"; // To call actions
import { Link, useNavigate } from "react-router-dom"; // For navigation
import { Loader, Lock, Mail, User } from "lucide-react"; // Icons for the inputs
import PasswordStrengthMeter from "@/components/common/password-strength-meter"; // Password Strength Meter
import CommonForm from "@/components/common/form"; // The form where the user types

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        navigate("/auth/verify-email");
        setFormData(initialState);
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

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
            Create Account
          </h2>
          <p className="text-gray-500 font-medium">Join the premium world of gadgets</p>
        </div>

        <CommonForm
          formControls={registerFormControls}
          buttonText="Complete Registration"
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />

        <div className="mt-6">
          <PasswordStrengthMeter password={formData.password} />
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center">
          <p className="text-sm text-gray-600 font-medium mb-4">
            Already a member?
          </p>
          <Link
            to={"/auth/login"}
            className="w-full py-3 px-6 rounded-xl border-2 border-peach-100 text-peach-600 font-black text-center hover:bg-peach-50 transition-all active:scale-95"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


export default AuthRegister;
