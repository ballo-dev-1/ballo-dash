import React from "react";
import { Card, Table } from "react-bootstrap";

const BasicTable1 = () => {
  return (
    <Card>
      <Card.Header>
        <h5>Facebook</h5>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-06-10 14:23:00</td>
                <td>Womens Day Post</td>
                <td>810</td>
                <td>19</td>
                <td>👍 17, ❤️ 2</td>
              </tr>
              <tr>
                <td>2025-05-19 08:42:00</td>
                <td>Happy Monday Post</td>
                <td>580</td>
                <td>36</td>
                <td>👍 22, ❤️ 10, 😆 4</td>
              </tr>
              <tr>
                <td>2025-06-10 14:23:00</td>
                <td>What's New Post</td>
                <td>620</td>
                <td>15</td>
                <td>8👍 , ❤️ 2, 😲 5</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BasicTable1;
