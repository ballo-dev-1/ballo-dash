import { apimethod } from "@/Common/JsonData";
import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";

interface Props {
  // meta: any; // Replace `any` with a proper type if you know the shape of `meta`
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const TopPosts: React.FC<Props> = ({ isExpanded, onToggleExpand }) => {
  const title = "Top performing posts";
  const columns = [
    { header: "Name", enableColumnFilter: false, accessorKey: "Name" },
    { header: "Ext.", enableColumnFilter: false, accessorKey: "Ext" },
    { header: "City", enableColumnFilter: false, accessorKey: "City" },
    {
      header: "Start Date",
      enableColumnFilter: false,
      accessorKey: "StartDate",
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5>{title}</h5>

                <button onClick={onToggleExpand} className="expand-btn">
                  {isExpanded ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </button>
              </div>
            </Card.Header>
            <Card.Body className="table-border-style">
              <div id="pc-dt-fetchapi" className="overflow-hidden">
                <TableContainer
                  columns={columns || []}
                  data={apimethod || []}
                  isGlobalFilter={true}
                  isBordered={false}
                  customPageSize={5}
                  isPagination={true}
                  loading={true}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default TopPosts;
