import React, { useState, useEffect, useRef } from 'react';
import type { ApiResponse, AppSettings, Cookie } from '../../types';
import Loader from './Loader';
import DownloadIcon from './icons/DownloadIcon';

interface ResponseDisplayProps {
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
  settings: AppSettings;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, loading, error, settings }) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'cookies'>('body');
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showDownloadPrompt && fileNameInputRef.current) {
      fileNameInputRef.current.focus();
      fileNameInputRef.current.select();
    }
  }, [showDownloadPrompt]);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    if (status >= 500) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const syntaxHighlight = (json: any) => {
    const { colors } = settings;
    if (json === null) return `<span style="color: ${colors.nullColor}">null</span>`;
    
    let jsonString = JSON.stringify(json, undefined, 2);
    jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let color = colors.numberColor;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                color = colors.keyColor;
            } else {
                color = colors.stringColor;
            }
        } else if (/true|false/.test(match)) {
            color = colors.booleanColor;
        } else if (/null/.test(match)) {
            color = colors.nullColor;
        }
        return `<span style="color: ${color}">${match}</span>`;
    });
  }

  const handleDownloadClick = () => {
    if (!response || response.data === null || response.data === undefined) return;

    const isJson = typeof response.data === 'object';
    const contentTypeHeader = response.headers['content-type']?.split(';')[0];
    const blobType = contentTypeHeader || (isJson ? 'application/json' : 'text/plain');
    
    let extension = 'txt';
    if (blobType.includes('json')) {
      extension = 'json';
    } else if (blobType.includes('xml')) {
      extension = 'xml';
    } else if (blobType.includes('html')) {
      extension = 'html';
    } else if (blobType.includes('csv')) {
      extension = 'csv';
    } else if (blobType.includes('javascript')) {
      extension = 'js';
    }

    setFileName(`response.${extension}`);
    setShowDownloadPrompt(true);
  };
  
  const handleConfirmDownload = () => {
    if (!response || !fileName.trim() || response.data === null || response.data === undefined) {
      setShowDownloadPrompt(false);
      return;
    }

    const isJson = typeof response.data === 'object';
    const dataString = isJson ? JSON.stringify(response.data, null, 2) : String(response.data);
    
    const contentTypeHeader = response.headers['content-type']?.split(';')[0];
    const blobType = contentTypeHeader || (isJson ? 'application/json' : 'text/plain');
    
    const blob = new Blob([dataString], { type: blobType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.trim();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowDownloadPrompt(false);
  };
  
  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-full"><Loader /></div>;
    }
    if (error) {
      return (
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
          <h3 className="font-bold mb-2">Error</h3>
          <p className="font-mono text-sm whitespace-pre-wrap">{error}</p>
        </div>
      );
    }
    if (!response) {
      return (
        <div className="text-center text-muted-foreground py-10">
          Send a request to see the response here.
        </div>
      );
    }
    
    const isJson = typeof response.data === 'object' && response.data !== null;
    const hasBody = response.data !== null && response.data !== undefined && (typeof response.data === 'object' || String(response.data).length > 0);


    return (
      <>
        <div className="flex items-center justify-between p-2 mb-2 bg-muted rounded-md flex-wrap gap-2">
            <div className="flex items-center space-x-4 text-sm font-mono flex-wrap">
                <span>Status: <b className={getStatusColor(response.status)}>{response.status} {response.statusText}</b></span>
                <span>Time: <b className="text-primary">{response.time}ms</b></span>
                <span>Size: <b className="text-primary">{(response.size / 1024).toFixed(2)} KB</b></span>
            </div>
            {hasBody && (
              <button 
                onClick={handleDownloadClick}
                className="flex items-center space-x-2 bg-primary/10 text-primary hover:bg-primary/20 font-semibold py-1.5 px-3 rounded-md text-sm transition-colors"
                title="Download response body"
                aria-label="Download response body"
              >
                <DownloadIcon />
                <span>Download</span>
              </button>
            )}
        </div>
        <div className="bg-card border border-border rounded-md p-1 flex-1 flex flex-col min-h-0">
          <div className="flex space-x-1 border-b border-border mb-2 overflow-x-auto">
             <button onClick={() => setActiveTab('body')} className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'body' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Body
            </button>
            <button onClick={() => setActiveTab('headers')} className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'headers' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Headers
            </button>
             <button onClick={() => setActiveTab('cookies')} className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'cookies' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Cookies ({response.cookies.length})
            </button>
          </div>

          <div className="p-2 overflow-auto flex-1">
            {activeTab === 'body' && (
              <pre
                className="w-full bg-muted rounded-md p-3 whitespace-pre-wrap break-all"
                style={{ fontSize: `${settings.fontSizes.responseFontSize}px` }}
              >
                {isJson 
                  ? <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(response.data) }} />
                  : <code style={{ color: settings.colors.responseTextColor }}>{String(response.data)}</code>
                }
              </pre>
            )}
            {activeTab === 'headers' && (
              <div className="space-y-1 font-mono text-sm p-2">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    <span className="text-muted-foreground font-semibold">{key}:</span>
                    <span className="text-green-700 break-all">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'cookies' && (
               response.cookies.length > 0 ? (
                <div className="font-mono text-sm">
                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {response.cookies.map((cookie, index) => (
                       <div key={index} className="bg-muted rounded-md p-3 border border-border">
                          <div className="pb-2 mb-2 border-b border-slate-200">
                            <span className="font-semibold text-foreground break-all">{cookie.name}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-muted-foreground">Value:</span>
                                <span className="text-green-700 break-all">{cookie.value}</span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-muted-foreground">Domain:</span>
                                <span className="text-blue-700 break-all">{cookie.domain || 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-muted-foreground">Path:</span>
                                <span className="text-purple-700 break-all">{cookie.path || 'N/A'}</span>
                            </div>
                          </div>
                       </div>
                    ))}
                  </div>
                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-muted rounded-md p-3 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 pr-2 text-muted-foreground font-semibold">Name</th>
                          <th className="py-2 px-2 text-muted-foreground font-semibold">Value</th>
                          <th className="py-2 px-2 text-muted-foreground font-semibold">Domain</th>
                          <th className="py-2 pl-2 text-muted-foreground font-semibold">Path</th>
                        </tr>
                      </thead>
                      <tbody>
                        {response.cookies.map((cookie, index) => (
                          <tr key={index} className="border-b border-slate-200 last:border-b-0">
                            <td className="py-2 pr-2 text-foreground break-all">{cookie.name}</td>
                            <td className="py-2 px-2 text-green-700 break-all">{cookie.value}</td>
                            <td className="py-2 px-2 text-blue-700 break-all">{cookie.domain || 'N/A'}</td>
                            <td className="py-2 pl-2 text-purple-700 break-all">{cookie.path || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
               ) : (
                 <p className="text-muted-foreground text-center py-4">No cookies were sent in the response.</p>
               )
            )}
          </div>
        </div>
      </>
    );
  };
  
  return (
    <>
      <div className="h-full flex flex-col">{renderContent()}</div>
      {showDownloadPrompt && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm p-4" onClick={() => setShowDownloadPrompt(false)}>
          <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-sm border border-border" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Save Response As</h2>
            <div className="mb-4">
              <label htmlFor="filename" className="text-sm font-medium text-foreground mb-1 block">Filename</label>
              <input
                ref={fileNameInputRef}
                id="filename"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmDownload(); }}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDownloadPrompt(false)} className="bg-muted hover:bg-slate-200 text-foreground font-bold py-2 px-4 rounded-md text-sm">
                Cancel
              </button>
              <button onClick={handleConfirmDownload} disabled={!fileName.trim()} className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-2 px-4 rounded-md text-sm disabled:bg-primary/70 disabled:cursor-not-allowed">
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponseDisplay;