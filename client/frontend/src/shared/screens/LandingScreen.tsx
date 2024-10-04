import Navbar from "../components/paging/Navbar";
import AboutSection from "../components/paging/About";
import FactsSection from "../components/paging/Facts";
import Footer from "../components/Footer";
import Frontpage from "../components/paging/FrontPage";

const LandingPage = () => {
  return (
    <div className="navbar bg-white shadow-lg sticky top-0 z-10">
      {/* Navbar */}
      <Navbar />

      {/* Carousel */}
      <Frontpage />

      {/* About Section */}
      <AboutSection />

      {/* Facts Section */}
      <FactsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
