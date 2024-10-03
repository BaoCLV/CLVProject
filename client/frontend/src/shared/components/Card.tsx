// Card.tsx (Reusable card component)
import React from "react";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const Card: React.FC<CardProps> = ({ icon, title, value }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
      <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
        {icon}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 ">
          {title}
        </p>
        <p className="text-lg font-semibold text-black">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Card;
