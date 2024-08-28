"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex">
      <div className="w-80 bg-bgColor inset-0 hidden lg:block">
        <Sidebar show={showSidebar} setShow={setShowSidebar} />
      </div>
      {showSidebar ? (
        <div className="w-full fixed inset-0 z-20 bg-bgColor">
          <Sidebar show={showSidebar} setShow={setShowSidebar} />
        </div>
      ) : null}
      <div className="w-full max-h-screen overflow-y-scroll relative">
        <div className="sticky top-0">
          <Navbar setShow={setShowSidebar} type="app" />
        </div>
        <div className="container mx-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
