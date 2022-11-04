import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-slate-200 py-20 min-h-screen ">
      <div className="max-w-4xl mx-auto box-border px-10">
        <h1 className="text-md font-bold text-left mb-10">
          <Link href={"/"}>rainbowconnection.com</Link>
        </h1>{" "}
        <Component {...pageProps} />
      </div>
    </div>
  );
}
