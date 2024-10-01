import LandingPage from "../components/LandingPage";

const Home = () => {
  console.log(process.env.JWT_SECRET)
  return (
    <div>
      <LandingPage />
    </div>
  );
};
export default Home;
