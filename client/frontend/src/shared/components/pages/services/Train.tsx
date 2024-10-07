'use client'

import React from 'react';
import  Player  from 'lottie-react';
import roadAnimation from '@/src/animations/train.json';
import Navbar from '../../home/Navbar';

const RoadFreight = () => {
  return (
    <div className="navbar bg-white shadow-lg sticky top-0 z-10">
    {/* Navbar */}
    <Navbar />
    <div className="min-h-screen bg-yellow-100 py-20">
      <div className="container mx-auto px-4">
        {/* Section 1: Introduction */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <Player
                autoplay
                loop
                animationData={roadAnimation}
                style={{ height: '600px', width: '600px' }}
              />
            </div>
            <div className="w-full md:w-1/2 md:ml-8">
              <h1 className="text-5xl font-bold mb-6 text-gray-800">Road Freight Services</h1>
              <p className="text-lg text-gray-600 mb-4">
                Our Road Freight service ensures timely and secure transportation of goods across
                the country. We handle small packages to large cargo with efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Advantages */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Why Choose Road Freight?</h2>
          <ul className="text-lg text-gray-600 space-y-4">
            <li>Ideal for domestic shipments with flexible schedules.</li>
            <li>Cost-effective for regional deliveries.</li>
            <li>Tracking and monitoring ensure peace of mind.</li>
          </ul>
        </section>

        {/* Section 3: Coverage */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Nationwide Coverage</h2>
          <p className="text-lg text-gray-600 mb-4">
            Our road freight network covers all major cities and regions, providing comprehensive
            services across the country.
          </p>
        </section>

        {/* Section 4: Get a Quote */}
        <section>
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Request a Quote</h2>
          <p className="text-lg text-gray-600 mb-4">
            For more information about our road freight services, contact us for a customized quote.
          </p>
          <a
            href="/contact"
            className="text-white bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get a Quote
          </a>
        </section>
      </div>
    </div>
    </div>
  );
};

export default RoadFreight;
