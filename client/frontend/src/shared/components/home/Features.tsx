import '@fortawesome/fontawesome-free/css/all.min.css'; // FontAwesome for icons
import Image from 'next/image';

const FeaturesSection = () => {
  return (
    <div className="relative overflow-hidden py-20 ">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-reverse"></div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-wrap items-center justify-between mx-0">
          {/* Text Section */}
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 animate-slideInLeft">
            <h1 className=" bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-6xl font-extrabold uppercase mb-6 tracking-wider drop-shadow-lg">
              Our Features
            </h1>
            <h2 className="text-5xl font-bold mb-8 leading-snug">
              Trusted Logistics Company Since 1990
            </h2>
            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="flex items-center space-x-4 transition-transform hover:scale-105 hover:translate-x-3 duration-300">
                <i className="fas fa-globe text-blue-400 text-5xl"></i>
                <div>
                  <h5 className="text-2xl font-semibold ">Worldwide Service</h5>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex items-center space-x-4 transition-transform hover:scale-105 hover:translate-x-3 duration-300">
                <i className="fas fa-shipping-fast text-green-400 text-5xl"></i>
                <div>
                  <h5 className="text-2xl font-semibold ">On Time Delivery</h5>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="flex items-center space-x-4 transition-transform hover:scale-105 hover:translate-x-3 duration-300">
                <i className="fas fa-headphones text-red-400 text-5xl"></i>
                <div>
                  <h5 className="text-2xl font-semibold">24/7 Telephone Support</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section with Advanced Parallax Hover */}
          <div className="w-full lg:w-1/2 relative animate-slideInRight" style={{ minHeight: '500px' }}>
            <div className="absolute inset-0 transition-transform hover:scale-110 hover:rotate-3 transform-gpu duration-700">
              <Image
                src="/img/feature.jpg"
                alt="Feature"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
                layout="fill"
              />
            </div>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/40 via-black/20 to-transparent rounded-3xl"></div> {/* Subtle Gradient Overlay */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
