import { StoreProvider } from "@/redux/store/StoreProvider";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import PushNotificationLayout from "@/components/firebaseNotification/PushNotification";
import ScrollToTop from "@/components/ScrollToTop";
import { BookingDetailsProvider } from "@/contexts/BookingDetails";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import NavigationProgress from "@/components/NavigationProgress";
import { GoogleAnalytics } from '@next/third-parties/google'
import ClarityProvider from "@/components/commonComponents/ClarityProvider";
import { getSettingsServer } from "@/api/server/getSettingsServer";
import { initialState as settingsInitialState } from "@/redux/reducers/settingsSlice";
import type { RootState } from "@/redux/store";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_TITLE,
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  keywords: process.env.NEXT_PUBLIC_KEYWORDS,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: process.env.NEXT_PUBLIC_TITLE ?? "eStay",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: process.env.NEXT_PUBLIC_TITLE,
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: process.env.NEXT_PUBLIC_TITLE,
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let preloadedState: Partial<RootState> | undefined;
  try {
    const settingsResponse = await getSettingsServer();
    preloadedState = { settings: { ...settingsInitialState, data: settingsResponse?.data!  } };
  } catch {
    preloadedState = undefined;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics gaId={process?.env?.NEXT_PUBLIC_MEASUREMENT_ID || ''} />
      <ClarityProvider />
      <body
        className={`${outfit.variable} antialiased pointer-events-auto!`}
        suppressHydrationWarning
      >
        <StoreProvider preloadedState={preloadedState}>
          <BookingDetailsProvider>
            <NavigationProgress />
            <ScrollToTop />
            <Toaster position="top-right" />
            <Providers>
              <PushNotificationLayout>
                {children}
              </PushNotificationLayout>
              <InstallPrompt />
            </Providers>
          </BookingDetailsProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
