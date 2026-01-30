
export interface VerilogPort {
  name: string;
  type: 'input' | 'output' | 'inout';
  width: string;
  description: string;
}

export interface AnalysisResult {
  moduleName: string;
  description: string;
  ports: VerilogPort[];
  synthesisNotes: string[];
  complexity: {
    estimatedGates: string;
    fsmDetected: boolean;
    clockDomains: number;
  };
  suggestions: string[];
  summary: string;
}

export enum AppState {
  LANDING = 'LANDING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
