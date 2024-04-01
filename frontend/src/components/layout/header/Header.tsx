import React, { Fragment, useState, useEffect, useContext } from "react";

import Logo from "../../../assets/logo.png";
import { ReactNavbar } from "overlay-navbar";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import Title from "./Title";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import Loader from "../Loader/Loader";
import SmLoader from "../Loader/SmLoader";
import AccountMenu from "./AccountMenu";
import Styles from "./Header.module.css"
import { MenuContext, contextDataType } from "../../../context/MainContext";
import styled from "@emotion/styled";
import { hover } from "@testing-library/user-event/dist/hover";
import { VscAccount } from "react-icons/vsc";


export default function Header() {
  const navigate = useNavigate();
  const {isDarkTheme,setTheme} = useContext(MenuContext)
  const { isAuthenticated, loading, response }: any = useSelector(
    (state: RootState) => state.login
  );

  return (
    <header
      className={"headerContainer"}
      id={Styles.header}
      style={{ background: isDarkTheme ? "black" : "white" }}
    >
      {/* youtube icon */}
      <div></div>
      {/* search bar with search icon */}
      <label className={Styles.searchContainer}>
        <input
          type="text"
          style={{
            color: !isDarkTheme ? "black" : "white",
            background: "transparent",
            outline: "0.1px solid #222222",
          }}
          id={Styles.search}
          placeholder="Search"
        />
        <div style={{ color: !isDarkTheme ? "black" : "white" }}>
          <button>X</button>
        </div>
        <div
          id={Styles.searchIcon}
          style={{ background: isDarkTheme ? "#222222" : "white" }}
        >
          <BiSearch
            size={"1.5vmax"}
            color={!isDarkTheme ? "black" : "whitesmoke"}
          />
        </div>
      </label>

      {/* profile */}
      <div style={{ color: !isDarkTheme ? "black" : "white" ,paddingRight:"2vmax"}}>
        {loading ? (
          <SmLoader />
        ) : !isAuthenticated ? (
          <button className={Styles.signInView} onClick={() => {
              !loading && !isAuthenticated && navigate("/login");
            }}>
            <pre> <VscAccount size={"1.5vmax"}/> Sign in </pre> 
          </button>
        ) : (
          <AccountMenu
            backgroundColor={isDarkTheme ? "black" : "white"}
            color={!isDarkTheme ? "black" : "white"}
          >
            <Avatar
              size={"sm"}
              name={String(response?.user?.name || "")}
              src={String(response?.user?.avatar?.url)}
            />
          </AccountMenu>
        )}
      </div>

      {/* <div
        style={{
          position: "fixed",
          right: "5vmax",
          top: "2.5vmax",
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          background:"green"
        }}
      >
        
        <button
          style={{
            padding: 5,
            fontSize: "1.5vmax",
          }}
          onClick={() => {
            {
              !loading && !isAuthenticated && navigate("/login");
            }
          }}
        >
          {loading ? (
            <SmLoader />
          ) : !isAuthenticated ? (
            "Login"
          ) : (
            <AccountMenu>
              <Avatar
                name={String(response?.user?.name)}
                src={String(response?.user?.avatar?.url)}
              />
            </AccountMenu>
          )}
        </button>
      </div> */}
    </header>
  );
}
