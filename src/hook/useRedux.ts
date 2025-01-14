import type { AppDispatch, RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useReduxDispatch = () => useDispatch<AppDispatch>();