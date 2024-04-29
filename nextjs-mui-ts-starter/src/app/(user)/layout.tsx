import AppHeader from "@/components/header/app.header";
import AppFooter from "@/components/footer/app.footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
}
