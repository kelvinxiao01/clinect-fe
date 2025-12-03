import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default async function Home() {
  try {
    const user = await getCurrentUser();

    if (user.logged_in) {
      redirect("/search");
    } else {
      redirect("/login");
    }
  } catch (error) {
    // If API is unreachable, redirect to login
    redirect("/login");
  }
}
