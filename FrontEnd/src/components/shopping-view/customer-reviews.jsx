'use client';
import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Chinedu Nwosu",
      comment:
        "Absolutely love my purchase! The quality exceeded my expectations and delivery was super fast. I’ll definitely shop here again.",
      avatar:
        "https://images.pexels.com/photos/18779012/pexels-photo-18779012.jpeg?cs=srgb&dl=pexels-johnson-ambisa-547930445-18779012.jpg&fm=jpg",
    },
    {
      id: 2,
      name: "Tunde Olaleye",
      comment:
        "The product quality is top-notch and it arrived earlier than expected. Everything worked perfectly right out of the box.",
      avatar:
        "https://media.istockphoto.com/id/1671407049/photo/authentic-portrait-of-handsome-smiling-african-american-man-looking-at-camera.jpg?s=612x612&w=0&k=20&c=x_uWUbJGQb8bT8uKaU15va-Xk9xYYogyLVxyf6V_WLI=",
    },
    {
      id: 3,
      name: "Adanna Okafor",
      comment:
        "This is my second order and I’m just as impressed as the first time. Excellent experience every single time.",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQesas79ivum649KFBvwjFgSL_TNxQ0-QLF4Q&s",
    },
    {
      id: 4,
      name: "Blessing Adekunle",
      comment:
        "The customer service team was so helpful and polite. My order arrived neatly packaged and right on time!",
      avatar:
        "https://www.okayafrica.com/media-library/kolade-mayowa-bolade-and-ore-akinde-are-running-thriving-businesses-built-on-the-back-of-the-craft-they-love-crochet.png?id=53156379&width=1245&height=700&quality=80&coordinates=0%2C0%2C0%2C158",
    },
    {
      id: 5,
      name: "Fatima Abdullahi",
      comment:
        "I was really happy with the purchase. The design and build are even better than in the pictures. Highly recommend!",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVW80AM_12isldNgqWiU9W5Mhtd43bor_j4FFfQxW1IialehoXTXks54fkaXvYiwRrFp4&usqp=CAU",
    },
    {
      id: 6,
      name: "Chidinma Eze",
      comment:
        "From ordering to delivery, everything went smoothly. The product quality is superb, and I’ll definitely tell my friends!",
      avatar:
        "https://the-ibg.com/wp-content/uploads/2015/12/12295766_10204490386653577_1691251345_o.jpg?w=760&h=946",
    },
    {
      id: 7,
      name: "Chukwuemeka Okoro",
      comment:
        "Truly impressed with the authenticity of the products. It’s rare to find such reliability these days — kudos!",
      avatar:
        "https://www.bellanaija.com/wp-content/uploads/2020/02/John-Ogba-Ifeakanwa.jpg",
    },
    {
      id: 8,
      name: "Saliu Mohammed",
      comment:
        "The team was responsive and professional. My package arrived earlier than expected and in great condition.",
      avatar:
        "https://images.unsplash.com/photo-1723221890385-6949a72be9da?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmlnZXJpYW4lMjBtYW58ZW58MHx8MHx8fDA%3D",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
          What Our Customers Say
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Hear from some of our happy customers across Nigeria
        </p>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-full">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-peach-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      review.name
                    )}&background=random&color=fff&size=128`;
                  }}
                />
                <h4 className="font-semibold text-gray-800 text-lg mb-3 uppercase tracking-tight">
                  {review.name}
                </h4>
                <div className="relative mb-4">
                  <FaQuoteLeft className="text-peach-100 text-4xl absolute -top-2 -left-2 opacity-60" />
                  <p className="text-gray-600 relative z-10 pl-6 leading-relaxed italic font-medium">
                    {review.comment}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
