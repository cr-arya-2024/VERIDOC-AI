'use client'
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Card } from './Cards';
import { useTranslations, useLocale } from 'next-intl';

interface FileUploadProps {
  onAnalyzeComplete: (analysis: string) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAnalyzeComplete, isAnalyzing }) => {
  const t = useTranslations('file_upload');
  const locale = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.v') && !selectedFile.name.endsWith('.sv')) {
        setError(t('error_invalid'));
        return;
      }

      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('locale', locale);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        // Show detailed error message from API
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to analyze file';
        throw new Error(errorMsg);
      }

      // route.ts returns: { success, data: { analysis: string, ... } }
      onAnalyzeComplete(data.data.analysis);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Analysis error:', error);
      setError(error.message || 'An unexpected error occurred during analysis.');
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <Card className="border border-indigo-500/30 bg-black/70 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:shadow-[0_0_50px_rgba(99,102,241,0.25)] transition-shadow duration-500">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-6 p-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('title')}</h2>
          <p className="text-slate-400 mb-6 max-w-xs">
            {t('subtitle')}
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".v,.sv"
            className="hidden"
          />

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('select_btn')}
            </Button>
            {file && (
              <Button variant="ghost" onClick={handleClear} disabled={isAnalyzing}>
                {t('clear_btn')}
              </Button>
            )}
          </div>

          {error && (
            <p className="mt-4 text-rose-500 text-sm font-medium">{error}</p>
          )}
        </div>
      </Card>

      {preview && (
        <Card title={`${t('preview_title')}: ${file?.name}`} className="animate-in fade-in slide-in-from-bottom-4">
          <div className="relative group">
            <pre className="p-4 bg-slate-950 rounded-lg overflow-x-auto text-sm font-mono text-indigo-300 max-h-96 border border-slate-800">
              <code>{preview}</code>
            </pre>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">VERILOG</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              size="lg"
              isLoading={isAnalyzing}
              onClick={handleSubmit}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? t('analyzing_btn') : t('analyze_btn')}
            </Button>
          </div>
        </Card>
      )
      }
    </div >
  );
};
