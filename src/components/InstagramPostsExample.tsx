/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useAppDispatch } from "@/toolkit/hooks";
import { useSelector } from "react-redux";
import { 
  fetchInstagramPosts, 
  selectInstagramPosts, 
  selectInstagramPostsStatus,
  selectInstagramPostsError
} from "@/toolkit/instagramData/reducer";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";

const InstagramPostsExample: React.FC = () => {
  const dispatch = useAppDispatch();
  const instagramPosts = useSelector(selectInstagramPosts);
  const instagramPostsStatus = useSelector(selectInstagramPostsStatus);
  const instagramPostsError = useSelector(selectInstagramPostsError);

  const [accountId, setAccountId] = useState('');
  const [username, setUsername] = useState('');

  const handleFetchPosts = async () => {
    if (!accountId || !username) {
      alert('Please enter both Account ID and Username');
      return;
    }

    try {
      await dispatch(fetchInstagramPosts({
        accountId,
        username
      })).unwrap();
      console.log('✅ Instagram posts fetched successfully');
    } catch (error) {
      console.error('❌ Failed to fetch Instagram posts:', error);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <Card.Header>
          <h4>Instagram Posts Example</h4>
          <p className="text-muted mb-0">
            This component demonstrates how to fetch Instagram posts using the business_discovery API.
          </p>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Instagram Account ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Instagram Business Account ID"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                />
                <Form.Text className="text-muted">
                  The Instagram Business Account ID (e.g., 123456789)
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Instagram Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Instagram username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Text className="text-muted">
                  The Instagram username to fetch posts for (without @)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 mb-4">
            <Button 
              variant="primary" 
              onClick={handleFetchPosts}
              disabled={instagramPostsStatus === 'loading'}
            >
              {instagramPostsStatus === 'loading' ? 'Loading...' : 'Fetch Instagram Posts'}
            </Button>
          </div>

          {instagramPostsError && (
            <Alert variant="danger">
              <strong>Error:</strong> {instagramPostsError}
            </Alert>
          )}

          {instagramPosts && (
            <div>
              <Alert variant="success">
                <strong>Success!</strong> Fetched {instagramPosts.total} posts from {instagramPosts.pageInfo.name}
              </Alert>
              
              <Card>
                <Card.Header>
                  <h5>Account Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      {instagramPosts.pageInfo.profilePicture && (
                        <img
                          src={instagramPosts.pageInfo.profilePicture}
                          alt="Profile"
                          className="rounded-circle"
                          style={{ width: 80, height: 80, objectFit: 'cover' }}
                        />
                      )}
                    </Col>
                    <Col md={9}>
                      <h6>{instagramPosts.pageInfo.name}</h6>
                      <p className="text-muted">@{instagramPosts.pageInfo.username}</p>
                      <p><strong>Followers:</strong> {instagramPosts.pageInfo.followers_count?.toLocaleString()}</p>
                      <p><strong>Media Count:</strong> {instagramPosts.pageInfo.media_count}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mt-3">
                <Card.Header>
                  <h5>Recent Posts ({instagramPosts.posts.length})</h5>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    {instagramPosts.posts.slice(0, 6).map((post: any) => (
                      <div key={post.id} className="col-md-4 mb-3">
                        <Card>
                          <Card.Body>
                            {post.media_url && (
                              <img
                                src={post.media_url}
                                alt="Post"
                                className="img-fluid rounded mb-2"
                                style={{ width: '100%', height: 150, objectFit: 'cover' }}
                              />
                            )}
                            <p className="small text-muted mb-1">
                              {new Date(post.created_time).toLocaleDateString()}
                            </p>
                            <p className="small mb-2">
                              {post.message ? 
                                (post.message.length > 100 ? 
                                  post.message.substring(0, 100) + '...' : 
                                  post.message
                                ) : 
                                'No caption'
                              }
                            </p>
                            <div className="d-flex justify-content-between small text-muted">
                              <span>❤️ {post.insights.post_reactions_like_total}</span>
                              <span>💬 {post.insights.comment}</span>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default InstagramPostsExample;
