import React, { Fragment, useEffect, useState } from "react";
import { Row, Table, Button } from "react-bootstrap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Skeleton,
  Box,
} from "@mui/material";

import {
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";

// Column Filter
const Filter = ({
  column,
}: {
  column: Column<any, unknown>;
  table: ReactTable<any>;
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1"></div>
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <div className="search-box">
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
      />
      <i className="ri-search-line search-icon"></i>
    </div>
  );
};

interface TableContainerProps {
  columns?: any;
  data?: any;
  divClassName?: any;
  tableClass?: any;
  theadClass?: any;
  isBordered?: boolean;
  customPageSize?: number;
  isGlobalFilter?: boolean;
  isPagination?: boolean;
  tdColumn?: string;
  thColumn?: string;
  buttonName?: string;
  SearchPlaceholder?: string;
  loading?: boolean;
}

const TableContainer = ({
  columns,
  data,
  tableClass,
  theadClass,
  tdColumn,
  thColumn,
  divClassName,
  isBordered,
  isPagination,
  customPageSize,
  isGlobalFilter,
  SearchPlaceholder,
  loading,
}: TableContainerProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Record<
    string,
    any
  > | null>(null);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    setPageSize,
    getState,
  } = table;

  useEffect(() => {
    Number(customPageSize) && setPageSize(Number(customPageSize));
  }, [customPageSize, setPageSize]);

  const onChangeInSelect = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  const [error, setError] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (loading) {
      timeout = setTimeout(() => {
        setError(true);
      }, 6000 * 60 * 5); // 10 seconds
    } else {
      setError(false); // reset on success
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="error" gutterBottom>
          Failed to load data. Please try again later.
        </Typography>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  const getTruncatedPageNumbers = (): (number | string)[] => {
    const totalPages = Math.ceil(data.length / getState().pagination.pageSize);
    const currentPage = getState().pagination.pageIndex;
    const maxVisiblePages = 5;

    const pageNumbers: (number | string)[] = [];

    // Show all pages if total is small
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const showLeftEllipsis = currentPage > 2;
    const showRightEllipsis = currentPage < totalPages - 3;

    pageNumbers.push(0); // Always show first page

    if (showLeftEllipsis) {
      pageNumbers.push("...");
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (showRightEllipsis) {
      pageNumbers.push("...");
    }

    pageNumbers.push(totalPages - 1); // Always show last page

    return pageNumbers;
  };

  return (
    <Fragment>
      {isGlobalFilter && (
        <React.Fragment>
          {data.length > 4 && (
            <div className="datatable-top">
              <div className="datatable-dropdown">
                <label>
                  <select
                    onChange={onChangeInSelect}
                    className="datatable-selector"
                  >
                    {[5, 10, 15, 20, 25].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>{" "}
                  entries per page
                </label>
              </div>
              <div className="datatable-search">
                <DebouncedInput
                  value={globalFilter ?? ""}
                  onChange={(value) => setGlobalFilter(String(value))}
                  className="form-control search"
                  placeholder={SearchPlaceholder}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      )}
      <div
        className={divClassName ? divClassName : "table-responsive react-table"}
      >
        <Table
          className={`position-relative ${tableClass} `}
          bordered={isBordered}
        >
          <thead className={theadClass}>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerClass = `sort cursor-pointer ${
                    thColumn ? thColumn : ""
                  }`;
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      {...{
                        className: header.column.getCanSort()
                          ? headerClass
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <React.Fragment>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " ",
                            desc: " ",
                          }[header.column.getIsSorted() as string] ?? null}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </React.Fragment>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  onClick={() => {
                    setSelectedRowData(row.original);
                    setOpenModal(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {row.getVisibleCells().map((cell: any) => {
                    const columnKey = cell.column.columnDef?.accessorKey;
                    const tdClass = columnKey === "Action" ? tdColumn : "";
                    return (
                      <td key={cell.id} className={tdClass}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        {loading && (
          <Box paddingBottom={2}>
            <Skeleton height={40} width="100%" />
            <Skeleton height={40} width="100%" />
          </Box>
        )}
      </div>

      {isPagination && data.length > getState().pagination.pageSize && (
        <Row className="align-items-center py-2 gy-2 text-center text-sm-start">
          <div className="col-sm">
            <div className="text-muted ms-3">
              Showing{" "}
              <span className="fw-semibold">
                {getState().pagination.pageSize}
              </span>{" "}
              of <span className="fw-semibold">{data.length}</span> Results
            </div>
          </div>
          <div className="col-sm-auto">
            <ul className="pagination mb-0">
              {/* Previous */}
              <li
                className={
                  !getCanPreviousPage()
                    ? "page-item rounded disabled"
                    : "page-item"
                }
                onClick={previousPage}
              >
                <Button variant="link" className="page-link me-2">
                  Previous
                </Button>
              </li>

              {getTruncatedPageNumbers().map((item, index) => (
                <li key={index} className="page-item me-2">
                  {item === "..." ? (
                    <span className="page-link disabled">...</span>
                  ) : (
                    <Button
                      variant="link"
                      className={
                        getState().pagination.pageIndex === item
                          ? "page-link active"
                          : "page-link"
                      }
                      onClick={() => setPageIndex(item as number)}
                    >
                      {(item as number) + 1}
                    </Button>
                  )}
                </li>
              ))}

              {/* Next */}
              <li
                className={!getCanNextPage ? "page-item disabled" : "page-item"}
                onClick={nextPage}
              >
                <Button variant="link" className="page-link me-3">
                  Next
                </Button>
              </li>
            </ul>
          </div>
        </Row>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Post Details</DialogTitle>
        <DialogContent dividers>
          {selectedRowData ? (
            Object.entries(selectedRowData).map(([key, value]) => (
              <Typography key={key} variant="body1" sx={{ mb: 1 }}>
                <strong>{key}:</strong> {String(value)}
              </Typography>
            ))
          ) : (
            <Typography>No data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default TableContainer;
