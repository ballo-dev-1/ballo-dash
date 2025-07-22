import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { apimethod } from "@common/JsonData";
import { useAppDispatch, useAppSelector } from "@/toolkit/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMetaStats,
  selectMetaErrorStats,
  selectMetaStats,
  selectMetaStatusStats,
} from "@/toolkit/metaData/reducer";

const OverviewSocialToWebsite = () => {
  const dispatch = useAppDispatch();
  const stats = useSelector(selectMetaStats);
  const status = useSelector(selectMetaStatusStats);
  const error = useSelector(selectMetaErrorStats);

  useEffect(() => {
    dispatch(fetchMetaStats({ pageId: "me", platform: "facebook" }));
  }, [dispatch]);
  useEffect(() => {
    console.log("App stats");
    console.log(stats);
  }, [stats]);

  const title = "Recent Post Performance Overview";
  const description = "Audience growth over time.";
  const columns = [
    {
      header: "Date",
      enableColumnFilter: false,
      accessorKey: "Date",
    },
    { header: "Platform", enableColumnFilter: false, accessorKey: "Platform" },
    {
      header: "Page Name.",
      enableColumnFilter: false,
      accessorKey: "Page Name",
    },
    {
      header: "Visitors",
      enableColumnFilter: false,
      accessorKey: "Visitors",
    },
    {
      header: "Bounce Rate",
      enableColumnFilter: false,
      accessorKey: "Bounce Rate ",
    },
    { header: "Lost", enableColumnFilter: false, accessorKey: "Lost" },
    {
      header: "Avg Time on Site",
      enableColumnFilter: false,
      accessorKey: "Avg Time on Site",
    },
  ];

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header>
            <h5>{title}</h5>
          </Card.Header>
          <Card.Body className="table-border-style">
            <div id="pc-dt-fetchapi">
              <TableContainer
                columns={columns || []}
                data={apimethod || []}
                isGlobalFilter={true}
                isBordered={false}
                customPageSize={10}
                isPagination={true}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OverviewSocialToWebsite;
