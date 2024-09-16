import React from "react";
import Header from "../components/Header";
import App from "../views/route/dashboard";

const HomeScreen = () => {
  return (
    <div>
      <Header />
      <main>
        <App /> 
      </main>
    </div>
  );
}

export default HomeScreen;
