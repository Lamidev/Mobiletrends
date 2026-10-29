'use client';

import { LogOut, Menu, ShoppingCart, User, Search } from "lucide-react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Avatar, AvatarFallback } from "../ui/avatar";
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
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="relative group">
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-xs uppercase tracking-widest font-bold cursor-pointer flex items-center gap-2 pb-1 text-gray-800 hover:text-[#0C1172] transition-all after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#DF5E00] after:transition-all after:duration-300 group-hover:after:w-full"
          >
            {menuItem.label}
          </Label>
        </div>
      ))}
    </nav>
  );
}

function HeaderRightContent({ closeSheet }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
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

  useEffect(() => {
    if (user?.Id) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, user?.Id]);

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          navigate("/shop/search");
          if (closeSheet) closeSheet();
        }}
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-slate-100 text-gray-800 hover:text-[#0C1172] transition-all"
      >
        <Search className="w-5 h-5" />
      </Button>

      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-slate-100 text-gray-800 hover:text-[#0C1172] transition-all"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItems?.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DF5E00] text-white text-[10px] font-black shadow-sm ring-2 ring-white">
              {cartItems.length}
            </span>
          )}
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.length > 0 ? cartItems : []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-[#0C1172] cursor-pointer ring-2 ring-offset-1 ring-[#0C1172]/20">
            <AvatarFallback className="bg-[#0C1172] text-white font-bold">
              {user?.userName ? user?.userName[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          {user?.userName ? (
            <>
              <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/shop/account");
                  if (closeSheet) closeSheet();
                }}
              >
                <User className="mr-2 h-4 w-4" /> Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                navigate("/auth/login");
                if (closeSheet) closeSheet();
              }}
            >
              <User className="mr-2 h-4 w-4" /> Login
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
    <SheetContent side="left" className="flex flex-col h-full p-0 bg-white border-r-0 max-w-[85vw] w-[300px]">
      <div className="flex-1 overflow-y-auto p-6 pb-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-gray-200 p-0.5 shadow-sm">
              <img
                src="/logo.jpg"
                alt="Mobiletrends Logo"
                className="h-10 w-10 object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-gray-900 tracking-tighter uppercase">
                Mobile<span className="text-[#0C1172]">trends</span>
              </span>
              <span className="text-[9px] font-bold text-[#DF5E00] uppercase tracking-wider">Systems Limited</span>
            </div>
          </div>

          <MenuItems closeSheet={closeSheet} />
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
        {user?.userName ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                navigate("/shop/account");
                if (closeSheet) closeSheet();
              }}
              className="justify-start rounded-xl font-bold"
            >
              <User className="mr-3 h-4 w-4" />
              Account
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="justify-start rounded-xl hover:bg-red-50 text-red-600 font-bold"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="rounded-xl font-bold bg-[#0C1172] hover:bg-[#080c52] text-white shadow-md transition-all"
              onClick={() => {
                navigate("/auth/login");
                if (closeSheet) closeSheet();
              }}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="rounded-xl font-bold border-[#DF5E00] text-[#DF5E00] hover:bg-[#DF5E00]/10 transition-all"
              onClick={() => {
                navigate("/auth/register");
                if (closeSheet) closeSheet();
              }}
            >
              Register
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="rounded-2xl max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-center">Confirm Sign Out</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-gray-500 font-medium text-sm">
            Are you sure you want to log out of Mobiletrends?
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="rounded-xl font-bold order-2 sm:order-1" onClick={() => setIsLogoutDialogOpen(false)}>
              Stay Logged In
            </Button>
            <Button variant="destructive" className="rounded-xl font-bold bg-red-600 hover:bg-red-700 order-1 sm:order-2" onClick={handleLogout}>
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
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <MobileSheetContent closeSheet={() => setIsSheetOpen(false)} />
          </Sheet>

          <Link to="/shop/home" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 p-1 group-hover:border-[#0C1172] transition-colors shadow-sm">
              <img
                src="/logo.jpg"
                alt="Mobiletrends Logo"
                className="h-10 w-10 object-contain rounded-lg transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-tight font-black text-gray-900 tracking-tight uppercase">
                Mobile<span className="text-[#0C1172]">trends</span>
              </span>
              <span className="text-[10px] font-bold text-[#DF5E00] uppercase tracking-wider -mt-0.5">Systems Limited</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="outline" size="icon" onClick={() => navigate("/shop/search")}>
            <Search className="h-5 w-5" />
          </Button>

          <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
            <Button
              onClick={() => setOpenCartSheet(true)}
              variant="outline"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems?.length > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#DF5E00] text-white text-[10px] font-bold">
                  {cartItems.length}
                </span>
              )}
            </Button>
            <UserCartWrapper
              setOpenCartSheet={setOpenCartSheet}
              cartItems={cartItems?.length > 0 ? cartItems : []}
            />
          </Sheet>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems closeSheet={() => setIsSheetOpen(false)} />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <HeaderRightContent closeSheet={() => setIsSheetOpen(false)} />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
