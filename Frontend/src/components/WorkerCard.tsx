import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";

export interface Worker {
  _id: string;
  name: string;
  registerImage: string;
  avarageReview: number;
  place: string;
  city: string;
  state: string;
  categories: string[];
  status: string; 
}

interface WorkerCardProps {
  worker: Worker;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  if (worker.status !== "approved") {
    return null; 
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl hover:border-blue-500">
      <Link to={`/worker/${worker._id}`} className="block">
        <img
          className="w-full h-56 object-cover transition-transform duration-300 transform hover:scale-110"
          src={worker.registerImage}
          alt={worker.name}
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{worker.name}</h2>
          {worker.avarageReview > 0 && (
            <div className="flex items-center mb-2">
              <span
                className={`text-lg font-semibold ${worker.avarageReview < 3 ? 'text-red-500' : 'text-green-500'}`}
              >
                {worker.avarageReview}
              </span>
              <span className="text-yellow-500 ml-2">★</span>
            </div>
          )}
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <LocationOnIcon className="text-blue-500 mr-2" />
            <span>{`${worker.place}, ${worker.city}, ${worker.state}`}</span>
          </div>
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {worker.categories.map(category => (
              <Tooltip key={category} title={`Category: ${category}`} arrow>
                <span
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {category}
                </span>
              </Tooltip>
            ))}
          </div>
          <Link to={`/worker/${worker._id}`}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="text-white"
            >
              Read More
            </Button>
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default WorkerCard;
