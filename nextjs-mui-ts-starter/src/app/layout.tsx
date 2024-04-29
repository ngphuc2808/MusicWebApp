import ThemeRegistry from "@/components/theme-registry/theme.registry";
import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";
import NextAuthWrapper from "./lib/next.auth.wrapper";
import { ToastProvider } from "@/utils/toast";
import { TrackContextProvider } from "./lib/track.wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <TrackContextProvider>
            <NextAuthWrapper>
              <ToastProvider>{children}</ToastProvider>
            </NextAuthWrapper>
          </TrackContextProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
