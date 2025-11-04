import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { FeedItem, QueryFeedResponse } from '../types/api.types';
import { fetchQueryFeed, fetchQueryFeedFromFile } from '../services/api.service';
import './DataTable.css';

const DataTable: React.FC = () => {
  const [data, setData] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>('1');
  const [useLocalData, setUseLocalData] = useState<boolean>(false);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Define columns based on the API response
  const columns = useMemo<ColumnDef<FeedItem>[]>(() => {
    if (data.length === 0) return [];

    const firstItem = data[0];
    const keys = Object.keys(firstItem);

    // Create order number column as first column
    const orderColumn: ColumnDef<FeedItem> = {
      id: 'orderNumber',
      header: '#',
      cell: (info: any) => {
        const rowIndex = info.row.index;
        return (pageNumber - 1) * pageSize + rowIndex + 1;
      },
      size: 60,
    };

    // Create columns for all data fields
    const dataColumns = keys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info: any) => {
        const value = info.getValue();
        // Handle Acquisition Type object specifically
        if (key === 'Acquisition Type' && typeof value === 'object' && value !== null) {
          const acqType = value['Acquisition Type'] || '';
          const acqSubType = value['Acquisition Sub Type'] || '';
          return acqSubType ? `${acqType} - ${acqSubType}` : acqType;
        }
        // Handle other nested objects
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return value as string;
      },
    }));

    return [orderColumn, ...dataColumns];
  }, [data, pageNumber, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const fetchData = useCallback(async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: QueryFeedResponse = useLocalData
        ? await fetchQueryFeedFromFile({
            pageNumber: page,
            pageSize: size,
          })
        : await fetchQueryFeed({
            pageNumber: page,
            pageSize: size,
          });
      setData(response.Items);
      setTotalItems(response.TotalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [useLocalData]);

  useEffect(() => {
    fetchData(pageNumber, pageSize);
  }, [pageNumber, pageSize, fetchData]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPageNumber(1);
    setPageInput('1');
  };

  const handleFirstPage = () => {
    setPageNumber(1);
    setPageInput('1');
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
      setPageInput(String(newPage));
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
      setPageInput(String(newPage));
    }
  };

  const handleLastPage = () => {
    setPageNumber(totalPages);
    setPageInput(String(totalPages));
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = Number(pageInput);
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    } else {
      setPageInput(String(pageNumber));
    }
  };

  return (
    <div className="data-table-container">
      <h1>Test table app</h1>

      {/* Stats */}
      <div className="table-stats">
        <div className="stat-item">
          <strong>Rows:</strong> {data.length}
        </div>
        <div className="stat-item">
          <strong>Columns:</strong> {columns.length}
        </div>
        <div className="stat-item">
          <strong>Total Items:</strong> {totalItems.toLocaleString()}
        </div>
      </div>

      {/* Page Size Selector */}
      <div className="controls">
        <label htmlFor="dataSource">
          Data Source:
          <select
            id="dataSource"
            value={useLocalData ? 'file' : 'api'}
            onChange={(e) => {
              setUseLocalData(e.target.value === 'file');
              setPageNumber(1);
              setPageInput('1');
            }}
            disabled={loading}
          >
            <option value="api">API</option>
            <option value="file">Local File</option>
          </select>
        </label>
      </div>

      {/* Table */}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && data.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={handleFirstPage}
          disabled={pageNumber === 1 || loading}
        >
          &lt;&lt;
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={pageNumber === 1 || loading}
        >
          &lt;
        </button>
        <button
          onClick={handleNextPage}
          disabled={pageNumber === totalPages || loading}
        >
          &gt;
        </button>
        <button
          onClick={handleLastPage}
          disabled={pageNumber === totalPages || loading}
        >
          &gt;&gt;
        </button>

        <span className="pagination-info">
          Page: {pageNumber} of {totalPages}
        </span>

        <span className="pagination-separator">|</span>

        <form onSubmit={handlePageInputSubmit} className="page-jump">
          <label htmlFor="pageInput">
            Go to page
            <input
              id="pageInput"
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={handlePageInputChange}
              disabled={loading}
            />
          </label>
        </form>

        <label htmlFor="pageSizeFooter" className="page-size-footer">
          <select
            id="pageSizeFooter"
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={loading}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default DataTable;

