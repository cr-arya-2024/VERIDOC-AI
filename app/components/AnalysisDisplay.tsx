
import React from 'react';
import { AnalysisResult } from '../lib/types';
import { Card } from './Cards';
import { Button } from './Button';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

import { useTranslations } from 'next-intl';

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, onReset }) => {
  const t = useTranslations('analysis');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-indigo-500">{t('title_prefix')}</span> {result.moduleName}
          </h2>
          <p className="text-slate-400 mt-1">{result.description}</p>
        </div>
        <Button variant="secondary" onClick={onReset}>
          {t('analyze_another')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card title={t('executive_summary')}>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
          </Card>

          <Card title={t('port_mapping')}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-500 font-medium border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-2">{t('table.type')}</th>
                    <th className="py-3 px-2">{t('table.name')}</th>
                    <th className="py-3 px-2">{t('table.width')}</th>
                    <th className="py-3 px-2">{t('table.description')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {result.ports.map((port, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${port.type === 'input' ? 'bg-emerald-500/10 text-emerald-500' :
                            port.type === 'output' ? 'bg-sky-500/10 text-sky-500' :
                              'bg-amber-500/10 text-amber-500'
                          }`}>
                          {port.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-indigo-300">{port.name}</td>
                      <td className="py-3 px-2 font-mono text-slate-400">{port.width}</td>
                      <td className="py-3 px-2 text-slate-400">{port.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title={t('synthesis_notes')}>
            <ul className="space-y-3">
              {result.synthesisNotes.map((note, idx) => (
                <li key={idx} className="flex gap-3 text-slate-300">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title={t('design_metrics')} className="bg-indigo-900/10 border-indigo-500/20">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">{t('metrics.gate_count')}</span>
                <span className="text-white font-mono">{result.complexity.estimatedGates}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">{t('metrics.fsm_logic')}</span>
                <span className={`font-semibold ${result.complexity.fsmDetected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {result.complexity.fsmDetected ? t('metrics.detected') : t('metrics.none')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">{t('metrics.clock_domains')}</span>
                <span className="text-white font-mono">{result.complexity.clockDomains}</span>
              </div>
            </div>
          </Card>

          <Card title={t('optimization_tips')} className="bg-amber-900/10 border-amber-500/20">
            <div className="space-y-4">
              {result.suggestions.map((tip, idx) => (
                <div key={idx} className="p-3 rounded bg-amber-500/5 border border-amber-500/10 text-sm text-amber-200/80">
                  {tip}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
