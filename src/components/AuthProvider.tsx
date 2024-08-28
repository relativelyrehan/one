"use client";
import { isLoggedInAtom } from "@/lib/atoms";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window) {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      setIsLoggedIn(!!token);
      if (token && ["/login", "/signup"].indexOf(pathname) !== -1) {
        router.push("/dashboard");
        setIsLoggedIn(true);
      } else if (
        !token &&
        ["/dashboard", "/dashboard-new", "/profile"].indexOf(pathname) !== -1
      ) {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
