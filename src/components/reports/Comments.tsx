import React from "react";
import { Card } from "react-bootstrap";

interface CommentSection {
    title: string;
    content: string;
    bulletPoints?: string[];
    conclusion?: string;
}

interface CommentsProps {
    currentPlatform?: string;
    introText?: string;
    sections?: CommentSection[];
    keyTakeaway?: string;
}

const Comments: React.FC<CommentsProps> = ({ 
    currentPlatform,
    introText,
    sections,
    keyTakeaway
}) => {
    // Default content - to be replaced by AI-generated content
    const defaultIntroText = "Clients consistently asked about loan processing timelines and application status. Questions like, \"I need a loan. How long does it take for one to receive the money once applied?\" highlight the importance of timely updates and clearer communication throughout the loan application journey (Hence our inclusion of application processing timeline in the last content plan).";
    
    const defaultSections: CommentSection[] = [
        {
            title: "Ballo Innovations Contacts & Support",
            content: "Many clients needed assistance with branch access, deductions, refunds, and account queries. For example:",
            bulletPoints: [
                "\"Kindly share the location and number for Choma branch\"",
                "\"I have seen a deduction of K5,000 from my account\"",
                "\"Am waiting for my refund\"",
                "\"How can I check if my account is still active with Ballo Innovations?\"",
                "\"Asking for your loan schedule for 2025\""
            ],
            conclusion: "These interactions point to the need for faster, more accessible digital support flow and proactive customer service, especially around deductions and documentation."
        },
        {
            title: "Refinancing",
            content: "Client interest in refinancing continues to rise. Queries like \"Are you refinancing\", \"I need help with refinance\", and \"I want a loan but I have other 3 loans, my question can zanaco be refinanced?\" show that customers are open to switching from other institutions. There's a strong opportunity for Ballo Innovations to grow this product line with clearer messaging, eligibility criteria, and cross-institution engagement."
        }
    ];
    
    const defaultKeyTakeaway = "Customers want faster updates, easy access to support, and clearer information about Ballo Innovations's financial solutions. We will continue prioritising digital responsiveness, and branch accessibility, transparent product communication will enhance satisfaction and position Ballo Innovations for deeper client trust and product uptake.";
    
    // Use provided content or defaults
    const displayIntroText = introText || defaultIntroText;
    const displaySections = sections || defaultSections;
    const displayKeyTakeaway = keyTakeaway || defaultKeyTakeaway;
    return (
        <Card className="comments-card" style={{ borderTop: '1px solid white' }}>
            <Card.Body style={{ backgroundColor: '#2c2c2c', color: 'white', padding: '40px', paddingBottom: '4rem' }}>
                <div className="d-flex align-items-center mb-4">
                    <div className="me-3" style={{ fontSize: '3rem', color: 'white' }}>
                        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 10 L60 10 Q70 10 70 20 L70 35 Q70 45 60 45 L25 45 L15 55 L15 45 Q10 45 10 35 L10 20 Q10 10 10 10 Z" 
                                  stroke="white" strokeWidth="2" fill="none"/>
                            <path d="M25 20 L27 26 L33 26 L28 30 L30 36 L25 32 L20 36 L22 30 L17 26 L23 26 Z" 
                                  fill="white"/>
                            <path d="M40 22 L41.5 26 L45.5 26 L42.5 28.5 L44 32.5 L40 30 L36 32.5 L37.5 28.5 L34.5 26 L38.5 26 Z" 
                                  fill="white"/>
                            <path d="M52 20 L53.5 24 L57.5 24 L54.5 26.5 L56 30.5 L52 28 L48 30.5 L49.5 26.5 L46.5 24 L50.5 24 Z" 
                                  fill="white"/>
                        </svg>
                                            </div>
                    <h2 className="text-white fw-bold mb-0">Comments</h2>
                                            </div>
                                            
                <div className="comments-content">
                    <p className="mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                        {displayIntroText}
                    </p>

                    {/* Dynamic Sections */}
                    {displaySections.map((section, index) => (
                        <div key={index} className="mb-4">
                            <h4 className="text-white fw-bold mb-3">{section.title}</h4>
                            <p className="mb-3" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                {section.content}
                            </p>
                            
                            {/* Bullet Points (if any) */}
                            {section.bulletPoints && section.bulletPoints.length > 0 && (
                                <ul className="list-unstyled mb-3" style={{ paddingLeft: '20px' }}>
                                    {section.bulletPoints.map((point, pointIndex) => (
                                        <li key={pointIndex} className="mb-2 d-flex align-items-start">
                                            <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                            <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                            {/* Conclusion (if any) */}
                            {section.conclusion && (
                                <p className="mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    {section.conclusion}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Key Takeaway */}
                        <div>
                        <h4 className="text-white fw-bold mb-3">Key Takeaway</h4>
                        <p className="mb-0" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                            {displayKeyTakeaway}
                        </p>
                            </div>
                        </div>
            </Card.Body>
        </Card>
    );
};

export default Comments;
