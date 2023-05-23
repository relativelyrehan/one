"use client";

import { headers } from "next/dist/client/components/headers";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  interface Urls {
    app_url: string;
    play_url: string;
  }

  const [loading, setLoading] = useState<Boolean>(false);
  const [urls, setUrls] = useState({ app_url: "", play_url: "" });
  const [qr, setQr] = useState("");
  const handleSubmit =  async (urls: Urls) => {
    try {
      if (urls.app_url === "" || urls.play_url === "") {
        return toast.error("Please fill in both app store links");
      }
      setLoading(true);
      const response = await fetch('/api/qr', {
        method: 'POST',
        body: JSON.stringify({
          app_url: urls.app_url,
          play_url: urls.play_url
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.status == 200) {
        setLoading(true);
        const data = await response.json();
        console.log('data', data.qr.id);
        return toast.success("QR code generated successfully");
      } else {
        return toast.success("Something went wrong");
      }
    } catch(e) {
      return toast.error("Something went wrong");
    }
  };
  return (
    <div className="max-w-4xl mx-auto flex flex-col justify-center items-center h-screen px-5">
      <h1 className="text-3xl lg:text-5xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Generate one QR for both Playstore and Appstore app links
      </h1>
      <p className="text-center text-lg mt-3 mb-8 text-gray-600">
        Add your app store links and generate a QR code that will redirect to
        the correct app store based on the user&apos;sdevice. An iOS user will
        be redirected to the App Store, while an Android user will be redirected
        to play store.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(urls);
        }}
        className="flex flex-col w-2/3 mx-auto gap-6 p-3"
      >
        <div>
          <label
            className="text-gray-400 mb-2 text-xs block"
            htmlFor="app_store"
          >
            Enter App Store URL
          </label>
          <input
            id="app_store"
            type="text"
            value={urls.app_url}
            onChange={(e) => {
              setUrls({ ...urls, app_url: e.target.value });
            }}
            placeholder="https://https://apps.apple.com/us/app/your-awesome-app"
            className="bg-gray-800 px-4 py-3 rounded-lg w-full block placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label
            className="text-gray-400 mb-2 text-xs block"
            htmlFor="play_store"
          >
            Enter App Store URL
          </label>
          <input
            id="play_store"
            type="text"
            value={urls.play_url}
            onChange={(e) => {
              setUrls({ ...urls, play_url: e.target.value });
            }}
            placeholder="https://play.google.com/store/apps/your-awesome-app"
            className="bg-gray-800 px-4 py-3 rounded-lg w-full block placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-300 text-black py-3 mx-auto px-8 transform rounded-e-xl rounded-bl-xl hover:bg-gray-800 hover:text-slate-50 transition-colors ease-in-out"
        >
          Generate QR
        </button>
      </form>
      <Toaster />
    </div>
  );
}
