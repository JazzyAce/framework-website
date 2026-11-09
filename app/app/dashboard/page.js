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
      <p>Your filmmaking workspace is ready to begin.</p>
      <p>
        <Link
          href="/analyze"
          style={{
            display: "inline-block",
            padding: "14px 22px",
            background: "#244b83",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            marginTop: "15px"
          }}
        >
          Analyze a Screenplay
        </Link>
      </p>
      <Link href="/auth/sign-out">Sign out</Link>
    </main>
  );
}
