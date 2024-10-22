import Navbar from "../components/home/Navbar";
import AboutSection from "../components/home/About";
import FactsSection from "../components/home/Facts";
import Footer from "../components/Footer";
import Frontpage from "../components/home/FrontPage";
import Features from "../components/home/Features";
import Services from "../components/home/Services";
import TeamSection from "../components/home/Team";
import TechStack from "../components/home/techStack";

const LandingPage = () => {
  return (
    <div>
      {/* Navbar */}
      <div className="navbar bg-white shadow-lg sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div>
        {/* Carousel (Frontpage) */}
        <div>
          <Frontpage />
        </div>

        {/* About Section */}
        <div>
          <AboutSection />
        </div>

        {/* Services Section */}
        <div className="bg-blue-200 text-black">
          <Services />
        </div>

        {/* Facts Section */}
        <div className="bg-gray-800 text-white">
          <FactsSection />
        </div>

        {/* Features Section */}
        <div className="bg-green-200 text-gray-900">
          <Features />
        </div>

        {/* Tech Stack Section */}
        <div className="bg-blue-900 text-white">
          <TechStack />
        </div>

        {/* Team Section */}
        <div className="bg-gray-100 text-gray-900">
          <TeamSection />
        </div>

        {/* Footer */}
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
