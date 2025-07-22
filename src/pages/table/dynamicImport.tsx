import React, { useEffect,ReactElement } from "react";
import Layout from "@layout/index";
import BreadcrumbItem from "../../Common/BreadcrumbItem";
import { Card, Col, Row} from "react-bootstrap";
import TableContainer from "../../Common/TableContainer";
import { data } from "@common/JsonData";

const DynamicImport = () => {

    const columns = [
        { header: "Name", accessorKey: "Name", enableColumnFilter: false },
        { header: "Position", accessorKey: "position", enableColumnFilter: false },
        { header: "Office", accessorKey: "office", enableColumnFilter: false },
        { header: "Age", accessorKey: "age", enableColumnFilter: false },
        { header: "Start Date", accessorKey: "startDate", enableColumnFilter: false },
        { header: "Salary", accessorKey: "salary", enableColumnFilter: false },
    ];
    
    useEffect(() => {
        const data = "Name,Ext.,City,Start Date|Hammett Gordon,8101,Wah,1998/06/09|Kyra Moses,3796,Quenast,1998/07/07|Kelly Cameron,4836,Fontaine-Valmont,1999/02/07|Theodore Duran,8971,Dhanbad,1999/04/07|Hammett Gordon,8101,Wah,1998/06/09|Kyra Moses,3796,Quenast,1998/07/07|Kelly Cameron,4836,Fontaine-Valmont,1999/02/07|Theodore Duran,8971,Dhanbad,1999/04/07|Hammett Gordon,8101,Wah,1998/06/09|Kyra Moses,3796,Quenast,1998/07/07|Kelly Cameron,4836,Fontaine-Valmont,1999/02/07|Theodore Duran,8971,Dhanbad,1999/04/07|Hammett Gordon,8101,Wah,1998/06/09|Kyra Moses,3796,Quenast,1998/07/07|Kelly Cameron,4836,Fontaine-Valmont,1999/02/07|Theodore Duran,8971,Dhanbad,1999/04/07";
        const lines = data.split("|");
        const headings = lines[0].split(",");
        const rows = lines.slice(1).map(line => line.split(","));

        // Dynamically create the table HTML
        const tableHTML = `
      <thead>
        <tr>
          ${headings.map(heading => `<th>${heading}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map(cell => `<td>${cell}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    `;

        // Insert the table HTML into the DOM
        const tableElement = document.getElementById("pc-dt-dynamic-import");
        if (tableElement) {
            tableElement.innerHTML = tableHTML;
        }
    }, []);

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Table" subTitle="Dynamic Import" />
            <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <h5>Dynamic Import</h5>
                            </Card.Header>
                            <Card.Body className="table-border-style">
                                <div id="pc-dt-export">
                                    <TableContainer
                                        columns={columns || []}
                                        data={data || []}
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
        </React.Fragment>
    );
};
DynamicImport.getLayout = (page: ReactElement) => {

    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default DynamicImport;
