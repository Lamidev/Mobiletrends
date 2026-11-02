'use client';
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "font-body flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-xs placeholder:font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }

// import * as React from "react";
// import { cn } from "@/lib/utils";

// const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
//   return (
//     <div className="relative flex items-center">
//       {Icon && (
//         <div className="absolute left-3 flex items-center">
//           <Icon className="size-5 text-green-500" />
//         </div>
//       )}
//       <input
//         type={type}
//         className={cn(
//           "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           Icon ? "pl-10" : "pl-3", // Adjust padding if icon is present
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     </div>
//   );
// });

// Input.displayName = "Input";

// export { Input };

