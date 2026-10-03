import React from 'react';
import { SandboxType } from '../../types/curriculum';
import { WiresharkSandbox } from './WiresharkSandbox';
import { PortsSandbox } from './PortsSandbox';
import { WindowsEventSandbox } from './WindowsEventSandbox';
import { LinuxTerminalSandbox } from './LinuxTerminalSandbox';
import { SiemSplSandbox } from './SiemSplSandbox';
import { TriageTreeSandbox } from './TriageTreeSandbox';
import { EmailPhishingSandbox } from './EmailPhishingSandbox';
import { MitreNavigatorSandbox } from './MitreNavigatorSandbox';
import { NistIrSandbox } from './NistIrSandbox';
import { ThreatIntelSandbox } from './ThreatIntelSandbox';
import { WebDefenseSandbox } from './WebDefenseSandbox';
import { NmapSandbox } from './NmapSandbox';
import { IamSandbox } from './IamSandbox';
import { VpcFlowSandbox } from './VpcFlowSandbox';
import { CloudTrailSandbox } from './CloudTrailSandbox';

interface Props {
  type: SandboxType;
}

export const SandboxRenderer: React.FC<Props> = ({ type }) => {
  switch (type) {
    case 'wireshark':
      return <WiresharkSandbox />;
    case 'ports':
      return <PortsSandbox />;
    case 'windows-events':
      return <WindowsEventSandbox />;
    case 'linux-cli':
      return <LinuxTerminalSandbox />;
    case 'siem-spl':
      return <SiemSplSandbox />;
    case 'triage-tree':
      return <TriageTreeSandbox />;
    case 'phishing-headers':
      return <EmailPhishingSandbox />;
    case 'mitre-matrix':
      return <MitreNavigatorSandbox />;
    case 'nist-ir':
      return <NistIrSandbox />;
    case 'threat-intel':
      return <ThreatIntelSandbox />;
    case 'web-attacks':
      return <WebDefenseSandbox />;
    case 'nmap-burp':
      return <NmapSandbox />;
    case 'iam-evaluator':
      return <IamSandbox />;
    case 'vpc-flow':
      return <VpcFlowSandbox />;
    case 'cloudtrail':
      return <CloudTrailSandbox />;
    default:
      return <SiemSplSandbox />;
  }
};
