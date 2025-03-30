import { toast } from "react-hot-toast";

const showToast = (message, type = "success") => {
  const toastOptions = {
    duration: 3000, // 3 seconds
    position: "top-right",
  };

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast(message, { ...toastOptions, icon: "⚠️" });
      break;
    case "info":
      toast(message, { ...toastOptions, icon: "ℹ️" });
      break;
    default:
      toast(message, toastOptions);
  }
};

export default showToast;
