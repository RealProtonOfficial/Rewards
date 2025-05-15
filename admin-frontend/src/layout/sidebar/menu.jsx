import {
      Box
    , Anchor
    , Headphones
    , Send
    , Users
    , Activity
    , ShoppingBag
    , Globe
    , Database
    , Layers
    , HelpCircle
    , ArrowRight
} from "react-feather";

import DynamicPageIcons from "./DynamicPageIcons";

export const MENUITEMS = [

    /*
    {
        menutitle:"General",
        menucontent:"Dashboards,Widgets",
        Items:[
            {
                title: 'Dashboard', icon: Home, type: 'sub', active: false, children: [
                    { path: `${process.env.PUBLIC_URL}/dashboard/default`, title: 'Default', type: 'link' },
                    { path: `${process.env.PUBLIC_URL}/dashboard/ecommerce`, title: 'Ecommerce', type: 'link' },
                ]
            }
        ]
    }
    */

    {
        Items: [

            {
                  name: "platform-commission"
                  //name: "commission"
                , title: "Platform Commission"
                , path: `${process.env.PUBLIC_URL}/commission/commission`
                , icon: Globe
                , active: false
                , type: "link"
                , permission: {
                      view: true
                    , add: true
                    , edit: true
                    , delete: true          
                }
            }

            , {
                  name: "referral-commission"
                , title: "Referral Commission"
                , path: `${process.env.PUBLIC_URL}/referral/commission`
                , icon: Globe
                , active: false
                , type: "link"
                , permission: {
                      view: true
                    , add: true
                    , edit: true
                    , delete: true
                }
            }
            
        ]
    }

];
