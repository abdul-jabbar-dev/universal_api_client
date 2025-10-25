import React, { useState, useRef } from 'react';
import type { HttpMethod, KeyValue, BodyType, FormDataEntry, AppSettings } from '../../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import UploadIcon from './icons/UploadIcon';

interface RequestFormProps {
  onSendRequest: (request: any) => Promise<void>;
  loading: boolean;
  settings: AppSettings;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSendRequest, loading, settings }) => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<KeyValue[]>([{ id: `h-${Date.now()}`, key: '', value: '', enabled: true }]);
  const [params, setParams] = useState<KeyValue[]>([{ id: `p-${Date.now()}`, key: '', value: '', enabled: true }]);
  const [rawBody, setRawBody] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [bodyType, setBodyType] = useState<BodyType>('none');
  const [formData, setFormData] = useState<FormDataEntry[]>([{ id: `fd-${Date.now()}`, key: '', value: '', type: 'text', enabled: true }]);
  const [activeTab, setActiveTab] = useState<'params' | 'auth' | 'headers' | 'body'>('params');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const validateUrl = (currentUrl: string) => {
    if (!currentUrl) {
      setUrlError("URL cannot be empty.");
      return false;
    }
    try {
      new URL(currentUrl);
      setUrlError(null);
      return true;
    } catch (_) {
      setUrlError("Invalid URL format.");
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    validateUrl(newUrl);
  };

  const handleSend = () => {
    if (!validateUrl(url)) return;

    let finalUrl = url;
    try {
      const urlObject = new URL(url);
      const activeParams = params.filter(p => p.enabled && p.key);
      if (activeParams.length > 0) {
        const searchParams = new URLSearchParams(urlObject.search);
        activeParams.forEach(p => searchParams.append(p.key, p.value));
        urlObject.search = searchParams.toString();
        finalUrl = urlObject.toString();
      }
    } catch(e) { /* Should be caught by validation, but safeguard here */ }
    
    onSendRequest({
      method,
      url: finalUrl,
      headers,
      params,
      authToken: bearerToken,
      bodyType,
      rawBody,
      formData,
    });
  };
  
  const handleKeyValueChange = (items: any[], setItems: React.Dispatch<React.SetStateAction<any[]>>, id: string, field: string, value: any) => {
    setItems(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };
  
  const addKeyValue = (items: any[], setItems: React.Dispatch<React.SetStateAction<any[]>>, defaultItem: any) => {
    setItems([...items, { ...defaultItem, id: `kv-${Date.now()}` }]);
  };
  
  const removeKeyValue = (items: any[], setItems: React.Dispatch<React.SetStateAction<any[]>>, id: string, defaultItem: any) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      setItems([{ ...defaultItem, id: `kv-${Date.now()}` }]);
    }
  };

  const handleFormatJson = () => {
    try {
      if (!rawBody.trim()) return;
      const parsedJson = JSON.parse(rawBody);
      const formatted = JSON.stringify(parsedJson, null, 2);
      setRawBody(formatted);
      setJsonError(null);
    } catch (error: any) {
      setJsonError(`Format failed: The content is not valid JSON. Error: ${error.message}`);
    }
  };
  
  const handleRawBodyChange = (value: string) => {
    setRawBody(value);
    if (value.trim() === '') {
        setJsonError(null);
        return;
    }
    try {
        JSON.parse(value);
        setJsonError(null);
    } catch (error: any) {
        setJsonError(`Invalid JSON: ${error.message}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
        setJsonError('Import failed: Please select a valid JSON file (.json).');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        handleRawBodyChange(text); // Reuse existing logic to set body and validate
        try {
          // Attempt to format it nicely for the user
          const parsed = JSON.parse(text);
          const formatted = JSON.stringify(parsed, null, 2);
          setRawBody(formatted);
        } catch (error) {
          // If formatting fails, just use the raw text. Validation error will be shown.
          setRawBody(text);
        }
      }
    };
    reader.onerror = () => {
      setJsonError(`Import failed: Error reading file. ${reader.error}`);
    };
    reader.readAsText(file);

    // Reset file input value to allow importing the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const renderKeyValueInputs = (items: KeyValue[], setItems: React.Dispatch<React.SetStateAction<KeyValue[]>>, keyPlaceholder: string, valuePlaceholder: string) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <input type="checkbox" checked={item.enabled} onChange={(e) => handleKeyValueChange(items, setItems, item.id, 'enabled', e.target.checked)} className="form-checkbox h-4 w-4 text-primary bg-muted border-border rounded focus:ring-primary" />
          <div className="flex-grow flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input type="text" placeholder={keyPlaceholder} value={item.key} onChange={(e) => handleKeyValueChange(items, setItems, item.id, 'key', e.target.value)} className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" disabled={!item.enabled} style={{color: settings.colors.inputTextColor}} />
            <input type="text" placeholder={valuePlaceholder} value={item.value} onChange={(e) => handleKeyValueChange(items, setItems, item.id, 'value', e.target.value)} className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" disabled={!item.enabled} style={{color: settings.colors.inputTextColor}} />
          </div>
          <button onClick={() => removeKeyValue(items, setItems, item.id, { key: '', value: '', enabled: true })} className="p-2 text-muted-foreground hover:text-foreground"><TrashIcon /></button>
        </div>
      ))}
      <button onClick={() => addKeyValue(items, setItems, { key: '', value: '', enabled: true })} className="flex items-center space-x-1 text-primary hover:text-primary-hover text-sm mt-2 font-medium"><PlusIcon /><span>Add</span></button>
    </div>
  );

  const renderFormDataInputs = () => (
    <div className="space-y-3">
      {formData.map((item) => (
        <div key={item.id} className="flex items-start space-x-2">
          <input type="checkbox" checked={item.enabled} onChange={(e) => handleKeyValueChange(formData, setFormData, item.id, 'enabled', e.target.checked)} className="form-checkbox h-4 w-4 text-primary bg-muted border-border rounded focus:ring-primary mt-2.5" />
          <div className="flex-grow space-y-2">
             <div className="flex">
                <input type="text" placeholder="Key" value={item.key} onChange={(e) => handleKeyValueChange(formData, setFormData, item.id, 'key', e.target.value)} className="flex-1 bg-background border border-border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" disabled={!item.enabled} />
                <select value={item.type} onChange={(e) => handleKeyValueChange(formData, setFormData, item.id, 'type', e.target.value)} className="bg-muted border-t border-b border-r border-border rounded-r-md px-2 text-sm focus:outline-none disabled:opacity-50" disabled={!item.enabled}>
                  <option value="text">Text</option>
                  <option value="file">File</option>
                </select>
              </div>
              {item.type === 'text' ? (
                <input type="text" placeholder="Value" value={item.value as string} onChange={(e) => handleKeyValueChange(formData, setFormData, item.id, 'value', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" disabled={!item.enabled} />
              ) : (
                <input type="file" onChange={(e) => handleKeyValueChange(formData, setFormData, item.id, 'value', e.target.files ? e.target.files[0] : '')} className="w-full bg-background text-sm text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-foreground hover:file:bg-slate-200 disabled:opacity-50" disabled={!item.enabled} />
              )}
          </div>
          <button onClick={() => removeKeyValue(formData, setFormData, item.id, { key: '', value: '', type: 'text', enabled: true })} className="p-2 text-muted-foreground hover:text-foreground mt-0.5"><TrashIcon /></button>
        </div>
      ))}
      <button onClick={() => addKeyValue(formData, setFormData, { key: '', value: '', type: 'text', enabled: true })} className="flex items-center space-x-1 text-primary hover:text-primary-hover text-sm mt-2 font-medium"><PlusIcon /><span>Add</span></button>
    </div>
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col mb-4 space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch">
            <select value={method} onChange={(e) => setMethod(e.target.value as HttpMethod)} className="bg-muted border border-border rounded-t-md sm:rounded-l-md sm:rounded-tr-none px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm">
            <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
            </select>
            <input 
              type="text" 
              value={url} 
              onChange={handleUrlChange} 
              placeholder="https://api.example.com/data" 
              style={{ color: settings.colors.urlColor }}
              className={`flex-1 bg-background border-t border-b sm:border-l-0 border-r sm:border-r-0 px-4 py-2 text-sm focus:outline-none focus:ring-2 ${urlError ? 'border-red-500 ring-red-500/50' : 'border-border focus:ring-primary/50'}`} 
            />
            <button onClick={handleSend} disabled={loading || !!urlError} className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-2 px-6 rounded-b-md sm:rounded-r-md sm:rounded-bl-none flex items-center justify-center space-x-2 transition-colors disabled:bg-primary/70 disabled:cursor-not-allowed">
            <span>{loading ? 'Sending...' : 'Send'}</span>
            </button>
        </div>
        {urlError && <p className="text-red-600 text-xs mt-1 px-1">{urlError}</p>}
      </div>

      <div className="bg-card border border-border rounded-md p-1 flex-grow flex flex-col">
        <div className="flex space-x-1 border-b border-border mb-2 overflow-x-auto">
          { (['params', 'auth', 'headers', 'body'] as const).map(tabName => (
            <button key={tabName} onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tabName ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
            </button>
          )) }
        </div>
        <div className="p-3 flex-grow overflow-auto">
          {activeTab === 'params' && renderKeyValueInputs(params, setParams, 'Key', 'Value')}
          {activeTab === 'auth' && (
            <div className="p-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Bearer Token</label>
                <input type="text" value={bearerToken} onChange={e => setBearerToken(e.target.value)} placeholder="Enter your token" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          )}
          {activeTab === 'headers' && renderKeyValueInputs(headers, setHeaders, 'Header', 'Value')}
          {activeTab === 'body' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center space-x-4 mb-2 flex-wrap">
                {(['none', 'form-data', 'raw'] as BodyType[]).map(type => (
                  <label key={type} className="flex items-center space-x-2 text-sm cursor-pointer py-1">
                    <input type="radio" name="bodyType" value={type} checked={bodyType === type} onChange={() => setBodyType(type)} className="form-radio h-4 w-4 text-primary bg-muted border-border focus:ring-primary" disabled={method === 'GET'} />
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                ))}
              </div>
              {bodyType === 'raw' && (
                <div className="flex flex-col h-full">
                   <div className="flex justify-end mb-2 space-x-2">
                     <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".json,application/json"
                    />
                    <button 
                      onClick={handleImportClick} 
                      className="flex items-center text-xs bg-muted hover:bg-slate-200 text-foreground font-semibold py-1 px-3 rounded-md transition-colors disabled:opacity-50"
                      disabled={method === 'GET'}
                    >
                      <UploadIcon />
                      Import
                    </button>
                     <button 
                       onClick={handleFormatJson} 
                       className="text-xs bg-muted hover:bg-slate-200 text-foreground font-semibold py-1 px-3 rounded-md transition-colors disabled:opacity-50"
                       disabled={!rawBody.trim() || method === 'GET'}
                     >
                       Format
                     </button>
                   </div>
                   <div className="flex-grow flex flex-col">
                      <textarea 
                        value={rawBody} 
                        onChange={(e) => handleRawBodyChange(e.target.value)} 
                        placeholder='{ "key": "value" }'
                        style={{
                          color: settings.colors.inputTextColor,
                          fontSize: `${settings.fontSizes.inputFontSize}px`,
                        }}
                        className={`w-full flex-grow bg-muted rounded-md p-3 font-mono focus:outline-none resize-none border ${jsonError ? 'border-red-500 ring-2 ring-inset ring-red-500/20' : 'border-border focus:ring-2 focus:ring-primary/50'}`} 
                        disabled={method === 'GET'} 
                      />
                      {jsonError && <p className="text-red-600 text-xs mt-1 px-1">{jsonError}</p>}
                   </div>
                </div>
              )}
              {bodyType === 'form-data' && <div className="flex-grow">{renderFormDataInputs()}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestForm;