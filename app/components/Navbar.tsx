"use client";

import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  type navLink = { link: string; name: string; key: number }[];

  const protectedNavLinks: navLink = [
    { link: "/", name: "Home", key: 0 },
    { link: "/dashboard", name: "Dashboard", key: 1 },
    { link: "/upload", name: "Upload", key: 2 },
  ];

  const logOut = () => {
    deleteCookie("x-auth-token");
    router.replace("/auth");
  };

  return (
    <nav className="!bg-slate-500 p-6 text-white space-x-3 flex justify-end">
      {/* <Link href="/dashboard" className="hover:scale-110 duration-200 active:scale-100 justify-self-start">Logo</Link> */}
      {protectedNavLinks.map(({ link, name, key }) => (
        <Link
          href={link}
          key={key}
          className="hover:scale-110 duration-200 active:scale-100"
        >
          {/* <span > */}
          {name} {/* </span> */}
        </Link>
      ))}
      <button
        className="hover:scale-110 duration-200 active:scale-100"
        onClick={logOut}
      >
        LogOut
      </button>
    </nav>
  );
};

export default Navbar;
