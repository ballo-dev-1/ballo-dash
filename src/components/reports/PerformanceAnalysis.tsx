import React from "react";

interface OverviewData {
    followers: number;
    engagement: number;
    reach: number;
    posts: number;
}

interface PerformanceAnalysisProps {
    data: OverviewData;
}

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ data }) => {
    return (
        <div className="mb-5">
            <h5 className="mb-3 text-primary">
                <i className="ph-duotone ph-chart-bar me-2"></i>
                Performance Analysis
            </h5>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Metric</th>
                            <th>Current</th>
                            <th>Previous</th>
                            <th>Growth</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Followers</td>
                            <td>{data.followers.toLocaleString()}</td>
                            <td>{(data.followers * 0.9).toLocaleString()}</td>
                            <td className="text-success">+12.5%</td>
                            <td><span className="badge bg-success">Excellent</span></td>
                        </tr>
                        <tr>
                            <td>Engagement Rate</td>
                            <td>{data.engagement}%</td>
                            <td>{(data.engagement - 2.1).toFixed(1)}%</td>
                            <td className="text-success">+2.1%</td>
                            <td><span className="badge bg-success">Excellent</span></td>
                        </tr>
                        <tr>
                            <td>Reach</td>
                            <td>{data.reach.toLocaleString()}</td>
                            <td>{(data.reach * 0.92).toLocaleString()}</td>
                            <td className="text-success">+8.3%</td>
                            <td><span className="badge bg-success">Excellent</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformanceAnalysis;
