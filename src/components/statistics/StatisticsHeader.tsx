import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface StatisticsHeaderProps {
    onExportPDF: () => void;
}

const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({ onExportPDF }) => {
    return (
        <Card.Body className="d-flex align-items-center justify-content-between controls-row">
            <div className="d-flex align-items-center border rounded-3 control-group">
                <button className="btn btn-sm me-2">Previous Month: 1 Feb, 2025 - 28 Feb, 2025</button>
                <button className="btn btn-sm">▼</button>
            </div>
            <Dropdown className="border rounded-3 control-group">
                <Dropdown.Toggle as="button" className="btn btn-sm">
                    Export
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={onExportPDF}>
                        <i className="feather-file-text me-2"></i>
                        Export as PDF
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Card.Body>
    );
};

export default StatisticsHeader;
