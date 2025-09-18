import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export type DateFilterType = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateFilterProps {
  onDateRangeChange: (range: DateRange | null) => void;
  className?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({ onDateRangeChange, className = '' }) => {
  const [filterType, setFilterType] = useState<DateFilterType | ''>('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Calculate date ranges based on filter type
  const calculateDateRange = (type: DateFilterType): DateRange => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (type) {
      case 'week': {
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        return {
          startDate: startOfWeek,
          endDate: endOfToday
        };
      }
      case 'month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
          startDate: startOfMonth,
          endDate: endOfToday
        };
      }
      case 'quarter': {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
        return {
          startDate: startOfQuarter,
          endDate: endOfToday
        };
      }
      case 'year': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return {
          startDate: startOfYear,
          endDate: endOfToday
        };
      }
      case 'custom': {
        if (customStartDate && customEndDate) {
          return {
            startDate: new Date(customStartDate),
            endDate: new Date(customEndDate + 'T23:59:59')
          };
        }
        // Default to current month if custom dates are not set
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
          startDate: startOfMonth,
          endDate: endOfToday
        };
      }
      default:
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1),
          endDate: endOfToday
        };
    }
  };

  // Update date range when filter type or custom dates change
  useEffect(() => {
    if (filterType && filterType !== '') {
      // User has selected a filter type
      const range = calculateDateRange(filterType as DateFilterType);
      onDateRangeChange(range);
    } else if (filterType === '') {
      // User has selected "All Posts" - send null to show all data
      onDateRangeChange(null);
    }
  }, [filterType, customStartDate, customEndDate, onDateRangeChange]);

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as DateFilterType);
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Set default custom dates when switching to custom
  useEffect(() => {
    if (filterType === 'custom' && !customStartDate && !customEndDate) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setCustomStartDate(formatDateForInput(startOfMonth));
      setCustomEndDate(formatDateForInput(now));
    }
  }, [filterType, customStartDate, customEndDate]);

  return (
    <div className={`date-filter ${className}`}>
      <Row className="align-items-center">
        <Col md={4}>
          <Form.Group>
            <Form.Label className="mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              Date Range
            </Form.Label>
            <Form.Select
              value={filterType}
              onChange={handleFilterTypeChange}
              size="sm"
            >
              <option value="">All Posts</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        {filterType === 'custom' && (
          <>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  Start Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  End Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  size="sm"
                />
              </Form.Group>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default DateFilter;
