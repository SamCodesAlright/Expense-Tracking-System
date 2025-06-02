import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {/* User Info */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName || "User"}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}
        <h5 className="text-gray-950 font-medium leading-6">
          {user?.fullName || "User"}
        </h5>
      </div>

      {/* Menu Items */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu${index}`}
          onClick={() => handleClick(item.path)}
          className={`w-full flex items-center gap-4 text-[15px] px-4 py-3 rounded-lg mb-2 transition-colors duration-200
            ${
              activeMenu === item.label
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
        >
          {item.icon && <item.icon className="text-xl" />}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
