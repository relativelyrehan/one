import { AUTH_TOKEN_KEY } from "@/utils/constants";
import toast from "react-hot-toast";

export async function handleSubmitQR(
  app_url: string,
  play_url: string,
  setLoading: any,
  setNewQr: any,
  setQrList: any,
  redirect?: boolean,
  router?: any
) {
  if (!app_url || !play_url) {
    return toast.error("Please fill in both app store links");
  }
  if (!app_url.includes("https://apps.apple.com/")) {
    return toast.error("Please enter valid app store link");
  }
  if (!play_url.includes("https://play.google.com")) {
    return toast.error("Please enter valid play store link");
  }
  try {
    setLoading(true);
    const response = await fetch("/api/entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
      },
      body: JSON.stringify({ app_url: app_url, play_url: play_url }),
    });
    if (response.status == 200) {
      setLoading(false);
      const data = await response.json();
      setNewQr(data.qr);
      setQrList((prev: TQr[]) => [data.qr, ...prev]);
      redirect && router.push("/qr-link");
      return toast.success("QR code generated successfully");
    } else {
      const data = await response.json();
      setLoading(false);
      if (data?.message) {
        return toast.error(data.message);
      }
      return toast.success("Something went wrong");
    }
  } catch (error) {
    toast.error("Something went wrong");
    setLoading(false);
  }
}
