import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export type AccountsDateFilterType = 'lifetime' | 'today' | 'yesterday' | '7days' | '30days' | '90days';

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
      case '7days': {
        const startOf7Days = new Date(startOfToday);
        startOf7Days.setDate(startOfToday.getDate() - 7);
        return {
          startDate: startOf7Days,
          endDate: endOfToday
        };
      }
      case '30days': {
        const startOf30Days = new Date(startOfToday);
        startOf30Days.setDate(startOfToday.getDate() - 30);
        return {
          startDate: startOf30Days,
          endDate: endOfToday
        };
      }
      case '90days': {
        const startOf90Days = new Date(startOfToday);
        startOf90Days.setDate(startOfToday.getDate() - 90);
        return {
          startDate: startOf90Days,
          endDate: endOfToday
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
      case '7days': return '7 Days Ago';
      case '30days': return '30 Days Ago';
      case '90days': return '90 Days Ago';
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
              <option value="7days">7 Days Ago</option>
              <option value="30days">30 Days Ago</option>
              <option value="90days">90 Days Ago</option>
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
