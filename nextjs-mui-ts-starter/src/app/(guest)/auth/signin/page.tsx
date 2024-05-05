import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/auth.options";
import AuthSignIn from "@/components/auth/auth.signin";

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return <AuthSignIn />;
};

export default SignInPage;
