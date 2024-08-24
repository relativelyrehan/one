"use client";
import dayjs from "dayjs";
import {
  FaAppStoreIos,
  FaGooglePlay,
  FaCalendar,
  FaChartArea,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { MdDownload, MdOutlineFileCopy } from "react-icons/md";
import toast from "react-hot-toast";

type IProps = {
  key: string;
  path?: string;
  appStoreURL?: string;
  playStoreURL?: string;
  createdAt?: string;
  clicks?: number;
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
}: IProps) {
  return (
    <div key={key} className="w-full p-4 rounded col-span-1 bg-zinc-800">
      <div className="w-full h-72 flex items-start justify-center gap-1">
        <QRCode
          id="QRCode"
          size={250}
          value={`https://one.rehan.fun/api/qr?slug=${path}`}
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
                `https://one.rehan.fun/api/qr?id=${path}`
              );
              toast.success("Link copied to clipboard");
            }}
            className="bg-white py-4 rounded text-black flex items-center justify-center flex-1"
          >
            <MdOutlineFileCopy />
          </button>
        </div>
      </div>
    </div>
  );
}
