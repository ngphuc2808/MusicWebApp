import ThemeRegistry from "@/components/theme-registry/theme.registry";
import NextAuthWrapper from "./lib/next.auth.wrapper";
import { ToastProvider } from "@/utils/toast";
import { TrackContextProvider } from "./lib/track.wrapper";
import Script from "next/script";

import type { Metadata } from "next";
import NProgessWrapper from "./lib/nprogress.wrapper";

export const metadata: Metadata = {
  title: "SoundClound Clone",
  description: "Clone soundclone with Next.Js 13",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const idJsonObject = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Tiki",
    image: {
      "@type": "ImageObject",
      url: "https://salt.tikicdn.com/cache/w500/ts/upload/c0/8b/46/c3f0dc850dd93bfa7af7ada0cbd75dc0.png",
      width: 1080,
      height: 1080,
    },
    telephone: "19006035",
    url: "https://tiki.vn/",
    address: {
      "@type": "PostalAddress",
      streetAddress: "52 Ut Tich, Ward 4, Tan Binh District, Ho Chi Minh City",
      addressLocality: "Ho Chi Minh",
      postalCode: "700000",
      addressRegion: "Ho Chi Minh",
      addressCountry: "VN",
    },
    priceRange: "1000 - 1000000000",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "21:00",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: "10.79664498748942",
      longitude: "106.65856519879867",
    },
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <NProgessWrapper>
            <TrackContextProvider>
              <NextAuthWrapper>
                <ToastProvider>{children}</ToastProvider>
              </NextAuthWrapper>
            </TrackContextProvider>
          </NProgessWrapper>
        </ThemeRegistry>
      </body>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(idJsonObject) }}
      />
    </html>
  );
}
