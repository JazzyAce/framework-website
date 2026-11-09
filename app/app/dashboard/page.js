import { auth } from "../../lib/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function DashboardPage() {
  const { data } = await auth.getSession();

  if (!data?.user) redirect("/auth/sign-in");

  return (
    <main style={{ padding: 48 }}>
      <h1>FRAMEWORK Dashboard</h1>
      <p>Welcome, {data.user.name || data.user.email}!</p>
      <p>Your filmmaking workspace is being built.</p>
      <Link href="/auth/sign-out">Sign out</Link>
    </main>
  );
}
