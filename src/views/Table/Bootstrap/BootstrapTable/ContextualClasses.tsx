import React from "react";
import { Card, Table } from "react-bootstrap";

const ContextualClassesTable = () => {
  return (
    <Card>
      <Card.Header>
        <h5>Top performing Posts</h5>
        <span className="d-block m-t-5">
          For Make row Contextual add Contextual class like{" "}
          <code>.table-success</code> in <code>tr tag</code> and For cell add
          Contextual class in <code>td or th tag</code>.
        </span>
      </Card.Header>
      <Card.Body className="table-border-style">
        <div className="table-responsive">
          <Table className="table">
            <thead>
              <tr>
                <th># Rank</th>
                <th>Date</th>
                <th>Platform</th>
                <th>Type</th>
                <th>Caption (shortened)</th>
                <th>Impressions</th>
                <th>Engagement Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-success">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-success">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-success">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-success">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-active">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr className="table-active">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr className="table-active">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-warning">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-warning">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-danger">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-info">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ContextualClassesTable;
