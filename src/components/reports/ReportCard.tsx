import React from "react";
import { Card, Button } from "react-bootstrap";

interface ReportCardProps {
    platformName: string;
    children: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ platformName, children }) => {
    return (
        <div className="pdf-report-view">
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pb-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="mb-1">{platformName} Analytics Report</h4>
                            <p className="text-muted mb-0">Generated on {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                                <i className="ph-duotone ph-download me-1"></i>
                                Download PDF
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                                <i className="ph-duotone ph-printer me-1"></i>
                                Print
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {children}
                    
                    {/* Footer */}
                    <div className="text-center text-muted small border-top pt-3">
                        <p className="mb-0">This report was generated automatically by Ballo Analytics Dashboard</p>
                        <p className="mb-0">For questions or support, contact your account manager</p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReportCard;
