import React from "react";
import { Card, Row, Col } from "react-bootstrap";

interface CalendarEvent {
    id: number;
    date: number;
    content: string;
    type: 'date' | 'content' | 'empty';
}

interface SocialMediaCalendarProps {
    month?: string;
    year?: number;
    events?: CalendarEvent[];
}

const SocialMediaCalendar: React.FC<SocialMediaCalendarProps> = ({ 
    month = "JULY",
    year = 2025,
    events = [
        { id: 1, date: 1, content: "", type: 'date' },
        { id: 2, date: 2, content: "", type: 'date' },
        { id: 3, date: 3, content: "", type: 'date' },
        { id: 4, date: 4, content: "", type: 'date' },
        { id: 5, date: 7, content: "", type: 'date' },
        { id: 6, date: 8, content: "", type: 'date' },
        { id: 7, date: 9, content: "", type: 'date' },
        { id: 8, date: 10, content: "", type: 'date' },
        { id: 9, date: 11, content: "", type: 'date' },
        { id: 10, date: 14, content: "", type: 'date' },
        { id: 11, date: 15, content: "", type: 'date' },
        { id: 12, date: 16, content: "", type: 'date' },
        { id: 13, date: 17, content: "", type: 'date' },
        { id: 14, date: 0, content: "-> Mid year check-in", type: 'content' },
        { id: 15, date: 0, content: "How much can you borrow?", type: 'content' },
        { id: 16, date: 22, content: "", type: 'date' },
        { id: 17, date: 0, content: "Just Refinance", type: 'content' },
        { id: 18, date: 0, content: "Did you know?", type: 'content' },
        { id: 19, date: 26, content: "", type: 'date' },
        { id: 20, date: 0, content: "Restructure your debt.", type: 'content' },
    ]
}) => {
    const weekdays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    
    // Group events into rows of 5 (weekdays)
    const calendarRows = [];
    for (let i = 0; i < events.length; i += 5) {
        calendarRows.push(events.slice(i, i + 5));
    }

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <div className="text-center mt-2">
                    <h2 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>
                        Social Media Calender
                    </h2>
                    <div className="text-end">
                        <span 
                            className="fw-bold text-decoration-underline" 
                            style={{ fontSize: '1.2rem' }}
                        >
                            {month} {year}
                        </span>
                    </div>
                </div>
                
                <div className="calendar-grid">
                    {/* Header Row */}
                    <div className="calendar-header">
                        {weekdays.map((day, index) => (
                            <div key={index} className="calendar-header-cell">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    {/* Calendar Rows */}
                    {calendarRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="calendar-row">
                            {row.map((event, cellIndex) => (
                                <div key={event.id} className="calendar-cell">
                                    {event.type === 'date' && event.date > 0 && (
                                        <span className="calendar-date">{event.date}</span>
                                    )}
                                    {event.type === 'content' && (
                                        <span className="calendar-content">{event.content}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Card.Body>
            
            <style jsx>{`
                .calendar-grid {
                    border: 2px solid #000;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .calendar-header {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    background-color: #09a9f5;
                }
                
                .calendar-header-cell {
                    padding: 12px 8px;
                    text-align: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    border-right: 1px solid #000;
                }
                
                .calendar-header-cell:last-child {
                    border-right: none;
                }
                
                .calendar-row {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    border-top: 1px solid #000;
                }
                
                .calendar-cell {
                    padding: 12px 8px;
                    text-align: center;
                    border-right: 1px solid #000;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .calendar-cell:last-child {
                    border-right: none;
                }
                
                .calendar-date {
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .calendar-content {
                    font-size: 12px;
                    line-height: 1.3;
                    text-align: center;
                    word-wrap: break-word;
                }
            `}</style>
        </Card>
    );
};

export default SocialMediaCalendar;
