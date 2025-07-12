// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";

// const Navbar = () => {
//   const { data: session, status } = useSession();
//   const [showdropdown, setShowdropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowdropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (status === "loading") {
//     return <div>Loading...</div>; // Show a loading state while session data is being fetched
//   }

//   return (
//     <nav className="bg-gray-900 text-white flex justify-between items-center px-4 md:h-16 flex-direction-col md:flex-row ">
//       {/* Logo */}
//       <Link className="logo font-bold text-lg flex items-center justify-center" href="/">
//         <Image className="invertImg" src="/coffee.gif" width={44} height={44} alt="Coffee logo" unoptimized />
//         <span> BringMeACoffee!!! </span>
//       </Link>

//       {/* Dropdown and Buttons */}
//       <div className="relative" ref={dropdownRef}>
//         {session ? (
//           <>
//             {/* Dropdown Button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation(); // Prevent event propagation
//                 setShowdropdown(!showdropdown);
//               }}
//               id="dropdownDefaultButton"
//               data-dropdown-toggle="dropdown"
//               aria-expanded={showdropdown}
//               className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm mx-4 px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//               type="button"
//             >
//               Welcome {session.user.email}
//               <svg
//                 className="w-2.5 h-2.5 ms-3"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 10 6"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m1 1 4 4 4-4"
//                 />
//               </svg>
//             </button>

//             {/* Dropdown Menu */}
//             <div
//               id="dropdown"
//               className={`z-10 ${showdropdown ? "block" : "hidden"} absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
//             >
//               <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
//                 <li>
//                   <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                     Dashboard
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href= {`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                     Your Page
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => signOut()}
//                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                   >
//                     Sign out
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </>
//         ) : (
//           // Login Button
//           <Link href="/login">
//             <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
//               Login
//             </button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    if (!mobileMenuOpen) setShowDropdown(false);
  }, [mobileMenuOpen]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
      {/* Logo */}
      <Link className="flex items-center gap-2 font-bold text-lg" href="/">
        <Image className="invertImg" src="/coffee.gif" width={44} height={44} alt="Coffee logo" unoptimized />
        <span>BringMeACoffee!!!</span>
      </Link>

      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex items-center px-3 py-2"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center relative" ref={dropdownRef}>
        {session ? (
          <>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm mx-4 px-5 py-2.5 text-center inline-flex items-center"
              type="button"
            >
              Welcome {session.user.email}
              <svg className="w-2.5 h-2.5 ms-3 ml-2" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {/* Dropdown */}
            <div
              className={`z-10 ${showDropdown ? "block" : "hidden"} absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Your Page
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/login">
            <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-gray-900 z-40 transition-all duration-200 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
        ref={dropdownRef}
      >
        <div className="flex flex-col items-center py-4 space-y-2">
          {session ? (
            <>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center"
                type="button"
              >
                Welcome {session.user.email}
                <svg className="w-2.5 h-2.5 ms-3 ml-2" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              {/* Dropdown in mobile */}
              <div className={`w-full ${showDropdown ? "block" : "hidden"} bg-white dark:bg-gray-700 rounded-lg shadow-sm mt-2`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Your Page
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link href="/login">
              <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
