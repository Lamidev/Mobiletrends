'use client';
// import { useDispatch } from "react-redux";
// import { Button } from "../ui/button";
// import { AlignJustify, LogOut } from "lucide-react";
// import { logoutUser } from "@/store/auth-slice";

// function AdminHeader({setOpen}) {
// const dispatch = useDispatch();

// // Function to handle logout action
// function handleLogout() {
// dispatch(logoutUser());
// }

//   return (
//     <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
//       <Button 
//       onClick={() => setOpen(true)} 
//       className="lg:hidden sm:block rounded  ">
//         <AlignJustify size={20} />
//         <span className="sr-only">Toggle Menu</span>
//       </Button>
//       <div className="flex flex-1 justify-end">
//         <Button onClick={handleLogout}
//         className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium shadow rounded">
//           <LogOut size={18}/>
//           Log Out
//         </Button>
//       </div>
//     </header>
//   );
// }

// export default AdminHeader;

import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { logoutUser } from "@/store/auth-slice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 


function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  // Function to handle logout action
  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/shop/home"); // Redirect to login page
    });
    setIsLogoutDialogOpen(false);
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button 
        onClick={() => setOpen(true)} 
        className="lg:hidden sm:block rounded">
        <AlignJustify size={20} />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex flex-1 justify-end">
        {/* Logout Button */}
        <Button 
          onClick={() => setIsLogoutDialogOpen(true)}
          className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium shadow rounded">
          <LogOut size={18} />
          Log Out
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
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
    </header>
  );
}

export default AdminHeader;
