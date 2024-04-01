import React, { useContext } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Image,
  Button,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { callLogoutApi } from "../../../redux/user/loginSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/store";
import { MdAddCircleOutline } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { clearCart } from "../../../redux/cart/cart";
import { MenuContext } from "../../../context/MainContext";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";


export default function AccountMenu({
  children,color,backgroundColor
}: {
  children: React.ReactNode;
  color?:string;
  backgroundColor?:string;
}) {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const onClickProfile = () => {
    navigate("/profile");
  };
  const onClickThemeChange = () => {
    setTheme(prev=>!prev)
  }
  const onClickLogout = () => {
    dispatch(callLogoutApi({ navigate }));
  };
  const {isDarkTheme,setTheme} = useContext(MenuContext)
  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuList style={{background:backgroundColor,color:color}} mr="3.5vmax !important" mt="-35px !important" transition={"0.1s"}>
        <MenuItem onClick={onClickProfile} style={{background:backgroundColor}} icon={<FaPerson />}>
          Profile
        </MenuItem>
        <MenuItem onClick={onClickThemeChange} style={{background:backgroundColor}} icon={isDarkTheme?<MdOutlineLightMode  />: <MdDarkMode/>}>
          {!isDarkTheme?"Dark Theme":"Light Theme"}
        </MenuItem>
        <MenuItem onClick={onClickLogout} style={{background:backgroundColor}} icon={<CiLogout />}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
