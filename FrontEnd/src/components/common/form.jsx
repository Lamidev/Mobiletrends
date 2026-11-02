'use client';

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  onCancel,
  children,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    
    let Icon = null;
    if (getControlItem.name === "userName") Icon = User;
    else if (getControlItem.name === "email") Icon = Mail;
    else if (getControlItem.name === "password" || getControlItem.name === "confirmPassword") Icon = Lock;

    const isPasswordField = getControlItem.name === "password";
    const isConfirmPasswordField = getControlItem.name === "confirmPassword";
    const showField = isPasswordField ? showPassword : showConfirmPassword;

    const isCurrency = getControlItem.name === "price" || getControlItem.name === "salePrice";
    const rawVal = value === undefined || value === null ? "" : String(value);
    const cleanDigits = rawVal.replace(/[^0-9]/g, "");
    const formattedDisplay = isCurrency
      ? (cleanDigits ? Number(cleanDigits).toLocaleString("en-NG") : "")
      : value;

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="relative">
            <div className="flex items-center">
              {Icon && <Icon className="text-black absolute left-3 z-10" size={20} />}
              {isCurrency && (
                <span className="absolute left-3 text-xs font-bold text-gray-500 pointer-events-none z-10">
                  ₦
                </span>
              )}
              <Input
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={isCurrency ? "text" : (showField ? "text" : getControlItem.type)}
                inputMode={isCurrency ? "numeric" : undefined}
                value={formattedDisplay}
                onChange={(event) => {
                  let val = event.target.value;
                  if (isCurrency) {
                    val = val.replace(/[^0-9]/g, "");
                  }
                  setFormData({
                    ...formData,
                    [getControlItem.name]: val,
                  });
                }}
                className={`w-full ${Icon ? 'pl-10' : ''} ${isCurrency ? 'pl-8' : ''} ${(isPasswordField || isConfirmPasswordField) ? 'pr-10' : ''}`}
              />
              {(isPasswordField || isConfirmPasswordField) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isPasswordField) setShowPassword((prev) => !prev);
                    if (isConfirmPasswordField) setShowConfirmPassword((prev) => !prev);
                  }}
                  className="absolute right-3 text-gray-500 hover:text-gray-700 p-1"
                  style={{ touchAction: 'manipulation' }}
                >
                  {showField ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </div>
        );
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="min-h-[100px] resize-vertical"
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="w-full"
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-2" key={controlItem.name}>
            <Label htmlFor={controlItem.name} className="text-sm font-medium">
              {controlItem.label}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      {children}
      
      {onCancel ? (
        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-1/3 py-3 text-sm font-bold border-gray-300 hover:bg-gray-100 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            disabled={isBtnDisabled}
            type="submit"
            className="w-2/3 py-3 text-sm font-bold bg-[#111344] hover:bg-[#0C1172] text-white rounded-xl"
            style={{ touchAction: 'manipulation' }}
          >
            {buttonText || "Submit"}
          </Button>
        </div>
      ) : (
        <Button 
          disabled={isBtnDisabled} 
          type="submit" 
          className="mt-6 w-full py-3 text-base font-medium"
          style={{ touchAction: 'manipulation' }}
        >
          {buttonText || "Submit"}
        </Button>
      )}
    </form>
  );
}

export default CommonForm;
