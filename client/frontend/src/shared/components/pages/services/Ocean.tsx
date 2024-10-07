'use client'

import React from 'react';
import  Player  from 'lottie-react';
import oceanAnimation from '@/src/animations/ocean.json';
import Navbar from '../../home/Navbar';

const OceanFreight = () => {
  return (
    <div className="navbar bg-white shadow-lg sticky top-0 z-10">
    {/* Navbar */}
    <Navbar />
    <div className="min-h-screen bg-blue-100 py-20">
      <div className="container mx-auto px-4">
        {/* Section 1: Introduction */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <Player
                autoplay
                loop
                animationData={oceanAnimation}
                style={{ height: '400px', width: '400px' }}
              />
            </div>
            <div className="w-full md:w-1/2 md:ml-8">
              <h1 className="text-5xl font-bold mb-6 text-gray-800">Ocean Freight Services</h1>
              <p className="text-lg text-gray-600 mb-4">
                Our Ocean Freight service offers cost-effective shipping for large and bulk goods.
                We provide comprehensive coverage with a wide network of global ports.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Benefits */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Advantages of Ocean Freight</h2>
          <ul className="text-lg text-gray-600 space-y-4">
            <li>Best solution for bulk shipments at an affordable cost.</li>
            <li>Wide global port coverage ensuring flexibility.</li>
            <li>Environmentally friendly compared to air freight.</li>
          </ul>
        </section>

        {/* Section 3: Our Global Network */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Our Global Network</h2>
          <p className="text-lg text-gray-600 mb-4">
            With partnerships in major ports around the world, our ocean freight services ensure
            smooth and efficient transportation of your goods.
          </p>
        </section>

        {/* Section 4: Request a Quote */}
        <section>
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">Request a Quote</h2>
          <p className="text-lg text-gray-600 mb-4">
            To learn more about our ocean freight services and pricing, contact us today.
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

export default OceanFreight;
