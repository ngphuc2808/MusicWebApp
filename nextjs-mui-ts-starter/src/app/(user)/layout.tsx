import AppHeader from "@/components/global/header/app.header";
import AppFooter from "@/components/global/footer/app.footer";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      {children}
      <div style={{ marginBottom: "100px" }}></div>
      <AppFooter />
    </>
  );
};

export default UserLayout;
