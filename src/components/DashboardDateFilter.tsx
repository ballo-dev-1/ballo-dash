import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export type DashboardDateFilterType = 'today' | 'week' | 'month' | 'quarter' | 'lifetime';

export interface DashboardDateRange {
  current: {
    startDate: Date;
    endDate: Date;
  };
  previous: {
    startDate: Date;
    endDate: Date;
  };
}

interface DashboardDateFilterProps {
  onDateRangeChange: (range: DashboardDateRange) => void;
  className?: string;
}

const DashboardDateFilter: React.FC<DashboardDateFilterProps> = ({ onDateRangeChange, className = '' }) => {
  const [filterType, setFilterType] = useState<DashboardDateFilterType>('today');

  // Calculate current and previous date ranges based on filter type
  const calculateDateRanges = (type: DashboardDateFilterType): DashboardDateRange => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (type) {
      case 'today': {
        // Current day
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        
        // Previous day
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfToday.getDate() - 1);
        const endOfYesterday = new Date(startOfToday);
        endOfYesterday.setDate(startOfToday.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59);

        return {
          current: {
            startDate: startOfToday,
            endDate: endOfToday
          },
          previous: {
            startDate: startOfYesterday,
            endDate: endOfYesterday
          }
        };
      }
      case 'week': {
        // Current week
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        
        // Previous week
        const startOfPreviousWeek = new Date(startOfWeek);
        startOfPreviousWeek.setDate(startOfWeek.getDate() - 7);
        const endOfPreviousWeek = new Date(startOfWeek);
        endOfPreviousWeek.setDate(startOfWeek.getDate() - 1);
        endOfPreviousWeek.setHours(23, 59, 59);

        return {
          current: {
            startDate: startOfWeek,
            endDate: endOfToday
          },
          previous: {
            startDate: startOfPreviousWeek,
            endDate: endOfPreviousWeek
          }
        };
      }
      case 'month': {
        // Current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Previous month
        const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        return {
          current: {
            startDate: startOfMonth,
            endDate: endOfToday
          },
          previous: {
            startDate: startOfPreviousMonth,
            endDate: endOfPreviousMonth
          }
        };
      }
      case 'quarter': {
        // Current quarter
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
        
        // Previous quarter
        const previousQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
        const previousQuarterYear = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const startOfPreviousQuarter = new Date(previousQuarterYear, previousQuarter * 3, 1);
        const endOfPreviousQuarter = new Date(now.getFullYear(), currentQuarter * 3, 0, 23, 59, 59);

        return {
          current: {
            startDate: startOfQuarter,
            endDate: endOfToday
          },
          previous: {
            startDate: startOfPreviousQuarter,
            endDate: endOfPreviousQuarter
          }
        };
      }
      case 'lifetime': {
        // Lifetime data - from a very early date to now
        const startOfLifetime = new Date(2020, 0, 1); // January 1, 2020
        const endOfLifetime = endOfToday;
        
        // Previous period for comparison - last 30 days before the lifetime period
        const startOfPreviousPeriod = new Date(2019, 11, 1); // December 1, 2019
        const endOfPreviousPeriod = new Date(2019, 11, 31, 23, 59, 59); // December 31, 2019

        return {
          current: {
            startDate: startOfLifetime,
            endDate: endOfLifetime
          },
          previous: {
            startDate: startOfPreviousPeriod,
            endDate: endOfPreviousPeriod
          }
        };
      }
      default:
        // Default to week
        return calculateDateRanges('week');
    }
  };

  // Update date range when filter type changes
  useEffect(() => {
    const range = calculateDateRanges(filterType);
    onDateRangeChange(range);
  }, [filterType, onDateRangeChange]);

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as DashboardDateFilterType);
  };

  const getFilterLabel = (type: DashboardDateFilterType): string => {
    switch (type) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'lifetime': return 'Lifetime';
      default: return 'Today';
    }
  };

  const getPreviousPeriodLabel = (type: DashboardDateFilterType): string => {
    switch (type) {
      case 'today': return 'Yesterday';
      case 'week': return 'Last Week';
      case 'month': return 'Last Month';
      case 'quarter': return 'Last Quarter';
      case 'lifetime': return 'Pre-2020';
      default: return 'Yesterday';
    }
  };

  return (
    <div className={`dashboard-date-filter ${className}`}>
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
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="lifetime">Lifetime</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8}>
          <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '1.5rem' }}>
            {filterType === 'lifetime' ? (
              <>Showing <strong>Lifetime data</strong></>
            ) : (
              <>Showing data for <strong>{getFilterLabel(filterType)}</strong> compared to <strong>{getPreviousPeriodLabel(filterType)}</strong></>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardDateFilter;
