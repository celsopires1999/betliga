import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { RegisterForm } from "@/frontend/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
