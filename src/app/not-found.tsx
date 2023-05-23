'use client';
export default function FourOhFour() {
    return (
        <div className="max-w-4xl mx-auto flex flex-col justify-center items-center h-screen px-5">
            <h1 className="text-3xl lg:text-5xl xl:text-7xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                404
            </h1>
            <p className="text-center text-lg mt-3 mb-8 text-gray-600">
                This page does not exist. Click <a href="/" className="text-indigo-400 font-semibold">here</a> to go back to the home page.
            </p>
        </div>
    );
}