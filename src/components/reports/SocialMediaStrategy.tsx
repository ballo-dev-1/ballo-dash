import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";

interface SocialMediaStrategyProps {
    platformName: string;
}

const SocialMediaStrategy: React.FC<SocialMediaStrategyProps> = ({ platformName }) => {
    const company = useAppSelector(selectCompany);
    const companyName = company?.name || 'Ballo Innovations';
    
    const strategyItems = [
        { name: 'Strategy 1' },
        { name: 'Strategy 2' },
        { name: 'Strategy 3' },
    ];
    const productItems = [
        { name: 'Product 1' },
        { name: 'Product 2' },
        { name: 'Product 3' },
    ];
    const uniqueSellingPoints = [
        { name: 'Unique Selling Point 1' },
        { name: 'Unique Selling Point 2' },
        { name: 'Unique Selling Point 3' },
    ];
    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
                <Row className="g-0">
                    {/* Left Section - Text Content */}
                    <Col md={7} className="p-5">
                        <div className="h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                                    {companyName} Social Media Strategy
                                </h2>
                                
                                <div className="mb-4">
                                    <ol className="" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                                        {strategyItems.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))}
                                    </ol>
                                </div>
                                
                                {productItems.length > 0 && <div className="mb-4">
                                    <h3 className="fw-bold mb-3" style={{ fontSize: '1.5rem' }}>
                                        Current Best-Selling Products
                                    </h3>
                                    <ul className="" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                        {productItems.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))}
                                    </ul>
                                </div>}
                                
                                {uniqueSellingPoints.length > 0 && <div className="mb-4">
                                    <h3 className="fw-bold mb-3" style={{ fontSize: '1.5rem' }}>
                                        Unique Selling Points
                                    </h3>
                                    <ul className="" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                        {uniqueSellingPoints.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))}
                                    </ul>
                                </div>}
                            </div>
                            
                            {/* Progress bars at bottom */}
                            <div className="mt-4">
                                <div className="d-flex gap-2">
                                    <div 
                                        className="bg-dark" 
                                        style={{ width: '60px', height: '4px' }}
                                    ></div>
                                    <div 
                                        className="bg-primary" 
                                        style={{ width: '40px', height: '4px' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    
                    <Col md={5} className="position-relative">
                    <div 
                                className="position-absolute bg-primary"
                                style={{
                                    bottom: '0',
                                    right: '0',
                                    width: '200px',
                                    height: '100%',
                                }}
                            />
                        <div 
                            className="position-relative z-1"
                            style={{
                                backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '500px',
                                height: '80%',
                                marginTop: '10%'

                            }}
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default SocialMediaStrategy;
