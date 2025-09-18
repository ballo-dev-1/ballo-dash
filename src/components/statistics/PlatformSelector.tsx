import React from "react";
import { Col } from "react-bootstrap";
import Image from "next/image";

interface Platform {
    key: string;
    label: string;
    icon: any;
}

interface PlatformSelectorProps {
    platforms: Platform[];
    selectedPlatform: string;
    onPlatformSelect: (platform: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    platforms,
    selectedPlatform,
    onPlatformSelect
}) => {
    return (
        <Col md={3} lg={2} className="mb-3 platforms-column bg-white pt-3 rounded-3">
            <div className="mb-2 fw-semibold text-center">Platforms</div>
            <div className="list-group list-group-flush gap-3">
                {platforms.map(platform => (
                    <a
                        key={platform.key}
                        onClick={() => onPlatformSelect(platform.key)}
                        className={`list-group-item list-group-item-action d-flex align-items-center px-2 py-2 border-0 bg-transparent ${
                            selectedPlatform === platform.key ? "statistics-active-platform" : ""
                        }`}
                        role="button"
                    >
                        <Image 
                            src={platform.icon} 
                            alt={platform.label} 
                            style={{ objectFit: "contain", width: 20, height: 20 }} 
                        />
                        <span className="ms-2">{platform.label}</span>
                    </a>
                ))}
            </div>
        </Col>
    );
};

export default PlatformSelector;
