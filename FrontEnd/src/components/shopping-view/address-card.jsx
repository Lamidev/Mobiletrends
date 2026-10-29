'use client';
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { User, Phone, MapPin, FileText, CheckCircle2, Edit3, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card
        onClick={
          setCurrentSelectedAddress
            ? () => setCurrentSelectedAddress(addressInfo)
            : null
        }
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 ${isSelected
            ? "border-peach-500 shadow-lg shadow-peach-100 ring-2 ring-peach-50 ring-offset-2"
            : "border-gray-100 hover:border-peach-200 hover:shadow-md"
          }`}
      >
        {isSelected && (
          <div className="absolute top-0 right-0 p-2">
            <div className="bg-peach-500 text-white rounded-full p-1 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
        )}

        <CardContent className="p-5 space-y-4">
          {/* Header with Name */}
          <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
            <div className={`p-2 rounded-xl ${isSelected ? 'bg-peach-100 text-peach-600' : 'bg-gray-100 text-gray-400'}`}>
              <User className="h-4 w-4" />
            </div>
            <span className="font-bold text-gray-900 truncate">
              {addressInfo?.fullName}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-300 mt-1 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-gray-600 leading-snug">
                  {addressInfo?.address}
                </p>
                <p className="text-gray-400 text-xs mt-0.5 font-bold uppercase tracking-wider">
                  {addressInfo?.lga}, {addressInfo?.state}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-300 flex-shrink-0" />
              <span className="text-sm font-bold text-gray-600">
                {addressInfo?.phone}
              </span>
            </div>

            {addressInfo?.notes && (
              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <FileText className="h-4 w-4 text-peach-300 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-500 font-medium italic line-clamp-2">
                  "{addressInfo?.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAddress(addressInfo);
              }}
              className="rounded-xl border-gray-200 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200 gap-1.5 h-9 font-bold transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAddress(addressInfo);
              }}
              className="rounded-xl border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 gap-1.5 h-9 font-bold transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AddressCard;
