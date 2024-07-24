"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Anonimo
          </h1>
          <p>“Connect, Share, and Stay Anonymous!”</p>
          <p className="mt-3 md:mt-4 text-md md:text-base">
            Our platform allows you to send and receive anonymous messages.
            Whether you want to express your thoughts or simply have fun. Join
            today and experience the freedom of anonymous communication!
          </p>
          <p className="mt-4">
            Sign up to get started{" "}
            <Link href={"/sign-up"} className="text-sky-600">
              Signup
            </Link>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-500 text-white">
        © 2023 Anonimo app. All rights reserved.
      </footer>
    </>
  );
}
