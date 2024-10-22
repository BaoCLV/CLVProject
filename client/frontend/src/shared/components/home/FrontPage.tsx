import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AuthScreen from "../../screens/AuthScreen";
import { useCreateRoute } from "../../../hooks/useRoute";
import Modal from "../Modal";
import { useUser } from "../../../hooks/useUser";
import Player from "lottie-react";
import logisticsAnimation from "@/src/animations/home.json";
import { useRoles } from "@/src/hooks/useRole";

// Dynamic import for the CreateRouteForm
const CreateRouteForm = dynamic(() => import("./createRouteForm"), {
  ssr: false,
});

// Sentences for random slogans
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

// Main front page component
const FrontPage = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [successNotification, setSuccessNotification] = useState(false);
  const [randomSlogan, setRandomSlogan] = useState(getRandomLogisticsAd);
  const router = useRouter();

  const { handleCreateRoute } = useCreateRoute();
  console.log("useCreateRoute:", handleCreateRoute);

  const { user, loading } = useUser();
  console.log("useUser:", user);

  const { loadingRoles, errorRoles, roles } = useRoles();
  console.log("useRoles:", roles);

  const roleName =
    roles.find((r: any) => r.id === user?.roleId)?.name || "No role";

  const handleUpdate = () => {
    router.push(`/api/profile/${user.id}/route`);
  };

  const createRouteHandler = () => {
    setModalOpen(true);
  };

  const handleFormSubmit = async (
    startLocation: string,
    endLocation: string,
    distance: number,
    price: number
  ) => {
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
        price,
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
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/img/landing-1.jpg')` }}
      />

      {/* Glassmorphism panel */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md shadow-xl p-10 sm:p-16 rounded-xl max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white neon-glow mb-6 animate-fadeIn">
          Welcome to{" "}
          <span className="text-green-400 neon-text">CLVProject</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-10 animate-slideUp">
          {randomSlogan}
        </p>

        <div className="flex space-x-4">
          <button
            onClick={createRouteHandler}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-neon"
          >
            Create Route
          </button>

          {!user && (
            <button
              onClick={() => setOpen(true)}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-neon"
            >
              Login / Sign Up
            </button>
          )}

          {roleName === "user" && (
            <button
              onClick={handleUpdate}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-neon"
            >
              My Routes
            </button>
          )}
        </div>

        {feedback && <div className="mt-4 text-white">{feedback}</div>}
      </div>

      {/* Lottie Animation on the side */}
      <div className="absolute right-0 z-10 hidden md:block pr-10 lg:pr-20 animate-slideIn">
        <Player
          autoplay
          loop
          animationData={logisticsAnimation}
          className="max-w-xs sm:max-w-md lg:max-w-lg"
        />
      </div>

      {/* Modal for login */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">
          <div className="relative z-50 p-8 rounded-lg shadow-lg max-w-lg w-full bg-white">
            <AuthScreen setOpen={setOpen} />
          </div>
        </div>
      )}

      {/* Modal for create route form */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <CreateRouteForm onSubmit={handleFormSubmit} />
        </Modal>
      )}

      {/* Success Notification */}
      {successNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-lg">
          <div className="relative z-50 p-8 bg-white rounded-xl shadow-xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Route Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your route has been created and is ready for tracking.
            </p>
            <button
              onClick={() => setSuccessNotification(false)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg"
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
