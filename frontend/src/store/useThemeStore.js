import { create } from "zustand";

export const useThemeStore = create((set) => ({ //theme store banave che
  currentTheme: localStorage.getItem("Mitra-Chat-theme")|| "coffee", // local storage mathi theme get karse, jya thi user je theme last time set karyo hase te theme load thase, ane default theme coffee che
  setTheme: (theme) => { //new theme set karse
    localStorage.setItem("Mitra-Chat-theme", theme)
    set({currentTheme: theme})
  }
}))