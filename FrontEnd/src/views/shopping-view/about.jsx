'use client';

import { motion } from "framer-motion";
import { FaShieldAlt, FaTruck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FaNairaSign } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="font-body container mx-auto py-16 px-6 md:px-12 lg:px-20">
      {/* Header Section */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-manrope text-4xl md:text-5xl font-extrabold tracking-tight text-center text-[#0C1172] mb-6"
      >
        About Us
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-lg text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
      >
        Welcome to{" "}
        <span className="font-bold text-[#0C1172]">
          Mobiletrends Systems Limited
        </span>
        , your trusted one-stop destination for cutting-edge smartphones, laptops, and accessories at unbeatable prices. Our passion is to bring authentic, top-tier technology right to your fingertips.
      </motion.p>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16"
      >
        {[
          {
            Icon: FaShieldAlt,
            title: "Quality Products",
            desc: "We source only authentic, high-quality gadgets from trusted global manufacturers.",
          },
          {
            Icon: FaNairaSign,
            title: "Affordable Prices",
            desc: "Top-notch smartphones, laptops, and accessories without breaking the bank.",
          },
          {
            Icon: FaTruck,
            title: "Fast Delivery",
            desc: "Quick and secure nationwide delivery straight to your doorstep.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100"
          >
            <item.Icon size={48} className="text-[#DF5E00] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0C1172] mb-3">
              {item.title}
            </h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Offices & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-[#DF5E00]" />
            <h3 className="text-xl font-bold text-[#0C1172]">Our Offices</h3>
          </div>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <div>
              <p className="font-bold text-[#0C1172]">Office 1 (FUTA South Gate):</p>
              <p>Offices 21 &amp; 39 Ogunleye Shopping Complex, Opposite Woleph Hostel, Oba-kekere Futa South gate Entrance, Akure.</p>
            </div>
            <div>
              <p className="font-bold text-[#0C1172]">Office 2 (Oba Adesida Road):</p>
              <p>Ground Floor 3, Felicia Mall Complex, adjacent Recabim Mtn office Oba Adesida road, Akure, Ondo State, Nigeria.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-[#DF5E00]" />
              <h3 className="text-xl font-bold text-[#0C1172]">Get In Touch</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <span className="font-bold text-[#0C1172]">Phone 1:</span>
                <a href="tel:08034378180" className="hover:text-[#0C1172] transition-colors">08034378180</a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-bold text-[#0C1172]">Phone 2:</span>
                <a href="tel:08142528191" className="hover:text-[#0C1172] transition-colors">08142528191</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#111344]" />
                <a href="mailto:Admin@mobiletrends.ng" className="hover:text-[#0C1172] transition-colors font-medium">
                  Admin@mobiletrends.ng
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center bg-gradient-to-r from-[#0C1172] to-[#1a2299] rounded-2xl p-12 text-white shadow-xl"
      >
        <h2 className="text-3xl font-extrabold mb-4">
          Ready to Upgrade Your Tech?
        </h2>
        <p className="text-lg mb-6 text-blue-100">
          Join thousands of happy customers enjoying authentic gadgets at unbeatable prices.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            className="bg-[#111344] text-white font-bold hover:bg-[#0C1172] transition-all duration-300 shadow-lg"
          >
            <Link to="/shop/listing">Shop Now</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white hover:text-[#0C1172] transition-all duration-300"
          >
            <a href="mailto:Admin@mobiletrends.ng">Contact Us</a>
          </Button>
        </div>
      </motion.div>

      {/* Accordion for Policies */}
      <Accordion type="single" collapsible className="mt-12">
        <AccordionItem value="return-policy">
          <AccordionTrigger className="text-[#0C1172] font-bold">
            Return Policy
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              We offer a 7-day return policy for all products. If you&apos;re not satisfied with your purchase, you can return it in its original condition for a full refund or exchange.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery-info">
          <AccordionTrigger className="text-[#0C1172] font-bold flex items-center gap-2">
            Delivery Information
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              Our delivery time is <strong>2-3 business days</strong>. We ensure quick and secure shipping so you receive your gadgets in top condition. Tracking details will be provided once your order is shipped.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="terms">
          <AccordionTrigger className="text-[#0C1172] font-bold">
            Terms and Conditions
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              By using our website, you agree to our terms and conditions. All products are subject to availability.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutPage;
