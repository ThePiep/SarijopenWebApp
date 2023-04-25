import LoginButton from "@/app/LoginButton";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FiAlignLeft, FiMenu } from "react-icons/fi";

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={"navbar bg-base-200 fixed top-0 z-50 "}>
      <div className={"navbar-start"}>
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle"
          onClick={() => setMenuOpen(!menuOpen)}
          onBlur={close}
        >
          <FiMenu color="white" size="20" />
        </label>
        <ul
          tabIndex={1}
          className={`${
            menuOpen ? "" : "hidden"
          }  menu menu-compact dropdown-content 
            p-2 shadow 
              bg-base-100 rounded-box w-52
            fixed top-16 left-0 `}
        >
          <li>
            <a href={"/api/hello"}>Test</a>
          </li>
          <li>
            <a href={"/api/bewoners"}>Bewoner api</a>
          </li>
        </ul>
      </div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Huize Sarijopen
        </Link>
      </div>
      <div className="navbar-end">
        <LoginButton />
      </div>
    </nav>
  );
};
