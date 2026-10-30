'use client';

import { LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { logoutUser, directLogout } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

/* Exact SVG icons matching the attached navbar reference */
function SearchIcon({ className = "w-[18px] h-[18px]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HeartOutlineIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
    </svg>
  );
}

function ShoppingBagBoxIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer 3D-top bag box matching reference */}
      <path d="M4.5 7.5 7 4.5h10l2.5 3v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11Z" />
      <path d="M4.5 7.5h15" />
      {/* Inner U-shaped bag handle */}
      <path d="M9.5 11a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

function UserOutlineIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19.5v-1a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v1" />
    </svg>
  );
}

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("filters");
    }

    if (
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "about"
    ) {
      const currentFilter = { category: [getCurrentMenuItem.id] };
      if (typeof window !== "undefined") {
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      }

      if (location.pathname.includes("listing")) {
        setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
        return;
      }
    }

    navigate(getCurrentMenuItem.path);
    if (closeSheet) closeSheet();
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-[31px] lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isActive =
          location.pathname === menuItem.path &&
          (!searchParams.get("category") || searchParams.get("category") === menuItem.id);
        return (
          <div key={menuItem.id} className="relative group">
            <Label
              onClick={() => handleNavigate(menuItem)}
              className={`font-body text-[13.5px] cursor-pointer flex items-center gap-2 py-1 transition-colors duration-200 ${
                isActive
                  ? "text-[#0C1172] font-semibold"
                  : "text-[#141619] font-medium hover:text-[#DF5E00]"
              }`}
            >
              {menuItem.label}
            </Label>
          </div>
        );
      })}
    </nav>
  );
}

