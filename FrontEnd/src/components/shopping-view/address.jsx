'use client';
// import { addressFormControls } from "@/config";
// import CommonForm from "../common/form";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addNewAddress, fetchAllAddresses, deleteAddress, editAddress } from "@/store/shop/address-slice";
// import AddressCard from "./address-card";
// import { useToast } from "../ui/use-toast";

// const initialAddressFormData = {
//   fullName: "",
//   address: "",
//   lga: "",
//   state: "",
//   phone: "",
//   pincode: "",
//   country: "Nigeria", // Default country
//   notes: "",
// };


// function Address({setCurrentSelectedAddress , selectedId}) {
//   const [formData, setFormData] = useState(initialAddressFormData);
//   const [currentEditedId, setCurrentEditedId] = useState(null);
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { addressList } = useSelector((state) => state.shopAddress);
//   const { toast } = useToast();

//   function handleManageAddress(event) {
//     event.preventDefault();

//     if (addressList.length >= 3 && currentEditedId === null) {
//       setFormData(initialAddressFormData);
//       toast({
//         title: "You can add max 3 addresses",
//         variant: "destructive",
//       });

//       return;
//     }

//     currentEditedId !== null
//       ? dispatch(
//           editAddress({
//             userId: user?.id,
//             addressId: currentEditedId,
//             formData,
//           })
//         ).then((data) => {
//           if (data?.payload?.success) {
//             dispatch(fetchAllAddresses(user?.id));
//             setCurrentEditedId(null);
//             setFormData(initialAddressFormData);
//             toast({
//               title: "Address updated successfully",
//             });
//           }
//         })
//       : dispatch(
//           addNewAddress({
//             ...formData,
//             userId: user?.id,
//           })
//         ).then((data) => {
//           if (data?.payload?.success) {
//             dispatch(fetchAllAddresses(user?.id));
//             setFormData(initialAddressFormData);
//             toast({
//               title: "Address added successfully",
//             });
//           }
//         });
//   }


//   function handleDeleteAddress(getCurrentAddress) {
//     dispatch(
//       deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchAllAddresses(user?.id));
//         toast({
//           title: "Address deleted successfully",
//         });
//       }
//     });
//   }

//   function handleEditAddress(getCuurentAddress) {
//     setCurrentEditedId(getCuurentAddress?._id);
//     setFormData({
//       fullName: getCuurentAddress?.fullName || "",
//       address: getCuurentAddress?.address || "",
//       lga: getCuurentAddress?.lga || "",
//       state: getCuurentAddress?.state || "",
//       phone: getCuurentAddress?.phone || "",
//       pincode: getCuurentAddress?.pincode || "",
//       country: getCuurentAddress?.country || "Nigeria", // Default to Nigeria
//       notes: getCuurentAddress?.notes || "",
//     });
//   }



// function isFormValid() {
//   return Object.keys(formData)
//     .map((key) => (formData[key] || "").trim() !== "")
//     .every((item) => item);
// }



//   useEffect(() => {
// dispatch(fetchAllAddresses(user?.id))
//   }, [dispatch] )

//   // console.log( addressList,"addressList");

//   return (
//     <Card className="border border-gray-200 shadow-lg">
//     <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
//         {addressList && addressList.length > 0
//           ? addressList.map((singleAddressItem) => (
//               <AddressCard
//                 selectedId={selectedId}
//                 handleDeleteAddress={handleDeleteAddress}
//                 addressInfo={singleAddressItem}
//                 handleEditAddress={handleEditAddress}
//                 setCurrentSelectedAddress={setCurrentSelectedAddress}

//               />
//             ))
//           : null}
//       </div>
//       <CardHeader className="p-4 border-b border-gray-300">
//       <CardTitle className="text-lg font-bold">
//           {currentEditedId !== null ? "Edit Address" : "Add New Address"}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-6 space-y-4">
//         <CommonForm
//           formControls={addressFormControls}
//           formData={formData}
//           setFormData={setFormData}
//           buttonText= {currentEditedId !== null ? "Edit Address" : "Add New Address"}
//           onSubmit={handleManageAddress}
//           isBtnDisabled={!isFormValid()}
//         />
//       </CardContent>
//     </Card>
//   );
// }

// export default Address;

import { addressFormControls } from "@/config";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, fetchAllAddresses, deleteAddress, editAddress } from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { getDeliveryPrice } from "../../services/delivery-service";

const initialAddressFormData = {
  fullName: "",
  address: "",
  lga: "",
  state: "",
  phone: "",
  // pincode: "",
  country: "Nigeria", // Default country
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
        editAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast({
            title: "Address updated successfully",
          });
        }
      })
      : dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          setFormData(initialAddressFormData);
          toast({
            title: "Address added successfully",
          });
        }
      });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      fullName: getCurrentAddress?.fullName || "",
      address: getCurrentAddress?.address || "",
      lga: getCurrentAddress?.lga || "",
      state: getCurrentAddress?.state || "",
      phone: getCurrentAddress?.phone || "",
      // pincode: getCurrentAddress?.pincode || "",
      country: getCurrentAddress?.country || "Nigeria", // Default to Nigeria
      notes: getCurrentAddress?.notes || "",
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "notes") // Notes are optional
      .map((key) => (formData[key] || "").trim() !== "")
      .every((item) => item);
  }

  const handleSelectAddress = (address) => {
    const deliveryPrice = getDeliveryPrice(address.state);
    setCurrentSelectedAddress({ ...address, deliveryPrice });
  };

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card className="border border-gray-200 shadow-lg">
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
            <AddressCard
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={handleSelectAddress}
            />
          ))
          : null}
      </div>
      <CardHeader className="p-4 border-b border-gray-300">
        <CardTitle className="text-lg font-bold">
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit Address" : "Add New Address"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;