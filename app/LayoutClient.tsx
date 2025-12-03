"use client";

import { usePathname } from "next/navigation";
import Nav from "./components/Nav";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Nav />}
      {children}
    </>
  );
}
