import Commission from "../components/commission";
import ReferralCommission from "../components/ReferralCommissions";
import ViewAffiliatePage from "../components/ViewAffiliate";

let publicUrl = process.env.PUBLIC_URL;

export const routes = [

      { path: `${ publicUrl }/commission/commission/:layout`            , Component: Commission         }
    , { path: `${ publicUrl }/referral/commission/:layout`              , Component: ReferralCommission }
    , { path: `${ publicUrl }/users/affiliate/:layout`                  , Component: ViewAffiliatePage  }

];
