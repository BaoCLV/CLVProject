import React from "react";
import Header from "../components/Header";
import FindAllRoutes from "../views/route/dashboard";

const HomeScreen = () => {
  return (
    <div>
      <Header />
      <main>
        <FindAllRoutes /> 
      </main>
    </div>
  );
}

export default HomeScreen;
