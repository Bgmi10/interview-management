import { LandingPage } from "./components/LandingPage";
import Header from "./components/header/Header";

export default function Home() {
  return (
    <div className="dark:bg-black bg-white"> 
      <Header />
      <LandingPage />
    </div>
  );
}
