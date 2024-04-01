import React, { createContext, useEffect, useState } from "react"

export type contextDataType = {
    isDarkTheme: boolean;
    setTheme: React.Dispatch<React.SetStateAction<boolean>>;
    showHeader: boolean;
    setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  };

export const MenuContext = createContext<contextDataType>({isDarkTheme:false,setTheme:()=>{},showHeader:false,setShowHeader:()=>{}});

export const MenuProvider = ({ children }: {children:React.ReactNode}) => {
  const selectedTheme = localStorage.getItem("darkTheme");
  const [isDarkTheme, setTheme] = useState(selectedTheme=="true"?true:false);
  const [showHeader,setShowHeader] = useState(true);
  useEffect(()=>{
    if (isDarkTheme?"true":"false" != localStorage.getItem("darkTheme")) {
      localStorage.setItem("darkTheme",isDarkTheme?"true":"false")
    } 
  },[isDarkTheme])
  return (
    <MenuContext.Provider value={{isDarkTheme,setTheme,showHeader,setShowHeader}}>
      {children}
    </MenuContext.Provider>
  );
};