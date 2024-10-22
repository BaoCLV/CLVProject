import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const technologies = [
  {
    category: 'Frontend',
    items: [
      { name: 'Next.js', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' },
      { name: 'Tailwind CSS', logo: '/img/tailwindcss-mark.svg' },
      { name: 'Styled Components', logo: 'https://styled-components.com/logo.png' },
      { name: 'GraphQL', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/graphql/graphql-plain.svg' },
      { name: 'React', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
      { name: 'Apollo Client', logo: 'https://graphql.org/img/logo.svg' },
      { name: 'Next UI', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' },
      { name: 'MUI', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/materialui/materialui-original.svg' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'NestJS', logo: 'https://nestjs.com/logo-small-gradient.76616405.svg' },
      { name: 'TypeORM', logo: 'https://avatars.githubusercontent.com/u/20165699?s=200&v=4' },
      { name: 'Node.js', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
      { name: 'PostgreSQL', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg' },
      { name: 'gRPC', logo: 'https://grpc.io/img/logos/grpc-logo.png' },
      { name: 'Kafka', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/apachekafka/apachekafka-original.svg' },
    ],
  },
  {
    category: 'DevOps',
    items: [
      { name: 'GitHub', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg' },
      { name: 'Docker', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg' },
      { name: 'VS Code', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg' },
      { name: 'DBeaver', logo: 'https://dbeaver.io/wp-content/uploads/2015/09/beaver-head.png' },
    ],
  },
];

// Custom carousel arrow buttons
const Arrow = styled.button`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)); /* Semi-transparent gradient */
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;

  &:hover {
    background: linear-gradient(135deg, #667eea, #764ba2);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    transform: scale(1.1); /* Slight scale on hover */
  }
`;

// Wrapper for the carousel item with glassmorphism effect
const CarouselItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1); /* Transparent glass effect */
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-15px) scale(1.07); /* Lift and scale on hover */
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 64px;
    height: 64px;
    transition: transform 0.5s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5); /* Neon glow */
    border-radius: 50%;
    background: white;
    padding: 8px;
  }

  &:hover img {
    transform: rotate(15deg) scale(1.1); /* Rotation and scale on hover */
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.8); /* Stronger neon glow */
  }

  h3 {
    margin-top: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

// Gradient text with a floating effect
const GradientText = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2, #43cea2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  animation: float 4s ease-in-out infinite;

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

const TechStack = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 8000, // Slow speed for a smooth, continuous spin
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Ensures no pauses
    cssEase: 'linear', // Linear easing for constant speed
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="p-12  min-h-screen relative overflow-hidden">
      {/* Background Overlay for more depth */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"></div>

      {technologies.map((techCategory, index) => (
        <div key={index} className="relative z-10 mb-16">
          <GradientText>{techCategory.category}</GradientText>
          <Slider {...settings}>
            {techCategory.items.map((tech, idx) => (
              <div key={idx} className="p-6">
                <CarouselItem>
                  <img src={tech.logo} alt={tech.name} className="object-contain mb-4" />
                  <h3>{tech.name}</h3>
                </CarouselItem>
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default TechStack;
