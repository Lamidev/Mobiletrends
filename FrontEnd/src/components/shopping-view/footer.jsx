'use client';

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Phone, Mail } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { siteConfig } from "@/config/site";

const Footer = () => {
  return (
    <div className="w-full bg-[#fafaf8] text-[#20231e] font-body mt-auto border-t border-[#daddd4]">
      {/* 1. SWOT-Style Walk-In Store & Contact Section */}
      <section
        id="contact"
        className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))] pt-16 md:pt-24 pb-16"
      >
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[#62665d] text-[10px] tracking-[2.2px] font-semibold mb-4 uppercase">
              WALK-IN STORES &amp; NATIONWIDE LOGISTICS
            </p>
            <h2 className="font-manrope text-[clamp(32px,3.7vw,48px)] leading-[1.19] tracking-[-2px] font-semibold text-[#20231e] m-0">
              Visit us in Akure.
              <br />
              Or order with nationwide waybill.
            </h2>
          </div>

          <a
            href="https://wa.me/2348034378180?text=Hi%20Mobiletrends%2C%20I'd%20like%20to%20make%20a%20gadget%20enquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto inline-flex items-center gap-2.5 px-5 py-3 rounded-[4px] border border-[#b9beb1] bg-white/80 hover:bg-[#eceee7] hover:border-[#7b826f] text-[12px] font-medium text-[#20231e] transition-colors"
          >
            <span>Send an enquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3-Column Contact Grid matching SWOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] gap-10 lg:gap-[65px] mt-12">
          {/* Column 1: Physical Stores */}
          <div>
            <span className="block text-[9px] tracking-[2.2px] font-semibold uppercase text-[#62665d] mb-5">
              PHYSICAL STORES IN AKURE
            </span>
            <Link to="/shop/home" className="inline-flex items-center gap-2.5 mb-3 group">
              <img
                src="/logo.jpg"
                alt="Mobiletrends Systems Limited"
                className="h-8 w-8 object-contain mix-blend-multiply shrink-0"
              />
              <h3 className="font-manrope text-[17px] font-semibold text-[#20231e] group-hover:text-[#0C1172] transition-colors m-0">
                Mobiletrends Systems Limited
              </h3>
            </Link>
            <address className="not-italic text-[12px] leading-[1.75] text-[#62665d] space-y-2.5">
              <div>
                <strong className="text-[#20231e] font-semibold">Office 1: </strong>
                Offices 21 &amp; 39 Ogunleye Shopping Complex, Opp. Woleph Hostel,
                Oba-kekere FUTA South Gate Entrance, Akure.
              </div>
              <div>
                <strong className="text-[#20231e] font-semibold">Office 2: </strong>
                Ground Floor 3, Felicia Mall Complex, Adj. Recabim MTN Office,
                Oba Adesida Road, Akure, Ondo State.
              </div>
            </address>
            <a
              href="https://maps.google.com/?q=Oba+Adesida+Road+Akure+Ondo+State"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#111344] hover:text-[#0C1172] transition-colors"
            >
              <span>Get directions on Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Column 2: Let's Talk Tech */}
          <div>
            <span className="block text-[9px] tracking-[2.2px] font-semibold uppercase text-[#62665d] mb-5">
              LET&apos;S TALK TECH
            </span>
            <a
              href="tel:+2348034378180"
              className="font-manrope text-[21px] font-semibold text-[#20231e] hover:text-[#0C1172] transition-colors flex items-center gap-2.5 mb-2.5"
            >
              <Phone className="w-[17px] h-[17px] text-[#62665d]" />
              <span>0803 437 8180</span>
            </a>
            <a
              href="tel:+2348142528191"
              className="text-[12px] text-[#62665d] hover:text-[#20231e] transition-colors flex items-center gap-2.5 mb-2.5"
            >
              <Phone className="w-[15px] h-[15px] text-[#62665d]" />
              <span>0814 252 8191</span>
            </a>
            <a
              href="mailto:Admin@mobiletrends.ng"
              className="text-[12px] text-[#62665d] hover:text-[#20231e] transition-colors flex items-center gap-2.5"
            >
              <Mail className="w-[15px] h-[15px] text-[#62665d]" />
              <span>Admin@mobiletrends.ng</span>
            </a>
            <a
              href="https://wa.me/2348034378180?text=Hi%20Mobiletrends%2C%20I'd%20like%20to%20make%20a%20purchase%20or%20order%20enquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-[#111344] hover:text-[#0C1172] transition-colors"
            >
              <FaWhatsapp className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Column 3: Keep Up With Mobiletrends */}
          <div className="md:col-span-2 lg:col-span-1 max-w-[400px] lg:max-w-none w-full">
            <span className="block text-[9px] tracking-[2.2px] font-semibold uppercase text-[#62665d] mb-5">
              KEEP UP WITH MOBILETRENDS
            </span>
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 border-b border-[#daddd4] pb-2.5 mb-2.5 group"
            >
              <span className="inline-flex items-center gap-2.5 text-[12px] text-[#20231e] group-hover:text-[#0C1172] transition-colors">
                <FaInstagram className="w-4 h-4" />
                <span>Instagram</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#62665d]">
                <span>@mobiletrends</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </a>

            <a
              href={siteConfig.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 border-b border-[#daddd4] pb-2.5 mb-2.5 group"
            >
              <span className="inline-flex items-center gap-2.5 text-[12px] text-[#20231e] group-hover:text-[#0C1172] transition-colors">
                <FaFacebook className="w-4 h-4" />
                <span>Facebook</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#62665d]">
                <span>@mobiletrends</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </a>

            <a
              href={siteConfig.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 border-b border-[#daddd4] pb-2.5 group"
            >
              <span className="inline-flex items-center gap-2.5 text-[12px] text-[#20231e] group-hover:text-[#0C1172] transition-colors">
                <FaTwitter className="w-4 h-4" />
                <span>X</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#62665d]">
                <span>@mobiletrends</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SWOT-Style Site Footer Bar */}
      <footer className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))] border-t border-[#daddd4] py-6">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] text-[#62665d]">
          <span>
            &copy; {new Date().getFullYear()} Mobiletrends Systems Limited. All
            rights reserved.
          </span>
          <span>Reliable tech starts with an honest conversation.</span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