function HeaderRightContent({ closeSheet }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(directLogout());
    setIsLogoutDialogOpen(false);
    if (closeSheet) closeSheet();
    navigate("/shop/home");

    dispatch(logoutUser()).catch((error) => {
      console.error("Background logout error:", error);
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/shop/search?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/shop/search");
    }
    if (closeSheet) closeSheet();
  }

  useEffect(() => {
    if (user?.Id) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, user?.Id]);

  return (
    <div className="flex items-center gap-2.5">
      {/* Search Pill */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 h-11 px-4 rounded-full bg-[#F2F3F7] hover:bg-[#E9EBF2] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0C1172]/20 transition-all duration-200"
      >
        <button
          type="submit"
          aria-label="Search gadgets"
          className="text-[#5A606D] hover:text-[#0C1172] transition-colors flex-shrink-0"
        >
          <SearchIcon className="w-[18px] h-[18px]" />
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => {
            if (!searchQuery) navigate("/shop/search");
          }}
          placeholder="Search..."
          className="w-[68px] focus:w-[150px] transition-all duration-300 bg-transparent text-sm font-medium text-gray-900 placeholder:text-[#5A606D] focus:outline-none"
        />
      </form>

      {/* Heart / Saved Items Circle Button */}
      <button
        type="button"
        onClick={() => {
          navigate("/shop/listing");
          if (closeSheet) closeSheet();
        }}
        aria-label="Featured & Saved Gadgets"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F3F7] text-[#14171F] hover:bg-[#E5E7F0] hover:text-[#0C1172] transition-all"
      >
        <HeartOutlineIcon className="w-5 h-5" />
      </button>

      {/* Shopping Bag Circle Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <button
          type="button"
          onClick={() => setOpenCartSheet(true)}
          aria-label="Shopping Bag"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F3F7] text-[#14171F] hover:bg-[#E5E7F0] hover:text-[#0C1172] transition-all"
        >
          <ShoppingBagBoxIcon className="w-5 h-5" />
          {cartItems?.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#DF5E00] text-white text-[10px] font-extrabold shadow-sm ring-2 ring-white">
              {cartItems.length}
            </span>
          )}
        </button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.length > 0 ? cartItems : []}
        />
      </Sheet>

      {/* User Profile Circle Button: Routes directly to /auth/login when logged out; opens account menu when logged in */}
      {user?.userName ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="User Account"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F3F7] text-[#14171F] hover:bg-[#E5E7F0] hover:text-[#0C1172] transition-all focus:outline-none"
            >
              <UserOutlineIcon className="w-5 h-5" />
              <span
                title={`Logged in as ${user.userName}`}
                className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-[#0C1172] ring-2 ring-white"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-1.5 shadow-xl border-gray-100">
            <DropdownMenuLabel className="text-xs font-bold text-gray-500 px-3 py-2">
              Signed in as <span className="text-[#0C1172] font-extrabold">{user?.userName}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-xl cursor-pointer font-semibold py-2.5"
              onClick={() => {
                navigate("/shop/account");
                if (closeSheet) closeSheet();
              }}
            >
              <User className="mr-2.5 h-4 w-4 text-[#0C1172]" /> My Account &amp; Orders
            </DropdownMenuItem>
            {user?.role === "admin" && (
              <DropdownMenuItem
                className="rounded-xl cursor-pointer font-semibold py-2.5"
                onClick={() => {
                  navigate("/admin/dashboard");
                  if (closeSheet) closeSheet();
                }}
              >
                <LayoutDashboard className="mr-2.5 h-4 w-4 text-[#DF5E00]" /> Admin Dashboard
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-xl cursor-pointer font-semibold text-red-600 focus:text-red-600 py-2.5"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <LogOut className="mr-2.5 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          type="button"
          onClick={() => {
            navigate("/auth/login");
            if (closeSheet) closeSheet();
          }}
          aria-label="Sign In"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F3F7] text-[#14171F] hover:bg-[#E5E7F0] hover:text-[#0C1172] transition-all focus:outline-none"
        >
          <UserOutlineIcon className="w-5 h-5" />
        </button>
      )}

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MobileSheetContent({ closeSheet }) {
  const { user } = useSelector((state) => state.auth);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(directLogout());
    setIsLogoutDialogOpen(false);
    if (closeSheet) closeSheet();
    navigate("/shop/home");

    dispatch(logoutUser()).catch((error) => {
      console.error("Background logout error:", error);
    });
  }

  return (
    <SheetContent side="left" className="flex flex-col h-full p-0 bg-[#fafaf8] border-r border-[#daddd4] max-w-[85vw] w-[300px] font-body">
      <div className="flex-1 overflow-y-auto p-6 pb-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Mobiletrends Logo"
              className="h-9 w-9 object-contain mix-blend-multiply shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-manrope text-[16px] font-extrabold text-[#20231e] tracking-[-0.5px] uppercase leading-tight">
                Mobile<span className="text-[#0C1172]">trends</span>
              </span>
              <span className="font-body text-[9px] font-bold text-[#DF5E00] uppercase tracking-[0.14em]">
                Systems Limited
              </span>
            </div>
          </div>

          <MenuItems closeSheet={closeSheet} />
        </div>
      </div>

      <div className="p-5 border-t border-[#daddd4] bg-[#f3f4ef] flex flex-col gap-2.5">
        {user?.userName ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                navigate("/shop/account");
                if (closeSheet) closeSheet();
              }}
              className="justify-start rounded-full font-manrope font-semibold text-[13px] border-[#daddd4] bg-white text-[#20231e]"
            >
              <User className="mr-2.5 h-4 w-4 text-[#0C1172]" />
              My Account ({user.userName})
            </Button>
            {user?.role === "admin" && (
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/admin/dashboard");
                  if (closeSheet) closeSheet();
                }}
                className="justify-start rounded-full font-manrope font-semibold text-[13px] border-[#daddd4] bg-white text-[#20231e]"
              >
                <LayoutDashboard className="mr-2.5 h-4 w-4 text-[#DF5E00]" />
                Admin Dashboard
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="justify-start rounded-full hover:bg-red-50 text-red-600 font-manrope font-semibold text-[13px]"
            >
              <LogOut className="mr-2.5 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            className="w-full h-11 rounded-full font-manrope font-semibold text-[13px] bg-[#111344] hover:bg-[#0C1172] text-white shadow-sm transition-all"
            onClick={() => {
              navigate("/auth/login");
              if (closeSheet) closeSheet();
            }}
          >
            Sign In / Create Account
          </Button>
        )}
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="rounded-2xl max-w-[90vw] sm:max-w-[425px] font-body">
          <DialogHeader>
            <DialogTitle className="font-manrope text-xl font-bold text-center text-[#20231e]">
              Confirm Sign Out
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 text-center text-[#62665d] text-sm">
            Are you sure you want to log out of Mobiletrends?
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="outline"
              className="rounded-full font-manrope font-semibold order-2 sm:order-1"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Stay Logged In
            </Button>
            <Button
              variant="destructive"
              className="rounded-full font-manrope font-semibold bg-red-600 hover:bg-red-700 order-1 sm:order-2"
              onClick={handleLogout}
            >
              Yes, Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SheetContent>
  );
}

function ShoppingHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#e6e8e1] bg-[#fafaf8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fafaf8]/90 font-body">
      <div className="flex h-16 items-center justify-between px-3.5 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="lg:hidden flex items-center justify-center p-1 -ml-1 text-[#141619] hover:text-[#0C1172] transition-colors focus:outline-none cursor-pointer"
              >
                <Menu className="h-[22px] w-[22px]" strokeWidth={2} />
              </button>
            </SheetTrigger>

            <MobileSheetContent closeSheet={() => setIsSheetOpen(false)} />
          </Sheet>

          <Link to="/shop/home" className="flex items-center gap-2 group">
            <img
              src="/logo.jpg"
              alt="Mobiletrends Logo"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-manrope text-[15px] sm:text-[18px] leading-tight font-extrabold text-[#141619] tracking-[-0.5px] uppercase">
                Mobile<span className="text-[#0C1172]">trends</span>
              </span>
              <span className="font-body text-[8.5px] sm:text-[10px] font-bold text-[#DF5E00] uppercase tracking-[0.12em] -mt-0.5">
                Systems Limited
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Right Icons matching the exact style */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => navigate("/shop/search")}
            aria-label="Search"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F2F3F7] text-[#14171F]"
          >
            <SearchIcon className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
          </button>

          <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
            <button
              type="button"
              onClick={() => setOpenCartSheet(true)}
              aria-label="Shopping Bag"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F2F3F7] text-[#14171F]"
            >
              <ShoppingBagBoxIcon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#DF5E00] text-white text-[10px] font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
            <UserCartWrapper
              setOpenCartSheet={setOpenCartSheet}
              cartItems={cartItems?.length > 0 ? cartItems : []}
            />
          </Sheet>

          <button
            type="button"
            onClick={() => navigate(user?.userName ? "/shop/account" : "/auth/login")}
            aria-label="User Account"
            className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F2F3F7] text-[#14171F]"
          >
            <UserOutlineIcon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
            {user?.userName && (
              <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-[#0C1172] ring-2 ring-white" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems closeSheet={() => setIsSheetOpen(false)} />
        </div>

        <div className="hidden lg:flex items-center">
          <HeaderRightContent closeSheet={() => setIsSheetOpen(false)} />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
