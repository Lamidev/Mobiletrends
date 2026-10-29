'use client';
// import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { useRef, useEffect } from "react";
// import { Button } from "../ui/button";
// import axios from "axios";
// import { Skeleton } from "../ui/skeleton";

// function ProductImageUpload({
//   imageFile,
//   setImageFile,
//   uploadedImageUrl,
//   setUploadedImageUrl,
//   setImageLoadingState,
//   imageLoadingState,
//   isEditMode,
//   isCustomStyling = false,

  
// }) {
//   const inputRef = useRef(null);

//   function handleImageFileChange(event) {
//     const selectedFile = event.target.files?.[0];
//     console.log("Selected File:", selectedFile);
//     if (selectedFile) {
//       setImageFile(selectedFile); // Update state
//       console.log("Image file state updated to:", selectedFile);
//     } else {
//       console.error("No file selected or issue with event.target.files");
//     }
//   }

//   function handleDragOver(event) {
//     event.preventDefault();
//   }

//   function handleDrop(event) {
//     event.preventDefault();
//     const droppedfile = event.dataTransfer.files?.[0];
//     if (droppedfile) setImageFile(droppedfile);
//   }

//   function handleRemoveImage() {
//     setImageFile(null);
//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   }

//   // console.log(imageFile);

//   async function uploadImageToCloudinary(){
//     setImageLoadingState(true);
//     const data = new FormData();
//     data.append("my_file", imageFile);
//     const response = await axios.post("http://localhost:8050/api/admin/products/upload-image", data)
//   console.log(response, 'response');
  
//     if (response?.data?.success) 
//       { 
//         setUploadedImageUrl(response.data.result.url)
//         setImageLoadingState(false);
//       }
//   }

//   useEffect(() => {
//     if (imageFile !== null) uploadImageToCloudinary();
//   }, [imageFile]);

//   return (
//     <div 
//     className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
//     >
//       <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
//       <div
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         className={`${
//           isEditMode ? "opacity-60" : ""
//         } border-2 border-dashed rounded-lg p-4`}
//       >
//         <Input
//           id="image-upload"
//           type="file"
//           className="hidden"
//           ref={inputRef}
//           onChange={handleImageFileChange}
//           disabled={isEditMode}
//         />
//         {!imageFile ? (
//           <label
//             htmlFor="image-upload"
//             className={`${
//               isEditMode ? "cursor-not-allowed" : ""
//             } flex flex-col items-center justify-center h-32 cursor-pointer`}
//           >
//             <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
//             <span>Drag & drop or click to upload image</span>
//           </label>
//         ) : (
//           imageLoadingState ?
//           <Skeleton className="h-10 bg-gray-100" /> :
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FileIcon className="w-8 text-primary mr-2 h-8" />
//             </div>
//             <p className="text-sm font-medium">{imageFile.name}</p>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-muted-foreground hover:text-foreground"
//               onClick={handleRemoveImage}
//             >
//               <XIcon className="w-4 h-4" />
//               <span className="sr-only">Remove File</span>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductImageUpload;

import { FileIcon, UploadCloudIcon, XIcon, EyeIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling = false,
  existingImageUrl = "",
}) {
  const inputRef = useRef(null);
  const [localImageUrl, setLocalImageUrl] = useState("");

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setLocalImageUrl(objectUrl);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
      const objectUrl = URL.createObjectURL(droppedFile);
      setLocalImageUrl(objectUrl);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setLocalImageUrl("");
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (localImageUrl) {
      URL.revokeObjectURL(localImageUrl);
    }
  }

  function handleRemoveExistingImage() {
    setUploadedImageUrl("");
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;

    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api"}/admin/products/upload-image`,
        data
      );
      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (localImageUrl) {
        URL.revokeObjectURL(localImageUrl);
      }
    };
  }, [localImageUrl]);

  useEffect(() => {
    if (!imageFile && !uploadedImageUrl && !existingImageUrl) {
      setLocalImageUrl("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [imageFile, uploadedImageUrl, existingImageUrl]);

  const displayImageUrl = localImageUrl || uploadedImageUrl || existingImageUrl;
  const hasImage = !!displayImageUrl;
  const isNewImage = localImageUrl || uploadedImageUrl;
  const isExistingImage = existingImageUrl && !isNewImage;

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">
        {isEditMode ? "Product Image" : "Upload Image"}
      </Label>

      {hasImage && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
            <Label className="text-md font-medium">
              {isExistingImage ? "Current Image" : "Image Preview"}
            </Label>
            <div className="flex gap-2 flex-wrap">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 flex-1 sm:flex-none min-h-[44px]"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span className="sm:inline">View</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl mx-4">
                  <div className="flex justify-center">
                    <img
                      src={displayImageUrl}
                      alt="Preview"
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              {isNewImage ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1 flex-1 sm:flex-none min-h-[44px]"
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sm:inline">Remove New</span>
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveExistingImage}
                  className="flex items-center gap-1 flex-1 sm:flex-none min-h-[44px]"
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sm:inline">Remove</span>
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={displayImageUrl}
              alt="Preview"
              className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-lg border-2 border-gray-300"
            />
          </div>
          {isExistingImage && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Current product image. Upload a new image below to replace it.
            </p>
          )}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          accept="image/*"
        />

        {!imageFile ? (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 p-4 rounded-lg transition-colors cursor-pointer hover:bg-gray-50"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-center text-sm text-muted-foreground">
              {isEditMode && hasImage
                ? "Upload new image to replace current"
                : "Drag & drop or click to upload image"}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Supports: JPG, PNG, WebP
            </span>
          </label>
        ) : imageLoadingState ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Skeleton className="h-10 w-10 rounded-full mb-2" />
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
            <span className="text-xs text-muted-foreground mt-2">
              Uploading...
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FileIcon className="w-8 text-primary h-8 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {imageFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2 min-h-[44px] min-w-[44px]"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>

      {isEditMode && hasImage && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          {isExistingImage
            ? "Upload a new image above to replace the current one, or click 'Remove' to delete the image."
            : "New image ready to replace the current one."}
        </p>
      )}
    </div>
  );
}

export default ProductImageUpload;