'use client';
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getOrCreateSessionId,
//   clearSessionId,
// } from "@/components/utils/session";
// import { fetchCartItems, mergeCarts } from "@/store/shop/cart-slice";

// const AuthListener = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const handleAuthChange = async () => {
//       console.log('AuthListener: User changed', user?.id);
      
//       if (user?.id) {
//         try {
//           const sessionId = getOrCreateSessionId();
//           console.log('AuthListener: Session ID', sessionId);

//           if (sessionId && sessionId.startsWith('guest_')) {
//             console.log('AuthListener: Merging guest cart to user cart');
//             const result = await dispatch(mergeCarts({ userId: user.id })).unwrap();
//             console.log('AuthListener: Merge result', result);

//             if (result.success) {
//               console.log('AuthListener: Cart merged successfully, clearing session');
//               clearSessionId();
//             }
//           }

//           // Always fetch the latest cart after merge attempt
//           console.log('AuthListener: Fetching cart items');
//           await dispatch(fetchCartItems()).unwrap();
//           console.log('AuthListener: Cart fetched successfully');
          
//         } catch (error) {
//           console.error('AuthListener: Error during cart merge:', error);
//           // Still try to fetch cart items even if merge fails
//           await dispatch(fetchCartItems()).unwrap();
//         }
//       } else if (user === null) {
//         console.log('AuthListener: User logged out, clearing session');
//         clearSessionId();
//         // Fetch cart for guest user
//         await dispatch(fetchCartItems()).unwrap();
//       }
//     };

//     handleAuthChange();
//   }, [dispatch, user]);

//   return null;
// };

// export default AuthListener;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrCreateSessionId,
  clearSessionId,
} from "@/components/utils/session";
import { fetchCartItems, mergeCarts } from "@/store/shop/cart-slice";

const AuthListener = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleAuthChange = async () => {
      if (user?.id) {
        try {
          const sessionId = getOrCreateSessionId();

          if (sessionId && sessionId.startsWith("guest_")) {
            const result = await dispatch(
              mergeCarts({ userId: user.id })
            ).unwrap();

            if (result.success) {
              clearSessionId();
            }
          }

          await dispatch(fetchCartItems()).unwrap();
        } catch (error) {
          await dispatch(fetchCartItems()).unwrap();
        }
      } else if (user === null) {
        clearSessionId();
        await dispatch(fetchCartItems()).unwrap();
      }
    };

    handleAuthChange();
  }, [dispatch, user]);

  return null;
};

export default AuthListener;
