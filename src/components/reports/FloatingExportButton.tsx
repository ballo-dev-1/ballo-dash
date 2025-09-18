import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { Download } from "lucide-react";

interface FloatingExportButtonProps {
    onExport: () => void;
    isExporting: boolean;
}

const FloatingExportButton: React.FC<FloatingExportButtonProps> = ({ onExport, isExporting }) => {
    return (
        <div className="floating-export-btn">
            <Button
                variant="primary"
                size="lg"
                className="rounded-circle shadow-lg"
                onClick={onExport}
                disabled={isExporting}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    zIndex: 1000,
                }}
            >
                {isExporting ? (
                    <Spinner animation="border" size="sm" />
                ) : (
                    <Download size={24} />
                )}
            </Button>
        </div>
    );
};

export default FloatingExportButton;
