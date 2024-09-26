import React from 'react';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Rating from "@mui/material/Rating";
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Button, Typography } from "@mui/material";
import { toast } from 'react-toastify';

interface WorkerDetails {
  name: string;
  profileImage: string;
  address: string;
  rating: number;
  phoneNumber: string;
  whatsappNumber: string;
}

interface WorkerDetailedCardProps {
  workerDetails: WorkerDetails;
}

const WorkerDetailedCard: React.FC<WorkerDetailedCardProps> = ({ workerDetails }) => {
  const handlePhoneClick = () => {
    toast.info("Phone number copied to clipboard");
    navigator.clipboard.writeText(workerDetails.phoneNumber);
  };

  const handleWhatsappClick = () => {
    toast.info("WhatsApp number copied to clipboard");
    navigator.clipboard.writeText(workerDetails.whatsappNumber);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        <img
          src={workerDetails.profileImage}
          alt={workerDetails.name}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <Typography variant="h5" className="font-semibold">{workerDetails.name}</Typography>
        <Typography variant="body1" className="mt-2 text-gray-600 flex items-center">
          <LocationOnIcon fontSize="small" className="mr-1" />
          {workerDetails.address}
        </Typography>
        <div className="flex items-center mt-2">
          <Rating name="read-only" value={workerDetails.rating} readOnly />
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="contained"
            color="primary"
            startIcon={<CallRoundedIcon />}
            onClick={handlePhoneClick}
          >
            Call
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsappClick}
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailedCard;
