"use client";

import React from "react";
import Player from "lottie-react";
import airplaneAnimation from "@/src/animations/airplane.json";
import Navbar from "../../home/Navbar";
import Footer from "../../Footer";
import img from "next/image";

const AirFreight = () => {
  return (
    <div className="bg-white">
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          {/* Section 1: Introduction */}
          <section className="w-full mb-16 transition-all duration-700 ease-in-out transform hover:scale-105">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2">
                <Player
                  autoplay
                  loop
                  animationData={airplaneAnimation}
                  style={{ height: "400px", width: "400px" }}
                />
              </div>
              <div className="w-full md:w-1/2 md:ml-8">
                <h1 className="text-5xl font-bold mb-6 text-gray-800">
                  Air Freight Services
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Our Air Freight service provides fast and reliable global
                  coverage. Whether you are shipping goods across the country or
                  around the world, we ensure timely delivery.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Features with img */}
          <section className="w-full mb-16 transition-all duration-700 bg-cyan-300 ease-in-out transform hover:scale-105">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2">
                <img
                  src="/img/air-freight-features.jpg"
                  alt="Air Freight Features"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="w-full md:w-1/2 md:ml-8">
                <h2 className="text-4xl font-semibold mb-6 text-gray-800">
                  Why Choose Air Freight?
                </h2>
                <ul className="text-lg text-gray-600 space-y-4">
                  <li>Fastest shipping option for urgent deliveries.</li>
                  <li>Global network ensuring timely delivery worldwide.</li>
                  <li>Advanced tracking systems for real-time updates.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: How It Works with img */}
          <section className="w-full mb-16 transition-all duration-700 ease-in-out transform hover:scale-105">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 md:ml-8">
                <h2 className="text-4xl font-semibold mb-6 text-gray-800">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Our air freight services are tailored to meet your specific
                  needs. From small packages to large shipments, we provide a
                  range of options, including express shipping and chartered
                  flights.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <img
                  src="/img/how-it-works-air-freight.jpg"
                  alt="How Air Freight Works"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Contact with img */}
          <section className="w-full mb-16 transition-all duration-700 bg-blue-400 ease-in-out transform hover:scale-105">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2">
                <img
                  src="/img/contact-air-freight.jpg"
                  alt="Contact Us"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="w-full md:w-1/2 md:ml-8">
                <h2 className="text-4xl font-semibold mb-6 text-gray-800">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  For more information or to get a quote, contact our air
                  freight specialists today.
                </p>
                <a
                  href="/contact"
                  className="text-white bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AirFreight;
