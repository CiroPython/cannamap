import React from "react";

import IntroSection from "./IntroSection";
import CitiesGrid from "./CitiesGrid";

const LandingPage: React.FC = () => {
  return (
    <div>
      <IntroSection />
      <CitiesGrid />
    </div>
  );
};

export default LandingPage;
