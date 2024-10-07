const TeamSection = () => {
    return (
      <div className="flex items-center justify-center mb-4 bg-gray-100">
        <div className="container mx-auto py-16">
          <div className="text-center mb-10">
            <h6 className="text-secondary uppercase mb-3 font-bold text-lg">Our Team</h6>
            <h1 className="text-4xl font-bold">Expert Team Members</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="team-item p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="overflow-hidden mb-4">
                <img
                  className="w-full h-72 object-cover rounded-lg transition-transform duration-500 hover:scale-110"
                  src="/img/team-1.jpg"
                  alt="Team Member"
                />
              </div>
              <h5 className="text-lg font-semibold mb-1">Full Name</h5>
              <p className="text-gray-600 mb-4">Designation</p>
              <div className="flex space-x-3">
                <a href="#" className="text-primary hover:text-blue-500 transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-primary hover:text-blue-500 transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-primary hover:text-blue-500 transition">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
  
            {/* Team Member 2 */}
            <div className="team-item p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="overflow-hidden mb-4">
                <img
                  className="w-full h-72 object-cover rounded-lg transition-transform duration-500 hover:scale-110"
                  src="/img/team-2.jpg"
                  alt="Team Member"
                />
              </div>
              <h5 className="text-lg font-semibold mb-1">Full Name</h5>
              <p className="text-gray-600 mb-4">Designation</p>
              <div className="flex space-x-3">
                <a href="#" className="text-primary hover:text-blue-500 transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-primary hover:text-blue-500 transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-primary hover:text-blue-500 transition">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TeamSection;
  