import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AuthScreen from "../../screens/AuthScreen";
import { useCreateRoute } from "../../../hooks/useRoute";
import Modal from "../Modal";
import { useUser } from "../../../hooks/useUser";
import Player from "lottie-react";
import logisticsAnimation from "@/src/animations/home.json";

const CreateRouteForm = dynamic(() => import("./createRouteForm"), { ssr: false });

const logisticsAdSentences = [
  "Need fast and reliable shipping? We have you covered!",
  "Your logistics solution is just one click away with CLVProject.",
  "Optimize your delivery routes with CLVProject and save time!",
  "CLVProject: Delivering solutions for all your logistics needs.",
  "Fast. Reliable. Efficient. Let CLVProject take care of your logistics.",
];

const getRandomLogisticsAd = () => {
  const randomIndex = Math.floor(Math.random() * logisticsAdSentences.length);
  return logisticsAdSentences[randomIndex];
};

const FrontPage = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [successNotification, setSuccessNotification] = useState(false);
  const [randomSlogan, setRandomSlogan] = useState(getRandomLogisticsAd);
  const router = useRouter();

  const { handleCreateRoute } = useCreateRoute();
  const { user } = useUser();

  const createRouteHandler = () => {
    setModalOpen(true);
  };

  const handleFormSubmit = async (startLocation: string, endLocation: string, distance: number) => {
    if (!user || !user.id) {
      setFeedback("Error: User not logged in.");
      return;
    }

    try {
      const routeData = {
        userId: user.id,
        startLocation,
        endLocation,
        distance,
      };
      const newRoute = await handleCreateRoute(routeData);
      setModalOpen(false);
      setSuccessNotification(true);
      setTimeout(() => setSuccessNotification(false), 5000);
    } catch (error) {
      setFeedback("Failed to create the route.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url('/img/landing-1.jpg')` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute left-10 z-10 text-left p-6 sm:p-10">
        <h1 className="text-xl sm:text-2xl lg:text-6xl font-bold text-white mb-4">Welcome to CLVProject</h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-white mb-6">{randomSlogan}</p>
        <div className="flex space-x-4">
          <button onClick={createRouteHandler} className="px-4 sm:px-8 py-2 sm:py-4 bg-green-500 text-white">
            Create Route
          </button>
          {!user && (
            <button onClick={() => setOpen(true)} className="px-4 sm:px-8 py-2 sm:py-4 bg-blue-500 text-white">
              Login / Sign Up
            </button>
          )}
        </div>
        {feedback && <div className="mt-4 text-white">{feedback}</div>}
      </div>
      <div className="absolute right-0 z-10 hidden md:block pr-10 lg:pr-20">
        <Player autoplay loop animationData={logisticsAnimation} className="max-w-xs sm:max-w-md lg:max-w-lg" />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-50 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <AuthScreen setOpen={setOpen} />
          </div>
        </div>
      )}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <CreateRouteForm onSubmit={handleFormSubmit} />
        </Modal>
      )}
      {successNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative z-50 flex flex-col items-center p-8 bg-white rounded-xl shadow-xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Route Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Your route has been created and is ready for tracking.</p>
            <button onClick={() => setSuccessNotification(false)} className="px-6 py-2 bg-green-500 text-white">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontPage;
