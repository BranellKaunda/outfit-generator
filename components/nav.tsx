"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/">Home</Link>
      <Link href="/upload">Closet</Link>
      <Link href="/outfits">Outfits</Link>
      <Link href="/try">Try On</Link>
    </nav>
  );
}
