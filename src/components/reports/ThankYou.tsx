import React from "react";
import { Card } from "react-bootstrap";

interface ThankYouProps {
    currentPlatform?: string;
    message?: string;
    highlightedWord?: string;
}

const ThankYou: React.FC<ThankYouProps> = ({
    currentPlatform,
    message = "Thank You For Your",
    highlightedWord = "Attention"
}) => {
    return (
        <Card className="thank-you-card">
            <Card.Body style={{ padding: '0' }}>
                <div className="position-relative" style={{ 
                    minHeight: '400px', 
                    backgroundImage: 'url(https://images.unsplash.com/photo-1739289696453-2b98ba584f59?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGNoZWNraW5nJTIwcGhvbmUlMjBzbWlsaW5nfGVufDB8fDB8fHww)', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}>
                    {/* Dark overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)' }} />
                    
                    {/* Blue accent bar */}
                    <div className="position-absolute" style={{ 
                        top: '0', 
                        right: '0', 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#03a2e9' 
                    }} />
                    
                    <div className="position-relative d-flex align-items-center justify-content-center" style={{ height: '600px', padding: '40px' }}>
                        <div className="text-center">
                            <h1 className="text-white fw-bold mb-0" style={{ 
                                fontSize: '3rem', 
                                lineHeight: '1.1',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                            }}>
                                {message}
                            </h1>
                            <h1 className="fw-bold mb-0" style={{ 
                                fontSize: '3rem', 
                                lineHeight: '1.1',
                                color: '#03a2e9',
                                textDecoration: 'underline',
                                textDecorationColor: '#03a2e9',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                            }}>
                                {highlightedWord}
                            </h1>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ThankYou;
