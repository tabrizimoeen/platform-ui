// src/utils/toastError.js

import toast from "react-hot-toast";
import { getErrorMessage } from "./errorHandler";

export function toastError(error) {
    toast.error(getErrorMessage(error));
}