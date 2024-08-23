import React from "react";
import Header from "../components/Header";
import Dashboard from "../views/route/dashboard";

const HomeScreen = () => {
  return (
    <div>
      <Header />
      <main>
        <Dashboard /> 
      </main>
    </div>
  );
}

export default HomeScreen;
