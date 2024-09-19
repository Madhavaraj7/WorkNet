import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Define types for workerDetails
interface WorkImage {
  workImages: string | undefined;
  filename: string; // Ensure this is the full URL or adjust accordingly
}

interface WorkerDetails {
  workImages: WorkImage[];
}

interface PhotosProps {
  workerDetails: WorkerDetails | null;
}

const Photos: React.FC<PhotosProps> = ({ }) => {



  return (
    <div className='mt-5 h-auto'>
      <h1 className="text-2xl font-bold">Photos</h1>
      <div className='px-7 max-sm:px-0 mt-10'>
        {/* <Slider {...settings}>
          {workerDetails?.workImages.map((item) => (
            <div key={item.filename}>
              <img
                src={item.workImages} 
                alt="Work image"
                className="rounded-lg h-72 w-72 object-cover"
              />
            </div>
          ))}
        </Slider> */}

        
      </div>
    </div>
  );
};

export default Photos;
