import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Modals from '../components/modals/Modals';

export default function Home() {
  return (
    <div className="font-cera">
      <Modals />
      <Header />
      <Hero/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
