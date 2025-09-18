import React from "react";
import { Card } from "react-bootstrap";

interface PerformanceSummary {
    totalReach: number;
    platformBreakdown: { platform: string; reach: number }[];
    totalEngagement: number;
    engagementBreakdown: { platform: string; engagement: number }[];
    newFollowers: number;
    followerBreakdown: { platform: string; followers: number }[];
    directMessages: number;
}

interface EngagementTrend {
    title: string;
    description: string;
}

interface ContentInsight {
    title: string;
    description: string;
}

interface Recommendation {
    title: string;
    description: string;
}

interface CommentarySection {
    title: string;
    introText: string;
    performanceSummary?: PerformanceSummary;
    keyObservations?: {
        title: string;
        sections: Array<{
            subtitle: string;
            content: string;
        }>;
    };
    engagementTrends?: EngagementTrend[];
    contentInsights?: ContentInsight[];
    recommendations?: Recommendation[];
    directMessagesInsight?: string;
}

interface CommentaryProps {
    currentPlatform?: string;
    period?: string;
    commentarySections?: CommentarySection[];
}

const Commentary: React.FC<CommentaryProps> = ({
    currentPlatform,
    period = "July",
    commentarySections = [
        {
            title: `${period} Social Media Performance`,
            introText: `In ${period}, we strengthened digital presence with a total of 11 posts across platforms—5 on Facebook and 6 on LinkedIn (including the job ad). Facebook continued to deliver strong reach, while LinkedIn showed steady engagement and follower growth. Compared to June, overall reach improved significantly, although engagement dropped slightly.`,
            performanceSummary: {
                totalReach: 30338,
                platformBreakdown: [
                    { platform: "Facebook", reach: 28311 },
                    { platform: "LinkedIn", reach: 2027 }
                ],
                totalEngagement: 479,
                engagementBreakdown: [
                    { platform: "Facebook", engagement: 332 },
                    { platform: "LinkedIn", engagement: 147 }
                ],
                newFollowers: 315,
                followerBreakdown: [
                    { platform: "Facebook", followers: 195 },
                    { platform: "LinkedIn", followers: 120 }
                ],
                directMessages: 48
            },
            keyObservations: {
                title: "Key Observations & Insights",
                sections: [
                    {
                        subtitle: "Facebook Delivers Exceptional Reach",
                        content: "Despite only 5 posts, Facebook reach nearly doubled compared to June, climbing to over 28,000. However, engagement levels fell from 838 in June to 332 in this month. This suggests that while Facebook content is being widely seen, we may need to implement stronger calls-to-action and more engaging formats to convert reach into interactions."
                    }
                ]
            }
        },
        {
            title: `${period} Social Media Performance`,
            introText: "",
            keyObservations: {
                title: "",
                sections: [
                    {
                        subtitle: "LinkedIn Growth Steadily Improved",
                        content: "LinkedIn maintained modest reach but showed positive signals in follower growth (+120) and consistent engagement (147, only slightly lower than June). This reflects growing audience interest, especially with professional content such as the job ad and service-focused messaging."
                    }
                ]
            },
            contentInsights: [
                {
                    title: "Content Performance",
                    description: "The highest-performing Facebook post was \"No Pressure, Just Refinance\", showing refinancing remains a strong content theme."
                },
                {
                    title: "LinkedIn Engagement",
                    description: "On LinkedIn, \"Mid-Year, Half way there\" drove the most engagement, highlighting the effectiveness of timely, goal-oriented messaging."
                },
                {
                    title: "Content Themes",
                    description: "The performance trend suggests that content tied to financial milestones or easing customer stress continues to resonate strongly."
                }
            ],
            directMessagesInsight: "Messages dropped to 48 from June's 115. This indicates fewer direct service queries or that audiences are engaging differently with our content. It could also suggest a seasonal lull in customer demand."
        },
        {
            title: `${period} Social Media Performance`,
            introText: "",
            engagementTrends: [
                {
                    title: "Loan Refinancing Content",
                    description: "Continues to show strong traction, especially on Facebook."
                },
                {
                    title: "Professional Updates on LinkedIn",
                    description: "Recruitment- and milestone-related posts encourage both reach and engagement."
                },
                {
                    title: "Reach vs Engagement Gap",
                    description: "While visibility is high, interaction levels dropped, signaling the need for sharper creatives or more emotionally resonant content."
                }
            ],
            recommendations: [
                {
                    title: "Focusing on Converting Reach into Engagement",
                    description: "We can use interactive elements, stronger visuals, and more direct calls-to-action to close the gap between high reach and low engagement."
                },
                {
                    title: "Sustaining LinkedIn Momentum",
                    description: "We can keep publishing value-driven posts such as insights, job-related updates (where necessary), and simple explainers to strengthen Bayport's professional presence."
                },
                {
                    title: "Reinforce Proven Content Themes",
                    description: "Building on refinancing, milestone messaging, and customer-friendly tones that simplify financial services."
                },
                {
                    title: "Exploring Engagement-Boosting Formats",
                    description: "We can experiment with video, reels, or customer testimonial content when available to deepen interaction, not just impressions."
                }
            ]
        }
    ]
}) => {
    return (
        <>
            {commentarySections.map((section, sectionIndex) => (
                <Card key={sectionIndex} className="commentary-card">
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

                        {/* Performance Summary */}
                        {section.performanceSummary && (
                            <div className="mb-4">
                                <h4 className="text-white fw-bold mb-3">Overall Performance Summary</h4>
                                <ul className="list-unstyled mb-3" style={{ paddingLeft: '20px' }}>
                                    <li className="mb-2 d-flex align-items-start">
                                        <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                        <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                            <strong>Total Reach:</strong> {section.performanceSummary.totalReach.toLocaleString()}
                                        </span>
                                    </li>
                                    <li className="mb-2 d-flex align-items-start">
                                        <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                        <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                            ({section.performanceSummary.platformBreakdown.map(p => `${p.platform}: ${p.reach.toLocaleString()}`).join(' | ')})
                                        </span>
                                    </li>
                                    <li className="mb-2 d-flex align-items-start">
                                        <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                        <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                            <strong>Total Engagement:</strong> {section.performanceSummary.totalEngagement}
                                        </span>
                                    </li>
                                    <li className="mb-2 d-flex align-items-start">
                                        <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                        <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                            ({section.performanceSummary.engagementBreakdown.map(p => `${p.platform}: ${p.engagement}`).join(' | ')})
                                        </span>
                                    </li>
                                    <li className="mb-2 d-flex align-items-start">
                                        <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                        <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                            <strong>New Followers:</strong> {section.performanceSummary.newFollowers}
                                        </span>
                                    </li>
                                    <li className="mb-2 d-flex align-items-start">
                                        <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                        <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                            ({section.performanceSummary.followerBreakdown.map(p => `${p.platform}: ${p.followers}`).join(' | ')})
                                        </span>
                                    </li>
                                </ul>
                                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    <strong>Total Direct Messages:</strong> {section.performanceSummary.directMessages}
                                </p>
                            </div>
                        )}

                        {/* Key Observations */}
                        {section.keyObservations && (
                            <div className="mb-4">
                                {section.keyObservations.title && (
                                    <h4 className="text-white fw-bold mb-3">{section.keyObservations.title}</h4>
                                )}
                                {section.keyObservations.sections.map((obs, index) => (
                                    <div key={index} className="mb-4">
                                        <h5 className="text-white fw-bold mb-3">{obs.subtitle}</h5>
                                        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                            {obs.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Engagement Trends */}
                        {section.engagementTrends && (
                            <div className="mb-4">
                                <h4 className="text-white fw-bold mb-3">Engagement Trends</h4>
                                <ul className="list-unstyled mb-3" style={{ paddingLeft: '20px' }}>
                                    {section.engagementTrends.map((trend, index) => (
                                        <li key={index} className="mb-2 d-flex align-items-start">
                                            <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                            <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                                <strong>{trend.title}:</strong> {trend.description}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Content Insights */}
                        {section.contentInsights && (
                            <div className="mb-4">
                                <h4 className="text-white fw-bold mb-3">Content Performance</h4>
                                <ul className="list-unstyled mb-3" style={{ paddingLeft: '20px' }}>
                                    {section.contentInsights.map((insight, index) => (
                                        <li key={index} className="mb-2 d-flex align-items-start">
                                            <span className="me-2" style={{ color: 'white', fontSize: '16px' }}>•</span>
                                            <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                                                <strong>{insight.title}:</strong> {insight.description}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Direct Messages Insight */}
                        {section.directMessagesInsight && (
                            <div className="mb-4">
                                <h4 className="text-white fw-bold mb-3">Direct Messages</h4>
                                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                    {section.directMessagesInsight}
                                </p>
                            </div>
                        )}

                        {/* Recommendations */}
                        {section.recommendations && (
                            <div className="mb-4">
                                <h4 className="text-white fw-bold mb-3">Recommendations for September</h4>
                                {section.recommendations.map((rec, index) => (
                                    <div key={index} className="mb-3">
                                        <h6 className="text-white fw-semibold mb-2">{index + 1}. {rec.title}</h6>
                                        <p style={{ fontSize: '16px', lineHeight: '1.6', paddingLeft: '20px' }}>
                                            {rec.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ))}
        </>
    );
};

export default Commentary;
