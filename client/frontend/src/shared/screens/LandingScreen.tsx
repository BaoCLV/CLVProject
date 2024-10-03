"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthScreen from "./AuthScreen";
import { useCreateRoute } from "../../hooks/useRoute";
import Modal from "../components/Modal"; // Assuming you have a modal component for the form
import CreateRouteForm from "../components/createRouteForm";
import { useUser } from "../../hooks/useUser"; // Import your useUser hook

const images = [
  "/img/landing-1.jpg",
  "/img/landing-2.jpg",
  "/img/landing-3.jpg", 
];

const logisticsAdSentences = [
  "Need fast and reliable shipping? CLVProject has you covered!",
  "Your logistics solution is just one click away with CLVProject.",
  "Optimize your delivery routes with CLVProject and save time!",
  "CLVProject: Delivering solutions for all your logistics needs.",
  "Fast. Reliable. Efficient. Let CLVProject take care of your logistics."
];

const getRandomLogisticsAd = () => {
  const randomIndex = Math.floor(Math.random() * logisticsAdSentences.length);
  return logisticsAdSentences[randomIndex];
};

const LandingPage = () => {
  const [open, setOpen] = useState(false); // Modal state for Login/Sign Up
  const [modalOpen, setModalOpen] = useState(false); // Modal state for Create Route form
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Carousel state
  const [feedback, setFeedback] = useState<string | null>(null); // Feedback state
  const router = useRouter();

  const { handleCreateRoute } = useCreateRoute(); // Hook to create a route
  const { user, error, loading } = useUser(); // Use the useUser hook to get user and error

  // Carousel logic: Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.push("/dashboard"); 
    }
  }, [user, loading, router]);



  const createRouteHandler = () => {
    setModalOpen(true);
  };

  const handleFormSubmit = async (startLocation: string, endLocation: string, distance: number) => {
    try {
      const routeData = {
        userId: "1",
        startLocation,
        endLocation,
        distance,
      };
      const newRoute = await handleCreateRoute(routeData);
      setFeedback(`Route created successfully: ${newRoute.id}`);
      setModalOpen(false); // Close the modal after successful creation
    } catch (error) {
      setFeedback("Failed to create the route.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Carousel Background */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
        }}
      />

      {/* Overlay to darken background */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Top-right buttons */}
      <div className="absolute top-5 right-10 flex space-x-4">
        <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
          About Us
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
          Contact
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center p-10">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to CLVProject
        </h1>

        {/* Create Route Button - moved to the right, larger size */}
        <div className="flex justify-center">
          <button
            onClick={createRouteHandler} // Open modal for Create Route form
            className="mb-4 px-16 py-8 bg-green-500 text-white text-2xl  hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Route
          </button>
        </div>



        {/* Login / Sign Up Button */}
        <div className="flex space-x-4 justify-center mt-8">
          <button
            onClick={() => setOpen(true)}
            className="px-8 py-4 bg-blue-500 text-white text-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Login / Sign Up
          </button>
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className="mt-4 text-white">
            {feedback}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-50 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <AuthScreen setOpen={setOpen} /> {/* Modal for Login/Sign Up */}
          </div>
        </div>
      )}

      {/* Modal for Create Route */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <CreateRouteForm onSubmit={handleFormSubmit} /> {/* Pass submit handler */}
        </Modal>
      )}
    </div>
  );
};

export default LandingPage;
