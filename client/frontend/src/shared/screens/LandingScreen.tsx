import Navbar from "../components/home/Navbar";
import AboutSection from "../components/home/About";
import FactsSection from "../components/home/Facts";
import Footer from "../components/Footer";
import Frontpage from "../components/home/FrontPage";
import Features from "../components/home/Features";
import Services from "../components/home/Services";
import TeamSection from "../components/home/Team";

const LandingPage = () => {
  return (
    <div className="navbar bg-white shadow-lg sticky top-0 z-10">
      {/* Navbar */}
      <Navbar />

      {/* Carousel */}
      <Frontpage />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <Services/>

      {/* Facts Section */}
      <FactsSection />

      {/* Features Section */}
      <Features/>

      <TeamSection/>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
