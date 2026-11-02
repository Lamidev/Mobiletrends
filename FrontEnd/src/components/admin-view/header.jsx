'use client';

import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { AlignJustify, UserCircle } from "lucide-react";

function AdminHeader({ setOpen }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="font-manrope flex items-center justify-between px-3 sm:px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          className="lg:hidden rounded-lg h-9 w-9 text-gray-700 border-gray-200"
        >
          <AlignJustify size={18} />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Mobile Logo Title */}
        <div className="flex lg:hidden items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Mobiletrends"
            className="w-7 h-7 object-contain rounded"
          />
          <span className="text-xs font-bold text-[#111344] uppercase tracking-wide">
            Mobiletrends
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Admin User Info */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs">
          <UserCircle className="w-4 h-4 text-[#111344]" />
          <span className="font-semibold text-gray-700">
            {user?.userName || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
