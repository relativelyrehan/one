"use client";
import { isLoggedInAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { CiMenuFries } from "react-icons/ci";
export default function Navbar({
  type,
  setShow,
}: {
  type?: string;
  setShow?: any;
}) {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  if (!type) {
    return (
      <nav className="text-base font-semibold flex justify-between items-center gap-1 cursor-pointer hover:bg-opacity-80 py-4 dm-serif-text-regular">
        <p className="text-2xl uppercase text-gray-100 ">
          <Link href="/">ONETAPQR</Link>
        </p>
        {isLoggedIn ? (
          <Link href={"/profile"}>
            <div className="flex items-center gap-2">
              <FaUser size={24} />
              <span className="">Profile</span>
            </div>
          </Link>
        ) : (
          <Link href={"/login"}>
            <span className="text-lg lg:text-xl">Login</span>
          </Link>
        )}
      </nav>
    );
  }

  return (
    <nav className="text-base font-semibold flex-row-reverse flex lg:flex-row justify-between items-center gap-1 cursor-pointer hover:bg-opacity-80 py-4 lg:py-6 dm-serif-text-regular bg-bgColor px-4">
      <p className="text-2xl uppercase text-gray-100 ">
        <button
          onClick={() => {
            setShow((p: boolean) => !p);
          }}
          className="block lg:hidden transform rotate-280"
        >
          <CiMenuFries />
        </button>
        <Link href="/dashboard" className="hidden lg:block">
          <IoQrCode />
        </Link>
      </p>
      <Link
        href={"/profile"}
        className="h-6 w-6 border border-zinc-400/50 rounded flex items-center justify-center"
      >
        <CiUser size={14} />
      </Link>
    </nav>
  );
}
