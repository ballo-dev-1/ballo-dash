import React from "react";

const StrategicRecommendations: React.FC = () => {
    return (
        <div className="mb-4">
            <h5 className="mb-3 text-primary">
                <i className="ph-duotone ph-target me-2"></i>
                Strategic Recommendations
            </h5>
            <div className="row">
                <div className="col-md-4">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="card-title text-primary">Content Strategy</h6>
                            <p className="card-text small">Focus on video content and user-generated content. Increase posting frequency by 25%.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="card-title text-primary">Timing Optimization</h6>
                            <p className="card-text small">Post during peak engagement hours: 2-4 PM for maximum reach and engagement.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="card-title text-primary">Growth Strategy</h6>
                            <p className="card-text small">Implement cross-platform campaigns and influencer partnerships for accelerated growth.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategicRecommendations;
