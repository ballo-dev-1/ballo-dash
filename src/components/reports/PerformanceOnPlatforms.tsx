import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/router";

// Import platform icons
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";

interface PlatformMetrics {
    platform: string;
    reach: number;
    engagement: number;
    totalFollowing: number;
    posts: number;
}

interface PerformanceOnPlatformsProps {
    platforms?: PlatformMetrics[];
    currentPlatform?: string;
}

const PerformanceOnPlatforms: React.FC<PerformanceOnPlatformsProps> = ({ 
    platforms = [
        { platform: "Facebook", reach: 28311, engagement: 332, totalFollowing: 20950, posts: 5 },
        { platform: "LinkedIn", reach: 2027, engagement: 147, totalFollowing: 950, posts: 6 }
    ],
    currentPlatform
}) => {
    const router = useRouter();
    
    // Platform icons mapping
    const platformIcons: { [key: string]: any } = {
        "Facebook": facebookIcon,
        "Instagram": instaIcon,
        "LinkedIn": linkedinIcon,
        "Twitter": xIcon,
        "X": xIcon
    };

    // Filter platforms based on current route
    const displayPlatforms = React.useMemo(() => {
        if (!currentPlatform || currentPlatform === 'all') {
            return platforms;
        }
        
        // Map platform route to platform name
        const platformNameMap: { [key: string]: string } = {
            'facebook': 'Facebook',
            'instagram': 'Instagram',
            'linkedin': 'LinkedIn',
            'x': 'X',
            'twitter': 'Twitter'
        };
        
        const platformName = platformNameMap[currentPlatform];
        return platforms.filter(p => p.platform === platformName);
    }, [platforms, currentPlatform]);

    // Get the current period (you can make this dynamic)
    const currentPeriod = "JULY";

    const reportImage = "https://images.unsplash.com/photo-1650988612403-dd410dfe2d3a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjIzfHxhZHZlcnR8ZW58MHx8MHx8fDA%3D";
    const reportImageAlt = "Performance on Platforms";
    return (
        <Card className="py-4">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h4 className="mb-0 fw-bold text-dark">
                        {currentPeriod} Performance on Platforms
                    </h4>
                        </div>
                <Row>
                  <Col md={9} className="performance-table-wrapper">
                      <Table 
                          className="performance-table mb-0" 
                          style={{ 
                              borderCollapse: 'collapse'
                          }}
                      >
                          <thead>
                              <tr style={{ backgroundColor: '#ffffff' }}>
                                  <th 
                                      className="fw-normal text-dark py-4 px-4" 
                                      style={{ 
                                          fontSize: '16px',
                                          fontWeight: '500',
                                          border: '1px solid black',
                                          width: '200px'
                                      }}
                                  >
                                      {/* Empty first column */}
                                  </th>
                                  {displayPlatforms.map((platform, index) => (
                                      <th 
                                          key={platform.platform}
                                          className="py-4 px-4 text-center" 
                                          style={{ 
                                              border: '1px solid black',
                                              verticalAlign: 'middle',
                                              minWidth: '120px'
                                          }}
                                      >
                                          <div className="d-flex align-items-center justify-content-center">
                                              <div 
                                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                                  style={{ 
                                                      width: '56px', 
                                                      height: '56px',
                                                      
                                                  }}
                                              >
                                                  {platformIcons[platform.platform] && (
                                                      <Image 
                                                          src={platformIcons[platform.platform]} 
                                                          alt={platform.platform} 
                                                          width={28} 
                                                          height={28}
                                                          style={{ objectFit: 'contain' }}
                                                      />
                                                  )}
                                                </div>
                                            </div>
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                              {/* Reach Row */}
                              <tr>
                                  <td 
                                      className="py-4 px-4 fw-bold text-dark" 
                                      style={{ 
                                          border: '1px solid black',
                                          verticalAlign: 'middle',
                                          fontSize: '16px'
                                      }}
                                  >
                                      Reach
                                  </td>
                                  {displayPlatforms.map((platform, index) => (
                                      <td 
                                          key={`reach-${platform.platform}`}
                                          className="py-4 px-4 text-center" 
                                          style={{ 
                                              border: '1px solid black',
                                              verticalAlign: 'middle'
                                          }}
                                      >
                                          <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                                              {platform.reach.toLocaleString()}
                                          </span>
                                      </td>
                                  ))}
                              </tr>
                              
                              {/* Engagement Row */}
                              <tr>
                                  <td 
                                      className="py-4 px-4 fw-bold text-dark" 
                                      style={{ 
                                          border: '1px solid black',
                                          verticalAlign: 'middle',
                                          fontSize: '16px'
                                      }}
                                  >
                                      Engagement
                                  </td>
                                  {displayPlatforms.map((platform, index) => (
                                      <td 
                                          key={`engagement-${platform.platform}`}
                                          className="py-4 px-4 text-center" 
                                          style={{ 
                                              border: '1px solid black',
                                              verticalAlign: 'middle'
                                          }}
                                      >
                                          <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                                              {platform.engagement.toLocaleString()}
                                          </span>
                                      </td>
                                  ))}
                              </tr>
                              
                              {/* Total Following Row */}
                              <tr>
                                  <td 
                                      className="py-4 px-4 fw-bold text-dark" 
                                      style={{ 
                                          border: '1px solid black',
                                          verticalAlign: 'middle',
                                          fontSize: '16px'
                                      }}
                                  >
                                      Total Following
                                  </td>
                                  {displayPlatforms.map((platform, index) => (
                                      <td 
                                          key={`following-${platform.platform}`}
                                          className="py-4 px-4 text-center" 
                                          style={{ 
                                              border: '1px solid black',
                                              verticalAlign: 'middle'
                                          }}
                                      >
                                          <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                                              {platform.totalFollowing.toLocaleString()}
                                          </span>
                                      </td>
                                  ))}
                              </tr>
                              
                              {/* No. of Posts Row */}
                              <tr>
                                  <td 
                                      className="py-4 px-4 fw-bold text-dark" 
                                      style={{ 
                                          border: '1px solid black',
                                          verticalAlign: 'middle',
                                          fontSize: '16px'
                                      }}
                                  >
                                      No. of Posts
                                  </td>
                                  {displayPlatforms.map((platform, index) => (
                                      <td 
                                          key={`posts-${platform.platform}`}
                                          className="py-4 px-4 text-center" 
                                          style={{ 
                                              border: '1px solid black',
                                              verticalAlign: 'middle'
                                          }}
                                      >
                                          <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                                              {platform.posts}
                                          </span>
                                      </td>
                                  ))}
                              </tr>
                          </tbody>
                      </Table>
                    </Col>

                        <Col md={3} className="rounded-1" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1683721003111-070bcc053d8b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D)`, backgroundSize: 'cover', backgroundPosition: 'center' }}></Col>
                </Row>
                 
                    <small className="text-muted fst-italic text-center">
                        *This does not include cover photo posts
                    </small>
            </Card.Body>
        </Card>
    );
};

export default PerformanceOnPlatforms;
