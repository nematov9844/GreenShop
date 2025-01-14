import Category from "../components/Category";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Modals from "../components/modals/Modals";

export default function Home() {
  return (
    <div className="font-cera">
      <Modals />
        <Header/>
        <Hero/>
        <Category/>
        <Footer/>
    </div>
  )
}
