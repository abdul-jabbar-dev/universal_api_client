import React, { useState, useEffect } from 'react';
import type { AppSettings, ColorSettings, FontSizeSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  initialSettings: AppSettings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleColorChange = (key: keyof ColorSettings, value: string) => {
    const newSettings = { ...settings, colors: { ...settings.colors, [key]: value } };
    setSettings(newSettings);
    onSave(newSettings); // Save immediately on change for live preview
  };

  const handleFontSizeChange = (key: keyof FontSizeSettings, value: number) => {
    const newSize = Math.max(8, Math.min(32, value)); // Clamp font size between 8px and 32px
    const newSettings = { ...settings, fontSizes: { ...settings.fontSizes, [key]: newSize } };
    setSettings(newSettings);
    onSave(newSettings);
  }

  const jsonColorFields: { key: keyof ColorSettings; label: string }[] = [
    { key: 'keyColor', label: 'Keys' },
    { key: 'stringColor', label: 'Strings' },
    { key: 'numberColor', label: 'Numbers' },
    { key: 'booleanColor', label: 'Booleans' },
    { key: 'nullColor', label: 'Null' },
  ];
  
  const generalColorFields: { key: keyof ColorSettings; label: string }[] = [
    { key: 'urlColor', label: 'URL Text' },
    { key: 'inputTextColor', label: 'Input Text' },
    { key: 'responseTextColor', label: 'Response Text' },
  ];

  const renderColorInput = (field: { key: keyof ColorSettings; label: string }) => (
    <div key={field.key} className="flex items-center justify-between ">
      <label htmlFor={field.key} className="text-sm text-foreground">{field.label}</label>
      <div className="relative flex items-center space-x-2">
        <span className="font-mono text-sm text-muted-foreground">{settings.colors[field.key]}</span>
        <input
          id={field.key}
          type="color"
          value={settings.colors[field.key]}
          onChange={(e) => handleColorChange(field.key, e.target.value)}
          className="w-8 h-8 p-0 border-none cursor-pointer appearance-none bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        />
      </div>
    </div>
  );

  const renderFontSizeInput = (key: keyof FontSizeSettings, label: string) => (
    <div key={key} className="flex items-center justify-between">
        <label className="text-sm text-foreground">{label}</label>
        <div className="flex items-center space-x-2">
            <button onClick={() => handleFontSizeChange(key, settings.fontSizes[key] - 1)} className="w-7 h-7 flex items-center justify-center bg-muted hover:bg-slate-200 rounded text-lg">-</button>
            <span className="w-12 text-center font-mono text-sm">{settings.fontSizes[key]}px</span>
            <button onClick={() => handleFontSizeChange(key, settings.fontSizes[key] + 1)} className="w-7 h-7 flex items-center justify-center bg-muted hover:bg-slate-200 rounded text-lg">+</button>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex w-full scroll-y-auto h-full overflow-y-auto items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-lg border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl">&times;</button>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-3 border-b border-border pb-2">Colors</h3>
                <div className="space-y-4 pt-2">
                    <h4 className="font-medium text-sm text-muted-foreground">JSON Response</h4>
                    {jsonColorFields.map(renderColorInput)}
                    <h4 className="font-medium text-sm text-muted-foreground pt-2">General</h4>
                    {generalColorFields.map(renderColorInput)}
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-3 border-b border-border pb-2">Font Size</h3>
                 <div className="space-y-4 pt-2">
                    {renderFontSizeInput('inputFontSize', 'Inputs')}
                    {renderFontSizeInput('responseFontSize', 'Response')}
                 </div>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
           <button onClick={onClose} className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-2 px-5 rounded-md text-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;