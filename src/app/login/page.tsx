"use client";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  async function hanldeLogin(email: string, password: string) {
    try {
      if (!email) return toast.error("Email is required");
      if (!password) return toast.error("Password is required");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        const { data } = await response.json();
        toast.success("Login successful");
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        router.push("/dashboard");
      } else {
        toast.error("Something went wrong");
      }
    } catch (e) {
      return toast.error("Something went wrong");
    }
  }

  return (
    <section className="container mx-auto px-6">
      <Navbar />
      <div>
        <h1 className="text-4xl text-center mt-10 font-semibold">
          Login to your account
        </h1>
        <div className=" w-full lg:max-w-sm mx-auto mt-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              hanldeLogin(
                e.currentTarget.email.value,
                e.currentTarget.password.value
              );
            }}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
                autoCapitalize="off"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
              />
            </div>
            <Button
              padding="py-4"
              className="mt-8"
              category="white"
              text="Login"
              type="submit"
            ></Button>
          </form>
          <p className="mt-4 text-xl">
            Or{" "}
            <Link
              href="/signup"
              className="text-gray-400 font-extrabold hover:text-gray-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </section>
  );
}
