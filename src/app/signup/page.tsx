"use client";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window && localStorage.getItem(AUTH_TOKEN_KEY)) {
      setIsLoggedIn(true);
      router.push("/dashboard");
    }
  }, [router]);

  async function hanldeLogin(
    email: string,
    password: string,
    re_password: string
  ) {
    try {
      setShowPassword(false);
      if (!email) return toast.error("Email is required");
      if (!password) return toast.error("Password is required");
      if (!re_password) return toast.error("Confirm password is required");
      if (password !== re_password)
        return toast.error("Passwords do not match");
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 200) {
        toast.success("Login successful");
        const data = await response.json();
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        router.push("/dashboard");
        setLoading(false);
      }
      if (response.status === 400) {
        const data = await response.json();
        setLoading(false);
        return toast.error(data);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      return toast.error("Something went wrong");
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="container mx-auto px-6">
      <Navbar />
      <div>
        <h1 className="text-4xl text-center mt-10 font-semibold">
          Sign up to your account
        </h1>
        <div className=" w-full lg:max-w-sm mx-auto mt-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (loading) return;
              hanldeLogin(
                e.currentTarget.email.value,
                e.currentTarget.password.value,
                e.currentTarget.re_password.value
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
                Password{" "}
                <button
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-orange-400 text-xs"
                  type="button"
                >
                  {showPassword ? `( hide )` : `( show )`}
                </button>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <label htmlFor="re_password" className="text-lg">
                Confirm Password
              </label>
              <input
                type="password"
                id="re_password"
                name="re_password"
                placeholder="Enter your password"
                className="px-3 py-4 border border-zinc-800 rounded-md bg-black focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
              />
            </div>
            <Button
              padding="py-4"
              className="mt-8"
              category="white"
              text="Sign Up"
              type="submit"
              loading={loading}
            ></Button>
          </form>
          <p className="mt-4 text-xl">
            Or{" "}
            <Link
              href="/login"
              className="text-gray-400 font-extrabold hover:text-gray-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </section>
  );
}
