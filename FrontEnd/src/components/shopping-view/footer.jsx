'use client';
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaCode,
  FaTiktok,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";
      const response = await axios.post(`${apiBase}/common/newsletter/subscribe`, { email });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message || "Thank you for subscribing to Mobiletrends!",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to subscribe!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-50 to-white text-gray-900 pt-16 pb-8 mt-auto border-t border-gray-200 shadow-sm overflow-hidden relative"
    >
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Newsletter Section */}
        <div className="mb-16 p-8 sm:p-12 rounded-[2rem] bg-[#0C1172] overflow-hidden relative group shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF5E00]/20 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Stay in the <span className="text-[#DF5E00]">Loop</span>
              </h2>
              <p className="text-gray-200 font-medium max-w-sm">
                Subscribe to get special gadget offers, flash deals, and updates from Mobiletrends.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center space-x-2 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-none text-white placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-[#DF5E00] hover:bg-[#b84d00] text-white rounded-xl font-bold px-6 shadow-lg disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Subscribe</span>
                    <Send className="sm:ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left mb-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1"
          >
            <div className="flex flex-col items-center md:items-start space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/logo.jpg"
                  alt="Mobiletrends Systems Limited"
                  width={180}
                  height={50}
                  className="object-contain rounded-lg drop-shadow-sm"
                />
              </motion.div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                Welcome to <strong>Mobiletrends Systems Limited</strong>, your trusted destination for quality smartphones, laptops, gadgets, and genuine accessories.
              </p>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#0C1172]">Contact Us</h2>
              <ul className="text-gray-600 space-y-3">
                <motion.li
                  className="flex items-center justify-center md:justify-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaEnvelope className="w-4 h-4 mr-3 text-[#0C1172] flex-shrink-0" />
                  <a
                    href="mailto:Admin@mobiletrends.com.ng"
                    className="hover:text-[#0C1172] transition-colors text-sm font-medium"
                  >
                    Admin@mobiletrends.com.ng
                  </a>
                </motion.li>
                <motion.li
                  className="flex items-start justify-center md:justify-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaPhone className="w-4 h-4 mr-3 text-[#DF5E00] mt-1 flex-shrink-0" />
                  <div className="text-sm text-left">
                    <a href="tel:08034378180" className="hover:text-[#0C1172] block font-medium">08034378180</a>
                    <a href="tel:08142528191" className="hover:text-[#0C1172] block font-medium">08142528191</a>
                  </div>
                </motion.li>
                <motion.li
                  className="flex items-start justify-center md:justify-start group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaMapMarkerAlt className="w-4 h-4 mr-3 text-red-500 mt-1 flex-shrink-0" />
                  <div className="text-xs text-left space-y-2 text-gray-600">
                    <div>
                      <strong className="text-gray-900 block font-semibold">Office 1:</strong>
                      Offices 21 & 39 Ogunleye Shopping Complex, Opp. Woleph Hostel, Oba-kekere Futa South gate Entrance, Akure.
                    </div>
                    <div>
                      <strong className="text-gray-900 block font-semibold">Office 2:</strong>
                      Ground Floor 3, Felicia Mall Complex, adjacent Recabim Mtn office Oba Adesida road, Akure, Ondo State.
                    </div>
                  </div>
                </motion.li>
              </ul>
            </div>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-1"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#0C1172]">Connect With Us</h2>
              <div className="flex justify-center md:justify-start space-x-3 mb-6">
                {[
                  { icon: FaWhatsapp, href: "https://wa.me/2348034378180", color: "text-green-600 hover:bg-green-50" },
                  { icon: FaFacebook, href: siteConfig.socials.facebook, color: "text-blue-600 hover:bg-blue-50" },
                  { icon: FaInstagram, href: siteConfig.socials.instagram, color: "text-pink-600 hover:bg-pink-50" },
                  { icon: FaTwitter, href: siteConfig.socials.twitter, color: "text-sky-500 hover:bg-sky-50" },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`${social.color} rounded-full transition-all duration-300 border border-gray-200`}
                      >
                        <social.icon className="w-5 h-5" />
                      </Button>
                    </a>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Opening Hours: Mon - Sat: 8:00 AM - 6:00 PM
              </p>
            </div>
          </motion.div>

          {/* Accordion Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="md:col-span-1"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#0C1172]">Customer Care</h2>
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="warranty" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-gray-900 font-semibold hover:no-underline hover:text-[#0C1172] py-3 text-left">
                    Warranty & Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-xs pb-3">
                    We offer verified warranty on all brand new and certified pre-owned gadgets. Contact support within 7 days for eligible returns.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery-info" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-gray-900 font-semibold hover:no-underline hover:text-[#0C1172] py-3 text-left">
                    Nationwide Delivery
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-xs pb-3">
                    Same-day delivery within Akure. 1-3 business days nationwide with doorstep tracking.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="authenticity" className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-gray-900 font-semibold hover:no-underline hover:text-[#0C1172] py-3 text-left">
                    100% Genuine Tech
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-xs pb-3">
                    Every device is verified and inspected by certified technicians before delivery.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>

        {/* Main Separator */}
        <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Copyright Section */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MOBILETRENDS SYSTEMS LIMITED. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
