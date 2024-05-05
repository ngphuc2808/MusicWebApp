import type { Metadata } from "next/types";
import Script from "next/script";

import NextAuthWrapper from "./lib/auth.wrapper";
import GlobalContextProvider from "./lib/context.wrapper";
import ProgessWrapper from "./lib/progress.wrapper";
import { ToastProvider } from "@/utils/toast";
import { idJsonObject } from "@/utils/data";
import ThemeRegistry from "@/components/global/theme-registry/theme.registry";
import "./global.css";

export const metadata: Metadata = {
  title: "PTMusic",
  description: "PTMusic with Next.Js 13/14",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <ProgessWrapper>
            <GlobalContextProvider>
              <NextAuthWrapper>
                <ToastProvider>{children}</ToastProvider>
              </NextAuthWrapper>
            </GlobalContextProvider>
          </ProgessWrapper>
        </ThemeRegistry>
      </body>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(idJsonObject) }}
      />
    </html>
  );
};

export default RootLayout;
