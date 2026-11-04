'use client';

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

interface ReviewItem {
  name: string;
  meta: string;
  isLocalGuide?: boolean;
  avatar: string;
  body: string;
  highlight: string;
}

const BUYING_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Browse & add to cart",
    description:
      "Explore verified smartphones, laptops, gaming consoles, and accessories with transparent Naira (₦) pricing and honest specs.",
  },
  {
    number: "02",
    title: "Seamless & secure checkout",
    description:
      "Pay online in seconds via encrypted Paystack checkout, or use our 1-click WhatsApp order to confirm live battery stats with our team.",
  },
  {
    number: "03",
    title: "Swift delivery or store pickup",
    description:
      "Test and collect at our Akure stores, get same-day doorstep delivery in Akure, or receive fast, insured nationwide waybill delivery.",
  },
];

const REVIEWS_DATA: ReviewItem[] = [
  {
    name: "Sogunro Ayomide",
    meta: "Verified Customer · Akure",
    avatar: "/reviews/sogunro-ayomide.jpg",
    body: "“I had an excellent experience with this gadgets plug. The products are original, high quality, and exactly as described. What really stood out was how swift the service was—my order was processed and delivered faster than expected. Their customer service is topnotch, very responsive, polite, and genuinely helpful, making sure I was satisfied every step of the way... I highly recommend Mobiletrends to anyone looking for reliable products and stress-free service 💯💯”",
    highlight: "Original Products & Swift Delivery",
  },
  {
    name: "Angel Opoku",
    meta: "Client since 2023 · Repeat Buyer",
    avatar: "/reviews/angel-opoku.jpg",
    body: "“I have bought gadgets from Mobiletrends since 2023 and they are the surest plug. What's beautiful is not just that you can trust that you are getting what you pay for, it's that they genuinely care about offering you the best for your money. Consulting with them is really helpful because they really understand gadgets and which ones are best suited for each use case. Again, surest plug!”",
    highlight: "Long-term Client Trust",
  },
  {
    name: "Mathew Oguntayo",
    meta: "Google Local Guide",
    isLocalGuide: true,
    avatar: "/reviews/mathew-oguntayo.jpg",
    body: "“Talk and Do, that's what they are. Reliable, Dependable and Trustworthy. Ordered online and had my machine delivered intact without a single hitch.”",
    highlight: "Talk and Do · 100% Reliable",
  },
  {
    name: "Davie Fountains",
    meta: "Customer for 2+ Years",
    avatar: "/reviews/davie-fountains.jpg",
    body: "“The best plug I use for my gadgets and workstations! Been consistent with them for over 2 years and will continue to be. Bought my Starlink and MacBook from them amongst many other things. They are reliable and excellent!!”",
    highlight: "Starlink & Gadgets Sourcing",
  },
  {
    name: "Ilori Folusho",
    meta: "Verified Customer",
    avatar: "/reviews/ilori-folusho.jpg",
    body: "“It’s not even overrated to say Mobiletrends is the best in this business. Seamless checkout experience, great customer service, and authentic products too.”",
    highlight: "Best in the Business",
  },
];

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Mobiletrends+Systems+Limited+Akure";

function GoogleGIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 262"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285f4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34a853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#fbbc05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
      />
      <path
        fill="#eb4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}

function GoogleMapsPinIcon() {
  return (
    <svg
      viewBox="0 0 256 367"
      width="15"
      height="21"
      className="w-[15px] h-[21px] shrink-0 inline-block align-middle"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#34a853"
        d="M70.585 271.865a371 371 0 0 1 28.911 42.642c7.374 13.982 10.448 23.463 15.837 40.31c3.305 9.308 6.292 12.086 12.714 12.086c6.998 0 10.173-4.726 12.626-12.035c5.094-15.91 9.091-28.052 15.397-39.525c12.374-22.15 27.75-41.833 42.858-60.75c4.09-5.354 30.534-36.545 42.439-61.156c0 0 14.632-27.035 14.632-64.792c0-35.318-14.43-59.813-14.43-59.813l-41.545 11.126l-25.23 66.451l-6.242 9.163l-1.248 1.66l-1.66 2.078l-2.914 3.319l-4.164 4.163l-22.467 18.304l-56.17 32.432z"
      />
      <path
        fill="#fbbc04"
        d="M12.612 188.892c13.709 31.313 40.145 58.839 58.031 82.995l95.001-112.534s-13.384 17.504-37.662 17.504c-27.043 0-48.89-21.595-48.89-48.825c0-18.673 11.234-31.501 11.234-31.501l-64.489 17.28z"
      />
      <path
        fill="#4285f4"
        d="M166.705 5.787c31.552 10.173 58.558 31.53 74.893 63.023l-75.925 90.478s11.234-13.06 11.234-31.617c0-27.864-23.463-48.68-48.81-48.68c-23.969 0-37.735 17.475-37.735 17.475v-57z"
      />
      <path
        fill="#1a73e8"
        d="M30.015 45.765C48.86 23.218 82.02 0 127.736 0c22.18 0 38.89 5.823 38.89 5.823L90.29 96.516H36.205z"
      />
      <path
        fill="#ea4335"
        d="M12.612 188.892S0 164.194 0 128.414c0-33.817 13.146-63.377 30.015-82.649l60.318 50.759z"
      />
    </svg>
  );
}

