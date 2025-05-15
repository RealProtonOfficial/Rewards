import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MENUITEMS } from "./menu";
import { ArrowRight, ArrowLeft, Grid } from "react-feather";
import { Link } from "react-router-dom";
//import { translate } from "react-switch-lang";
import configDB from "../../data/customizer/config";
import { DefaultLayout } from "../theme-customizer";
import { axiosInstance, baseURL } from "../../utility/api";
import { useDispatch } from "react-redux";
import { SAVE_NAME } from "../../redux/actionTypes";
import Swal from 'sweetalert2';
import Logo from "../../assets/images/logo/logo.svg";

const Sidebar = (props) => {
    console.log('Sidebar(props)');

    console.log('props = ', props);
    //console.log('MENUITEMS = ', MENUITEMS);

    const EMPTY_STRING = "";
    const id = window.location.pathname.split("/").pop();
    const defaultLayout = Object.keys(DefaultLayout);
    const layout = id ? id : defaultLayout;
    // eslint-disable-next-line
    const [mainmenu, setMainMenu] = useState(MENUITEMS);
    const [margin, setMargin] = useState(0);
    const [width, setWidth] = useState(0);
    const [sidebartoogle, setSidebartoogle] = useState(true);
    const wrapper = useSelector((content) => content.Customizer.sidebar_types.type)
        || configDB.data.settings.sidebar.type;

    const handleScroll = () => {
        if (window.scrollY > 400) {
            if (
                   configDB.data.settings.sidebar.type.split(" ").pop() === "material-type"
                || configDB.data.settings.sidebar.type.split(" ").pop() === "advance-layout"
            )
            document.querySelector(".sidebar-main").className = "sidebar-main hovered";
        } else {
            // document.querySelector(".sidebar-main").className = "sidebar-main";
        }
    };

    const config = {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        }
    };

    const dispatch = useDispatch();

    /*
    const formatTitle = (str) => {
        if (str === 'Rcommission') {
            return `Referral Commission`
        } else {
            return str
        }
    };
    */

    useEffect(() => {
        console.log('Sidebar.useEffect(()...');
        document.querySelector(".left-arrow").classList.add("d-none");
        window.addEventListener("resize", handleResize);
        handleResize();
        const currentUrl = window.location.pathname;
        MENUITEMS.map((items) => {
            items.Items.filter((Items) => {
                if (Items.path === currentUrl) setNavActive(Items);
                //if (!Items.children) return false;
                if (Items.children) Items.children.filter((subItems) => {
                    if (subItems.path === currentUrl) setNavActive(subItems);
                    if (!subItems.children) return false;
                    subItems.children.filter((subSubItems) => {
                        if (subSubItems.path === currentUrl) {
                            setNavActive(subSubItems);
                            return true;
                        } else {
                            return false;
                        }
                    });
                    return subItems;
                });
                return Items;
            });
            return items;
        });

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };

      // eslint-disable-next-line
    }, [layout]);

    useEffect(() => {
        console.log('Sidebar.useEffect(()...');
        axiosInstance
            .get(`${baseURL}v1/admin/fetch-admin`, config)
            .then((res) => {
                console.log(`${baseURL}v1/admin/fetch-admin`, res);
                console.log('res?.data?.result = ', res?.data?.result);
                console.log('res?.data?.result.permissions = ', res?.data?.result.permissions);
                const menuItemsArray = Object.values(MENUITEMS[0]).flat();
                //console.log('menuItemsArray = ', menuItemsArray);
                let filteredMenuItems = [];
                if (res.data.result.permissions?.length > 0) {
                    filteredMenuItems = menuItemsArray.filter((menuItem) =>
                        res.data.result.permissions?.find((permission) => {
                            //console.log('menuItem = ', menuItem);
                            //console.log('permission = ', permission);
                            console.log('menuItem.name = '+ menuItem.name +', permission.name = '+ permission.name);
                            //if (menuItem.title == permission.title) {
                            if (menuItem.name == permission.name) {
                                console.log('menuItem.permission?.view = ', menuItem.permission?.view);
                                //console.log('permission.permissions?.view = ', permission.permissions?.view);
                                console.log('permission.permission?.view = ', permission.permission?.view);
                                //if (menuItem.permission?.view == permission.permissions?.view) return menuItem;
                                if (menuItem.permission?.view == permission.permission?.view) return menuItem;
                            } 
                        })
                    );
                    //console.log('menuItemsArray = ', menuItemsArray);
                }
                dispatch({
                    type: SAVE_NAME,
                    payload: res.data.result?.firstName,
                });
                console.log('filteredMenuItems = ', filteredMenuItems);
                setMainMenu([{ Items: filteredMenuItems }]);
                // onClose();
            })
            .catch((err) => {
                // setShowLoader(false);
                if (
                    err.response &&
                    err.response.data.errors &&
                    err.response.data.errors.length > 1
                ) {
                    Swal.fire({
                        title: "Alert",
                        text: err?.response?.data?.errors,
                        icon: "error",
                    });
                } else {
                    Swal.fire("Alert", err?.response?.data?.message, "error");
                }
            });
    }, []);

    const handleResize = () => {
        setWidth(window.innerWidth - 500);
    };

    const setNavActive = (item) => {
        MENUITEMS.map((menuItems) => {
            menuItems.Items.filter((Items) => {
                if (Items !== item) {
                    Items.active = false;
                    document.querySelector(".bg-overlay1").classList.remove("active");
                }
                if (Items.children && Items.children.includes(item)) {
                    Items.active = true;
                    document.querySelector(".sidebar-link").classList.add("active");
                }
                if (Items.children) {
                    Items.children.filter((submenuItems) => {
                        if (submenuItems.children && submenuItems.children.includes(item)) {
                            Items.active = true;
                            submenuItems.active = true;
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
                return Items;
            });
            return menuItems;
        });
        item.active = !item.active;
        setMainMenu(MENUITEMS);
    };

    const toggletNavActive = (item) => {
        console.log('toggletNavActive(item)');

        //const urlpage = window.location.href;

        if (window.innerWidth <= 991) {
            document.querySelector(".page-header").className = "page-header close_icon";
            document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon ";
            document .querySelector(".mega-menu-container").classList.remove("d-block");
            if (item.type === "sub") {
                document.querySelector(".page-header").className = "page-header ";
                document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper ";
            }
        }

        if (!item.active) {
            mainmenu.map((a) => {
                a.Items.filter((Items) => {
                    if (a.Items.includes(item)) Items.active = false;
                    if (!Items.children) return false;
                    Items.children.forEach((b) => {
                        if (Items.children.includes(item)) {
                            b.active = false;
                        }
                        if (!b.children) return false;
                        b.children.forEach((c) => {
                            if (b.children.includes(item)) {
                                c.active = false;
                            }
                        });
                    });
                    return Items;
                });
                return a;
            });
        }
        item.active = !item.active;
        //console.log('mainmenu = ', mainmenu);
        setMainMenu(mainmenu);
    };

    const scrollToRight = () => {
        if (margin <= -2598 || margin <= -2034) {
            if (width === 492) {
                setMargin(-3570);
            } else {
                setMargin(-3464);
            }
            document.querySelector(".right-arrow").classList.add("d-none");
            document.querySelector(".left-arrow").classList.remove("d-none");
        } else {
            setMargin((margin) => (margin += -width));
            document.querySelector(".left-arrow").classList.remove("d-none");
        }
    };

    const scrollToLeft = () => {
        if (margin >= -width) {
            setMargin(0);
            document.querySelector(".left-arrow").classList.add("d-none");
            document.querySelector(".right-arrow").classList.remove("d-none");
        } else {
            setMargin((margin) => (margin += width));
            document.querySelector(".right-arrow").classList.remove("d-none");
        }
    };

    const closeOverlay = () => {
        document.querySelector(".bg-overlay1").classList.remove("active");
        document.querySelector(".sidebar-link").classList.remove("active");
    };

    const activeClass = () => {
        // document.querySelector(".sidebar-link").classList.add("active");
        // document.querySelector(".bg-overlay1").classList.add("active");
    };

    const openCloseSidebar = (toggle) => {
        if (toggle) {
            setSidebartoogle(!toggle);
            document.querySelector(".page-header").className = "page-header close_icon";
            document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon ";
        } else {
            setSidebartoogle(!toggle);
            document.querySelector(".page-header").className = "page-header";
            document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper ";
        }
    };

    const responsiveSidebar = () => {
        document.querySelector(".page-header").className = "page-header close_icon";
        document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon";
    };

    //mainmenu?.map(function(Item, i) {
    //    console.log('Item = ', Item);
    //    console.log('Item.Items = ', Item.Items);
    //});

    return (
        <Fragment>

            <div
                className={`bg-overlay1`}
                onClick={() => {
                    closeOverlay();
                }}
            ></div>

            <div className="sidebar-wrapper" style={{background:"white", height:"100%"}}>
                <div className="logo-wrapper" style = {{ textAlign:"center" }}>

                    {/* <Link to={`${process.env.PUBLIC_URL}/dashboard/default`}> */}
                    <Link
                        to = { `${process.env.PUBLIC_URL}` }
                        style = {{
                            fontSize: "20px"
                            , fontWeight: "bold"
                        }}
                        >

                        <img
                            className="img-fluid for-light"
                            src={Logo}
                            alt=""
                            //width="122px"
                            /*
                            style = {{
                                width: '100%'
                                , margin: 'auto'
                                , textAlign: 'center'
                            }}
                            */
                            />
                        <img
                            className="img-fluid for-dark"
                            src={Logo}
                            alt=""
                            /*
                            style = {{
                                width: '100%'
                                , margin: 'auto'
                                , textAlign: 'center'
                            }}
                            */
                            />
                        <br/>Admin
                    </Link>

                    <div className="back-btn" onClick={() => responsiveSidebar()}>
                        <i className="fa fa-angle-left"></i>
                    </div>

                    {/*
                    <div
                        className="toggle-sidebar"
                        onClick={() => openCloseSidebar(sidebartoogle)}
                        >
                        <Grid className="status_toggle middle sidebar-toggle" />
                    </div>
                    */}

                </div>
                <div className="logo-icon-wrapper">
                    <Link to={`${process.env.PUBLIC_URL}/dashboard/default/${layout}`}>
                        <img
                            className="img-fluid"
                            src={require("../../assets/images/logo/logo.svg")}
                            alt=""
                            style = {{ width: '100%' }}
                            />
                    </Link>
                </div>
                <nav className="sidebar-main" style={{backgroundColor:"white"}}>
                    <div className="left-arrow" onClick={scrollToLeft}>
                        <ArrowLeft />
                    </div>
                    <div
                        id="sidebar-menu"
                        className="sidebarMenuStyle"
                        style={
                          wrapper.split(" ").includes("horizontal-wrapper")
                            ? { marginLeft: margin + "px" }
                            : { margin: "0px" }
                        }>
                        <ul className="sidebar-links custom-scrollbar" style={{overflowX:"hidden", maxHeight:"75vh", paddingBottom:"10px"}}>

                            <li className="back-btn">
                              <div className="mobile-back text-right">
                                <span>{"Back"}</span>
                                <i className="fa fa-angle-right pl-2" aria-hidden="true"></i>
                              </div>
                            </li>

                            {
                                mainmenu?.map((Item, i) => (
                                    <Fragment key={i}>

                                        {/*
                                        <li className="sidebar-main-title">
                                            <div>
                                                <h6 className="lan-1">{props.t(Item.menutitle)}</h6>
                                                <p className="lan-2">{props.t(Item.menucontent)}</p>
                                            </div>
                                        </li>
                                        */}

                                        {
                                            Item.Items.map((menuItem, i) => {

                                                //console.log('menuItem = ', menuItem)

                                                return (
                                                    <li className="sidebar-list" key={i}>
                                                        {
                                                            menuItem.type === "sub"
                                                            ? (
                                                                <a
                                                                    href="javascript"
                                                                    className={`sidebar-link sidebar-title ${ menuItem.active ? activeClass() : EMPTY_STRING }`}
                                                                    onClick={(event) => {
                                                                        event.preventDefault();
                                                                        setNavActive(menuItem);
                                                                    }}>
                                                                    <menuItem.icon />
                                                                    {/*
                                                                    <span>{props.t(menuItem.title)}</span>
                                                                    */}
                                                                    <span>{ menuItem.title }</span>
                                                                    {
                                                                        menuItem.badge
                                                                        ? (
                                                                            <label className={menuItem.badge}>
                                                                                { menuItem.badgetxt }
                                                                            </label>
                                                                        ) : (
                                                                            EMPTY_STRING
                                                                        )
                                                                    }
                                                                    <div className="according-menu">
                                                                        {
                                                                            menuItem.active
                                                                            ? (
                                                                                <i className="fa fa-angle-down"></i>
                                                                            ) : (
                                                                                <i className="fa fa-angle-right"></i>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                EMPTY_STRING
                                                            )
                                                        }

                                                        {
                                                            menuItem.type === "link"
                                                            ? (
                                                                <Link
                                                                    to = {menuItem.path + "/" + layout}
                                                                    className = {`sidebar-link sidebar-title link-nav  ${ menuItem.active ? "active" : EMPTY_STRING }`}
                                                                    onClick = {() => toggletNavActive(menuItem)}
                                                                    >
                                                                    <menuItem.icon />
                                                                    {/*
                                                                    <span>{formatTitle(props.t(menuItem.title))}</span>
                                                                    <span>{ formatTitle(menuItem.title) }</span>
                                                                    */}
                                                                    <span>{ menuItem.title }</span>
                                                                    {
                                                                        menuItem.badge ? (
                                                                            <label className={menuItem.badge}>
                                                                                { menuItem.badgetxt }
                                                                            </label>
                                                                        ) : (
                                                                            EMPTY_STRING
                                                                        )
                                                                    }
                                                                </Link>
                                                            ) : (
                                                                EMPTY_STRING
                                                            )
                                                        }

                                                        {
                                                            menuItem.children?.length
                                                            ? (
                                                                <ul
                                                                    className = "sidebar-submenu"
                                                                    style = {
                                                                        menuItem.active
                                                                        ? sidebartoogle
                                                                            ? {
                                                                                opacity: 1,
                                                                                transition: "opacity 500ms ease-in",
                                                                            }
                                                                            : { display: "block" }
                                                                        : { display: "none" }
                                                                    }>

                                                                    {
                                                                        menuItem.children.map((childrenItem, index) => {
                                                                            return (
                                                                                <li key={index}>
                                                                                    {
                                                                                        childrenItem.type === "sub"
                                                                                        ? (
                                                                                            <a
                                                                                                href="javascript"
                                                                                                className={`${ childrenItem.active ? "active" : EMPTY_STRING }`}
                                                                                                onClick={(event) => {
                                                                                                    event.preventDefault();
                                                                                                    toggletNavActive(childrenItem);
                                                                                                }}>
                                                                                                {/*
                                                                                                { props.t(childrenItem.title) }
                                                                                                */}
                                                                                                { childrenItem.title }
                                                                                                <span className="sub-arrow">
                                                                                                    <i className="fa fa-chevron-right"></i>
                                                                                                </span>
                                                                                                <div className="according-menu">
                                                                                                    {
                                                                                                        childrenItem.active
                                                                                                        ? (
                                                                                                            <i className="fa fa-angle-down"></i>
                                                                                                        ) : (
                                                                                                            <i className="fa fa-angle-right"></i>
                                                                                                        )
                                                                                                    }
                                                                                                </div>
                                                                                            </a>
                                                                                        ) : (
                                                                                            EMPTY_STRING
                                                                                        )
                                                                                    }

                                                                                    {
                                                                                        childrenItem.type === "link"
                                                                                        ? (
                                                                                            <Link
                                                                                                to={childrenItem.path + "/" + layout}
                                                                                                className={`${ childrenItem.active ? "active" : EMPTY_STRING }`}
                                                                                                onClick={() =>
                                                                                                    toggletNavActive(childrenItem)
                                                                                                }>
                                                                                                {/*
                                                                                                { props.t(childrenItem.title) }
                                                                                                */}
                                                                                                { childrenItem.title }
                                                                                            </Link>
                                                                                        ) : (
                                                                                            EMPTY_STRING
                                                                                        )
                                                                                    }

                                                                                    {
                                                                                        childrenItem.children
                                                                                        ? (
                                                                                            <ul
                                                                                                className="nav-sub-childmenu submenu-content"
                                                                                                style={
                                                                                                    childrenItem.active
                                                                                                    ? { display: "block" }
                                                                                                    : { display: "none" }
                                                                                                }>
                                                                                                {
                                                                                                    childrenItem.children.map((childrenSubItem, key) => (
                                                                                                        <li key={key}>
                                                                                                          {
                                                                                                              childrenSubItem.type === "link"
                                                                                                              ? (
                                                                                                                  <Link
                                                                                                                      to={childrenSubItem.path}
                                                                                                                      className={`${ childrenSubItem.active ? "active" : EMPTY_STRING }`}
                                                                                                                      onClick={() =>
                                                                                                                          toggletNavActive(childrenSubItem)
                                                                                                                      }>
                                                                                                                      {/*
                                                                                                                      {props.t(childrenSubItem.title)}
                                                                                                                      */}
                                                                                                                      { childrenSubItem.title }
                                                                                                                  </Link>
                                                                                                              ) : (
                                                                                                                  EMPTY_STRING
                                                                                                              )
                                                                                                          }
                                                                                                        </li>
                                                                                                    ))
                                                                                                }
                                                                                            </ul>
                                                                                        ) : (
                                                                                            EMPTY_STRING
                                                                                        )
                                                                                    }
                                                                                </li>
                                                                            );
                                                                        })
                                                                    }
                                                                </ul>
                                                            ) : (
                                                                EMPTY_STRING
                                                            )
                                                        }
                                                </li>
                                            )}
                                        )}
                                    </Fragment>
                                )
                            )}
                        </ul>
                    </div>
                    <div className="right-arrow" onClick={scrollToRight}>
                        <ArrowRight />
                    </div>
                </nav>
            </div>
        </Fragment>
    );
};

//export default translate(Sidebar);
export default Sidebar;
