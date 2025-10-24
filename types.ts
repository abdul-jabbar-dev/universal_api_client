export interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface FormDataEntry {
  id: string;
  key: string;
  value: string | File;
  type: 'text' | 'file';
  enabled: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type BodyType = 'none' | 'form-data' | 'raw';

export interface ApiRequest {
  method: HttpMethod;
  url: string;
  headers: KeyValue[];
  params: KeyValue[];
  authToken: string;
  bodyType: BodyType;
  rawBody: string;
  formData: FormDataEntry[];
}

export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  httpOnly: boolean;
  secure: boolean;
  maxAge?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
  cookies: Cookie[];
}

export interface ColorSettings {
  // JSON Syntax Highlighting
  keyColor: string;
  stringColor: string;
  numberColor: string;
  booleanColor: string;
  nullColor: string;
  // General UI
  urlColor: string;
  inputTextColor: string;
  responseTextColor: string;
}

export interface FontSizeSettings {
  inputFontSize: number; // in pixels
  responseFontSize: number; // in pixels
}

export interface AppSettings {
  colors: ColorSettings;
  fontSizes: FontSizeSettings;
}
