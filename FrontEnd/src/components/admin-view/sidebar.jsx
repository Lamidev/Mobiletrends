'use client';

import { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  LayoutDashboard,
  ShoppingBasket,
  Users,
  Store,
  LogOut,
  Truck,
} from "lucide-react";
import { logoutUser } from "@/store/auth-slice";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="w-5 h-5 shrink-0" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="w-5 h-5 shrink-0" />,
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: <Users className="w-5 h-5 shrink-0" />,
  },
  {
    id: "features",
    label: "Delivery Rates",
    path: "/admin/features",
    icon: <Truck className="w-5 h-5 shrink-0" />,
  },
];

function BrandHeader({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer group select-none py-1"
    >
      <img
        src="/logo.jpg"
        alt="Mobiletrends Logo"
        className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform"
      />
      <div className="flex flex-col">
        <span className="font-manrope text-[16px] leading-tight font-extrabold text-[#111344] tracking-tight uppercase">
          Mobile<span className="text-[#0C1172]">trends</span>
        </span>
        <span className="font-body text-[9px] font-bold text-[#DF5E00] uppercase tracking-[0.14em]">
          Systems Limited
        </span>
      </div>
    </div>
  );
}

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6 flex-col flex gap-1.5 font-manrope">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname.startsWith(menuItem.path);
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex cursor-pointer text-[13.5px] font-bold items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all ${
              isActive
                ? "bg-[#111344] text-white shadow-sm ring-1 ring-[#111344]"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <span className={isActive ? "text-white" : "text-gray-500"}>
              {menuItem.icon}
            </span>
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function BottomActions({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  function handleGoToStorefront() {
    if (setOpen) setOpen(false);
    dispatch(logoutUser()).then(() => {
      window.location.href = "/shop/home";
    });
  }

  function handleLogout() {
    if (setOpen) setOpen(false);
    dispatch(logoutUser()).then(() => {
      window.location.href = "/shop/home";
    });
    setIsLogoutDialogOpen(false);
  }

  return (
    <div className="pt-4 border-t border-gray-200 space-y-1 mt-auto font-manrope">
      {/* 1-Click Storefront Switch */}
      <button
        type="button"
        onClick={handleGoToStorefront}
        className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold text-gray-700 hover:bg-gray-100 hover:text-[#111344] transition-all cursor-pointer text-left"
        title="Sign out of admin and switch to customer view"
      >
        <Store className="w-5 h-5 shrink-0 text-[#111344]" />
        <span>View Storefront</span>
      </button>

      {/* Log Out Button */}
      <button
        type="button"
        onClick={() => setIsLogoutDialogOpen(true)}
        className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-left"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span>Log Out</span>
      </button>

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
    </div>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-6 bg-white">
          <div className="flex flex-col h-full justify-between">
            <div>
              <SheetHeader className="border-b pb-4">
                <SheetTitle asChild>
                  <BrandHeader
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setOpen(false);
                    }}
                  />
                </SheetTitle>
              </SheetHeader>
              <MenuItems setOpen={setOpen} />
            </div>

            <BottomActions setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden w-64 lg:w-72 flex-col justify-between border-r border-gray-200 bg-white p-6 lg:flex shrink-0 min-h-screen">
        <div>
          <div className="border-b border-gray-100 pb-5">
            <BrandHeader onClick={() => navigate("/admin/dashboard")} />
          </div>
          <MenuItems />
        </div>

        <BottomActions />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
