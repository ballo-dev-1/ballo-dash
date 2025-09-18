import React from "react";

interface OverviewData {
    followers: number;
    engagement: number;
    reach: number;
    posts: number;
}

interface ExecutiveSummaryProps {
    data: OverviewData;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
    return (
        <div className="mb-5">
            <h5 className="mb-3 text-primary">
                <i className="ph-duotone ph-chart-line me-2"></i>
                Executive Summary
            </h5>
            <div className="row">
                <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                        <h3 className="text-primary mb-1">{data.followers.toLocaleString()}</h3>
                        <p className="text-muted mb-0">Total Followers</p>
                        <small className="text-success">+12.5% vs last month</small>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                        <h3 className="text-success mb-1">{data.engagement}%</h3>
                        <p className="text-muted mb-0">Engagement Rate</p>
                        <small className="text-success">+2.1% vs last month</small>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                        <h3 className="text-info mb-1">{data.reach.toLocaleString()}</h3>
                        <p className="text-muted mb-0">Total Reach</p>
                        <small className="text-success">+8.3% vs last month</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveSummary;
