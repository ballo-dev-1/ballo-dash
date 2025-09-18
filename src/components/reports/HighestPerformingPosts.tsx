import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import Image from "next/image";
import facebookIcon from "@/assets/images/socials/facebook.png";
import instagramIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";

interface Post {
    id: number;
    title: string;
    platform: string;
    engagement: number;
    reach: number;
    date: string;
    imageUrl: string;
    type: 'post' | 'story' | 'reel' | 'video';
}

interface HighestPerformingPostsProps {
    posts?: Post[];
    month?: string;
}

const HighestPerformingPosts: React.FC<HighestPerformingPostsProps> = ({ 
    month = "July",
    posts = [
        {
            id: 1,
            title: "No Pressure, Just Refinance",
            platform: "facebook",
            engagement: 96,
            reach: 20908,
            date: "23rd July, 2025",
            imageUrl: "https://images.unsplash.com/photo-1650988612403-dd410dfe2d3a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjIzfHxhZHZlcnR8ZW58MHx8MHx8fDA%3D",
            type: "post"
        },
        {
            id: 2,
            title: "Restructure your Debt",
            platform: "facebook",
            engagement: 33,
            reach: 2313,
            date: "29th July, 2025",
            imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            type: "video"
        },
        {
            id: 3,
            title: "Mid Year, Halfway There",
            platform: "facebook",
            engagement: 16,
            reach: 191,
            date: "19th July, 2025",
            imageUrl: "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=1076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            type: "post"
        }
    ]
}) => {

    const bestPosts = posts.sort((a, b) => b.engagement - a.engagement);
    console.log(bestPosts); 
    return (
        <div>
            <div 
                className="position-relative overflow-hidden mb-1"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '300px'
                }}
            >
                <div className="position-absolute bg-black top-0 start-0 w-100 h-100" style={{ opacity: 0.6 }}/>
                <div className="position-relative text-white d-flex flex-column  h-100" style={{ padding: '4rem 2rem' }}>
                    <h1 className="fw-bold mb-0 text-white" style={{ fontSize: '3rem', lineHeight: '1.2' }}>
                        Highest Performing Posts for {month}
                    </h1>

                    <div className="d-flex flex-column gap-2 mt-4">
                        {bestPosts.slice(0, 3).map((post, index) => (
                            <div key={index} className="d-flex align-items-center fs-5">
                                <span className="fw-bold me-2">{index + 1}.</span>
                                <span className="me-2">"{post.title}"</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Post Cards */}
            <Row className="py-4 m-0 w-100" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
                {bestPosts.map((post, index) => (
                    <Col md={4} key={post.id} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm">
                            <div className="position-relative">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    width={400}
                                    height={300}
                                    style={{ 
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '250px'
                                    }}
                                />
                                {post.type === 'video' && (
                                    <div 
                                        className="position-absolute top-50 start-50 translate-middle"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="ph-duotone ph-play text-white" style={{ fontSize: '24px', marginLeft: '4px' }}></i>
                                    </div>
                                )}
                            </div>
                            
                            <Card.Body className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <Image src={post.platform === 'facebook' ? facebookIcon : post.platform === 'instagram' ? instagramIcon : post.platform === 'linkedin' ? linkedinIcon : xIcon} alt={post.platform} width={20} height={20} />
                                        <span                                             
                                        >
                                            {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                                        </span>
                                    </div>
                                    <small className="text-muted">{post.date}</small>
                                </div>
                                
                                <div className="row g-2 mt-1">
                                    <div className="col-6 border-1 border-end">
                                        <div className="text-center p-2">
                                            <div className="fw-bold" style={{ fontSize: '1.2rem' }}>{post.reach.toLocaleString()}</div>
                                            <small>Reach</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center p-2">
                                            <div className="fw-bold" style={{ fontSize: '1.2rem' }}>{post.engagement}</div>
                                            <small>Engagement</small>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HighestPerformingPosts;
