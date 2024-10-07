import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure this is imported for Font Awesome

const FeaturesSection = () => {
  return (
    <div className="flex items-center justify-center overflow-hidden py-8 px-0 bg-blue-300">
      <div className="container py-16 px-0">
        <div className="flex flex-wrap mx-0 items-center justify-center">
          {/* Text Section */}
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 animate-fadeInUp">
            <h1 className="font-bold uppercase mb-3 text-4xl text-center lg:text-left text-black">
              Our Features
            </h1>
            <h1 className="text-4xl font-bold mb-8 text-center lg:text-left text-white">
              We Are Trusted Logistics Company Since 1990
            </h1>
            <div className="flex mb-8 ml-10 animate-fadeInUp delay-300">
              <i className="fas fa-globe text-red-700 text-3xl flex-shrink-0"></i>
              <div className="ml-4">
                <h5 className="text-xl font-semibold text-red-700">Worldwide Service</h5>
              </div>
            </div>
            <div className="flex mb-8 ml-10 animate-fadeIn delay-500">
              <i className="fas fa-shipping-fast text-red-700 text-3xl flex-shrink-0"></i>
              <div className="ml-4">
                <h5 className="text-xl font-semibold text-red-700">On Time Delivery</h5>
              </div>
            </div>
            <div className="flex mb-0 ml-10 animate-fadeInUp delay-700">
              <i className="fas fa-headphones text-red-700 text-3xl flex-shrink-0"></i>
              <div className="ml-4">
                <h5 className="text-xl font-semibold text-red-700">24/7 Telephone Support</h5>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 relative animate-fadeInRight" style={{ minHeight: '400px' }}>
            <div className="absolute inset-0">
              <img
                src="/img/feature.jpg"
                alt="Feature"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
