'use client';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewAddress,
  fetchAllAddresses,
  editAddress,
} from "@/store/shop/address-slice";
import { getDeliveryPrice } from "../../services/delivery-service";

function Address({ setCurrentSelectedAddress, selectedId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList = [], isLoading = false } = useSelector(
    (state) => state.shopAddress || state.address || {}
  );
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: "",
    lga: "",
    state: "",
    phone: "",
  });

  const currentUserId = user?.id || user?.Id || user?._id;

  // 1. Fetch addresses on mount
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchAllAddresses(currentUserId));
    }
  }, [dispatch, currentUserId]);

  const handleSelectAddress = (address) => {
    if (!address) return;
    const deliveryPrice = getDeliveryPrice(address.state);
    setCurrentSelectedAddress({ ...address, deliveryPrice });
  };

  // 2. Auto-propagate primary address as soon as addresses are available
  useEffect(() => {
    if (addressList && addressList.length > 0) {
      const alreadySelected = addressList.find((a) => a._id === selectedId?._id);
      if (alreadySelected) {
        handleSelectAddress(alreadySelected);
      } else {
        // Default to the first (primary) address from user profile
        handleSelectAddress(addressList[0]);
      }
    } else {
      setCurrentSelectedAddress(null);
    }
  }, [addressList]);

  const openAddAddressModal = () => {
    setAddressToEdit(null);
    setAddressForm({
      address: "",
      lga: "",
      state: "",
      phone: user?.phone || "",
    });
    setIsModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setAddressToEdit(addr);
    setAddressForm({
      address: addr?.address || "",
      lga: addr?.lga || "",
      state: addr?.state || "",
      phone: addr?.phone || user?.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.address.trim() || !addressForm.lga.trim() || !addressForm.state.trim()) {
      toast({
        title: "Please enter your address, city/LGA, and state",
        variant: "destructive",
      });
      return;
    }

    if (!currentUserId) {
      toast({
        title: "User session not found. Please log in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      userId: currentUserId,
      fullName: user?.userName || "Customer",
      address: addressForm.address.trim(),
      lga: addressForm.lga.trim(),
      state: addressForm.state.trim(),
      phone: addressForm.phone?.trim() || user?.phone || "08000000000",
      country: "Nigeria",
    };

    try {
      if (addressToEdit?._id) {
        await dispatch(
          editAddress({
            userId: currentUserId,
            addressId: addressToEdit._id,
            formData: payload,
          })
        ).unwrap();
        toast({ title: "Delivery address updated!" });
      } else {
        await dispatch(addNewAddress(payload)).unwrap();
        toast({ title: "Delivery address added!" });
      }
      const updatedList = await dispatch(fetchAllAddresses(currentUserId)).unwrap();
      if (updatedList?.data && updatedList.data.length > 0) {
        // Select the newly added or updated address
        const target = addressToEdit?._id
          ? updatedList.data.find((a) => a._id === addressToEdit._id) || updatedList.data[0]
          : updatedList.data[updatedList.data.length - 1];
        handleSelectAddress(target);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast({
        title: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSelected =
    addressList.find((a) => a._id === selectedId?._id) || addressList[0];

  return (
    <div className="font-manrope space-y-4">
      {isLoading ? (
        <div className="py-6 flex items-center justify-center text-sm text-[#64748b]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>Loading delivery address...</span>
        </div>
      ) : addressList && addressList.length > 0 && currentSelected ? (
        /* Address exists: Show propagated address card without cluttering checkout with form inputs */
        <div className="border border-[#e5e7eb] rounded-[14px] p-4 sm:p-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-bold text-[#64748b] uppercase tracking-wider">
                Shipping Destination
              </span>
            </div>
            <button
              type="button"
              onClick={() => openEditAddressModal(currentSelected)}
              className="text-black hover:text-black/70 font-bold text-[13.5px] cursor-pointer hover:underline transition-colors"
            >
              Update address
            </button>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-[15px] sm:text-[16px] text-[#0f172a] leading-snug">
              {currentSelected.address}
            </p>
            <p className="text-[13.5px] sm:text-[14px] text-[#64748b]">
              {currentSelected.lga}, {currentSelected.state}, Nigeria
            </p>
            {currentSelected.phone && (
              <p className="text-[12px] text-[#94a3b8] pt-0.5">
                Recipient Contact:{" "}
                <span className="font-semibold text-[#0f172a]">
                  {currentSelected.phone}
                </span>
              </p>
            )}
          </div>

          {/* If user has more than 1 address saved in profile, allow quick switching */}
          {addressList.length > 1 && (
            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-[#94a3b8] font-semibold">
                Switch:
              </span>
              {addressList.map((addr, idx) => {
                const isItemActive = currentSelected?._id === addr._id;
                return (
                  <button
                    key={addr._id || idx}
                    type="button"
                    onClick={() => handleSelectAddress(addr)}
                    className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold border transition-all cursor-pointer ${
                      isItemActive
                        ? "bg-[#111344] text-white border-[#111344]"
                        : "bg-white text-[#64748b] border-[#e5e7eb] hover:border-[#111344] hover:text-[#111344]"
                    }`}
                  >
                    {addr.lga || `Address ${idx + 1}`}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* No address added yet: only show "+ Add address" */
        <div className="border border-[#e5e7eb] rounded-[14px] p-6 text-center bg-white shadow-sm space-y-3">
          <div className="w-11 h-11 rounded-full bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center mx-auto text-[#64748b]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[15px] text-[#0f172a]">
              No delivery address added yet
            </h4>
            <p className="text-[12.5px] text-[#64748b] mt-0.5 max-w-sm mx-auto">
              Please add your delivery address so we can calculate shipping and dispatch your order.
            </p>
          </div>
          <Button
            type="button"
            onClick={openAddAddressModal}
            className="rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white text-[13px] font-semibold px-4 h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add address
          </Button>
        </div>
      )}

      {/* Clean Modal Popup for Add / Update Address matching Profile specification */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="font-manrope rounded-[24px] sm:rounded-[24px] max-w-[480px] p-6 sm:p-7 border border-[#e5e7eb] shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-[20px] sm:text-[22px] font-bold text-[#0f172a]">
              {addressToEdit ? "Edit Delivery Address" : "Add Delivery Address"}
            </DialogTitle>
            <p className="text-[12.5px] text-[#64748b]">
              Used for door-to-door delivery, POD dispatch, and order fulfillment.
            </p>
          </DialogHeader>

          <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1.5">
                House / Street Address
              </label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, address: e.target.value })
                }
                placeholder="e.g. 2, Bolarinwa street, Ipaja"
                className="w-full h-11 px-3.5 rounded-[12px] border border-[#d1d5db] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#0C1172] focus:ring-2 focus:ring-[#0C1172]/20 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1.5">
                  City / LGA
                </label>
                <input
                  type="text"
                  value={addressForm.lga}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, lga: e.target.value })
                  }
                  placeholder="e.g. Alimosho"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-[#d1d5db] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#0C1172] focus:ring-2 focus:ring-[#0C1172]/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  placeholder="e.g. Lagos"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-[#d1d5db] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#0C1172] focus:ring-2 focus:ring-[#0C1172]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, phone: e.target.value })
                }
                placeholder="e.g. 08012345678"
                className="w-full h-11 px-3.5 rounded-[12px] border border-[#d1d5db] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#0C1172] focus:ring-2 focus:ring-[#0C1172]/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 px-4 rounded-[6px] border border-[#e5e7eb] text-[13px] font-semibold text-[#0f172a] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white text-[13px] font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : addressToEdit ? (
                  "Save Address"
                ) : (
                  "Add Address"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Address;
