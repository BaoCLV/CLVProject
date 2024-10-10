'use client'

import React from 'react';
import Player from 'lottie-react';
import trainAnimation from '@/src/animations/truck.json';
import Navbar from '../../home/Navbar';

const TrainFreight = () => {
  return (
    <div className="navbar bg-white shadow-lg sticky top-0 z-10">
    {/* Navbar */}
    <Navbar />
    <div className="min-h-screen bg-green-100 py-20">
      <div className="container mx-auto px-4">
        {/* Section 1: Introduction */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <Player
                autoplay
                loop
                animationData={trainAnimation}
                style={{ height: '400px', width: '400px' }}
              />
            </div>
            <div className="w-full md:w-1/2 md:ml-8">
              <h1 className="text-5xl font-bold mb-6 text-gray-800">Train Freight Services</h1>
              <p className="text-lg text-gray-600 mb-4">
                Our Train Freight service provides a cost-efficient solution for long-distance
                transportation of goods. We offer reliable and eco-friendly shipping across regions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Benefits */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Why Choose Train Freight?</h2>
          <ul className="text-lg text-gray-600 space-y-4">
            <li>Low-cost solution for transporting large volumes over long distances.</li>
            <li>Environmentally friendly alternative to road or air freight.</li>
            <li>Reliable schedules and timely deliveries.</li>
          </ul>
        </section>

        {/* Section 3: Our Routes */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Nationwide Coverage</h2>
          <p className="text-lg text-gray-600 mb-4">
            We operate across key rail routes, connecting major cities and regions efficiently for
            freight transportation.
          </p>
        </section>

        {/* Section 4: Contact */}
        <section>
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-4">
            For more information about our train freight services, contact us today.
          </p>
          <a
            href="/contact"
            className="text-white bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
    </div>
  );
};

export default TrainFreight;
