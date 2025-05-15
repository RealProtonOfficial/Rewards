import React, { useState } from "react";
import "./index.css";
import Settings from "./commissionSetting";
import ReferralCommissionTable from "./referralCommissionListing";

export default function ReferralCommission() {

    const [selectedTab, setSelectedTab] = useState("settings");

    return (
        <div>

            <div class="page-title">
                <div class="row">
                    <div class="col-6">
                        <h1>Referral Commission</h1>
                    </div>
                </div>
            </div>

            <div className="commissionContent">
                <div className="boleroTabsSection">
                    <div
                      className={
                        "UsersTabOption " +
                        (selectedTab == "settings" ? "userTabSelected" : "")
                      }
                      onClick={() => {
                        setSelectedTab("settings");
                      }}
                    >
                      Referral Settings
                    </div>

                    {/*
                    <div
                        className={
                          "boleroTabCurve " +
                          (selectedTab == "settings" ? "userTabSelected" : "")
                        }
                        onClick={() => {
                          setSelectedTab("settings");
                        }}
                      ></div>
                    */}

                    <div
                        className={
                          "UsersTabOption " +
                          (selectedTab == "referralCommission" ? "userTabSelected" : "")
                        }
                        onClick={() => {
                          setSelectedTab("referralCommission");
                        }}
                        >
                        Blocked user Referral Commission
                    </div>

                    {/*
                    <div
                        className={
                          "boleroTabCurve" +
                          (selectedTab == "referralCommission" ? "userTabSelected" : "")
                        }
                        onClick={() => {
                          setSelectedTab("referralCommission");
                        }}
                        ></div>
                    */}
                </div>
                
                {
                    selectedTab == "settings"
                    &&
                        <div
                            className="products-content"
                            >
                            <Settings />
                        </div>
                }

                {
                    selectedTab == "referralCommission"
                    &&
                        <div
                            className="products-content"
                            >
                            <ReferralCommissionTable />
                        </div>
                }
            </div>
        </div>
    );
}
