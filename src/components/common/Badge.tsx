import React from 'react';
import { SeverityLevel, TriageClassification } from '../../types/curriculum';

interface BadgeProps {
  severity?: SeverityLevel;
  classification?: TriageClassification;
  status?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ severity, classification, status, className = '' }) => {
  if (severity) {
    switch (severity) {
      case 'Critical':
        return <span className={`cyber-badge-critical ${className}`}>Critical</span>;
      case 'High':
        return <span className={`cyber-badge-high ${className}`}>High</span>;
      case 'Medium':
        return <span className={`cyber-badge-medium ${className}`}>Medium</span>;
      case 'Low':
        return <span className={`cyber-badge-low ${className}`}>Low</span>;
      default:
        return <span className={`cyber-badge-info ${className}`}>Info</span>;
    }
  }

  if (classification) {
    switch (classification) {
      case 'True Positive':
        return <span className={`bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-xs px-2 py-0.5 rounded ${className}`}>True Positive</span>;
      case 'Benign True Positive':
        return <span className={`bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono text-xs px-2 py-0.5 rounded ${className}`}>Benign TP</span>;
      case 'False Positive':
        return <span className={`bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs px-2 py-0.5 rounded ${className}`}>False Positive</span>;
    }
  }

  if (status) {
    return <span className={`bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs px-2 py-0.5 rounded ${className}`}>{status}</span>;
  }

  return null;
};
