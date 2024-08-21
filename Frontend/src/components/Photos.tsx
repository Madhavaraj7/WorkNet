import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LeftArrow from '../assets/Images/LeftArrow.png';
import RightArrow from '../assets/Images/RightArrow.png';

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

const Photos: React.FC<PhotosProps> = ({ workerDetails }) => {
  const SlickArrowLeft: React.FC<any> = (props) => (
    <img id='Arrows' src={LeftArrow} alt="prevArrow" {...props} />
  );

  const SlickArrowRight: React.FC<any> = (props) => (
    <img id='Arrows' src={RightArrow} alt="nextArrow" {...props} />
  );

  const settings = {
    infinite: true,
    centerPadding: '60px',
    centerMode: true,
    className: 'center',
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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
