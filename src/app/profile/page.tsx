"use client";
import { AuthProvider } from "@/components/AuthProvider";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState({ email: "", limit: 0 });
  const [loading, setLoading] = useState(false);
  async function getProfile() {
    try {
      setLoading(true);
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setProfile(data.user);
        setLoading(false);
      } else {
        console.error("Error fetching profile");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <AuthProvider>
      <section className="container mx-auto px-6">
        <Navbar />
        {loading ? (
          <div className="max-w-sm mt-10">
            <div className="max-w-sm h-40 bg-zinc-800 animate-pulse mb-4"></div>
            <div className="max-w-sm h-40 bg-zinc-800 animate-pulse mb-4"></div>
            <div className="max-w-sm h-40 bg-zinc-800 animate-pulse mb-4"></div>
          </div>
        ) : (
          <div className="max-w-sm">
            <div
              className="flex items-center cursor-pointer mt-10"
              onClick={() => router.push("/dashboard")}
            >
              <IoArrowBackOutline size={24} />
              <span className="text-xl ml-2">Back</span>
            </div>
            <h1 className="text-4xl mt-10 font-semibold">Profile</h1>
            <div className="mt-10">
              <h2 className="text-2xl font-semibold">Email</h2>
              <p className="text-2xl">{profile.email}</p>
            </div>
            <div className="my-10 bg-zinc-600 h-[1px]" />
            <div className="">
              <h2 className="text-2xl font-semibold">Remaining QR quota</h2>
              <p className="text-2xl">{profile.limit}</p>
            </div>
            <div className="my-10 bg-zinc-600 h-[1px]" />
            <Button
              padding="py-4 px-4"
              className="mt-8 w-auto"
              category="danger"
              text="Logout"
              type="submit"
              onClick={() => {
                localStorage.clear();
                router.push("/home");
              }}
            ></Button>
          </div>
        )}
      </section>
    </AuthProvider>
  );
}
