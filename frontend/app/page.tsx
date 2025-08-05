'use client'
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Home() {
   const { user, logout } = useAuth();
   const pathname = usePathname();
   const hideNav = pathname.startsWith('/api/auth/google/callback');

  return (
    <>
            {!hideNav && (
                <nav>
                    <Link href="/">Home</Link> |{' '}
                    {user ? (
                        <>
                            <Link href="/profile">Profile</Link> |{' '}
                            <span>Welcome, {user.email}!</span> |{' '}
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link href="/login">Login</Link>
                    )}
                </nav>
            )}
        </>
  );
}
