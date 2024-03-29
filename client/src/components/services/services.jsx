import React, { useContext, useState, useEffect } from "react";
// import { Image } from "react-bootstrap";
import Service from "./service";
import { v4 as uuidv4 } from "uuid";
import emoji from "react-easy-emoji";
import { useParams } from "react-router-dom";

import Infobar from "../generic/infobar";
import { ThemeContext } from "../../contexts/ThemeContext";
import SearchBar from "../generic/SearchBar";
import CustomPagination from "../generic/CustomPagination";
import FloatingCart from "../shoppingCart/FloatingCart";
import PromotionalCarousel from "./PromotionalCarousel";

const Services = () => {
    const params = useParams();
    const [flag, setFlag] = useState(true);
    const [sName, setSName] = useState("");
    const [services, setServices] = useState([]);
    const [searchData, setSearchData] = useState("");

    const [totalPage, setTotalPage] = useState(0);
    const [activePage, setActivePage] = useState(1);

    const [isServiceProvider] = useState(
        localStorage.getItem("isServiceProvider") === "true"
    );

    // Themes
    const { isLightTheme, theme } = useContext(ThemeContext);
    // const border = isLightTheme ? theme.light.border : theme.dark.border;
    const syntax = isLightTheme ? theme.light.syntax : theme.dark.syntax;

    // componentDidMount
    useEffect(() => {
        let API_URL = "/ownProducts/";

        const loadData = async () => {
            let bodyData = {
                service_id: params.id,
                page_number: activePage,
                search_data: searchData,
            };

            let response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            let data = await response.json();

            setServices(data.products);

            // Gey total page
            API_URL = "/inventory/page/";

            bodyData = {
                service_id: params.id,
                search_data: searchData,
            };

            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            data = await response.json();

            setTotalPage(data.details);
        };
        loadData();
    }, [params, flag, searchData, activePage]);

    useEffect(() => {
        // if (services.length > 0) {
        const API_URL = "/getProfile/";

        const loadData = async () => {
            const servideID = {
                userid: params.id,
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(servideID),
            });

            const data = await response.json();

            setSName(data.company_name);
        };
        loadData();
        // }
    }, [services, params.id]);

    // componentDidMount
    useEffect(() => {
        setActivePage(1);
    }, [searchData]);

    const updateFlag = () => setFlag(!flag);

    const handleChange = (e) => setSearchData(e.target.value);

    const handlePageClick = (e) => setActivePage(e);

    return (
        <div>
            {isServiceProvider ? <h4 className={"mb-5 text-center" + syntax}>Your Inventory</h4> : <PromotionalCarousel />}

            <div className={"text-center" + syntax}>
                {/* <FloatingCart /> */}
                {isServiceProvider? "" :  <FloatingCart />}
                {/* <h4 className={"mb-5" + syntax}>
                    {isServiceProvider ? "Your Inventory" : "Our Services"}
                </h4> */}

                <SearchBar
                    handleChange={handleChange}
                    placeholder="Search products...."
                    searchBy="Search products by product name, company name or price"
                />

                {sName && (
                    <Infobar>
                        {sName}
                        {/* {emoji("🤪")} */}
                    </Infobar>
                )}
            </div>

            {services && services.length > 0 ? (
                <>
                    <div className="row">
                        {services.map((service) => (
                            // Here gives unmounted error 🙁
                            <Service
                                key={uuidv4()}
                                serviceInfo={service}
                                updateFlag={updateFlag}
                            />
                        ))}
                    </div>

                    <CustomPagination
                        totalPage={totalPage}
                        activePage={activePage}
                        handlePageClick={handlePageClick}
                    />
                </>
            ) : (
                <Infobar>No services {emoji("☹")}</Infobar>
            )}
        </div>
    );
};

export default Services;
