import React from "react";

interface KeyInsightsProps {
    platformName: string;
}

const KeyInsights: React.FC<KeyInsightsProps> = ({ platformName }) => {
    return (
        <div className="mb-5">
            <h5 className="mb-3 text-primary">
                <i className="ph-duotone ph-lightbulb me-2"></i>
                Key Insights & Interpretations
            </h5>
            <div className="row">
                <div className="col-md-6">
                    <div className="p-3 border rounded h-100">
                        <h6 className="text-success mb-2">
                            <i className="ph-duotone ph-trend-up me-1"></i>
                            Positive Trends
                        </h6>
                        <ul className="mb-0">
                            <li>{platformName} engagement increased by 15% due to video content strategy</li>
                            <li>Story content shows 23% higher completion rates</li>
                            <li>User-generated content drives 40% more engagement</li>
                            <li>Cross-platform campaigns show 35% better performance</li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-3 border rounded h-100">
                        <h6 className="text-warning mb-2">
                            <i className="ph-duotone ph-warning me-1"></i>
                            Areas for Improvement
                        </h6>
                        <ul className="mb-0">
                            <li>Posting frequency could be optimized for better reach</li>
                            <li>Video content needs better optimization for mobile</li>
                            <li>Consider increasing engagement with interactive content</li>
                            <li>User-generated content campaigns show potential</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyInsights;
