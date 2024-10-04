"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthScreen from "../../screens/AuthScreen";
import { useCreateRoute } from "../../../hooks/useRoute";
import Modal from "../Modal";
import CreateRouteForm from "../createRouteForm";
import { useUser } from "../../../hooks/useUser"; 
import { useInView } from "../../../hooks/useInView";

// Slogans for logistics
const logisticsAdSentences = [
  "Need fast and reliable shipping? We has you covered!",
  "Your logistics solution is just one click away with CLVProject.",
  "Optimize your delivery routes with CLVProject and save time!",
  "CLVProject: Delivering solutions for all your logistics needs.",
  "Fast. Reliable. Efficient. Let CLVProject take care of your logistics."
];

// Function to get a random slogan
const getRandomLogisticsAd = () => {
  const randomIndex = Math.floor(Math.random() * logisticsAdSentences.length);
  return logisticsAdSentences[randomIndex];
};

const FrontPage = () => {
  const [open, setOpen] = useState(false); // Modal state for Login/Sign Up
  const [modalOpen, setModalOpen] = useState(false); // Modal state for Create Route form
  const [feedback, setFeedback] = useState<string | null>(null); // Feedback state
  const [randomSlogan, setRandomSlogan] = useState(getRandomLogisticsAd); // Random logistic slogan
  const router = useRouter();
  const [ref, isInView] = useInView(0.1);

  const { handleCreateRoute } = useCreateRoute(); // Hook to create a route
  const { user, error, loading } = useUser(); // Use the useUser hook to get user and error

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
      setModalOpen(false);
    } catch (error) {
      setFeedback("Failed to create the route.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: `url('/img/landing-1.jpg')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Main Content */}
      <div className="absolute top left-10 z-10 text-left p-10">
        {/* Welcome Message */}
        <h1 className="text-8xl font-bold text-white mb-4">
          Welcome to CLVProject
        </h1>

        {/* Random Logistics Slogan */}
        <p className="text-xl text-white mb-6">
          {randomSlogan}
        </p>

        {/* Inline Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={createRouteHandler}
            className="px-8 py-4 bg-green-500 text-white text-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Route
          </button>
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

      {/* Modal for Login / Sign Up */}
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

export default FrontPage;
