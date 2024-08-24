"use client";
import { FaAppStoreIos, FaGooglePlay } from "react-icons/fa";
import { AuthProvider } from "@/components/AuthProvider";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import { SecondScreen } from "@/components/SecondScreen";
import { useEffect, useState } from "react";
import { QRCard } from "@/components/QRCard";
import toast from "react-hot-toast";
import { AUTH_TOKEN_KEY } from "@/utils/constants";

export default function Dashboard() {
  const [createQR, setCreateQR] = useState(false);
  const [editQR, setEditQR] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const [qrList, setQrList] = useState<
    {
      id: string;
      app_store_url: string;
      play_store_url: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
      user_id: string;
      slug: string;
      clicks: number;
    }[]
  >([]);

  const [newQr, setNewQr] = useState({
    id: "",
    app_store_url: "",
    play_store_url: "",
    created_at: "",
    updated_at: "",
    deleted_at: "",
    user_id: "",
    slug: "",
    clicks: 0,
  });

  function handleClose() {
    setCreateQR(false);
    setEditQR(false);
    setNewQr({
      id: "",
      app_store_url: "",
      play_store_url: "",
      created_at: "",
      updated_at: "",
      deleted_at: "",
      user_id: "",
      slug: "",
      clicks: 0,
    });
  }

  async function handleGetQR(id?: string) {
    try {
      setPending(true);
      const url = id ? `/api/entry?id=${id}` : "/api/entry";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
      });
      if (response.status == 200) {
        setPending(false);
        const data = await response.json();
        setQrList(data.qr);
      } else {
        setPending(false);
        return toast.success("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      setPending(false);
    }
  }

  async function handleSubmitQR(app_url: string, play_url: string) {
    if (!app_url || !play_url) {
      return toast.error("Please fill in both app store links");
    }
    if (!app_url.includes("https://apps.apple.com/")) {
      return toast.error("Please enter valid app store link");
    }
    if (!play_url.includes("https://play.google.com")) {
      return toast.error("Please enter valid play store link");
    }
    try {
      setLoading(true);
      const response = await fetch("/api/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
        body: JSON.stringify({ app_url: app_url, play_url: play_url }),
      });
      if (response.status == 200) {
        setLoading(false);
        const data = await response.json();
        setNewQr(data.qr);
        return toast.success("QR code generated successfully");
      } else {
        setLoading(false);
        return toast.success("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetQR();
  }, []);

  return (
    <AuthProvider>
      <section className="container mx-auto px-6">
        <Navbar />
        <div className="flex items-center justify-between">
          <h1 className="text-4xl mt-10 font-semibold">
            Your QRs ({qrList.length})
          </h1>
          <Button
            padding="py-1 px-4"
            className="mt-8 w-32"
            category="white"
            text="Generate QR"
            type="submit"
            onClick={() => setCreateQR(true)}
          ></Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-6">
          {pending
            ? new Array(12)
                .fill(0)
                .map((_, k) => (
                  <div className="col-span-1 bg-zinc-800 animate-pulse h-80"></div>
                ))
            : qrList?.map((qr, k) => (
                <QRCard
                  key={qr.id}
                  path={qr.slug}
                  appStoreURL={qr.app_store_url}
                  playStoreURL={qr.play_store_url}
                  createdAt={qr.created_at}
                  clicks={qr.clicks}
                />
              ))}
        </div>

        <SecondScreen title="Create QR" show={createQR} onClose={handleClose}>
          {newQr.id ? (
            <div className="p-6">
              <QRCard
                key={newQr.id}
                path={newQr.slug}
                appStoreURL={newQr.app_store_url}
                playStoreURL={newQr.play_store_url}
                createdAt={newQr.created_at}
                clicks={newQr.clicks}
              />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (loading) return;
                handleSubmitQR(
                  e.currentTarget.appstore.value,
                  e.currentTarget.playstore.value
                );
              }}
              className="w-full p-6"
            >
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="appstore" className="text-lg">
                  App Store
                </label>
                <div className="w-full flex items-center border border-zinc-800 rounded-md px-3 py-4 gap-2">
                  <FaAppStoreIos className="text-gray-500" size={24} />
                  <input
                    type="text"
                    id="appstore"
                    name="appstore"
                    placeholder="Enter App Store URL"
                    className=" bg-black focus:outline-none w-full"
                    autoCapitalize="off"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full mt-3">
                <label htmlFor="playstore" className="text-lg">
                  Play Store
                </label>
                <div className="w-full flex items-center border border-zinc-800 rounded-md px-3 py-4 gap-2">
                  <FaGooglePlay className="text-gray-500" size={24} />
                  <input
                    type="text"
                    id="playstore"
                    name="playstore"
                    placeholder="Enter App Store URL"
                    className=" bg-black focus:outline-none w-full"
                    autoCapitalize="off"
                    autoComplete="off"
                  />
                </div>
                <Button
                  padding="py-2 px-4"
                  className="mt-8 w-auto"
                  category="white"
                  text="Generate QR"
                  type="submit"
                  loading={loading}
                ></Button>
              </div>
            </form>
          )}
        </SecondScreen>
      </section>
    </AuthProvider>
  );
}
