"use client";
import React from "react";
import Headers from "../components/Header";
import CreatePost from "../components/CreatePost";
import UserPost from "../components/UserPost";

const Dashboard = () => {
  return (
    <div className=" bg-[#f8f8f8] flex flex-col h-full justify-center gap-4">
      <Headers />
      <CreatePost />
      <UserPost />
    </div>
  );
};

export default Dashboard;
