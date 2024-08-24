"use client";
import dayjs from "dayjs";
import {
  FaAppStoreIos,
  FaGooglePlay,
  FaCalendar,
  FaChartArea,
  FaTrash,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { MdDownload, MdOutlineFileCopy } from "react-icons/md";
import toast from "react-hot-toast";
import { SecondScreen } from "./SecondScreen";
import { useState } from "react";
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

export const downloadQRCode = (id: string) => {
  const svg = document.getElementById("QRCode") as HTMLElement;
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `one-redirect-qrcode-${id}`;
    downloadLink.href = `${pngFile}`;
    downloadLink.click();
  };
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
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
    <div key={key} className="w-full p-4 rounded col-span-1 bg-zinc-800">
      <div className="w-full h-72 flex items-start justify-center gap-1">
        <QRCode
          id="QRCode"
          size={250}
          value={`https://one.devrehan.xyz/api/qr?slug=${path}`}
          level="L"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <p className="bg-zinc-900 px-2 py-1 rounded flex items-center gap-1 ">
          <FaAppStoreIos className="w-5" />
          <span className="line-clamp-1 flex-1">{appStoreURL}</span>
        </p>
        <p className="bg-zinc-900 px-2 py-1 rounded flex items-center gap-1">
          <FaGooglePlay className="w-5" />
          <span className="line-clamp-1 flex-1">{playStoreURL}</span>
        </p>
        <div className="flex items-center justify-between gap-1">
          <p className="bg-zinc-900 px-2 py-1 rounded flex items-center gap-1 flex-1">
            <FaCalendar className="w-5" />
            <span className="line-clamp-1 flex-1">
              {dayjs(createdAt).format("DD MMMM YYYY")}
            </span>
          </p>
          <p className="bg-zinc-900 px-2 py-1 rounded flex items-center gap-1">
            <FaChartArea className="w-5" />
            <span className="line-clamp-1 flex-1">{clicks}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => {
              if (path) downloadQRCode(path);
            }}
            className="bg-white py-4 rounded text-black flex items-center justify-center flex-1"
          >
            <MdDownload />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://one.devrehan.xyz/api/qr?slug=${path}`
              );
              toast.success("Link copied to clipboard");
            }}
            className="bg-white py-4 rounded text-black flex items-center justify-center flex-1"
          >
            <MdOutlineFileCopy />
          </button>
          {qrId ? (
            <button
              onClick={() => {
                setShow(true);
              }}
              className="bg-white py-4 rounded text-black flex items-center justify-center flex-1"
            >
              <FaTrash />
            </button>
          ) : null}
        </div>
      </div>
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
