/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

// import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
// import Box from "@mui/material/Box";
// import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loader from "../common/Loader/Loader";
import "./commissionListing.css";
import Swal from "sweetalert2";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FilterListIcon from "@mui/icons-material/FilterList";

import { axiosInstance } from "../../utility/api";
import NoRecordsFound from "../common/Error/NoRecordsFound";
import moment from "moment";

const useRowStyles = makeStyles({
  root: {
    marginTop: "0px",
    border: "none",
    width: "100%",
  },
  header: {
    backgroundColor: "#F5F5FC",
  },
  rowDatas: {
    "& td,th": {
      border: "none",
      height: "90px",
    },
  },
  border__right: {
    borderRight: "2px solid white",
    height: "70%",
  },
  cursorDefault: {
    cursor: "default",
  },
});

//Each row of table
function Row(props) {
  const { data, tableColumnWidth } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow
        onClick={() => {
          setOpen(!open);
        }}
        className={classes.rowDatas}
        style={{ borderBottom: "12px solid #F5F5FC", cursor: "default" }}
      >
        <TableCell style={{ width: `${tableColumnWidth[0]}%` }}>
          <div className="columnStyles">
            {data?.referral?.userName || 'NA'}
          </div>
        </TableCell>
        <TableCell style={{ width: `${tableColumnWidth[1]}%` }}>
          <div className="columnStyles">
            {data?.level}
          </div>
        </TableCell>
        <TableCell style={{ width: `${tableColumnWidth[2]}%` }}>
          <div className="columnStyles">
            {data?.createdAt ? moment(data?.createdAt).format('DD/MM/YYYY') : "N/A"}
          </div>
        </TableCell>
        <TableCell style={{ width: `${tableColumnWidth[3]}%` }}>
          <div className="columnStyles">
            {data?.createdAt ? moment(data?.createdAt).format('hh:mm A') : "N/A"}
          </div>
        </TableCell>
        <TableCell style={{ width: `${tableColumnWidth[4]}%` }}>
          <div className="columnStyles">
              ${data?.commissionAmount || "0"}
          </div>
        </TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <ExpandedRow
                rowData={data}
                setShowLoader={(e) => setShowLoader(e)}
                showLoader={showLoader}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </React.Fragment>
  );
}

const RenderHeader = ({ columns, onSorting }) => {
  const [sortingField, setSortingField] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");

  const onSortingChange = (field) => {
    const order =
      field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
    setSortingField(field);
    setSortingOrder(order);
    onSorting(field, order);
  };

  const classes = useRowStyles();
  return (
    <TableHead className={classes.header}>
      <TableRow>
        {columns?.map(({ name, field, sortable, image }) => (
          <TableCell
            align={columns.align}
            key={name}
            className={classes.cursorDefault}
          >
            <div className="dividerFlex">
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                  fontWeight: "600",
                  fontSize: "12px",
                  cursor: sortable ? "pointer" : "default",
                }}
                onClick={() => (sortable ? onSortingChange(field) : null)}
              >
                {name}
                {/* {sortable && (
                  <div className="sort_icons">
                    <img src={upSort} alt="" className="sortArrows" />
                    <img src={downSort} alt="" className="sortArrows" />
                  </div>
                )} */}
              </div>
            </div>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default function ReferralCommissionTable({ showLoader }) {
  const classes = useRowStyles();
  const [sorting, setSorting] = useState({ field: "_id", order: "desc" });
  const [tableData, setTableData] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [commissionList, setCommissionList] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedLevel, setSelectedLevel] = useState("all");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const tableColumnWidth = [40, 20, 20, 20];
  const columns = [
    {
      name: "Name of the Affiliate",
      field: "name",
      // image: Divider,
      numeric: false,
      sortable: false,
      align: "left",
    },
    {
      name: "Level",
      field: "Level",
      // image: Divider,
      numeric: false,
      sortable: false,
      align: "left",
    },
    {
      name: "Date of Purchase",
      field: "purchaseDate",
      // image: Divider,
      numeric: false,
      sortable: false,
      align: "left",
    },
    {
      name: "Time of Purchase",
      field: "purchaseTime",
      // image: Divider,
      numeric: false,
      sortable: false,
      align: "left",
    },
    {
      name: "Earned Commission",
      field: "commissionEarned",
      // image: Divider,
      numeric: true,
      sortable: false,
      align: "left",
    },
  ];

  useEffect(() => {
    getCommissionList();
  }, [selectedLevel, pageNo]);

  const handleChangePage = (event, nextPageNo) => {
    setPageNo(nextPageNo);
    window.scrollTo(0, 0);
  };

  const getCommissionList = async () => {
    let urlParam = {
      params: {
        page: pageNo + 1,
        sortBy: sorting.field,
        sorting: sorting.order,
      },
    };
    let page = pageNo+1;
    const result = await axiosInstance
      .get(`/v1/admin/blocked/rewards/history?page=${page}${selectedLevel !=='all' ? '&level='+selectedLevel : ''}`, { headers })
      .then((result) => {
        setCommissionList(result?.data?.result?.rewards);
        setTotalCount(result?.data?.result?.totalItems);
      })
      .catch((err) => {
        if (
          err?.response &&
          err?.response?.data?.errors &&
          err?.response?.data?.errors?.length !== 0
        ) {
          Swal.fire({
            title: "Alert",
            text: err?.response?.data?.errors.map((err) => err.msg),
            icon: "error",
          });
        } else {
          Swal.fire("Alert", err?.response?.data?.message, "error");
        }
      });
  };

  return (
    <div className="table_div tableWidth100 paddingBottom66px">
      {showLoader == true ? <Loader /> : null}
      <div className="searchBoxProduct">
        <FormControl variant="outlined" className={classes.height24}>
          <InputLabel htmlFor="outlined-age-native-simple">Filter</InputLabel>
          <Select
            native
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value)
            }}
            label="Filter"
            inputProps={{
              name: "Filter",
              id: "outlined-age-native-simple",
            }}
            IconComponent={FilterListIcon}
            displayEmpty={true}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <optgroup label="Status">
              <option value={"all"}>All</option>
              <option value={"1"}>Level 1</option>
              <option value={"2"}>Level 2</option>
              <option value={"3"}>Level 3</option>
            </optgroup>
          </Select>
        </FormControl>
      </div>
      {commissionList?.length !== 0 ? (
        <>
        <br/>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table" className={classes.root}>
              <RenderHeader
                columns={columns}
                onSorting={(field, order) => setSorting({ field, order })}
              />
              <TableBody style={{ width: "100%" }}>
                {commissionList?.map((row, index) => (
                  <Row
                    aria-label="expand row"
                    size="small"
                    key={row?.id}
                    row={row}
                    setSelectedRow={(value) => setSelectedRow(value)}
                    selectedRow={selectedRow}
                    data={commissionList[index]}
                    tableColumnWidth={tableColumnWidth}
                    setOpenEdit={setOpenEdit}
                  // setShowLoader={setShowLoader}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[]}
            // backIconButtonProps={{ disabled: false }}
            component="div"
            count={totalCount}
            rowsPerPage={10}
            page={pageNo}
            onChangePage={handleChangePage}
            // onChange={(e) => handleChangePage(e, page)}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => (
              <>
                <span className="paginationLabel">Showing </span>
                {`${from}-${to}`}
                <span className="paginationLabel"> out of </span>
                {`${count}`}
              </>
            )}
          />
        </>
      ) : (
        <div className="noResultFound flexColumnCenter">
          <NoRecordsFound message="No records found." />
        </div>
      )}
    </div>
  );
}
