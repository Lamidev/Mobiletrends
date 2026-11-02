'use client';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AlignJustify, LogOut, UserCircle } from "lucide-react";
import { logoutUser } from "@/store/auth-slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/shop/home");
    });
    setIsLogoutDialogOpen(false);
  }

  return (
    <header className="font-manrope flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
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

      <div className="flex items-center gap-3">
        {/* Admin User Info */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs">
          <UserCircle className="w-4 h-4 text-[#111344]" />
          <span className="font-semibold text-gray-700">
            {user?.userName || "Admin"}
          </span>
        </div>

        {/* Log Out Button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsLogoutDialogOpen(true)}
          className="inline-flex gap-1.5 items-center px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Log Out</span>
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-manrope text-lg font-bold text-gray-900">
              Confirm Log Out
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 py-2">
            Are you sure you want to log out from the Mobiletrends Management Console?
          </p>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
              className="rounded-lg font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              className="rounded-lg font-semibold"
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default AdminHeader;
