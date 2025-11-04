import { QueryFeedRequest, QueryFeedResponse } from '../types/api.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;
const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY!;

export const fetchQueryFeed = async (
  request: QueryFeedRequest
): Promise<QueryFeedResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/developer/QueryFeed`, {
    method: 'POST',
    headers: {
      'DeveloperKey': DEVELOPER_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

export const fetchQueryFeedFromFile = async (
  request: QueryFeedRequest
): Promise<QueryFeedResponse> => {
  const response = await fetch('/test-data.json');

  if (!response.ok) {
    throw new Error(`Failed to load test data: ${response.statusText}`);
  }

  const data: QueryFeedResponse = await response.json();

  const paginatedItems = data.Items.slice(
    (request.pageNumber - 1) * request.pageSize,
    request.pageNumber * request.pageSize
  );

  return {
    TotalItems: data.Items.length,
    PageNumber: request.pageNumber,
    PageSize: request.pageSize,
    Items: paginatedItems,
  };
};
