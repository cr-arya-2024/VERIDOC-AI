export enum AppState {
  LANDING = 'LANDING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  moduleName: string;
  description: string;
  ports: {
    name: string;
    type: 'input' | 'output' | 'inout';
    width: string;
    description: string;
  }[];
  synthesisNotes: string[];
  complexity: {
    estimatedGates: string;
    fsmDetected: boolean;
    clockDomains: number;
  };
  suggestions: string[];
  summary: string;
  rawAnalysis?: string;
}
