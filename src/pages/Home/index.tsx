import React from "react";
import { WindowChat } from "../../components/WindowChat";

export const Home: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-dark/90">
      <WindowChat />
    </div>
  )
}
