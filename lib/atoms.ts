import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const profileAtom = atom({ email: "", limit: 0 });

export const isLoggedInAtom = atomWithStorage("loggedIn", false);

export const refetchAtom = atom(0);
