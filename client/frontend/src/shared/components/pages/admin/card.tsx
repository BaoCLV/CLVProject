import React from "react";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color?: string; // Background color for the card
  iconBgColor?: string; // Background color for the icon container
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  value,
  color = "bg-white",
  iconBgColor = "bg-blue-100",
  onClick
}) => {
  return (
    <div
      className={`flex flex-col justify-between p-6 rounded-lg shadow-md ${color} w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-auto hover:scale-105 transition-transform duration-300`} 
      onClick={onClick}
    >
      <div className="flex justify-between w-full">
        <div className={`p-3 text-white rounded-full ${iconBgColor}`}>
          {icon}
        </div>
      </div>
      <div className="flex justify-center pb-8 w-full mt-2">
        <p className="text-4xl font-bold text-black">{value}</p>
      </div>
      <div className="flex justify-start w-full">
        <p className="text-xl font-semibold text-black">{title}</p>
      </div>
    </div>
  );
};

export default Card;
