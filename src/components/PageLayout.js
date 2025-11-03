import React from "react";
import Sidebar from "./Sidebar";

const PageLayout = ({ title, children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">{title}</h1>
        <div className="bg-white p-6 rounded-2xl shadow-md">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
