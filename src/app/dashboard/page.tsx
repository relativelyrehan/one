"use client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/Button";
import { QRCard } from "@/components/QRCard";
import { SecondScreen } from "@/components/SecondScreen";
import { handleSubmitQR } from "@/service/qr";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaAppStoreIos, FaGooglePlay } from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalQr: 0,
    totalClicks: 0,
    limit: 0,
  });
  const [qrList, setQrList] = useState<TQr[]>([]);
  const [createQR, setCreateQR] = useState(false);
  const [newQr, setNewQr] = useState({
    id: "",
    app_store_url: "",
    play_store_url: "",
    created_at: "",
    updated_at: "",
    deleted_at: "",
    user_id: "",
    slug: "",
    clicks: 0,
  });

  function handleClose() {
    setCreateQR(false);
    setNewQr({
      id: "",
      app_store_url: "",
      play_store_url: "",
      created_at: "",
      updated_at: "",
      deleted_at: "",
      user_id: "",
      slug: "",
      clicks: 0,
    });
  }

  async function getDashboardData() {
    try {
      setPending(true);
      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
          "content-type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setQrList(data.data.qr);
        setStats({
          totalClicks: data.data.totalClicks,
          totalQr: data.data.totalQr,
          limit: data.data.limit,
        });
        setPending(false);
      } else {
        toast.error("Something went wrong");
        setPending(false);
      }
    } catch (e) {
      toast.error("Something went wrong");
      setPending(false);
      console.error(e);
    }
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <AppLayout>
      <section>
        <div className="flex mb-6 items-center justify-between">
          <h1 className="text-4xl font-semibold flex-1">You Stats</h1>
          <div>
            <Button
              padding="py-1 px-4"
              className="w-32"
              category="white"
              text="Generate QR"
              type="submit"
              onClick={() => setCreateQR(true)}
            ></Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {pending ? (
            <>
              {new Array(4).fill(0).map((_, k) => (
                <div
                  key={k}
                  className="col-span-1 bg-zinc-500 px-6 py-16 animate-pulse"
                ></div>
              ))}
            </>
          ) : (
            <>
              <div className="col-span-1 bg-bgColor px-6 py-8">
                <p className="text-lg">Total QR</p>
                <p className="text-4xl font-semibold">{stats.totalQr}</p>
              </div>
              <div className="col-span-1 bg-bgColor px-6 py-8">
                <p className="text-lg">Total Clicks</p>
                <p className="text-4xl font-semibold">{stats.totalClicks}</p>
              </div>
              <div className="col-span-1 bg-bgColor px-6 py-8">
                <p className="text-lg">Limit</p>
                <p className="text-4xl font-semibold">{stats.limit}</p>
              </div>
            </>
          )}
        </div>
        <div>
          {qrList.length ? (
            <h1 className="text-4xl font-semibold flex-1">Top QRs</h1>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-6">
            {pending
              ? new Array(4).fill(0).map((_, k) => (
                  <div
                    className="col-span-1 bg-zinc-800 animate-pulse h-96 p-6"
                    key={k}
                  >
                    <div className="h-40 w-full bg-zinc-500 animate-pulse"></div>
                    <div className="h-10 w-full bg-zinc-500 animate-pulse mb-2"></div>
                    <div className="h-10 w-full bg-zinc-500 animate-pulse mb-2"></div>
                    <div className="h-10 w-full bg-zinc-500 animate-pulse mb-2"></div>
                  </div>
                ))
              : qrList
                  .sort((a, b) => {
                    return b.clicks - a.clicks;
                  })
                  ?.map((qr, k) => (
                    <QRCard
                      key={qr.id}
                      path={qr.slug}
                      appStoreURL={qr.app_store_url}
                      playStoreURL={qr.play_store_url}
                      createdAt={qr.created_at}
                      clicks={qr.clicks}
                      qrId={qr.id}
                    />
                  ))}
          </div>
        </div>
        {qrList.length === 0 && !pending ? (
          <div>
            <h1 className="text-2xl font-semibold">No QRs found</h1>
            <p className="text-zinc-400">
              Generate a new QR code by clicking on the "Generate QR" button
            </p>
          </div>
        ) : null}
      </section>
      <SecondScreen title="Create QR" show={createQR} onClose={handleClose}>
        {newQr.id ? (
          <div className="p-6">
            <QRCard
              key={newQr.id}
              path={newQr.slug}
              appStoreURL={newQr.app_store_url}
              playStoreURL={newQr.play_store_url}
              createdAt={newQr.created_at}
              clicks={newQr.clicks}
            />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (loading) return;
              handleSubmitQR(
                e.currentTarget.appstore.value,
                e.currentTarget.playstore.value,
                setLoading,
                setNewQr,
                setQrList,
                true, // redirect to links
                router
              );
            }}
            className="w-full p-6"
          >
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="appstore" className="text-lg">
                App Store
              </label>
              <div className="w-full flex items-center border border-zinc-800 rounded-md px-3 py-4 gap-2">
                <FaAppStoreIos className="text-gray-500" size={24} />
                <input
                  type="text"
                  id="appstore"
                  name="appstore"
                  placeholder="Enter App Store URL"
                  className=" bg-black focus:outline-none w-full"
                  autoCapitalize="off"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full mt-3">
              <label htmlFor="playstore" className="text-lg">
                Play Store
              </label>
              <div className="w-full flex items-center border border-zinc-800 rounded-md px-3 py-4 gap-2">
                <FaGooglePlay className="text-gray-500" size={24} />
                <input
                  type="text"
                  id="playstore"
                  name="playstore"
                  placeholder="Enter App Store URL"
                  className=" bg-black focus:outline-none w-full"
                  autoCapitalize="off"
                  autoComplete="off"
                />
              </div>
              <Button
                padding="py-2 px-4"
                className="mt-8 w-auto"
                category="white"
                text="Generate QR"
                type="submit"
                loading={loading}
              ></Button>
            </div>
          </form>
        )}
      </SecondScreen>
    </AppLayout>
  );
}
