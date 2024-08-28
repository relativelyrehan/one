"use client";
import dayjs from "dayjs";
import {
  FaAppStoreIos,
  FaGooglePlay,
  FaCalendar,
  FaChartArea,
  FaTrash,
} from "react-icons/fa";
import { QRCode } from "react-qrcode-logo";
import { MdDownload, MdOutlineFileCopy } from "react-icons/md";
import toast from "react-hot-toast";
import { SecondScreen } from "./SecondScreen";
import { useRef, useState } from "react";
import { Button } from "./Button";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import { useAtom } from "jotai";
import { refetchAtom } from "@/lib/atoms";

type IProps = {
  key: string;
  path?: string;
  appStoreURL?: string;
  playStoreURL?: string;
  createdAt?: string;
  clicks?: number;
  qrId?: string;
};

export function QRCard({
  key,
  path,
  appStoreURL,
  playStoreURL,
  createdAt,
  clicks,
  qrId,
}: IProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setRefetch] = useAtom(refetchAtom);

  const [downloadModal, setDownloadModal] = useState(false);
  const ref = useRef<QRCode>(null);
  const customRef = useRef<QRCode>(null);

  const [customValues, setCustomValues] = useState({
    background: "#ffffff",
    foreground: "#000000",
    eyeColor: "#000000",
    style: "squares",
  });

  async function handleDelete(id: string) {
    try {
      if (!id) return toast.error("Failed to delete QR code");
      setLoading(true);
      const response = await fetch(`/api/entry/?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
        },
      });
      if (response.status === 200) {
        toast.success("QR code deleted successfully");
        setRefetch((prev) => prev + 1);
        setLoading(false);
        handleClose();
      } else {
        toast.error("Failed to delete QR code");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Failed to delete QR code");
    }
  }

  function handleClose() {
    if (loading) return;
    setShow(false);
  }

  return (
    <div key={key} className="w-full p-4 rounded col-span-1 bg-bgColor">
      <div className="w-full h-56 flex items-start justify-center gap-1">
        <QRCode
          ref={ref}
          id={path}
          size={180}
          value={`https://www.onetapqr.xyz/api/qr?slug=${path}`}
          ecLevel="M"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <p className="bg-zinc-800 px-2 py-1 rounded flex items-center gap-1 ">
          <FaAppStoreIos className="w-5" />
          <span className="line-clamp-1 flex-1">{appStoreURL}</span>
        </p>
        <p className="bg-zinc-800 px-2 py-1 rounded flex items-center gap-1">
          <FaGooglePlay className="w-5" />
          <span className="line-clamp-1 flex-1">{playStoreURL}</span>
        </p>
        <div className="flex items-center justify-between gap-1">
          <p className="bg-zinc-800 px-2 py-1 rounded flex items-center gap-1 flex-1">
            <FaCalendar className="w-5" />
            <span className="line-clamp-1 flex-1">
              {dayjs(createdAt).format("DD MMMM YYYY")}
            </span>
          </p>
          <p className="bg-zinc-800 px-2 py-1 rounded flex items-center gap-1">
            <FaChartArea className="w-5" />
            <span className="line-clamp-1 flex-1">{clicks}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => {
              if (path)
                ref.current?.download("png", `one-redirect-qrcode-${path}`);
            }}
            className="bg-white py-2 rounded text-black flex items-center justify-center flex-1 lg:hidden"
          >
            <MdDownload />
          </button>
          <button
            onClick={() => {
              setDownloadModal(true);
            }}
            className="bg-white py-2 rounded text-black hidden items-center justify-center flex-1 lg:flex"
          >
            <MdDownload />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://www.onetapqr.xyz/api/qr?slug=${path}`
              );
              toast.success("Link copied to clipboard");
            }}
            className="bg-white py-2 rounded text-black flex items-center justify-center flex-1"
          >
            <MdOutlineFileCopy />
          </button>
          {qrId ? (
            <button
              onClick={() => {
                setShow(true);
              }}
              className="bg-white py-2 rounded text-black flex items-center justify-center flex-1"
            >
              <FaTrash />
            </button>
          ) : null}
        </div>
      </div>
      <SecondScreen
        title="Editor"
        show={downloadModal}
        onClose={() => setDownloadModal(false)}
      >
        <div className="p-6 flex items-start justify-center gap-5">
          <QRCode
            size={250}
            value={`https://www.onetapqr.xyz/api/qr?slug=${path}`}
            ecLevel="M"
            ref={customRef}
            bgColor={customValues.background}
            fgColor={customValues.foreground}
            qrStyle={customValues.style as "squares" | "dots" | "fluid"}
            eyeColor={customValues.eyeColor}
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-lg">
                Background
              </label>
              <input
                type="text"
                id="background"
                name="background"
                placeholder="eg. #ffffff"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
                autoCapitalize="off"
                autoComplete="off"
                value={customValues.background}
                onChange={(e) => {
                  setCustomValues((prev) => ({
                    ...prev,
                    background: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-lg">
                Foreground
              </label>
              <input
                type="text"
                id="foreground"
                name="foreground"
                placeholder="eg. #000000"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
                autoCapitalize="off"
                autoComplete="off"
                value={customValues.foreground}
                onChange={(e) => {
                  setCustomValues((prev) => ({
                    ...prev,
                    foreground: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-lg">
                Eye Color
              </label>
              <input
                type="text"
                id="eye color"
                name="eye color"
                placeholder="eg. #000000"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
                autoCapitalize="off"
                autoComplete="off"
                value={customValues.eyeColor}
                onChange={(e) => {
                  setCustomValues((prev) => ({
                    ...prev,
                    eyeColor: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-lg">
                Style
              </label>
              <select
                id="style"
                name="style"
                placeholder="eg. #000000"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
                autoCapitalize="off"
                autoComplete="off"
                value={customValues.style}
                onChange={(e) => {
                  setCustomValues((prev) => ({
                    ...prev,
                    style: e.target.value,
                  }));
                }}
              >
                <option value="squares">Squares</option>
                <option value="dots">Dots</option>
                <option value="fluid">Fluid</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (path)
                  customRef.current?.download(
                    "png",
                    `one-redirect-qrcode-${path}`
                  );
              }}
              className="bg-white py-4 rounded text-black flex items-center justify-center flex-1 "
            >
              <MdDownload />
            </button>
            <button
              onClick={() => {
                setShow(true);
              }}
              className="bg-white py-4 rounded text-black flex items-center justify-center flex-1"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </SecondScreen>
      <SecondScreen title="Delete QR" show={show} onClose={handleClose}>
        <div className="p-6">
          <p className="text-center text-lg mb-6">
            Are you sure you want to delete this QR code? This action cannot be
            undone.
          </p>
          <div className="flex gap-4">
            <Button category="white" text="Cancel" onClick={handleClose} />
            <Button
              loading={loading}
              category="danger"
              text="Delete"
              onClick={() => {
                if (qrId) handleDelete(qrId);
              }}
            />
          </div>
        </div>
      </SecondScreen>
    </div>
  );
}
