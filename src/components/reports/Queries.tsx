import React from "react";
import { Card, Table } from "react-bootstrap";

interface ProductQuery {
    product: string;
    queries: string[];
}

interface QueriesProps {
    productQueries?: ProductQuery[];
    currentPlatform?: string;
}

const Queries: React.FC<QueriesProps> = ({ 
    productQueries = [
        {
            product: "Product 1",
            queries: [
                "query A",
                "query B"
            ]
        },
        {
            product: "Product 2",
            queries: [
                "query A",
                "query B",
                "query C",
                "query D",
                "query E"
            ]
        },
        {
            product: "Product 3",
            queries: [
                "query A",
                "query B",
                "query C"
            ]
        }
    ],
    currentPlatform
}) => {
    return (
        <Card className="queries-card">
            <Card.Body style={{ backgroundColor: '#2c2c2c', color: 'white', padding: '40px', paddingBottom: '5rem' }}>
                {/* Header with Icon and Title */}
                <div className="d-flex align-items-center mb-4 justify-content-center">
                    <div className="me-3" style={{ fontSize: '3rem', color: 'white' }}>
                        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Speech bubble */}
                            <path d="M10 10 L60 10 Q70 10 70 20 L70 35 Q70 45 60 45 L25 45 L15 55 L15 45 Q10 45 10 35 L10 20 Q10 10 10 10 Z" 
                                  stroke="white" strokeWidth="2" fill="none"/>
                            {/* Stars */}
                            <path d="M25 20 L27 26 L33 26 L28 30 L30 36 L25 32 L20 36 L22 30 L17 26 L23 26 Z" 
                                  fill="white"/>
                            <path d="M40 22 L41.5 26 L45.5 26 L42.5 28.5 L44 32.5 L40 30 L36 32.5 L37.5 28.5 L34.5 26 L38.5 26 Z" 
                                  fill="white"/>
                            <path d="M52 20 L53.5 24 L57.5 24 L54.5 26.5 L56 30.5 L52 28 L48 30.5 L49.5 26.5 L46.5 24 L50.5 24 Z" 
                                  fill="white"/>
                        </svg>
                    </div>
                    <h2 className="text-white fw-bold mb-0">Example Product Queries</h2>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <Table 
                        className="mb-0" 
                        style={{ 
                            borderCollapse: 'collapse',
                            border: '2px solid white'
                        }}
                    >
                        <thead>
                            <tr>
                                <th 
                                    className="text-white fw-bold py-3 px-4" 
                                    style={{ 
                                        fontSize: '18px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid white',
                                        width: '35%'
                                    }}
                                >
                                    PRODUCT
                                </th>
                                <th 
                                    className="text-white fw-bold py-3 px-4" 
                                    style={{ 
                                        fontSize: '18px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid white'
                                    }}
                                >
                                    EXAMPLE QUERY
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productQueries.map((productQuery, index) => (
                                <tr key={index}>
                                    <td 
                                        className="text-white fw-medium py-4 px-4 align-top" 
                                        style={{ 
                                            fontSize: '16px',
                                            backgroundColor: 'transparent',
                                            border: '1px solid white',
                                            verticalAlign: 'top'
                                        }}
                                    >
                                        {productQuery.product}
                                    </td>
                                    <td 
                                        className="text-white py-4 px-4" 
                                        style={{ 
                                            backgroundColor: 'transparent',
                                            border: '1px solid white',
                                            verticalAlign: 'top'
                                        }}
                                    >
                                        <ul className="list-unstyled mb-0">
                                            {productQuery.queries.map((query, queryIndex) => (
                                                <li key={queryIndex} className="mb-2 d-flex align-items-start">
                                                    <span className="me-2" style={{ color: 'white', fontSize: '14px' }}>•</span>
                                                    <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{query}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Queries;
