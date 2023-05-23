"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import QRCode from "react-qr-code";
import { downloadQRCode } from "@/lib/helpers";
import { IoClose } from "react-icons/io5";

export default function Home() {
  interface Urls {
    app_url: string;
    play_url: string;
  }

  const [loading, setLoading] = useState<Boolean>(false);
  const [urls, setUrls] = useState({ app_url: "", play_url: "" });
  const [qr, setQr] = useState("");

  const handleSubmit = async (urls: Urls) => {
    try {
      if (urls.app_url === "" || urls.play_url === "") {
        return toast.error("Please fill in both app store links");
      }
      if (!urls.app_url.includes("https://apps.apple.com/")) {
        return toast.error("Please enter valid app store link");
      }
      if (!urls.play_url.includes("https://play.google.com"))
        return toast.error("Please enter valid play store link");
      setLoading(true);
      const response = await fetch("/api/qr", {
        method: "POST",
        body: JSON.stringify({
          app_url: urls.app_url,
          play_url: urls.play_url,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        setLoading(true);
        const data = await response.json();
        setQr(data.qr.id);
        return toast.success("QR code generated successfully");
      } else {
        return toast.success("Something went wrong");
      }
    } catch (e) {
      return toast.error("Something went wrong");
    }
  };
  return (
    <div className="max-w-4xl mx-auto flex flex-col justify-center items-center h-screen px-5">
      {qr ? (
        <div className="fixed inset-0 backdrop-blur-md z-10 flex items-center justify-center px-5">
          <div className="w-96 relative h-auto bg-gray-800 px-4 py-6 rounded-md flex flex-col justify-center items-center">
            <IoClose
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setQr("");
                setLoading(false);
              }}
              size={24}
            />
            <p className="border-y border-white/20 font-semibold text-center py-3 mb-5">
              QR code generated
            </p>
            <QRCode
              id="QRCode"
              size={250}
              value={`https://one.relativelyrehan.co/${qr}`}
              level="L"
            />
            <div className="flex flex-col sm:flex-row gap-3 text-sm mt-5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://one.relativelyrehan.co/${qr}`
                  );
                  toast.success("Link copied to clipboard");
                }}
                type="button"
                className={`bg-slate-100 text-black py-3 mx-auto px-8 transform rounded-e-xl rounded-bl-xl hover:bg-gray-800 hover:text-slate-50 transition-colors ease-in-out hover:border-white/30 border`}
              >
                Copy One Link
              </button>
              <button
                onClick={() => downloadQRCode(qr)}
                type="button"
                className={`text-slate-100 bg-black py-3 mx-auto px-8 transform rounded-e-xl rounded-bl-xl hover:bg-gray-800 hover:text-slate-50 transition-colors ease-in-out hover:border-white/30 border`}
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
          disabled={loading ? true : false}
          type="submit"
          className={`${
            loading ? "bg-opacity-50 cursor-not-allowed" : ""
          } bg-slate-300 text-black py-3 mx-auto px-8 transform rounded-e-xl rounded-bl-xl hover:bg-gray-800 hover:text-slate-50 transition-colors ease-in-out`}
        >
          {loading ? "Generating QR..." : "Generate QR"}
        </button>
      </form>
      <Toaster />
    </div>
  );
}
