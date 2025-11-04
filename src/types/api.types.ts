export interface AcquisitionType {
  'Acquisition Type': string;
  'Acquisition Sub Type': string;
}

export interface FeedItem {
  'Published Date': string;
  'Acquiree Company': string;
  'Acquiree Company Ticker From Article': string;
  'Acquirer Company': string;
  'Acquirer Company Ticker From Article': string;
  'MAStatus': string;
  'MAType': string;
  'Deal Value': string;
  'Industry': string;
  'Acquiree Company Display Name': string;
  'Acquiree Company Usearch Id': string;
  'Acquiree Company Id': string;
  'Acquiree Company Website': string;
  'Acquiree Company Website Unified': string;
  'Acquiree Company ZoomInfo Url': string;
  'Acquiree Company Industry': string;
  'Acquiree Company Revenue': string;
  'Acquiree Company Headquarters': string;
  'Acquiree Company Employees': string;
  'Acquiree Company Phone Number': string;
  'Acquiree Company NAICS Code': string;
  'Acquiree Company SIC Code': string;
  'Acquiree Company Popular Searches': string;
  'Acquiree Company Stock Symbol': string;
  'Acquiree Company Ticker': string;
  'Acquiree Company Logo Url': string;
  'Acquiree Company LinkedIn Url': string;
  'Acquiree Company Twitter Url': string;
  'Acquiree Company Facebook Url': string;
  'Acquiree Company PitchBook Url': string;
  'Acquirer Company Display Name': string;
  'Acquirer Company Usearch Id': string;
  'Acquirer Company Id': string;
  'Acquirer Company Website': string;
  'Acquirer Company Website Unified': string;
  'Acquirer Company ZoomInfo Url': string;
  'Acquirer Company Industry': string;
  'Acquirer Company Revenue': string;
  'Acquirer Company Headquarters': string;
  'Acquirer Company Employees': string;
  'Acquirer Company Phone Number': string;
  'Acquirer Company NAICS Code': string;
  'Acquirer Company SIC Code': string;
  'Acquirer Company Popular Searches': string;
  'Acquirer Company Stock Symbol': string;
  'Acquirer Company Ticker': string;
  'Acquirer Company Logo Url': string;
  'Acquirer Company LinkedIn Url': string;
  'Acquirer Company Twitter Url': string;
  'Acquirer Company Facebook Url': string;
  'Acquirer Company PitchBook Url': string;
  'Source URL': string;
  'Source Domain Name': string;
  'Record Id': string;
  'Article Id': string;
  'Article Title': string;
  'Article Group Id': string;
  'Tag': string;
  'Acquisition Type': AcquisitionType;
  'Is Primary Company': string;
  'Primary Companies': string;
  'All Companies': string;
  'Categories': string;
  'Subcategories': string;
  'Events': string;
  'Impact': string;
  'Credible': string;
  'Confirmation': string;
  'Source Formality Type': string;
  'Article Formality Type': string;
}

export interface QueryFeedResponse {
  TotalItems: number;
  PageNumber: number;
  PageSize: number;
  Items: FeedItem[];
}

export interface QueryFeedRequest {
  pageNumber: number;
  pageSize: number;
}

