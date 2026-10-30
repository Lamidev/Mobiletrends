'use client';

import React, { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface FaqItemData {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemData[] = [
  {
    question: "Are your UK-used and foreign gadgets thoroughly tested?",
    answer:
      "Yes. Every device passes a strict hardware and diagnostics audit before listing: authentic display verification, battery cycle and health status, motherboard health, camera modules, biometric sensors (Face ID, Touch ID, fingerprint), ports, and Wi-Fi/cellular antennas. We provide clear, high-resolution photos and diagnostic reports on WhatsApp prior to payment.",
  },
  {
    question: "Do your devices come with a warranty?",
    answer:
      "Yes. All foreign UK-used laptops and smartphones include our store testing warranty to ensure complete peace of mind. If any non-accidental hardware malfunction arises during the warranty period, we repair or replace it promptly. Brand-new, factory-sealed gadgets also carry full official manufacturer warranties.",
  },
  {
    question: "Can I inspect and collect in person at your store?",
    answer:
      "Absolutely. You can walk into either of our physical stores in Akure (Ogunleye Shopping Complex at FUTA South Gate, or Felicia Mall Complex on Oba Adesida Road). You can hold, benchmark, check battery health, and test any device in person before completing your purchase.",
  },
  {
    question: "How does interstate delivery and waybill work?",
    answer:
      "We ship nationwide to Lagos, Ibadan, Abuja, Port Harcourt, Enugu, and all states across Nigeria using reputable logistics partners (including GIG Logistics, interstate park couriers, and insured riders). Every parcel is bubble-wrapped, video-documented before dispatch, and provided with trackable waybill information.",
  },
  {
    question: "Do you accept device upgrades or trade-ins?",
    answer:
      "Yes, we offer clean upgrade deals. Bring your current laptop, MacBook, or iPhone to our store or send photos and specifications via WhatsApp. We will evaluate its physical and technical state, determine an honest valuation, and apply it as balance toward your upgrade.",
  },
  {
    question: "Can you source a specific specification that isn't on the shelf?",
    answer:
      "Yes. If you need a specific configuration—such as an Apple Silicon M-Max chip, 32GB/64GB RAM developer rig, dual physical SIM iPhone, or high-tier gaming GPU—simply message our team on WhatsApp. We will source, test, and deliver it within 24 to 72 hours.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#fafaf8] border-t border-[#daddd4] font-body"
    >
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))] py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-9 lg:gap-[56px] items-start">
        {/* Left Sticky Intro Column */}
        <div className="lg:sticky lg:top-[110px]">
          <p className="text-[#62665d] text-[10px] tracking-[2.2px] font-semibold mb-4 uppercase">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="font-manrope text-[clamp(32px,3.7vw,48px)] leading-[1.19] tracking-[-2px] font-semibold text-[#20231e] m-0">
            Answers before you buy.
          </h2>
          <p className="mt-4 text-[14px] leading-[1.8] text-[#62665d] max-w-[420px]">
            Everything you need to know about testing standards, warranties,
            nationwide waybill delivery, and device upgrades at Mobiletrends.
          </p>

          <div className="mt-7 p-[22px] bg-white border border-[#daddd4] rounded-[6px]">
            <h3 className="font-manrope text-[15px] font-semibold text-[#20231e] mb-1.5">
              Have a different question?
            </h3>
            <p className="text-[13px] leading-[1.6] text-[#62665d] mb-4">
              Our team is on WhatsApp to check live inventory, confirm battery
              stats, or help you pick the right machine.
            </p>
            <a
              href="https://wa.me/2348034378180?text=Hi%20Mobiletrends%2C%20I'd%20like%20to%20ask%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#DF5E00] hover:text-[#0C1172] transition-colors"
            >
              <span>Chat with our team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Accordion List */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-[6px] overflow-hidden border transition-colors duration-200 ${
                  isOpen
                    ? "bg-[#f0f1ed] border-[#44443e]"
                    : "bg-white border-[#daddd4] hover:border-[#b9beb1]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-[18px] sm:px-6 sm:py-5 font-manrope text-[14.5px] sm:text-[15px] font-semibold leading-[1.4] text-[#20231e] cursor-pointer flex items-center justify-between gap-4 text-left select-none"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-[18px] h-[18px] shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 text-[#DF5E00]"
                        : "text-[#62665d]"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-[18px] sm:px-6 sm:pb-[22px] pt-3 text-[13.5px] leading-[1.8] text-[#62665d] border-t border-black/[0.05]">
                    <p className="m-0">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

