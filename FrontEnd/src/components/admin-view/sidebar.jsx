'use client';

import {
  BadgeCheck,
  LayoutDashboard,
  ShoppingBasket,
  Users,
  Store,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

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

      <div className="pt-4 mt-4 border-t border-gray-200">
        <div
          onClick={() => {
            navigate("/shop/home");
            if (setOpen) setOpen(false);
          }}
          className="flex cursor-pointer text-[13px] font-bold items-center gap-3 rounded-xl px-3.5 py-2.5 text-gray-500 hover:bg-orange-50 hover:text-[#DF5E00] transition-all"
        >
          <Store className="w-5 h-5 shrink-0" />
          <span>View Storefront</span>
        </div>
      </div>
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-6 bg-white">
          <div className="flex flex-col h-full">
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
        </SheetContent>
      </Sheet>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden w-64 lg:w-72 flex-col border-r border-gray-200 bg-white p-6 lg:flex shrink-0">
        <div className="border-b border-gray-100 pb-5">
          <BrandHeader onClick={() => navigate("/admin/dashboard")} />
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
