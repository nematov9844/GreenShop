import { Input, Button } from 'antd';
import Logo from '../assets/logo.png';
import PaypalIcon from '../assets/icons/paypal.png';
import MasterCardIcon from '../assets/icons/mastercard.png';
import VisaIcon from '../assets/icons/visa.png';
import AmexIcon from '../assets/icons/amex.png';
import { FacebookFilled, InstagramFilled, YoutubeFilled, LinkedinFilled } from '@ant-design/icons';
import gardenCare from '../assets/icons/garden-care.png';
import plantRenovation from '../assets/icons/plant-renovation.png';
import wateringGraden from '../assets/icons/watering-graden.png';
export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] pt-12">
      {/* Services Section */}
      <div className="max-w-[1280px] mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <img src={gardenCare} alt="Garden Care" className="w-24 h-24 mx-auto md:mx-0 mb-4" />
            <h3 className="text-xl font-bold mb-2">Garden Care</h3>
            <p className="text-gray-600">
              We are an online plant shop offering a wide range of cheap and trendy plants.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <img src={plantRenovation} alt="Plant Renovation" className="w-24 h-24 mx-auto md:mx-0 mb-4" />
            <h3 className="text-xl font-bold mb-2">Plant Renovation</h3>
            <p className="text-gray-600">
              We are an online plant shop offering a wide range of cheap and trendy plants.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <img src={wateringGraden} alt="Watering Graden" className="w-24 h-24 mx-auto md:mx-0 mb-4" />
            <h3 className="text-xl font-bold mb-2">Watering Graden</h3>
            <p className="text-gray-600">
              We are an online plant shop offering a wide range of cheap and trendy plants.
            </p>
          </div>
          <div className="flex flex-col  justify-between items-center gap-6">
          <div className='w-full'>
            <h3 className="text-xl font-bold mb-2">Would you like to join newsletters?</h3>
            <p className="text-gray-600">
              We usually post offers and challenges in newsletter. We're your online houseplant destination.
              We offer a wide range of houseplants and accessories shipped directly from our (green)house to yours!
            </p>
          </div>
          <div className="w-full ">
            <div className="flex gap-2">
              <Input placeholder="enter your email address..." className="min-w-[200px]" />
              <Button type="primary" className="bg-green">
                Join
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Newsletter Section */}
     

      {/* Main Footer */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-5 justify-between w-full">
              <div className="flex items-center gap-2 mb-4">
                <img src={Logo} alt="GreenShop" className="h-8" />
                <span className="text-2xl font-bold text-green">GREENSHOP</span>
              </div>
              <div className="flex items-start gap-2 mb-2">
                <span>🏠</span>
                <p>70 West Buckingham Ave. Farmingdale, NY 11735</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span>✉️</span>
                <p>contact@greenshop.com</p>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <p>+88 01911 717 490</p>
              </div>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Logo and Address */}

            {/* My Account */}
            <div>
              <h4 className="font-bold mb-4">My Account</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green">My Account</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Our stores</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Contact us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Career</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Specials</a></li>
              </ul>
            </div>

            {/* Help & Guide */}
            <div>
              <h4 className="font-bold mb-4">Help & Guide</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">How to Buy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Shipping & Delivery</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Product Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">How to Return</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-green">House Plants</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Potter Plants</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Seeds</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Small Plants</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green">Accessories</a></li>
              </ul>
            </div>
            
          {/* Social Media and Payments */}
          <div className="flex flex-col  justify-between items-start gap-6 mt-12 pt-8 border-t">
            <div className="flex md:flex-col gap-4">
              <h4 className="font-bold">Social Media:</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-green">
                  <FacebookFilled/>
                </a>
                <a href="#" className="text-gray-600 hover:text-green">
                  <InstagramFilled/>
                </a>
                <a href="#" className="text-gray-600 hover:text-green">
                  <LinkedinFilled/>
                </a>
                <a href="#" className="text-gray-600 hover:text-green">
                  <YoutubeFilled/>
                </a>
              </div>
            </div>
            <div className="flex md:flex-col gap-4">
              <h4 className="font-bold">We Accept:</h4>
              <div className="flex gap-2">
                <img src={PaypalIcon} alt="PayPal" className="h-6" />
                <img src={MasterCardIcon} alt="MasterCard" className="h-6" />
                <img src={VisaIcon} alt="Visa" className="h-6" />
                <img src={AmexIcon} alt="American Express" className="h-6" />
              </div>
            </div>
          </div>
          </div>


          {/* Copyright */}
          <div className="text-center mt-8 pt-8 border-t">
            <p className="text-gray-600">© 2021 GreenShop. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 