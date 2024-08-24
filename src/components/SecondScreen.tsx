"use client";
import { useEffect } from "react";

type IProps = {
  show: boolean;
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  loading?: boolean;
};

export const SecondScreen = ({
  show,
  children,
  title,
  onClose,
  loading,
}: IProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.body.style.overflow = show ? "hidden" : "auto";
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      });

      return () => {
        window.document.body.style.overflow = "auto";
        window.removeEventListener("keydown", () => {});
      };
    }
  }, [onClose, show]);

  if (!show) return <></>;
  return (
    <>
      <div className="fixed lg:hidden h-full w-full bottom-0 left-1/2 transform -translate-x-1/2 dark:bg-white/10 bg-black bg-opacity-50 z-50 backdrop-blur">
        {loading ? (
          <div
            className={`flex flex-col items-center justify-center absolute bottom-0 bg-white dark:bg-black rounded-lg py-4 backdrop-blur-smf w-full rounded-t-2xl`}
          >
            <h1 className="text-xl leading-8 font-semibold tracking-wide text-black dark:text-slate-100 mt-8">
              Creating smart link...
            </h1>
            {/* <Animator
                        animation={LoadingAnimation}
                        height={300}
                        width={300}
                    /> */}
          </div>
        ) : (
          <div
            className={`flex flex-col absolute bottom-0 bg-white dark:bg-black rounded-lg py-4 backdrop-blur-sm w-full rounded-t-2xl slide-in-bottom `}
          >
            <div className="flex items-center justify-between mb-4 px-7">
              <h1 className="text-xl leading-8 font-semibold tracking-wide text-black dark:text-slate-100">
                {title}
              </h1>
              <button
                className="dark:text-white border border-red-400 py-1 px-2 rounded-md text-xs hover:bg-red-400 transition-all hover:text-white"
                onClick={onClose}
              >
                Esc
                {/* <MdClose size={24} className="text-black dark:text-slate-100 dark:hover:text-white hover:text-off" /> */}
              </button>
            </div>
            <div className="border-b border-black/10 dark:border-white/30 mx-5"></div>
            <div className="flex justify-center overflow-hidden">
              {children}
            </div>
          </div>
        )}
      </div>
      <div className="fixed hidden lg:flex top-0 left-0 dark:bg-white/10 bg-black bg-opacity-50 flex-col justify-center items-center z-[100] w-screen h-screen backdrop-blur">
        {loading ? (
          <div className="w-[450px] bg-white dark:bg-black rounded-lg py-8 backdrop-blur-sm flex flex-col justify-center items-center">
            <h1 className="text-xl leading-8 font-semibold tracking-wide text-black dark:text-slate-100">
              Creating smart link...
            </h1>
            {/* <Animator
                        animation={LoadingAnimation}
                        height={300}
                        width={300}
                    /> */}
          </div>
        ) : (
          <div className="w-[450px] xl:w-[768px] bg-white dark:bg-black rounded-lg py-8 backdrop-blur-sm scale-in-center">
            <div className="flex items-center justify-between px-6 pb-4">
              <h1 className="text-xl leading-8 font-semibold tracking-wide text-black dark:text-slate-100">
                {title}
              </h1>
              <button
                className="dark:text-white border border-red-400 py-1 px-2 rounded-md text-xs hover:bg-red-400 transition-all hover:text-white"
                onClick={onClose}
              >
                Esc
                {/* <MdClose size={24} className="text-black dark:text-slate-100 dark:hover:text-white hover:text-off" /> */}
              </button>
            </div>
            <div className="border-b border-black/10 dark:border-white/30 mx-5"></div>
            <div className="border-slate-300"></div>
            {children}
          </div>
        )}
      </div>
    </>
  );
};
