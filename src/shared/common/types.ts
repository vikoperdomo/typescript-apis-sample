export interface SecretStorageInfo {
  storageAccountName: string;
  storageKey: string;
  storageContainer: string;
}

export interface ResponseBody {
  success?: boolean;
  data?: any;
  message?: string;
  pageSize?: number;
  pageIndex?: number;
  totalCount?: number;
}

export interface ResponseHeader {
  'content-type': string;
}

export interface Response {
  status: number;
  body: ResponseBody;
  headers: ResponseHeader;
}

export interface FilterOption {
  key: string;
  operator: string;
  value: string | boolean | number | Array<string | boolean | number>;
}

export interface SearchRequest {
  pageSize?: number;
  pageIndex?: number;
  filter: Array<FilterOption>;
}

export interface ResponseOptions {
  body?: ResponseBody;
  headers?: ResponseHeader;
}

export interface SearchResult<T> {
  count: number;
  records: Array<T>;
}

export interface Lead {
  representing?: string;
  name?: string;
  email?: string;
  role?: string;
  teamIsPlayFab?: boolean;
  addRoleName?: string;
  addRole?: string;
  addRoleEmail?: string;
  musicLink?: string;
  submissionDatetime?: number;
}

export interface RequestOptions {
  method?: string;
  body?: string;
  headers?: object;
}

export interface UploadImageResponse {
  fileName: string;
}

export interface EmailInfo {
  to: Array<string>;
  from: string;
  templateId: string;
  dynamic_template_data: any;
}
