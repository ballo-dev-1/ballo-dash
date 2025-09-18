import React from "react";
import { Card } from "react-bootstrap";

interface RecommendationItem {
    title: string;
    description: string;
    bulletPoints?: string[];
}

interface RecommendationSection {
    title: string;
    introText?: string;
    recommendations: RecommendationItem[];
}

interface RecommendationsProps {
    currentPlatform?: string;
    period?: string;
    recommendationSections?: RecommendationSection[];
}

const Recommendations: React.FC<RecommendationsProps> = ({
    currentPlatform,
    period = "July",
    recommendationSections = [
        {
            title: "Recommendations/Next Steps:",
            introText: "With the information shared, our recommendations are still to:",
            recommendations: [
                {
                    title: "Deepen Personal & Human-Centered Content",
                    description: "Continue building emotional connection by incorporating more personal stories, client testimonials, and user-generated content. Beyond success stories, include behind-the-scenes glimpses of Bayport's staff, culture, and everyday operations to humanise the brand and reinforce trust. These formats consistently perform well organically."
                },
                {
                    title: "Increase Promotional Activity",
                    description: "Promotional content continues to drive engagement, especially on Facebook. Consider regular giveaways, competitions, and time-sensitive offers to attract and retain attention—even without paid ads. These can be low-cost yet high-impact, particularly when designed with the right call-to-action."
                },
                {
                    title: "Activate Story-Based Content",
                    description: "Begin leveraging Facebook (and eventually Instagram) Stories to create dynamic, daily engagement. Start by repurposing existing product ads into stories, incorporating polls, quizzes, countdowns, and interactive stickers to invite participation. This light, interactive format can significantly boost visibility and foster routine brand interaction."
                }
            ]
        },
        {
            title: "Recommendations/Next Steps:",
            introText: "",
            recommendations: [
                {
                    title: "Introduce more thought leadership content:",
                    bulletPoints: [
                        "We could do a series at least once a month to share industry knowledge, tips and some financial terms"
                    ]
                },
                {
                    title: "Run Targeted Ad campaigns for products:",
                    bulletPoints: [
                        "Utilising some advertising techniques to target and isolate some of your outstanding products and sell them differently. This may help reach professionals in the financial sector and increase new follower and client acquisition. Taking specific approaches for each digital platform.",
                        "We can invest in targeted ads to reach and attract a more relevant audience likely to engage and follow."
                    ]
                },
                {
                    title: "Lastly, hopefully much faster approval process for dissemination to be more seamless:",
                    bulletPoints: [
                        "We could continue to work collaboratively to streamline the content approval process to minimise delays and ensure timely dissemination of marketing materials.",
                        "We can work on ways to implement automated approval systems with predefined templates for specific/common content types to facilitate faster reviews and approvals."
                    ]
                }
            ]
        }
    ]
}) => {
    return (
        <>
            {recommendationSections.map((section, sectionIndex) => (
                <Card key={sectionIndex} className="recommendations-card">
                    <Card.Body style={{ backgroundColor: '#2c2c2c', color: 'white', padding: '40px' }}>
                        {/* Header with Icon and Title */}
                        {section.title && (
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-3">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Growth arrow */}
                                        <path d="M5 35 L15 25 L25 30 L35 15" stroke="white" strokeWidth="3" fill="none"/>
                                        <path d="M30 15 L35 15 L35 20" stroke="white" strokeWidth="2" fill="none"/>
                                    </svg>
                                </div>
                                <h2 className="text-white fw-bold mb-0">{section.title}</h2>
                            </div>
                        )}

                        {/* Introduction Text */}
                        {section.introText && (
                            <p className="mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                {section.introText}
                            </p>
                        )}

                        {/* Recommendations */}
                        <div className="recommendations-content">
                            {section.recommendations.map((recommendation, index) => (
                                <div key={index} className="mb-4">
                                    <h4 className="text-white fw-bold mb-3">{recommendation.title}</h4>
                                    
                                    {/* Description */}
                                    {recommendation.description && (
                                        <p className="mb-3" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                            {recommendation.description}
                                        </p>
                                    )}
                                    
                                    {/* Bullet Points */}
                                    {recommendation.bulletPoints && recommendation.bulletPoints.length > 0 && (
                                        <ul className="list-unstyled mb-3" style={{ paddingLeft: '20px' }}>
                                            {recommendation.bulletPoints.map((point, pointIndex) => (
                                                <li key={pointIndex} className="mb-2 d-flex align-items-start">
                                                    <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                                    <span style={{ fontSize: '16px', lineHeight: '1.5' }}>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </>
    );
};

export default Recommendations;
