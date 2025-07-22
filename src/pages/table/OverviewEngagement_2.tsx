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

const OverviewEngagement = () => {
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

  const title = "Account Overview";
  const columns = [
    { header: "Platform", enableColumnFilter: false, accessorKey: "Platform" },
    {
      header: "Page Name.",
      enableColumnFilter: false,
      accessorKey: "Page Name",
    },
    {
      header: "Followers",
      enableColumnFilter: false,
      accessorKey: "Followers",
    },
    {
      header: "Engagement Rate",
      enableColumnFilter: false,
      accessorKey: "Engagement Rate",
    },
    {
      header: "Reach (Last 7 Days)",
      enableColumnFilter: false,
      accessorKey: "Reach (Last 7 Days)",
    },
    { header: "Clicks", enableColumnFilter: false, accessorKey: "Clicks" },
    {
      header: "Last Post Date",
      enableColumnFilter: false,
      accessorKey: "Last Post Date",
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

export default OverviewEngagement;
