import { Link } from 'react-router-dom'
import CallIcon from '@mui/icons-material/Call';
import { Button } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  return (
    <footer id='Footer' className='bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 shadow-lg'>
      <div className='container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='space-y-4'>
          <Link className='flex items-center space-x-2 hover:opacity-80 transition-opacity' to={'/'}>
            <EngineeringIcon fontSize='large' className='text-teal-400' />
            <h4 className='text-3xl font-extrabold text-teal-400'>WorkNet</h4>
          </Link>
          <p className='text-md italic'>
            "Where your project needs meet skilled hands and reliable workers"
          </p>
        </div>

        <div className='space-y-4'>
          <h6 className='font-bold text-xl border-b-2 border-teal-400 pb-2'>Pages</h6>
          <ul className='space-y-2'>
            <li><Link to={'/'} className='hover:text-teal-400 transition-colors'>Home</Link></li>
            <li><Link to={'/workers'} className='hover:text-teal-400 transition-colors'>Workers</Link></li>
            <li><Link to={'/about'} className='hover:text-teal-400 transition-colors'>About</Link></li>
            <li><Link to={'/profile'} className='hover:text-teal-400 transition-colors'>Dashboard</Link></li>
          </ul>
        </div>

        <div className='space-y-4'>
          <h6 className='font-bold text-xl border-b-2 border-teal-400 pb-2'>Customer Services</h6>
          <ul className='space-y-2'>
            <li><Link to={'/help'} className='hover:text-teal-400 transition-colors'>Help</Link></li>
            <li><Link to={'/terms'} className='hover:text-teal-400 transition-colors'>Terms</Link></li>
            <li><Link to={'/privacy'} className='hover:text-teal-400 transition-colors'>Privacy Policy</Link></li>
            <li><Link to={'/faq'} className='hover:text-teal-400 transition-colors'>FAQ</Link></li>
          </ul>
        </div>

        <div className='space-y-4'>
          <h4 className='text-xl font-bold'>Contact Us</h4>
          <Button variant='contained' className='w-full mb-3 bg-green-600 hover:bg-green-700 shadow-md transition-shadow' startIcon={<CallIcon />}>
            Call
          </Button>
          <Button variant='contained' className='w-full bg-red-600 hover:bg-red-700 shadow-md transition-shadow' startIcon={<EmailIcon />}>
            E-mail
          </Button>
        </div>
      </div>
      <div className='text-center text-gray-400 mt-6'>
        <h6 className='text-md'>&copy; {new Date().getFullYear()} All Rights Reserved.</h6>
      </div>
    </footer>
  )
}

export default Footer;
