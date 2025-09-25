import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export type AccountsDateFilterType = 'lifetime' | 'today' | 'yesterday' | 'week' | 'lastWeek' | 'month' | 'lastMonth' | 'quarter' | 'lastQuarter';

export interface AccountsDateRange {
  startDate: Date;
  endDate: Date;
}

interface AccountsDateFilterProps {
  onDateRangeChange: (range: AccountsDateRange) => void;
  className?: string;
}

const AccountsDateFilter: React.FC<AccountsDateFilterProps> = ({ onDateRangeChange, className = '' }) => {
  const [filterType, setFilterType] = useState<AccountsDateFilterType>('lifetime');

  // Calculate date range based on filter type
  const calculateDateRange = (type: AccountsDateFilterType): AccountsDateRange => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (type) {
      case 'lifetime': {
        const startOfLifetime = new Date(2020, 0, 1); // January 1, 2020
        return {
          startDate: startOfLifetime,
          endDate: endOfToday
        };
      }
      case 'today': {
        return {
          startDate: startOfToday,
          endDate: endOfToday
        };
      }
      case 'yesterday': {
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfToday.getDate() - 1);
        const endOfYesterday = new Date(startOfToday);
        endOfYesterday.setDate(startOfToday.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59);
        return {
          startDate: startOfYesterday,
          endDate: endOfYesterday
        };
      }
      case 'week': {
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        return {
          startDate: startOfWeek,
          endDate: endOfToday
        };
      }
      case 'lastWeek': {
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfWeek);
        endOfLastWeek.setDate(startOfWeek.getDate() - 1);
        endOfLastWeek.setHours(23, 59, 59);
        return {
          startDate: startOfLastWeek,
          endDate: endOfLastWeek
        };
      }
      case 'month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
          startDate: startOfMonth,
          endDate: endOfToday
        };
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        return {
          startDate: startOfLastMonth,
          endDate: endOfLastMonth
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
      case 'lastQuarter': {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const previousQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
        const previousQuarterYear = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const startOfLastQuarter = new Date(previousQuarterYear, previousQuarter * 3, 1);
        const endOfLastQuarter = new Date(now.getFullYear(), currentQuarter * 3, 0, 23, 59, 59);
        return {
          startDate: startOfLastQuarter,
          endDate: endOfLastQuarter
        };
      }
      default:
        const startOfLifetime = new Date(2020, 0, 1);
        return {
          startDate: startOfLifetime,
          endDate: endOfToday
        };
    }
  };

  // Update date range when filter type changes
  useEffect(() => {
    const range = calculateDateRange(filterType);
    onDateRangeChange(range);
  }, [filterType, onDateRangeChange]);

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as AccountsDateFilterType);
  };

  const getFilterLabel = (type: AccountsDateFilterType): string => {
    switch (type) {
      case 'lifetime': return 'Lifetime';
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'week': return 'This Week';
      case 'lastWeek': return 'Last Week';
      case 'month': return 'This Month';
      case 'lastMonth': return 'Last Month';
      case 'quarter': return 'This Quarter';
      case 'lastQuarter': return 'Last Quarter';
      default: return 'Lifetime';
    }
  };

  return (
    <div className={`accounts-date-filter ${className}`}>
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
              <option value="lifetime">Lifetime</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="month">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="quarter">This Quarter</option>
              <option value="lastQuarter">Last Quarter</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8}>
          <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '1.5rem' }}>
            {filterType === 'lifetime' ? (
              <>Showing <strong>Lifetime data</strong></>
            ) : (
              <>Showing data for <strong>{getFilterLabel(filterType)}</strong></>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AccountsDateFilter;
