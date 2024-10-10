"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthScreen from "../../screens/AuthScreen";
import { useCreateRoute } from "../../../hooks/useRoute";
import Modal from "../Modal";
import CreateRouteForm from "./createRouteForm";
import { useUser } from "../../../hooks/useUser";
import { useInView } from "../../../hooks/useInView";
import Player from "lottie-react";
import logisticsAnimation from "@/src/animations/home.json";

// Slogans for logistics
const logisticsAdSentences = [
  "Need fast and reliable shipping? We have you covered!",
  "Your logistics solution is just one click away with CLVProject.",
  "Optimize your delivery routes with CLVProject and save time!",
  "CLVProject: Delivering solutions for all your logistics needs.",
  "Fast. Reliable. Efficient. Let CLVProject take care of your logistics.",
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
  const [successNotification, setSuccessNotification] = useState(false); // Success notification state
  const [randomSlogan, setRandomSlogan] = useState(getRandomLogisticsAd); // Random logistic slogan
  const router = useRouter();
  const [ref, isInView] = useInView(0.1);

  const { handleCreateRoute } = useCreateRoute(); // Hook to create a route
  const { user, loading } = useUser(); // Use the useUser hook to get user and error

  const createRouteHandler = () => {
    setModalOpen(true);
  };

  const handleFormSubmit = async (
    startLocation: string,
    endLocation: string,
    distance: number
  ) => {
    if (!user || !user.id) {
      setFeedback("Error: User not logged in.");
      return;
    }

    try {
      const routeData = {
        userId: user.id, // Now pulling the userId from the logged-in user
        startLocation,
        endLocation,
        distance,
      };
      const newRoute = await handleCreateRoute(routeData);
      setModalOpen(false);

      // Show the success notification in the middle of the screen
      setSuccessNotification(true);
      setTimeout(() => setSuccessNotification(false), 5000); // Hide after 3 seconds
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
      <div className="absolute left-10 z-10 text-left p-6 sm:p-10">
        {/* Welcome Message */}
        <h1 className="text-xl sm:text-2xl lg:text-6xl font-bold text-white mb-4">
          Welcome to CLVProject
        </h1>

        {/* Random Logistics Slogan */}
        <p className="text-lg sm:text-xl lg:text-2xl text-white mb-6">
          {randomSlogan}
        </p>

        {/* Inline Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={createRouteHandler}
            className="px-4 sm:px-8 py-2 sm:py-4 bg-green-500 text-white text-base sm:text-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Create Route
          </button>

          {/* Conditionally render the Login / Sign Up button if user is not logged in */}
          {!user && (
            <button
              onClick={() => setOpen(true)}
              className="px-4 sm:px-8 py-2 sm:py-4 bg-blue-500 text-white text-base sm:text-lg hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Feedback Section */}
        {feedback && <div className="mt-4 text-white">{feedback}</div>}
      </div>

      {/* Lottie Animation (Right side) */}
      <div className="absolute right-0 z-10 hidden md:block pr-10 lg:pr-20">
        <Player
          autoplay
          loop
          animationData={logisticsAnimation}
          className="max-w-xs sm:max-w-md lg:max-w-lg"
        />
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
          <CreateRouteForm onSubmit={handleFormSubmit} />{" "}
          {/* Pass submit handler */}
        </Modal>
      )}

      {/* Success Notification */}
      {successNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative z-50 flex flex-col items-center p-8 bg-white rounded-xl shadow-xl max-w-lg w-full text-center">
            {/* Success Icon */}
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Route Created Successfully!
            </h2>

            {/* Subtext */}
            <p className="text-gray-600 mb-6">
              Your route has been created and is now ready for tracking.
            </p>

            {/* Close Button */}
            <button
              onClick={() => setSuccessNotification(false)}
              className="px-6 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontPage;
