import { PRIMARY_COLOR } from "@/model/types";
import Link from "next/link";
import Links from "../../components/navbarLinks";

function Navbar() {
  return (
    <div
      className="flex items-center w-full h-20 px-12 border-b-2"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      <div className="justify-start lg:w-2/5">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <Links />
          </ul>
        </div>
        <Link
          href="/"
          className="font-semibold normal-case text-2xl text-black"
        >
          Modulo I.E. 80892 Los Pinos
        </Link>
      </div>
      <div className="justify-end w-3/5 hidden lg:flex">
        <ul className="menu menu-horizontal space-x-6">
          <Links />
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
