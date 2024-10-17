'use client'
import Image from "next/image";
import { useInView } from "../../../hooks/useInView";
import Footer from "../Footer";
import Navbar from "../home/Navbar";

const AboutPage = () => {
  const [refAbout, aboutInView] = useInView(0); 
  const [refMission, missionInView] = useInView(0.1); // Threshold set for Mission section
  const [refVision, visionInView] = useInView(0.1); // Threshold set for Vision section
  const [refTeam, teamInView] = useInView(0.1); // Threshold set for Team section

  return (

    <div className="bg-gray-50">
          <div className="navbar bg-white shadow-lg sticky top-0 z-10">
    {/* Navbar */}
    <Navbar />
    </div>
      {/* About Section */}
      <div ref={refAbout} className="bg-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          {/* Image Section with Slide-in from Left */}
          <div
            className={`w-full md:w-1/2 transition-transform duration-2000 ease-in-out transform ${
              aboutInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <Image
              src="/img/about.jpg"
              alt="About us"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Text Section with Slide-in from Bottom */}
          <div
            className={`w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 transition-transform duration-2000 ease-in-out transform ${
              aboutInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8">About Us</h2>
            <p className="text-lg text-gray-600 mb-4">
              CLVProject provides reliable transport and logistics solutions with a commitment
              to ensuring fast, efficient, and global coverage. We aim to simplify complex 
              logistics, making shipping, transportation, and delivery services accessible and 
              seamless for businesses of all sizes.
            </p>
            <p className="text-lg text-gray-600">
              With years of experience and a deep understanding of global markets, we bring 
              innovative solutions that drive success for our clients worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div ref={refMission} className="bg-blue-300 py-16">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between">
          {/* Text Section with Slide-in from Left */}
          <div
            className={`w-full md:w-1/2 transition-transform duration-2000 ease-in-out transform ${
              missionInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              Our mission is to empower businesses by providing comprehensive logistics 
              solutions that connect people and goods in an efficient, sustainable, and 
              innovative way. We are committed to being the most reliable and trusted 
              partner in the logistics industry.
            </p>
            <p className="text-lg text-gray-600">
              Whether you need air, ocean, or road freight services, we aim to be your 
              go-to provider for fast and dependable deliveries across the globe.
            </p>
          </div>

          {/* Image Section with Slide-in from Right */}
          <div
            className={`w-full md:w-1/2 mb-8 md:mb-0 md:ml-8 transition-transform duration-2000 ease-in-out transform ${
              missionInView ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <Image
              src="/img/mission.jpg"
              alt="Mission"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div ref={refVision} className="bg-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          {/* Image Section with Slide-in from Left */}
          <div
            className={`w-full md:w-1/2 transition-transform duration-2000 ease-in-out transform ${
              visionInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <Image
              src="/img/vision.png"
              alt="Vision"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Text Section with Slide-in from Bottom */}
          <div
            className={`w-full md:w-1/2 mt-8 md:mt-0 md:ml-8 transition-transform duration-2000 ease-in-out transform ${
              visionInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Vision</h2>
            <p className="text-lg text-gray-600 mb-4">
              To be a global leader in the logistics industry by continually improving the 
              quality of our services, expanding our reach, and leveraging cutting-edge 
              technology to enhance customer satisfaction.
            </p>
            <p className="text-lg text-gray-600">
              At CLVProject, we envision a future where businesses of all sizes can 
              seamlessly access logistics solutions that support their growth and success 
              in a rapidly changing global market.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div ref={refTeam} className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div
              className={`bg-white p-6 rounded-lg shadow-lg transition-transform duration-2000 ease-in-out transform ${
                teamInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <Image
                src="/img/team-1.jpg"
                alt="Team Member 1"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">John Doe</h3>
              <p className="text-lg text-gray-600">CEO & Founder</p>
            </div>

            {/* Team Member 2 */}
            <div
              className={`bg-white p-6 rounded-lg shadow-lg transition-transform duration-2000 ease-in-out transform ${
                teamInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <Image
                src="/img/team-2.jpg"
                alt="Team Member 2"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">Jane Smith</h3>
              <p className="text-lg text-gray-600">Chief Operating Officer</p>
            </div>

            {/* Team Member 3 */}
            <div
              className={`bg-white p-6 rounded-lg shadow-lg transition-transform duration-2000 ease-in-out transform ${
                teamInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <Image
                src="/img/team-3.jpg"
                alt="Team Member 3"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">Emily Johnson</h3>
              <p className="text-lg text-gray-600">Head of Logistics</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AboutPage;
