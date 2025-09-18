import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { Share2, MoreVertical } from "lucide-react";
import reportHeaderBg from "@/assets/images/reports/report-bg-1.png";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
interface ReportHeaderProps {
    platformName: string;
    platformIcon?: any;
    reportPeriod: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ platformName, platformIcon, reportPeriod }) => {
    const company = useAppSelector(selectCompany);
    const timeInterval = "Monthly";
    
    // Fallback logo URL if company.logoUrl is not available
    const logoUrl = company?.logoUrl || '';
    const companyName = company?.name || 'Ballo Innovations';
    
    return (
        <Row className="">
            <Col xs={12}>
                <div className="d-flex align-items-center justify-content-between report-header">
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            {platformIcon && (
                                <div className="me-3 platform-icon">
                                    <Image 
                                        src={platformIcon} 
                                        alt={platformName} 
                                        width={40} 
                                        height={40}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                            <div>
                                <h2 className="mb-0">{platformName} Report</h2>
                                <small className="text-muted">Last updated: {new Date().toLocaleDateString()}</small>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-2 action-buttons">
                        <Button variant="outline-primary" size="sm">
                            <Share2 size={16} className="me-1" />
                            Share
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                            <MoreVertical size={16} />
                        </Button>
                    </div>
                </div>
            </Col>
            <Col xs={12} className="pt-3">
                <div className="report-header-bg rounded-top-2 overflow-hidden mt-4 background-image-cover background-image-center" style={{ backgroundImage: `url(${reportHeaderBg.src})`, minHeight: '60vh' }}>
                    <div className="position-absolute bg-black opacity-50 top-0 start-0 w-100 h-100" style={{ zIndex: 0 }} />
                    <div className="z-1 h-100 gap-4 position-relative text-white d-flex flex-column justify-content-between" style={{ padding: ' 8rem 5rem' }}>
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt={`${companyName} logo`}
                          className="report-header-logo"
                          style={{ width: '50%' }}
                          onError={(e) => {
                            // Fallback to a default logo if the image fails to load
                            e.currentTarget.src = '/logos/Ballo logo new-06.png';
                          }}
                        />
                      )}

                      <div >
                        <h2 className="text-white py-3" style={{ maxWidth: '25rem' }}>Social Media Plan and {timeInterval} Report</h2>
                        <span className="d-flex gap-2 mt-3 bg-blue-500 p-2 w-fit fs-5" style={{ width: 'fit-content' }}>Report Period: {reportPeriod}</span>
                      </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ReportHeader;
