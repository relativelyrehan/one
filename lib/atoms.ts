import { atomWithStorage } from "jotai/utils";

export const isLoggedInAtom = atomWithStorage("loggedIn", false);
