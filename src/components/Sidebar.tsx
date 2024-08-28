"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiUser, CiLogout } from "react-icons/ci";
import { IoQrCode } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { RiHome4Line } from "react-icons/ri";

export default function Sidebar({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col jus justify-between h-screen px-4 py-4 lg:py-6">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IoQrCode size={24} />
            <span>ONETAPQR</span>
          </div>
          {show ? (
            <button>
              <MdClose size={24} onClick={() => setShow(false)} />
            </button>
          ) : null}
        </div>
        <div className="mt-16 flex flex-col gap-4">
          <Link
            href={"/dashboard"}
            className={`flex gap-2 p-4 rounded items-center ${
              pathname === "/dashboard" ? "bg-zinc-800 font-medium" : ""
            }`}
          >
            <RiHome4Line size={24} />
            <span>Dashboard</span>
          </Link>
          <Link
            href={"/profile"}
            className={`flex gap-2 p-4 rounded items-center ${
              pathname === "/profile" ? "bg-zinc-800 font-medium" : ""
            }`}
          >
            <CiUser size={24} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          location.href = "/";
        }}
        className={`flex gap-2 p-4 rounded items-center`}
      >
        <CiLogout size={24} />
        <span>Logout</span>
      </button>
    </div>
  );
}
