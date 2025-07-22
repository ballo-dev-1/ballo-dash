import React from "react";
import { Card, Table } from "react-bootstrap";

const BasicTable2 = () => {
  return (
    <Card>
      <Card.Header>
        <h5>LinkedIn</h5>
        {/* <span className="d-block m-t-5">
          use class <code>table</code> inside table element
        </span> */}
      </Card.Header>
      <Card.Body className="table-border-style">
        <div className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Message</th>
                <th>Reach</th>
                <th>Engagements</th>
                <th>Reactions</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-06-12 11:00:00</td>
                <td>We think outside the box</td>
                <td>5,600</td>
                <td>19</td>
                <td>👍 17, ❤️ 2</td>
                <td>19</td>
              </tr>
              <tr>
                <td>2025-06-08 08:45:00</td>
                <td>We're hiring</td>
                <td>580</td>
                <td>36</td>
                <td>👍 22, ❤️ 10, 😆 4</td>
                <td>19</td>
              </tr>
              <tr>
                <td>2025-06-04 16:30:00</td>
                <td>What's New Post</td>
                <td>620</td>
                <td>15</td>
                <td>8👍 , ❤️ 2, 😲 5</td>
                <td>19</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BasicTable2;
