import { createContext, useContext } from "react";

export const OverlayContext = createContext(null);
export const useOverlay = () => useContext(OverlayContext);