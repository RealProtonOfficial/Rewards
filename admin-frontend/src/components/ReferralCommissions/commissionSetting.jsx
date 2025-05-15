import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { axiosInstance } from "../../utility/api";
import "./commissionSetting.css";
import Primary from "../../assets/images/icons/Primary.svg";
import Secondary from "../../assets/images/icons/Secondary.svg";
import { formatAPIError } from "../../utility/helper";

export default function CommissionSetting() {
  const [primaryCommision, setPrimaryCommision] = useState(0);
  const [secondaryCommision, setSecondaryCommision] = useState(0);

  const [levelOne, setLevelOne] = useState(0);
  const [levelTwo, setLevelTwo] = useState(0);
  const [levelThree, setLevelThree] = useState(0);

  const dummyData = {
    "success": true,
    "message": "Fetch commissions successfully",
    "result": [
        {
            "id": 1,
            "type": "level1",
            "commission": 1,
            "createdAt": "2022-07-18T09:54:01.063Z",
            "updatedAt": "2022-07-18T09:54:01.063Z"
        },
        {
            "id": 2,
            "type": "level2",
            "commission": 4,
            "createdAt": "2022-07-18T09:54:01.102Z",
            "updatedAt": "2022-07-18T09:54:01.102Z"
        },
        {
            "id": 3,
            "type": "level3",
            "commission": 3,
            "createdAt": "2022-07-18T09:54:01.113Z",
            "updatedAt": "2022-07-18T09:54:01.113Z"
        }
      ]
    }

  const [error,setError]=useState({});

  const config = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    },
  };

  useEffect(() => {
    getCommissionList();
  }, []);

  const commissionTypeOptions = [
    { label: "Primary Commission", value: "primary" },
    { label: "Secondary Commission", value: "secondary" },
  ];

  const getCommissionList = async () => {
    axiosInstance.get("/v1/admin/referral/commissions", config)
      .then(res => {
        if(res?.data?.result?.length) {
          let data = res?.data?.result
          if(data?.[0]?.commission && data?.[0]?.type === 'level1') setLevelOne(data?.[0]?.commission || 0)
          if(data?.[1]?.commission && data?.[1]?.type === 'level2') setLevelTwo(data?.[1]?.commission || 0)
          if(data?.[2]?.commission && data?.[2]?.type === 'level3') setLevelThree(data?.[2]?.commission || 0)
        }
      })
      .catch(err => {
        console.log(err?.response)
        let errMsg = formatAPIError(err)
        Swal.fire("Alert!", errMsg, "error");
      });
  };
  const validate = () => {
		let isValidated = true;
		let errors = {};
		if (levelOne === 0 || levelOne === '' || typeof levelOne === 'string') {
			errors["levelOne"] ="Please enter the Level 1 commission"
			isValidated = false;
		}
    if(levelOne > 0){
        if(levelOne < 0 || levelOne > 100){
          errors["levelOne"] =  "Level 1 commission should between 0% to 100%.";
          isValidated=false
        }
    }
    
    if (levelTwo === 0 || levelTwo === '' || typeof levelTwo === 'string') {
			errors["levelTwo"] ="Please enter the Level 2 commission"
			isValidated = false;
		}
    if(levelTwo > 0){
        if(levelTwo < 0 || levelTwo > 100){
          errors["levelTwo"] =  "Level 2 commission should between 0% to 100%.";
          isValidated=false
        }
    }

    if (levelThree === 0 || levelThree === '' || typeof levelThree === 'string') {
			errors["levelThree"] ="Please enter the Level 3 commission"
			isValidated = false;
		}
    if(levelThree > 0){
        if(levelThree < 0 || levelThree > 100){
          errors["levelThree"] =  "Level 3 commission should between 0% to 100%.";
          isValidated=false
        }
    }
    // console.log("errors", errors, levelOne, levelTwo, levelThree, isValidated, typeof levelOne === 'string')
		setError(errors);
		return isValidated;
	};
  const handleSubmit = async () => {
    if(validate()){
      let payload = {
        "v1": levelOne,
        "v2": levelTwo,
        "v3": levelThree
      }
      await axiosInstance.post(`/v1/admin/referral/addcommissions`, payload, config)
      .then((res) => {
        getCommissionList()
        Swal.fire("Success!", res?.data?.message, "success");
      })
      .catch((err) => {
        Swal.fire("Alert", err?.response?.data?.errors, "error");
      });
    }
   
  };

  return (
    <div className="commissionSettingWrapper">
      <div class="containers">
        <div class="container cone">
          <div class="icon flexRowFlexEnd">
            <img src={Primary} alt="primary" height="34px" />
            <h4>
              <u>Platform Admin Referral Commission.</u>
            </h4>
          </div>

          <table>
            <tr>
              <td className="commissionTableHeader">
                <label for="stock">Level 1 commission</label>
              </td>
              <td className="commissionTableContent paddingLeft78 displayFlexBaseline">
                <input
                  type="number"
                  name="adminCommission"
                  min="0"
                  className="form-control validate marginLeft10pxN"
                  value={levelOne}
                  // onKeyDown={formatInputDot}
                  onChange={(e) => {
                    setLevelOne(e.target.value === '' ? e.target.value : parseInt(e.target.value));
                    setError({...error, levelOne:''})
                  }}
                  required
                />
                <span className="percentageImgContainer">%</span>
              </td>
            </tr>
            {error?.levelOne && <tr><td></td><td className="paddingLeft78"><label className="errorMsg">{error?.levelOne}</label></td></tr>}
            <tr>
              <td className="commissionTableHeader">
                <label for="stock">Level 2 commission</label>
              </td>
              <td className="commissionTableContent paddingLeft78 displayFlexBaseline">
                <input
                  type="number"
                  name="adminCommission"
                  min="0"
                  className="form-control validate marginLeft10pxN"
                  value={levelTwo}
                  // onKeyDown={formatInputDot}
                  onChange={(e) => {
                    setLevelTwo(e.target.value === ''? e.target.value : parseInt(e.target.value));
                    setError({...error, levelTwo:''})
                  }}
                  required
                />
                <span className="percentageImgContainer">%</span>
              </td>
            </tr>
            {error?.levelTwo && <tr><td></td><td className="paddingLeft78"><label className="errorMsg">{error?.levelTwo}</label></td></tr>}
            <tr>
              <td className="commissionTableHeader">
                <label for="stock">Level 3 commission</label>
              </td>
              <td className="commissionTableContent paddingLeft78 displayFlexBaseline">
                <input
                  type="number"
                  name="adminCommission"
                  min="0"
                  className="form-control validate marginLeft10pxN"
                  value={levelThree}
                  // onKeyDown={formatInputDot}
                  onChange={(e) => {
                    setLevelThree(e.target.value === '' ? e.target.value : parseInt(e.target.value));
                    setError({...error, levelThree:''})
                  }}
                  required
                />
                <span className="percentageImgContainer">%</span>
              </td>
            </tr>
            {error?.levelThree && <tr><td></td><td className="paddingLeft78"><label className="errorMsg">{error?.levelThree}</label></td></tr>}
          </table>
          <div className="flexCenter">
            <div class="btn" onClick={() => handleSubmit()}>
              Save Changes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
