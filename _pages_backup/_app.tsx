// pages/_app.tsx
import type { AppProps } from "next/app";
import "../app_backup/globals.css"; // bring in Tailwind styles

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
