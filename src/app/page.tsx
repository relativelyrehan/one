"use client";
import Marquee from "react-fast-marquee";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { FaAppStoreIos, FaGooglePlay } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import { GITHUB_URL } from "@/utils/constants";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <section className="container mx-auto px-4 lg:px-10 xl:px-16 mb-40">
        <Navbar />
        <div className="mx-auto flex lg:flex-row flex-col-reverse justify-center items-center h-auto sm:h-[70vh] lg:h-[60vh]">
          <div className="flex-1">
            <h1 className="text-5xl xl:text-7xl font-semibold mb-1 mt-10">
              Generate one QR for both Playstore and Appstore app links
            </h1>
            <div className="flex w-full lg:w-80 gap-2 mt-4 mb-6">
              <Button
                text="Login"
                category="bordered"
                onClick={() => {
                  router.push("/login");
                }}
              />
              <Button
                text="Sign Up"
                category="white"
                onClick={() => {
                  router.push("/signup");
                }}
              />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center flex-col">
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <IoQrCode className="mx-auto mt-4 h-52 w-52 sm:h-64 sm:w-64 lg:h-96 lg:w-96" />
            </div>
          </div>
        </div>
        <div className="my-10 ">
          <h1 className="text-5xl xl:text-7xl font-semibold mb-1">
            Generate different color QR codes
          </h1>
          <p className="text-lg lg:text-2xl xl:text-3xl mt-3 mb-8 text-gray-600">
            You can generate different color QR codes based on your preference.
            We offer a variety of colors to choose from. Interested? Login now!
          </p>
          <Marquee>
            <div className="flex flex-row gap-6">
              {new Array(5).fill(0).map((_, index) => (
                <div
                  key={_}
                  className={`${index === 4 ? "mr-6" : ""} col-span-1`}
                >
                  <img
                    src={`/eg${index + 1}.png`}
                    alt="example"
                    className="h-60"
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </div>
        <div className="mb-10">
          <h1 className="text-5xl xl:text-7xl font-semibold mb-1">
            How does it work?
          </h1>
          <p className="text-lg lg:text-2xl xl:text-3xl mt-3 mb-8 text-gray-600">
            Add your app store links and generate a QR code that will redirect
            to the correct app store based on the user&apos;sdevice. An iOS user
            will be redirected to the App Store, while an Android user will be
            redirected to play store. Interested? Login now!
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
            <div className="col-span-1 bg-zinc-800/50 rounded p-3 py-16">
              <p className="text-3xl text-center">Add Apple Store Link</p>
              <p>
                <FaAppStoreIos size={100} className="mx-auto mt-4" />
              </p>
            </div>
            <div className="col-span-1 bg-zinc-800/50 rounded p-3 py-16">
              <p className="text-3xl text-center">Add Play Store Link</p>
              <p>
                <FaGooglePlay size={100} className="mx-auto mt-4" />
              </p>
            </div>
            <div className="col-span-1 bg-zinc-800/50 rounded p-3 py-16">
              <p className="text-3xl text-center">Get your QR Code</p>
              <p>
                <IoQrCode size={100} className="mx-auto mt-4" />
              </p>
            </div>
          </div>
          <div className="flex w-full lg:w-80 gap-3">
            <Button
              text="Login"
              category="bordered"
              onClick={() => {
                router.push("/login");
              }}
            />
            <Button
              text="Sign Up"
              category="white"
              onClick={() => {
                router.push("/signup");
              }}
            />
          </div>
        </div>
      </section>
      <footer className="bg-zinc-800/50 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-10 xl:px-16 flex flex-col lg:flex-row justify-between gap-6 lg:gap-0">
          <div className="flex flex-col">
            <p className="text-2xl mb-2">Quick Links</p>
            <Link href="/login" className="mb-1 text-lg text-gray-400">
              Login
            </Link>
            <Link href="/signup" className="mb-1 text-lg text-gray-400">
              Sign Up{" "}
            </Link>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl mb-2">About</p>
            <Link
              href="https://github.com/relativelyrehan/one"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 text-lg text-gray-400"
            >
              Source Code
            </Link>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl mb-2">About Me</p>
            <Link
              href="https://devrehan.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 text-lg text-gray-400"
            >
              Personal Website
            </Link>
            <Link
              href="https://blog.devrehan.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 text-lg text-gray-400"
            >
              Blog
            </Link>
            <Link
              href="https://github.com/relativelyrehan"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 text-lg text-gray-400"
            >
              My Github
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
}
