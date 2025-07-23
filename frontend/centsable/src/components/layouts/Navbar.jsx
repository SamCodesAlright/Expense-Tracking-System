import { useState, useContext } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuLogOut, LuLogIn } from "react-icons/lu";
import SideMenu from "./SideMenu";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { logoutUser } from "../../services/authService";
import Swal from "sweetalert2";

const Navbar = ({ activeMenu }) => {
  const navigate = useNavigate();
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const { user, clearUser } = useContext(UserContext);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7CCF00",
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      try {
        await logoutUser();
        clearUser();

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 2000,
        });

        navigate("/login");
      } catch (err) {
        console.error("Logout failed:", err);
        Swal.fire("Error", "Logout failed. Please try again.", "error");
      }
    }
  };

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      {/* Menu Toggle Button */}
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CentsAble Logo" className="w-60 h-14" />
        </div>

        <div className="flex items-center">
          {user ? (
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-md cursor-pointer"
              onClick={handleLogout}
            >
              <LuLogOut size={18} />
              Logout
            </button>
          ) : (
            <button
              className="flex items-center gap-2 bg-lime-600 text-white px-4 py-2 rounded-md hover:bg-lime-700 transition text-md cursor-pointer"
              onClick={handleLogin}
            >
              <LuLogIn size={18} />
              Login
            </button>
          )}
        </div>
      </div>

      {/* SideMenu for small screens */}
      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
