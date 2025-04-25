import { SessionProvider } from "next-auth/react";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";



function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
