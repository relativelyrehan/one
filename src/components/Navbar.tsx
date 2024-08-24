import { isLoggedInAtom } from "@/lib/atoms";
import { GITHUB_URL } from "@/utils/constants";
import { useAtom } from "jotai";
import Link from "next/link";
import { FaGithubAlt, FaUser } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <nav className="text-base font-semibold flex justify-between items-center gap-1 cursor-pointer hover:bg-opacity-80 py-4">
      <p className="text-2xl uppercase text-gray-100 matemasie-regular">
        <Link href="/">One QR</Link>
      </p>
      {isLoggedIn ? (
        <Link href={"/profile"}>
          <div className="flex items-center gap-2">
            <FaUser size={24} />
            <span className="">Profile</span>
          </div>
        </Link>
      ) : (
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2"
        >
          <FaGithubAlt size={24} />
          <span className="">Github</span>
        </a>
      )}
    </nav>
  );
}