function FiveStarsRow() {
  return (
    <div
      className="flex items-center gap-[3px] shrink-0"
      aria-label="5 out of 5 stars"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="w-4 h-4 fill-[#f59e0b] stroke-[#f59e0b] shrink-0"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function BuyingProcessAndReviews() {
  // Count-up animation for "10+"
  const [decadeCount, setDecadeCount] = useState(10);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);

  // Slider state for reviews
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setCardsPerPage(1);
      } else if (width <= 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const maxIndex = Math.max(0, REVIEWS_DATA.length - cardsPerPage);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsPerPage, maxIndex, currentIndex]);

  useEffect(() => {
    const el = experienceRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            let start = 0;
            const target = 10;
            const duration = 900;
            const startTime = performance.now();

            const tick = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const val = Math.round(start + (target - start) * eased);
              setDecadeCount(val);
              if (progress < 1) {
                requestAnimationFrame(tick);
              }
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
      } else {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    }
    touchStartXRef.current = null;
  };

  const gapPx = cardsPerPage === 1 ? 14 : 20;
  const totalPages = maxIndex + 1;

  return (
    <>
      {/* SECTION 1: SEAMLESS & TRANSPARENT BUYING PROCESS + A DECADE OF EARNED CUSTOMER TRUST */}
      <section className="w-full bg-[#fafaf8] py-14 sm:py-20 lg:py-24 font-body">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))]">
          {/* Buying Process Heading */}
          <div className="mb-8 sm:mb-11">
            <p className="text-[9px] sm:text-[10px] tracking-[2px] sm:tracking-[2.2px] font-semibold uppercase text-[#62665d] mb-3 sm:mb-4">
              SEAMLESS &amp; TRANSPARENT BUYING PROCESS
            </p>
            <h2 className="font-manrope text-[26px] sm:text-[32px] lg:text-[35px] leading-[1.19] tracking-[-1.4px] font-semibold text-[#20231e] m-0">
              Getting your gadget is simple.
            </h2>
          </div>

          {/* 3-Step Buying Flow (SWOT .steps layout: row on mobile <=640px, 3 cols on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px] md:gap-[25px] lg:gap-[40px]">
            {BUYING_STEPS.map((step) => (
              <article
                key={step.number}
                className="flex flex-row md:flex-col lg:flex-row items-start gap-[23px] md:gap-[15px] lg:gap-[20px]"
              >
                <span className="font-manrope text-[35px] font-semibold leading-[1.1] tracking-[-2px] text-[#DF5E00] shrink-0 select-none">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-manrope text-[15px] md:text-[14px] lg:text-[15px] font-semibold leading-[1.35] text-[#20231e] m-0">
                    {step.title}
                  </h3>
                  <p className="font-body text-[12.5px] md:text-[11.5px] lg:text-[12.5px] leading-[1.65] text-[#62665d] mt-[7px] sm:mt-[9px] max-w-[320px] lg:max-w-[260px] m-0">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* A Decade of Earned Customer Trust (SWOT .experience block) */}
          <div
            ref={experienceRef}
            className="grid grid-cols-1 md:grid-cols-2 items-center gap-[26px] md:gap-[40px] lg:gap-[70px] mt-[52px] sm:mt-[65px] lg:mt-[85px] pt-[38px] sm:pt-[45px] lg:pt-[50px] border-t border-[#daddd4]"
          >
            {/* Giant 10+ Number */}
            <div className="font-manrope text-[138px] sm:text-[145px] lg:text-[180px] tracking-[-10px] lg:tracking-[-13px] font-medium leading-none text-[#DF5E00] select-none">
              <span>{decadeCount}</span>
              <span className="text-[74px] sm:text-[78px] lg:text-[95px] align-top leading-[1.7] tracking-normal">
                +
              </span>
              <small className="block font-body text-[9.5px] sm:text-[10px] tracking-[3px] font-semibold text-[#62665d] mt-[12px] sm:mt-[14px] uppercase">
                YEARS IN NIGERIAN TECH
              </small>
            </div>

            {/* Copy & Link to #reviews */}
            <div>
              <h3 className="font-manrope text-[26px] sm:text-[28px] lg:text-[31px] leading-[1.22] tracking-[-1px] font-semibold text-[#20231e] m-0">
                A decade of earned{" "}
                <br className="hidden sm:inline" />
                customer trust.
              </h3>
              <p className="font-body text-[13px] sm:text-[13.5px] leading-[1.7] text-[#62665d] mt-[14px] sm:mt-[16px] max-w-[420px] mb-0">
                For over 10 years, we&apos;ve helped developers, remote workers,
                creators, students, and businesses across Akure, Ondo State,
                Lagos, and nationwide get dependable, original gear.
              </p>
              <a
                href="#reviews"
                className="inline-flex items-center gap-[12px] text-[13px] font-semibold text-[#111344] hover:text-[#0C1172] mt-[20px] sm:mt-[24px] transition-colors group"
              >
                <span>Read our verified reviews</span>
                <ArrowRight className="w-[17px] h-[17px] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SWOT-STYLE VERIFIED GOOGLE REVIEWS SECTION (#reviews) */}
      <section
        id="reviews"
        className="w-full bg-[#f3f4ef] border-t border-[#daddd4] py-14 sm:py-20 lg:py-24 font-body scroll-mt-20"
      >
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))]">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6">
            <div>
              <div className="inline-flex items-center justify-center mb-3.5 leading-none">
                <GoogleGIcon className="w-8 h-8" />
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-[2px] sm:tracking-[2.2px] font-semibold uppercase text-[#62665d] mb-3 sm:mb-4">
                VERIFIED GOOGLE REVIEWS · 5.0 RATING
              </p>
              <h2 className="font-manrope text-[clamp(28px,3.7vw,46px)] leading-[1.18] tracking-[-1.8px] font-semibold text-[#20231e] m-0">
                Real words from
                <br />
                real tech lovers.
              </h2>
            </div>

            <div className="w-full sm:w-auto flex items-end">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[47px] px-5 py-3 rounded-[5px] border border-[#b8bdb0] bg-white hover:bg-[#fafaf8] hover:border-[#20231e] text-[#20231e] text-[12px] font-semibold transition-all shrink-0"
              >
                <GoogleMapsPinIcon />
                <span>View on Google Maps</span>
                <ArrowUpRight className="w-[16px] h-[16px] text-[#62665d]" />
              </a>
            </div>
          </div>

          {/* Reviews Summary Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-8 p-5 sm:p-6 lg:px-8 bg-white border border-[#daddd4] rounded-[10px] mt-7 sm:mt-10 mb-6 sm:mb-7">
            <div className="flex items-center gap-3.5 sm:gap-[18px] shrink-0">
              <span className="font-manrope text-[42px] sm:text-[46px] font-bold leading-none tracking-[-1.5px] text-[#20231e]">
                5.0
              </span>
              <div className="flex flex-col gap-[5px] min-w-0">
                <FiveStarsRow />
                <span className="text-[12px] sm:text-[13px] font-semibold text-[#62665d] leading-[1.4]">
                  100% 5-Star Rating on Google
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] lg:w-[1px] lg:h-[44px] bg-[#daddd4] shrink-0" />

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-x-6 sm:gap-y-3">
              <span className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-medium text-[#62665d]">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                Verified Google Business Listing
              </span>
              <span className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-medium text-[#62665d]">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                Original Products &amp; Honest Guidance
              </span>
              <span className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-medium text-[#62665d]">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                Fast Nationwide Waybill &amp; In-Store Pickup
              </span>
            </div>
          </div>

          {/* Reviews Carousel */}
          <div
            className="relative w-full"
            role="region"
            aria-roledescription="carousel"
            aria-label="Customer Reviews"
          >
            <div
              className="overflow-hidden w-full rounded-[10px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex items-stretch transition-transform duration-500 ease-out will-change-transform"
                style={{
                  gap: `${gapPx}px`,
                  transform: `translate3d(calc(-${currentIndex} * ((100% + ${gapPx}px) / ${cardsPerPage})), 0, 0)`,
                }}
              >
                {REVIEWS_DATA.map((review, idx) => (
                  <article
                    key={review.name}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${idx + 1} of ${REVIEWS_DATA.length}`}
                    style={{
                      flex: `0 0 calc((100% - ${(cardsPerPage - 1) * gapPx}px) / ${cardsPerPage})`,
                      maxWidth: `calc((100% - ${(cardsPerPage - 1) * gapPx}px) / ${cardsPerPage})`,
                    }}
                    className="bg-white border border-[#daddd4] hover:border-[#b8bdb0] rounded-[10px] p-[22px] sm:p-[26px] flex flex-col justify-between min-w-0 transition-all duration-200"
                  >
                    <div>
                      {/* Card Top */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 sm:gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-[42px] h-[42px] rounded-full bg-[#eef0e9] border border-[#daddd4] overflow-hidden shrink-0 grid place-items-center">
                            <img
                              src={review.avatar}
                              alt={review.name}
                              width={42}
                              height={42}
                              loading="lazy"
                              className="w-full h-full object-cover rounded-full block"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-manrope text-[15px] font-semibold leading-[1.25] text-[#20231e] m-0 truncate">
                              {review.name}
                            </h3>
                            <span className="block text-[12px] text-[#62665d] mt-[3px]">
                              {review.isLocalGuide ? (
                                <span className="inline-block bg-[#4285f4]/12 text-[#4285f4] px-1.5 py-[1px] rounded-[4px] text-[10px] font-semibold tracking-[0.2px]">
                                  {review.meta}
                                </span>
                              ) : (
                                review.meta
                              )}
                            </span>
                          </div>
                        </div>
                        <FiveStarsRow />
                      </div>

                      {/* Review Body */}
                      <p className="font-body text-[13.5px] sm:text-[13.5px] leading-[1.7] text-[#20231e] my-[18px]">
                        {review.body}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#daddd4] pt-3.5 text-[11.5px] text-[#62665d]">
                      <span className="inline-flex items-center gap-1.5">
                        <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>Google Review</span>
                      </span>
                      <span className="font-semibold text-[#DF5E00] text-left sm:text-right">
                        {review.highlight}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-7">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous reviews"
                className="w-[44px] h-[44px] rounded-[6px] bg-white border border-[#daddd4] hover:border-[#111344] text-[#20231e] hover:text-[#111344] inline-flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                className="flex items-center"
                role="tablist"
                aria-label="Review pages"
              >
                {Array.from({ length: totalPages }).map((_, pageIdx) => {
                  const isActive = pageIdx === currentIndex;
                  return (
                    <button
                      key={pageIdx}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Review page ${pageIdx + 1}`}
                      onClick={() => setCurrentIndex(pageIdx)}
                      className="grid place-items-center w-[28px] h-[44px] bg-transparent border-0 p-0 cursor-pointer"
                    >
                      <span
                        className={`block h-[8px] transition-all duration-300 ${
                          isActive
                            ? "w-[22px] rounded-full bg-[#111344]"
                            : "w-[8px] rounded-full bg-[#c5c9bd] hover:bg-[#62665d]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next reviews"
                className="w-[44px] h-[44px] rounded-[6px] bg-white border border-[#daddd4] hover:border-[#111344] text-[#20231e] hover:text-[#111344] inline-flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 mt-7 p-5 sm:p-6 lg:px-8 bg-white border border-[#daddd4] rounded-[10px]">
            <div>
              <h3 className="font-manrope text-[16px] sm:text-[17px] font-semibold text-[#20231e] m-0">
                Bought your gadget from Mobiletrends?
              </h3>
              <p className="font-body text-[12.5px] sm:text-[13px] text-[#62665d] mt-1 mb-0">
                Share your honest experience on our Google Maps business listing
                to help fellow techies make the right choice.
              </p>
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[47px] px-5 py-3 rounded-[5px] border border-[#b8bdb0] bg-[#fafaf8] hover:bg-white hover:border-[#20231e] text-[#20231e] text-[12px] font-semibold transition-all shrink-0 text-center"
            >
              <GoogleMapsPinIcon />
              <span>Write a review on Google Maps</span>
              <ArrowUpRight className="w-[16px] h-[16px] text-[#62665d]" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
