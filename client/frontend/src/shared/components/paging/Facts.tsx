import { useInView } from "../../../hooks/useInView";

const FactsSection = () => {
  const [ref, isInView] = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-2000 ease-in-out transform ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Some Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold text-primary">1234</h3>
              <p className="text-lg text-gray-700">Happy Clients</p>
            </div>
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold text-primary">5678</h3>
              <p className="text-lg text-gray-700">Shipments Completed</p>
            </div>
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold text-primary">91011</h3>
              <p className="text-lg text-gray-700">Positive Reviews</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FactsSection;
