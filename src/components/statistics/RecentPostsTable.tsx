import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

interface Post {
    id: number;
    content: string;
    engagement: number;
    date: string;
}

interface RecentPostsTableProps {
    posts: Post[];
}

const RecentPostsTable: React.FC<RecentPostsTableProps> = ({ posts }) => {
    return (
        <Row>
            <Col xs={12}>
                <Card className="border-0 shadow-sm recent-posts">
                    <Card.Header className="bg-white border-0 pb-0">
                        <h5 className="mb-0">Recent Posts</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Content</th>
                                        <th>Engagement</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.id}>
                                            <td>
                                                <div className="text-truncate post-content">
                                                    {post.content}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-success engagement-badge">
                                                    {post.engagement.toLocaleString()}
                                                </span>
                                            </td>
                                            <td>{new Date(post.date).toLocaleDateString()}</td>
                                            <td>
                                                <Button variant="outline-primary" size="sm" className="action-btn">
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default RecentPostsTable;
