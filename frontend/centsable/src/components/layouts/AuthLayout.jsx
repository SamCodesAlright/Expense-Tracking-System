import React from "react";
import LOGIN_CARD from "../../assets/images/loginCard.png";
import { LuTrendingUpDown } from "react-icons/lu";
import logo from "../../assets/images/logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CentsAble Logo" className="w-60 h-14" />
        </div>
        {children}
      </div>

      <div className="hidden md:block w-[40vw] h-screen bg-green-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-lime-600 absolute -top-7 -left-5 transition-transform duration-300 hover:scale-110" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-emerald-600 absolute top-[30%] -right-10 transition-transform duration-300 hover:scale-110" />
        <div className="w-48 h-48 rounded-[40px] bg-lime-500 absolute -bottom-7 -left-5 transition-transform duration-300 hover:scale-110" />

        <div className="grid grid-cols-1 z-40">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income and Expenses"
            value="40,000"
            color="bg-primary"
          />
        </div>

        <img
          alt="Login Card"
          src={LOGIN_CARD}
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-lime-400/10 border border-gray-200/50 z-10">
      <div
        className={`w-12 h-12 flex-items-center justify-center text-[36px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
        <span className="text-[20px]">₹{value}</span>
      </div>
    </div>
  );
};
