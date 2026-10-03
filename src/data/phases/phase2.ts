import { Phase } from '../../types/curriculum';

export const phase2: Phase = {
  id: 'phase-2',
  phaseNumber: 2,
  title: 'SIEM Operations, Detection Engineering & Alert Triage',
  description: 'Master enterprise SIEM architecture (Splunk/Sentinel), construct professional hunting queries in SPL and KQL, execute triage decision trees, and conduct deep phishing forensics.',
  iconName: 'Activity',
  badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  topics: [
    {
      id: 'siem-fundamentals',
      phaseId: 'phase-2',
      title: 'Enterprise SIEM Architecture & Ingestion Pipelines',
      subtitle: 'Splunk, QRadar & Sentinel: Forwarders, Indexers, Parsing, & Storage Lifecycles',
      estimatedMinutes: 25,
      iconName: 'Database',
      analogy: {
        headline: 'The International Airport Air Traffic Control & Baggage Screening Network',
        story: 'Imagine thousands of travelers (servers and firewalls) constantly generating bags of cargo (logs). At each check-in counter, an agent tags the luggage with a barcode (Universal Forwarder). The luggage is loaded onto high-speed conveyor belts and passes through automated scanners that read passport stamps, inspect luggage contents, and translate foreign tags into a unified airport code (Parsing & Normalization via Heavy Forwarder or Ingestion Pipeline). The luggage is stored in accessible local lockers for immediate inspection (Hot Storage Indexer). After 90 days, older bags are moved to secondary warehouses (Warm & Cold storage), and after a year, archived to deep underground vaults (Frozen Storage). The Air Traffic Control room (Search Head Console) allows security chiefs to query any traveler, bag, or flight across the world in seconds.',
        keyTakeaway: 'Without a SIEM, you would have to log into 10,000 individual servers one by one to find an attacker. A SIEM aggregates, normalizes, timestamps, and correlates everything into a single searchable data plane.'
      },
      corporateReality: {
        headline: 'Data Tiers, License Costs, Parsing Engines, and Search Head Clustering',
        deepDive: ["Enterprise SIEM architectures balance performance, compliance, and cost:","- **Splunk Enterprise Architecture:**","  - *Universal Forwarder (UF):* Lightweight agent installed on endpoints, forwards raw data with zero parsing overhead.","  - *Heavy Forwarder (HF):* Full Splunk instance that parses, filters out junk (e.g. noise events), redacts sensitive PII, and routes data.","  - *Indexer Cluster:* Receives raw streams, extracts default fields (`_time`, `host`, `source`, `sourcetype`), builds inverted search index files, and manages storage tiers:","    - **Hot Bucket:** Read-write memory/NVMe storage for active ingestion.","    - **Warm Bucket:** Read-only NVMe/SSD, rapidly searchable.","    - **Cold Bucket:** Cheap magnetic storage for older data.","    - **Frozen Bucket:** Archived offline (AWS S3 Glacier), non-searchable without thawing.","  - *Search Head (SH) Cluster:* Web UI interface where analysts execute SPL queries; dispatches search jobs across indexers and aggregates results.","- **IBM QRadar Architecture:** WinCollect -> Event Collector (EC 15xx) -> Event Processor (EP 16xx with Ariel DB) -> QRadar Console.","- **Microsoft Sentinel (Cloud Native):** Azure Monitor Agent (AMA) -> Data Collection Rules (DCR) -> Log Analytics Workspace (LAW) -> KQL Hunting."].join('\n'),
        architectureNotes: [
          'Ingestion Filtering: Dropping debug/noisy logs before indexing saves hundreds of thousands of dollars in annual SIEM GB/day licensing.',
          'CIM (Common Information Model): Normalizes disparate vendor formats (Palo Alto, Cisco, Fortinet) into unified fields (`src_ip`, `dest_ip`, `user`, `action`).',
          'NTP Time Synchronization: Absolute synchronization is mandatory; out-of-sync timestamps invalidate correlation rules.',
          'Role-Based Access Control (RBAC): Restricts PCI-DSS and HIPAA index access to authorized analysts.'
        ],
        realWorldCase: 'A global logistics company experienced an indexer queue bottleneck during an incident because a misconfigured firewall began spamming 40,000 UDP broadcast logs per second. The search heads became unresponsive until the detection engineering team deployed an ingestion transform on the Heavy Forwarder to drop `action=teardown` UDP broadcast packets prior to indexing.'
      },
      cheatSheet: {
        title: 'SIEM Architecture & Storage Lifecycle Reference',
        description: 'Key components, data flow stages, and retention tiers in Splunk, QRadar, and Sentinel.',
        headers: ['Component / Tier', 'Function', 'Hardware / Cost Layer', 'Search Capability', 'Retention Strategy'],
        rows: [
          {
            term: 'Universal Forwarder',
            description: 'Agent installed on endpoints that ships raw log streams.',
            commandOrId: 'inputs.conf / outputs.conf',
            riskOrUsage: 'Negligible CPU footprint (<1%); no data parsing.',
            severity: 'Low'
          },
          {
            term: 'Heavy Forwarder',
            description: 'Parses, filters noisy events, routes to indexers or syslog.',
            commandOrId: 'props.conf / transforms.conf',
            riskOrUsage: 'Reduces license consumption by filtering garbage before indexing.',
            severity: 'Medium'
          },
          {
            term: 'Hot / Warm Storage',
            description: 'Active indexer buckets holding fresh indexed data.',
            commandOrId: 'indexes.conf (homePath)',
            riskOrUsage: 'High-speed NVMe SSDs; instant search response for SOC triage.',
            severity: 'Low'
          },
          {
            term: 'Cold / Frozen Storage',
            description: 'Aged historical data rolled off for compliance.',
            commandOrId: 'coldPath / thawedPath',
            riskOrUsage: 'Cold is slow HDD; Frozen is offline archive requiring manual restoration.',
            severity: 'Low'
          },
          {
            term: 'Search Head Cluster',
            description: 'Coordinates searches, distributes jobs to indexers, runs alerts.',
            commandOrId: 'SHC (Port 8000 Web / 8089 Mgmt)',
            riskOrUsage: 'Search concurrency limits can throttle SOC analysts during major incidents.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'siem-spl',
      sandboxConfig: {
        title: 'SIEM Pipeline & Ingestion Architecture Simulator',
        instructions: 'Test log ingestion filtering, observe how parsing rules extract normalized fields (src_ip, user, action), and trace event lifecycle from forwarder to indexer.',
        defaultData: {
          pipelineStages: ['Universal Forwarder', 'Heavy Forwarder (Transform/Drop)', 'Indexer (Hot Bucket)', 'Search Head (SPL/KQL)'],
          sampleLogs: [
            { raw: '2026-10-03 14:00:01 host=FW-01 msg="ALLOW src=10.0.1.25 dst=172.16.0.5 port=443"', parsed: { host: 'FW-01', action: 'ALLOW', src_ip: '10.0.1.25', dst_ip: '172.16.0.5', port: 443 } },
            { raw: '2026-10-03 14:00:02 host=DC-01 EventID=4625 user=jdoe substatus=0xC000006A', parsed: { host: 'DC-01', event_id: 4625, user: 'jdoe', error: 'Bad Password' } }
          ]
        }
      },
      incident: {
        id: 'inc-2010',
        ticketNumber: 'SEC-2010',
        title: 'SIEM Indexer Queue Stalling Due to Runaway Debug Telemetry Spike',
        severity: 'High',
        affectedAsset: 'Splunk Indexer Cluster (IDX-01 through IDX-06)',
        timestamp: '2026-10-03 18:10:00 UTC',
        summary: 'Splunk Cloud monitoring alerted on License Usage Warning: Daily license quota exceeded by 280% at 18:00 UTC. Indexer parsing queues blocked at 99%, causing real-time SOC detection alerts to delay by up to 45 minutes.',
        rawTelemetry: [
          'Indexer alert: blocked=true queue=parsingqueue exec_time=98.4%',
          'License usage breakdown: sourcetype="cisco:asa" volume=450GB (Normal: 40GB)',
          'Top talker query: index=_internal source=*license_usage.log | stats sum(b) by sourcetype | sort - sum(b)',
          'Root source IP: 10.240.12.1 (Core Core-Switch-DC-A) generating Cisco ASA debug level 7 logs after network upgrade'
        ],
        triageOptions: {
          correctClassification: 'Benign True Positive',
          explanation: 'Alert correctly identified an actual catastrophic ingestion spike, but the cause was an internal misconfiguration (debug logging level enabled during maintenance) rather than adversary data wiping.'
        },
        rootCauseOptions: {
          options: [
            'Network engineering team inadvertently enabled Level 7 Debug logging on core firewalls during maintenance, swamping the SIEM pipeline.',
            'Adversary conducting massive DDoS attack targeting Splunk web ports.',
            'Malware encrypting Splunk index files with ransomware.',
            'Hardware failure of the Search Head cluster power supply.'
          ],
          correctIndex: 0,
          explanation: 'The internal license telemetry identifies `sourcetype="cisco:asa"` from Core-Switch-DC-A generating 450GB of debug logs (Level 7) instead of normal operational Level 4 warnings.'
        },
        containmentOptions: {
          options: [
            'Immediately contact network operations to revert firewall logging to Level 4 (Warning), deploy a temporary regex drop rule on the Heavy Forwarders for debug messages, and clear indexer queues.',
            'Shut down all Splunk indexers to stop the license meter from running.',
            'Delete all historical hot buckets from the last 30 days to free up disk space.',
            'Ignore the backlog until tomorrow morning.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires shutting off the debug firehose at the source switch, implementing an immediate drop filter on intermediate forwarders, and verifying ingestion queues recover.'
        },
        mitreTechniques: ['T1499.001 - Endpoint Denial of Service: OS Exhaustion Flood', 'T1562.001 - Impair Defenses: Disable or Modify Tools'],
        slaMinutes: 30
      },
      flashcards: [
        {
          id: 'fc-2-1',
          question: 'What is the role of a Universal Forwarder vs a Heavy Forwarder in Splunk enterprise architecture?',
          category: 'SIEM Architecture',
          difficulty: 'Junior',
          modelAnswer: 'A Universal Forwarder (UF) is a minimal, lightweight binary deployed on endpoints that collects raw log data and streams it directly to indexers or intermediate servers with virtually no CPU or memory overhead. A Heavy Forwarder (HF) is a full Splunk Enterprise installation that can parse, mask PII, filter unwanted events (saving license costs), evaluate regex transforms, and route specific data streams to different indexers or external third-party systems.',
          scoringTips: ['UF is lightweight and does no parsing.', 'HF parses, masks, filters, and routes data.', 'Mention license cost savings by dropping noise on HF.'],
          corporateContext: 'Standard architectural question for junior SOC engineers and detection analysts.'
        },
        {
          id: 'fc-2-2',
          question: 'What is the difference between Hot, Warm, Cold, and Frozen buckets in an indexer storage lifecycle?',
          category: 'SIEM Storage',
          difficulty: 'Mid',
          modelAnswer: 'Hot buckets are active, read-write stores residing on fast NVMe/SSD where currently arriving data is written and instantly searchable. Warm buckets are rolled from hot once size or time limits are reached; they are read-only but remain on fast storage and fully searchable. Cold buckets contain older data moved to cheaper, slower magnetic storage to reduce costs while retaining searchability. Frozen buckets are rolled off cold, erased from index search heads, and archived (e.g. to AWS Glacier) for compliance; they cannot be searched unless manually thawed.',
          scoringTips: ['Hot = read/write active.', 'Warm = read-only on fast storage.', 'Cold = read-only on cheaper storage.', 'Frozen = archived/offline, non-searchable unless thawed.'],
          corporateContext: 'Crucial for understanding search speeds when hunting past 30-day timelines.'
        },
        {
          id: 'fc-2-3',
          question: 'What is CIM (Common Information Model) normalization, and why does an enterprise SOC depend on it?',
          category: 'Detection Engineering',
          difficulty: 'Mid',
          modelAnswer: 'CIM normalization is the process of mapping vendor-specific log fields (such as `src`, `src_ip`, `SourceAddress`, or `s-ip`) to a standardized, vendor-agnostic taxonomy (like `src_ip`). Without CIM, an alert rule detecting brute force would need separate queries for Cisco, Palo Alto, Windows, and Linux. With CIM, a single detection rule like `tag=authentication action=failure | stats count by src_ip, user` catches attacks across every technology in the enterprise.',
          scoringTips: ['Explains vendor-agnostic field normalization.', 'Gives examples (mapping disparate IP/User fields).', 'Explains how it enables single detection rules across multi-vendor environments.'],
          corporateContext: 'Vital for building scalable SIEM correlation searches.'
        }
      ],
      quiz: [
        {
          id: 'q-2-1',
          question: 'Which Splunk storage bucket tier contains data that can NO LONGER be searched by an analyst without an explicit manual restoration (thawing) process?',
          options: ['Warm Bucket', 'Cold Bucket', 'Frozen Bucket', 'Hot Bucket'],
          correctIndex: 2,
          explanation: 'Frozen buckets are removed from the active index and archived to cold cloud storage (like AWS S3 Glacier). They cannot be queried until thawed back into the index.'
        },
        {
          id: 'q-2-2',
          question: 'Why do enterprise detection engineering teams use Heavy Forwarders to filter out high-volume debug logs before reaching indexers?',
          options: [
            'To make the endpoint run faster',
            'To reduce Splunk daily ingestion volume and prevent expensive license overage costs',
            'To automatically encrypt all user passwords in memory',
            'To reboot domain controllers during off-hours'
          ],
          correctIndex: 1,
          explanation: 'Dropping noisy, non-security events on intermediate Heavy Forwarders prevents unnecessary ingestion volume against the enterprise GB/day license quota.'
        },
        {
          id: 'q-2-3',
          question: 'What is the primary function of the Search Head in a clustered SIEM architecture?',
          options: [
            'Physically store raw log files on magnetic tapes',
            'Provide the web console, parse search queries (SPL/KQL), dispatch search jobs across indexers, and consolidate results',
            'Act as a network gateway firewall between the internet and internal servers',
            'Generate SSL certificates for user laptops'
          ],
          correctIndex: 1,
          explanation: 'The Search Head serves the user interface, coordinates searches across distributed indexers, correlates events, and triggers alerts.'
        }
      ]
    },
    {
      id: 'query-mastery',
      phaseId: 'phase-2',
      title: 'Query Mastery: Splunk SPL & Microsoft Sentinel KQL',
      subtitle: 'Filtering, Stats Aggregations, Eval Logic, Timecharting, Dedup, & Regex Extractions',
      estimatedMinutes: 35,
      iconName: 'Search',
      analogy: {
        headline: 'The Ultimate Corporate Intelligence Search Engine & Forensic Filter Bar',
        story: 'Imagine walking into a warehouse filled with 100 million physical sales invoices from 500 branches. If you search by hand, you will retire before you find fraud. SPL and KQL are like having an army of robotic accountants. With one sentence, you say: "Look only in the 2026 tax bin (`index=finance`), find transactions above $10,000 (`amount > 10000`), group them by cashier name (`stats count, sum(amount) by employee`), throw out duplicate entries (`dedup transaction_id`), and graph the hourly trend (`timechart span=1h count`)." In 3 seconds, the needle in the haystack appears on your monitor.',
        keyTakeaway: 'An analyst who cannot write queries is blind. Writing high-speed, resource-efficient SPL and KQL queries is what separates junior alert-clickers from true threat hunters.'
      },
      corporateReality: {
        headline: 'Production Threat Hunting, Query Optimization, and Real-Time Correlation',
        deepDive: ["In a real SOC handling 50TB of daily telemetry, poorly written queries crash indexers or timeout after 30 minutes.","**Splunk SPL Best Practices:**","1. **Filter Early:** Always specify `index=` and `sourcetype=` as the very first terms. Never start with `*` or a generic string.","2. **Key Commands:**","   - `stats count, dc(user) as unique_users by src_ip`: Aggregates metrics (`count`, `dc` for distinct count, `sum`, `avg`).","   - `eval is_suspicious=if(count > 50, \"YES\", \"NO\")`: Calculates new fields or transforms existing ones.","   - `timechart span=5m count by action`: Generates time-series buckets for visualization and spike detection.","   - `dedup src_ip`: Removes duplicate events, preserving only the most recent entry.","   - `rex field=_raw \"user=(?<extracted_user>\\\\w+)\"`: Extracts custom fields dynamically using regular expressions.","**Microsoft Sentinel KQL Equivalence:**","   - Splunk: `index=windows EventCode=4625 | stats count by user | where count > 10`","   - KQL: `SecurityEvent | where EventID == 4625 | summarize FailedAttempts = count() by TargetAccount | where FailedAttempts > 10`"].join('\n'),
        architectureNotes: [
          'Search Mode (Fast vs Smart vs Verbose): In Splunk, use Fast Mode for statistical aggregations to avoid extracting non-essential event fields.',
          'Summary Indexing: Pre-calculate heavy baseline searches every hour into summary indexes so threat hunting dashboards load instantly.',
          'Index Partitioning: Segregate high-volume firewall logs (`index=firewall`) from sensitive endpoint telemetry (`index=endpoint`).',
          'Lookups: Enrich IP addresses with internal asset databases and Active Directory user metadata via `| lookup assets.csv ip as src_ip OUTPUT department, owner`.'
        ],
        realWorldCase: 'During a nation-state incident response, an analyst noticed odd traffic to an external IP. Using an optimized SPL query: `index=proxy status=200 | stats count, dc(uri) as unique_uris, min(_time) as first_seen, max(_time) as last_seen by src_ip, dest_domain | eval duration=last_seen-first_seen | eval beacon_ratio=count/duration | where beacon_ratio > 0.015`, the team isolated a compromised domain controller beaconing every 60 seconds with 5% jitter.'
      },
      cheatSheet: {
        title: 'Splunk SPL vs Microsoft Sentinel KQL Rosetta Stone',
        description: 'Direct translation of essential commands between the two premier enterprise SIEM languages.',
        headers: ['Operation', 'Splunk SPL Syntax', 'Microsoft Sentinel KQL Syntax', 'Performance / Tuning Tip'],
        rows: [
          {
            term: 'Search & Filter',
            description: 'Filter events by sourcetype and condition',
            commandOrId: 'index=win EventCode=4625',
            riskOrUsage: 'KQL: SecurityEvent | where EventID == 4625. Always place index/table and specific IDs first.',
            severity: 'Low'
          },
          {
            term: 'Count Aggregation',
            description: 'Count events grouped by fields',
            commandOrId: '| stats count by src_ip, user',
            riskOrUsage: 'KQL: | summarize count() by IpAddress, TargetAccount. Limits memory allocation on indexer.',
            severity: 'Low'
          },
          {
            term: 'Distinct Count',
            description: 'Count unique occurrences of an entity',
            commandOrId: '| stats dc(user) as unique_users by src_ip',
            riskOrUsage: 'KQL: | summarize dcount(TargetAccount) by IpAddress. Prime method to spot password spray.',
            severity: 'Medium'
          },
          {
            term: 'Field Calculation',
            description: 'Create conditional or math fields',
            commandOrId: '| eval risk=if(count>100,"HIGH","LOW")',
            riskOrUsage: 'KQL: | extend risk = iff(count_ > 100, "HIGH", "LOW"). Use for severity scoring.',
            severity: 'Low'
          },
          {
            term: 'Time-Series Charting',
            description: 'Bucket counts over time increments',
            commandOrId: '| timechart span=1h count by status',
            riskOrUsage: 'KQL: | summarize count() by bin(TimeGenerated, 1h), EventID. Perfect for spotting abnormal spikes.',
            severity: 'Low'
          },
          {
            term: 'Deduplication',
            description: 'Keep only the newest unique event',
            commandOrId: '| dedup src_ip',
            riskOrUsage: 'KQL: | summarize arg_max(TimeGenerated, *) by IpAddress. Use sparingly on large result sets.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'siem-spl',
      sandboxConfig: {
        title: 'Interactive SIEM Query Console (SPL & KQL Engine)',
        instructions: 'Type or click pre-built enterprise hunting queries (e.g. `index=windows EventCode=4625 | stats count by user`, `timechart span=1h count by status`, or KQL queries). Observe real-time parsing, calculated stats tables, and timechart visualization.',
        defaultData: {
          availableIndexes: ['index=windows', 'index=firewall', 'index=proxy'],
          mockEvents: [
            { _time: '2026-10-03 14:00', index: 'windows', EventCode: 4625, user: 'admin', src_ip: '192.168.1.50', status: 'FAILURE' },
            { _time: '2026-10-03 14:01', index: 'windows', EventCode: 4625, user: 'admin', src_ip: '192.168.1.50', status: 'FAILURE' },
            { _time: '2026-10-03 14:02', index: 'windows', EventCode: 4625, user: 'admin', src_ip: '192.168.1.50', status: 'FAILURE' },
            { _time: '2026-10-03 14:03', index: 'windows', EventCode: 4625, user: 'finance_lead', src_ip: '192.168.1.50', status: 'FAILURE' },
            { _time: '2026-10-03 14:04', index: 'windows', EventCode: 4625, user: 'exec_assistant', src_ip: '192.168.1.50', status: 'FAILURE' },
            { _time: '2026-10-03 14:05', index: 'windows', EventCode: 4624, user: 'exec_assistant', src_ip: '192.168.1.50', status: 'SUCCESS' },
            { _time: '2026-10-03 14:06', index: 'firewall', EventCode: 1001, user: 'system', src_ip: '192.168.1.50', status: 'DENIED', dest_ip: '198.51.100.99', port: 4444 }
          ]
        }
      },
      incident: {
        id: 'inc-2045',
        ticketNumber: 'SEC-2045',
        title: 'Threat Hunting Mandate: Detect Stealth Password Spraying Across Domain',
        severity: 'High',
        affectedAsset: 'Enterprise Active Directory Domain (CORP.LOCAL)',
        timestamp: '2026-10-03 18:40:00 UTC',
        summary: 'Threat Intelligence reports APT29 executing low-and-slow password spraying targeting executive accounts (trying 1 common password per account every 4 hours to evade account lockout thresholds). Craft an SPL/KQL query to catch the source IP.',
        rawTelemetry: [
          'Requirement: Detect any single internal or external IP address that has caused EventCode 4625 failures across 5 or more UNIQUE usernames within a 24-hour window.',
          'Expected query structure must leverage distinct count (`dc(user)`) aggregation.'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Low-and-slow password spraying evades traditional lockout thresholds (e.g. 5 failed attempts per user) by spraying one single password horizontally across dozens of users.'
        },
        rootCauseOptions: {
          options: [
            'Adversary conducting horizontal password spraying across multiple Active Directory user accounts from a single host.',
            'A single user forgot their laptop password and typed it wrong 5 times.',
            'An automated script querying domain time synchronizations.',
            'Corrupted Kerberos ticket cache on local workstations.'
          ],
          correctIndex: 0,
          explanation: 'Targeting multiple distinct usernames from a single source IP is the hallmark signature of password spraying.'
        },
        containmentOptions: {
          options: [
            'Isolate the source IP immediately, enforce emergency self-service password reset for all targeted accounts, enable mandatory MFA on all external portals, and review logon logs for any successful Event 4624 from that IP.',
            'Delete the Active Directory accounts that received failed attempts.',
            'Increase account lockout threshold to 100 attempts to stop alerts.',
            'Do nothing because none of the accounts were locked out.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires blocking the attacking IP, investigating if any attempt succeeded (Event 4624), forcing password resets for targeted accounts, and enforcing MFA.'
        },
        mitreTechniques: ['T1110.003 - Brute Force: Password Spraying', 'T1078 - Valid Accounts'],
        slaMinutes: 30
      },
      flashcards: [
        {
          id: 'fc-2-4',
          question: 'In Splunk SPL, what is the difference between `stats count` and `stats dc(user)`?',
          category: 'Query Mastery',
          difficulty: 'Junior',
          modelAnswer: '`stats count` calculates the total number of events that match the query criteria. In contrast, `stats dc(user)` calculates the "distinct count" (number of unique, individual users). For example, if user "bob" fails to log in 50 times, `count` equals 50, but `dc(user)` equals 1. In a password spray attack where an attacker tries 1 password across 50 different users, `dc(user)` equals 50, which is the key metric used for detection.',
          scoringTips: ['Define count as total occurrences.', 'Define dc() as distinct/unique entities.', 'Give the password spray detection example.'],
          corporateContext: 'Used in technical screening to test foundational data analysis logic.'
        },
        {
          id: 'fc-2-5',
          question: 'How do you optimize a slow-running Splunk or KQL query that searches millions of logs?',
          category: 'SIEM Optimization',
          difficulty: 'Mid',
          modelAnswer: 'To optimize query performance: 1) Narrow the time window as much as possible, 2) Specify exact indexes and sourcetypes at the beginning (`index=firewall sourcetype=pan:traffic`), 3) Never start with wildcards or unindexed fields (e.g. avoid `*error*`), 4) Use Fast Mode in Splunk rather than Verbose Mode, 5) Filter out non-matching events using `where` or boolean terms BEFORE piping to expensive commands like `stats`, `sort`, or `dedup`, and 6) Use summary indexing for heavy scheduled searches.',
          scoringTips: ['Mention narrow time windows.', 'Mention specifying index and sourcetype first.', 'Explain filtering before aggregation commands.'],
          corporateContext: 'Vital question to ensure analysts do not degrade production SIEM performance.'
        },
        {
          id: 'fc-2-6',
          question: 'What is the KQL equivalent of the Splunk `eval` command, and how is it used?',
          category: 'KQL Mastery',
          difficulty: 'Mid',
          modelAnswer: 'In Microsoft Sentinel KQL, the equivalent of Splunk `eval` is the `extend` operator. It creates calculated columns, modifies existing fields, or evaluates conditional statements. For example, in Splunk: `| eval is_admin=if(user="adm_root", 1, 0)`. In KQL: `| extend IsAdmin = iff(TargetAccount == "adm_root", true, false)`. It is essential for computing threat scores and standardizing telemetry on the fly.',
          scoringTips: ['Identify the `extend` keyword.', 'Mention conditional evaluation (iff / case).', 'Explain usage for creating dynamic fields/scores.'],
          corporateContext: 'Tested frequently for organizations migrating from Splunk to Microsoft Sentinel.'
        }
      ],
      quiz: [
        {
          id: 'q-2-4',
          question: 'Which Splunk command is used to display time-series metric fluctuations in a visual histogram or line chart?',
          options: ['| table', '| timechart', '| dedup', '| rex'],
          correctIndex: 1,
          explanation: '`| timechart` generates time-binned statistical summaries formatted specifically for visual charting over time.'
        },
        {
          id: 'q-2-5',
          question: 'In Microsoft Sentinel KQL, which operator is used to aggregate data (similar to `stats` in Splunk)?',
          options: ['project', 'extend', 'summarize', 'search'],
          correctIndex: 2,
          explanation: '`summarize` is the KQL operator used to compute aggregations such as `count()`, `dcount()`, `sum()`, and `avg()` grouped by specific fields.'
        },
        {
          id: 'q-2-6',
          question: 'Why should a threat hunter avoid starting an SPL search with `* | search "malware.exe"` in a production enterprise environment?',
          options: [
            'Because the command will automatically delete the malware.',
            'Because searching across all indexes and all fields without index filtering forces a full table scan, degrading SIEM performance for the entire SOC.',
            'Because wildcards are not permitted in Splunk syntax.',
            'Because it triggers an automatic Windows Defender reboot.'
          ],
          correctIndex: 1,
          explanation: 'Querying `*` without specifying an index forces the search head to query every single indexer bucket and parse raw text across terabytes of data, causing severe performance degradation.'
        }
      ]
    },
    {
      id: 'triage-decision-tree',
      phaseId: 'phase-2',
      title: 'Alert Triage Decision Tree & Severity Scoring',
      subtitle: 'True Positive vs False Positive vs Benign True Positive & SLA Calculations',
      estimatedMinutes: 30,
      iconName: 'GitFork',
      analogy: {
        headline: 'The Hospital Emergency Room Triage Protocol',
        story: 'When an ambulance rushes a patient to the ER, the triage nurse does not guess. They follow a strict clinical decision tree: Check airway, pulse, bleeding, and consciousness. A patient with a heart attack is classified Red / P1 (immediate treatment within 5 minutes). A patient with a scrape is Green / P4. If a heart monitor beeps because a sensor fell off the patient’s finger, that is a False Positive (alarm sounded, but no medical emergency). If the alarm sounded because the patient ran on a treadmill for an authorized stress test, that is a Benign True Positive (the alarm condition was met, but it was expected authorized activity). If the patient is actually having a stroke, that is a True Positive.',
        keyTakeaway: 'The SOC cannot treat all 5,000 daily alerts the same. Every alert must be classified accurately (TP, FP, BTP) with documented evidence, and mapped to the right SLA priority.'
      },
      corporateReality: {
        headline: 'Tier 1/2 Escalation Workflows, Tuning Feedback Loops, and Mean Time to Respond (MTTR)',
        deepDive: ["Enterprise SOC operational efficiency hinges on alert classifications:","- **True Positive (TP):** The alert triggered on actual malicious or unauthorized activity. Requires immediate containment, escalation to Tier 2/Incident Response, and ticketing.","- **False Positive (FP):** The alert triggered on legitimate, normal activity due to poorly written rule logic or bad baseline thresholds (e.g. an alert that flags every PowerShell execution without filtering out IT admin scripts). FPs must be sent to Detection Engineering for **rule tuning**.","- **Benign True Positive (BTP):** The alert correctly identified the specific activity described by the rule, but investigation reveals it was authorized and expected (e.g. an approved penetration test, scheduled vulnerability scan by Nessus, or authorized database backup script). BTPs are closed with approval documentation.","**Severity Scoring Formula:**","Severity = (Likelihood × Impact) × Asset Criticality.","- Criticality Levels: Tier 0 (Domain Controllers, Key Vaults) > Tier 1 (Production Databases, ERP) > Tier 2 (Corporate Workstations) > Tier 3 (Guest Wi-Fi, Isolated Lab).","- Response SLAs: Critical (P1: 15 mins), High (P2: 30 mins), Medium (P3: 2 hours), Low (P4: 24 hours)."].join('\n'),
        architectureNotes: [
          'Alert Fatigue Mitigation: A healthy SOC maintains an FP rate under 25%. FPs above 50% lead to analyst burnout and missed real breaches.',
          'Ticketing Integration: Bi-directional sync between SIEM/SOAR (Palo Alto XSOAR, Splunk SOAR) and ITSM (ServiceNow SecOps, Jira).',
          'Chain of Custody: Every triage comment, timestamp, analyst ID, and forensic artifact must be immutably recorded in the ticket.',
          'Metrics: Track Mean Time to Detect (MTTD), Mean Time to Acknowledge (MTTA), and Mean Time to Remediate (MTTR).'
        ],
        realWorldCase: 'During a Red Team exercise at an insurance firm, a Mimikatz credential-dump alert fired on a critical database server at 02:00 AM. A junior analyst dismissed it as a "False Positive" thinking it was the scheduled backup agent. 4 hours later, the Red Team obtained Domain Admin rights. The post-incident review revealed the difference between a True Positive and an authorized tool: legitimate backup software never calls `MiniDumpWriteDump` on `lsass.exe`.'
      },
      cheatSheet: {
        title: 'SOC Triage Classification & SLA Matrix',
        description: 'Definitions, required actions, tuning pathways, and SLA response timeframes for SOC analysts.',
        headers: ['Classification / Severity', 'Definition', 'Enterprise Action Path', 'Required Evidence', 'SLA Response Time'],
        rows: [
          {
            term: 'True Positive (TP)',
            description: 'Malicious threat confirmed.',
            commandOrId: 'Status: Escalated / Contained',
            riskOrUsage: 'Initiate IR playbook, isolate host/account, preserve RAM/logs, notify SOC Lead.',
            severity: 'Critical'
          },
          {
            term: 'Benign True Positive (BTP)',
            description: 'Rule matched authorized legitimate activity.',
            commandOrId: 'Status: Closed - Authorized',
            riskOrUsage: 'Verify approved Change Request (CR) or Pentest authorization ticket before closing.',
            severity: 'Low'
          },
          {
            term: 'False Positive (FP)',
            description: 'Rule triggered on normal benign noise.',
            commandOrId: 'Status: Closed - Tuned',
            riskOrUsage: 'Submit detection tuning ticket with filter conditions to Detection Engineering.',
            severity: 'Medium'
          },
          {
            term: 'Critical (P1)',
            description: 'Crown Jewel compromise or active ransomware.',
            commandOrId: 'Active Directory / Payment Gateway',
            riskOrUsage: 'Immediate bridge call, host isolation, executive escalation.',
            severity: 'Critical'
          },
          {
            term: 'High (P2)',
            description: 'Compromised workstation or successful phishing.',
            commandOrId: 'User Endpoint / Cloud Account',
            riskOrUsage: 'Isolate machine, reset user credentials, search enterprise for IOC spread.',
            severity: 'High'
          },
          {
            term: 'Medium (P3)',
            description: 'Blocked external exploit or policy violation.',
            commandOrId: 'Perimeter Firewall / Web Proxy',
            riskOrUsage: 'Investigate source IP, confirm edge control blocked traffic, document disposition.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'triage-tree',
      sandboxConfig: {
        title: 'Live Alert Triage & Decision Simulator',
        instructions: 'Evaluate simulated enterprise SOC alerts. Review telemetry, investigate context, choose between True Positive, False Positive, or Benign True Positive, and select proper SLA priority.',
        defaultData: {
          scenarios: [
            {
              id: 'tri-1',
              title: 'LSASS Memory Dump Alert on SQL-PROD-01',
              telemetry: 'Process: procdump64.exe -ma lsass.exe C:\\temp\\lsass.dmp | User: DB_Admin_Local | Time: 02:14:00 UTC',
              context: 'No approved Change Request found in ServiceNow. DBA denies running any diagnostics at 2 AM.',
              correctClassification: 'True Positive',
              correctSeverity: 'Critical',
              rationale: 'Credential dumping against LSASS with ProcDump without authorization is a critical true positive compromise.'
            },
            {
              id: 'tri-2',
              title: 'Port Scan Alert from Internal IP 10.0.10.15',
              telemetry: 'Nessus vulnerability scanner IP 10.0.10.15 conducting full SYN scan on subnet 10.0.2.0/24',
              context: 'Change Request CHG-99201 approved for weekly automated vulnerability assessment.',
              correctClassification: 'Benign True Positive',
              correctSeverity: 'Low',
              rationale: 'The scanner matched the port scan rule correctly, but activity is verified by an active Change Request.'
            },
            {
              id: 'tri-3',
              title: 'Suspicious PowerShell Execution Alert on HR Laptop',
              telemetry: 'powershell.exe -ExecutionPolicy Bypass -File C:\\Program Files\\ITAssetManager\\inventory.ps1',
              context: 'Verified corporate asset inventory script digitally signed by Internal IT CA.',
              correctClassification: 'False Positive',
              correctSeverity: 'Medium',
              rationale: 'Legitimate signed internal enterprise inventory script flagged by generic PowerShell rule; needs rule tuning.'
            }
          ]
        }
      },
      incident: {
        id: 'inc-2090',
        ticketNumber: 'SEC-2090',
        title: 'Mimikatz Execution Alert on Production Payroll Database Host',
        severity: 'Critical',
        affectedAsset: 'PAYROLL-DB-01 (10.10.4.50)',
        timestamp: '2026-10-03 19:20:00 UTC',
        summary: 'EDR Alert #EDR-9041: Behavioral memory injection matching Mimikatz `sekurlsa::logonpasswords` detected in LSASS memory on high-criticality payroll database server.',
        rawTelemetry: [
          '2026-10-03T19:18:22Z EDR-AGENT host=PAYROLL-DB-01 action=DETECT_ONLY process=mimi.exe pid=3912 target_process=lsass.exe target_pid=740 access_mask=0x1010',
          'ServiceNow check: No active maintenance windows or Change Requests found for PAYROLL-DB-01.',
          'Parent process: cmd.exe (Parent PID: 2190, launched by IIS worker process w3wp.exe)'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Mimikatz memory scraping launched via an IIS web server worker process (`w3wp.exe`) indicates an active web shell compromise leading to credential dumping.'
        },
        rootCauseOptions: {
          options: [
            'Web server exploited via web shell (spawned under `w3wp.exe`), used to execute Mimikatz for credential harvesting.',
            'Database administrator performing scheduled index rebuilds.',
            'Microsoft Windows Defender updating signature definitions.',
            'Network printer querying SNMP status.'
          ],
          correctIndex: 0,
          explanation: 'The process lineage `w3wp.exe` -> `cmd.exe` -> `mimi.exe` proves an adversary exploited the IIS web application and dropped Mimikatz into memory.'
        },
        containmentOptions: {
          options: [
            'Trigger immediate EDR network isolation of PAYROLL-DB-01, capture live volatile memory for forensic analysis, reset all service and administrative accounts associated with the host, and declare a P1 Major Incident.',
            'Email the database administrator to ask if they recognize mimi.exe.',
            'Add mimi.exe to the exclusion list to suppress duplicate alerts.',
            'Reboot the server to wipe the temporary files.'
          ],
          correctIndex: 0,
          explanation: 'Critical True Positive requires immediate network isolation to halt lateral movement, memory capture for volatile artifacts, credential revocation, and opening a P1 bridge.'
        },
        mitreTechniques: ['T1003.001 - OS Credential Dumping: LSASS Memory', 'T1505.003 - Server Software Component: Web Shell'],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-2-7',
          question: 'What is the exact difference between a False Positive and a Benign True Positive in enterprise SOC operations?',
          category: 'Alert Triage',
          difficulty: 'Junior',
          modelAnswer: 'A False Positive (FP) occurs when an alert fires on activity that is completely harmless and never should have triggered an alert in the first place (e.g., poorly written rule that flags IT inventory scripts as malware). A Benign True Positive (BTP) occurs when an alert correctly triggers on the specific dangerous or unusual condition defined by the rule, but investigation reveals the activity was authorized and expected (e.g., an authorized penetration testing team executing Mimikatz or an approved scheduled vulnerability scan). FPs lead to rule tuning; BTPs are closed with authorized documentation.',
          scoringTips: ['Define FP as harmless noise needing rule tuning.', 'Define BTP as matched condition but verified authorized activity.', 'Give real corporate examples (Pentest vs bad rule).'],
          corporateContext: 'One of the most frequently asked questions in Tier 1 SOC interviews.'
        },
        {
          id: 'fc-2-8',
          question: 'How do you calculate the Severity Level and SLA of an incoming security incident?',
          category: 'SOC Operations',
          difficulty: 'Mid',
          modelAnswer: 'Incident severity is calculated by evaluating: 1) Threat Likelihood & Confidence (how certain are we that this is an active attack?), 2) Threat Impact (Confidentiality, Integrity, Availability degradation), and 3) Asset Criticality (Tier 0 Crown Jewels like Domain Controllers and payment systems vs Tier 3 guest workstations). A confirmed malware outbreak on a Tier 0 asset is a P1/Critical (15-minute SLA). A blocked commodity adware alert on an isolated guest PC is a P4/Low (24-hour SLA).',
          scoringTips: ['Mention Likelihood, Impact, and Asset Criticality.', 'Mention Asset Tiering (Tier 0 vs Tier 3).', 'Provide typical SLA timeframes (15m, 30m, 2h, 24h).'],
          corporateContext: 'Demonstrates business-aligned risk management instead of treating all alerts equally.'
        },
        {
          id: 'fc-2-9',
          question: 'What is Alert Fatigue, and what concrete steps does a SOC analyst take to address it?',
          category: 'Detection Engineering',
          difficulty: 'Senior',
          modelAnswer: 'Alert Fatigue occurs when analysts are overwhelmed by a high volume of false positives or low-fidelity alerts, leading to desensitization, exhaustion, and missed critical breaches. To address it: 1) Measure and track FP rates per detection rule, 2) Submit rule-tuning requests with specific exclusion criteria (e.g. filter known internal hashes, service accounts, or maintenance windows), 3) Implement SOAR automated playbooks to pre-triage and enrich alerts with VirusTotal/Active Directory data before presenting them to humans, and 4) Retire obsolete or low-value detection signatures.',
          scoringTips: ['Explain psychological and operational impacts of fatigue.', 'Mention rule tuning and specific whitelist criteria.', 'Mention SOAR automation and alert enrichment.'],
          corporateContext: 'Crucial for modern SOC operations looking to improve analyst retention and MTTR.'
        }
      ],
      quiz: [
        {
          id: 'q-2-7',
          question: 'An enterprise vulnerability scanner conducts an authorized port scan on the corporate network during an approved maintenance window, triggering a Port Scan alert. How should this alert be classified?',
          options: ['False Positive (FP)', 'Benign True Positive (BTP)', 'True Positive (TP)', 'Zero-Day Exploit'],
          correctIndex: 1,
          explanation: 'It is a Benign True Positive because the detection rule correctly detected an actual port scan, but the activity was authorized and planned via a formal Change Request.'
        },
        {
          id: 'q-2-8',
          question: 'What should a SOC analyst do when an alert repeatedly triggers on normal, legitimate software due to overly broad detection logic?',
          options: [
            'Delete the SIEM index permanently',
            'Document the false positive evidence and submit a rule tuning / exception request to the Detection Engineering team',
            'Unplug the server from the network',
            'Mark the alert as Critical to get immediate attention'
          ],
          correctIndex: 1,
          explanation: 'Documenting the pattern and requesting detection engineering tuning with precise exclusion criteria stops recurring false positives without creating blind spots.'
        },
        {
          id: 'q-2-9',
          question: 'Which of the following corporate assets is classified as Tier 0 (Crown Jewel) in enterprise risk management?',
          options: [
            'A contractor laptop used for documentation',
            'A conference room TV display PC',
            'An Active Directory Primary Domain Controller (PDC)',
            'A cafeteria digital menu board'
          ],
          correctIndex: 2,
          explanation: 'Active Directory Domain Controllers manage identities, credentials, and access across the entire organization, making them Tier 0 Crown Jewels.'
        }
      ]
    },
    {
      id: 'phishing-investigation',
      phaseId: 'phase-2',
      title: 'Phishing Investigation & Email Forensics',
      subtitle: 'Raw Headers, SPF, DKIM, DMARC Alignment, IP Reputation, & URL Defanging',
      estimatedMinutes: 35,
      iconName: 'Mail',
      analogy: {
        headline: 'The Counterfeit Bank Check & Foreign Customs Inspection',
        story: 'Imagine receiving a letter claiming to be an official wire transfer check from "Chase Bank". You do not just look at the printed logo. You inspect the watermarks and security seals. SPF is like checking the courier van: Did the package arrive in an official armored Chase truck, or an unmarked rusty van with out-of-state plates? DKIM is like the wax seal on the envelope: Has the letter been tampered with or opened in transit? DMARC is the bank\'s published policy manual: It tells you, "If a letter claiming to be from Chase fails our courier check or wax seal, immediately shred it and incinerate it (Reject policy)."',
        keyTakeaway: 'Over 85% of corporate cyber breaches start with an email. Mastering email headers, email authentication records, and URL defanging protects the enterprise from credential harvesting and ransomware.'
      },
      corporateReality: {
        headline: 'Email Gateway Architecture, Header Analysis, and Safe Sandbox Detonation',
        deepDive: ["Enterprise email security flows through Secure Email Gateways (SEGs like Proofpoint, Mimecast, or Microsoft Defender for Office 365).","**Email Authentication Triad:**","1. **SPF (Sender Policy Framework):** A DNS TXT record (`v=spf1 ip4:192.0.2.1 include:_spf.google.com ~all`). The receiving mail server inspects the connecting MTA IP against the domain\\'s SPF record. Results: `Pass`, `Fail`, `SoftFail (~all)`, `Neutral`.","2. **DKIM (DomainKeys Identified Mail):** Uses public-key cryptography. The sender signs the email header and body (`DKIM-Signature: v=1; d=company.com; s=selector1; b=...`). The receiver fetches the public key from DNS (`selector1._domainkey.company.com`) and verifies the signature has not been altered.","3. **DMARC (Domain-based Message Authentication, Reporting, and Conformance):** Requires SPF and/or DKIM to not only pass, but **align** with the domain in the visible `From:` header. Policies: `p=none` (monitoring only), `p=quarantine` (deliver to junk), `p=reject` (drop at gateway).","**SOC Investigation Steps:**","- Read `Received:` headers from **bottom to top** (bottom represents the original sending mail server).","- Inspect `Return-Path:` (where bounce-backs go) vs `From:` (what the user sees).","- Extract and **defang** all indicators (`hxxps[://]evil[.]com`, `198[.]51[.]100[.]42`). Never click live links or open attachments on your host machine!","- Submit suspicious files/URLs to sandboxes (Any.Run, Hybrid Analysis, Joe Sandbox) or check reputation on VirusTotal."].join('\n'),
        architectureNotes: [
          'URL Rewriting / Time-of-Click Protection: SEGs wrap outbound URLs with protective redirects (`urldefense.proofpoint.com/...`) to inspect links at click time.',
          'MIME File Attachment Stripping: Block dangerous file extensions at gateway: `.exe`, `.scr`, `.iso`, `.vhd`, `.hta`, `.lnk`, and password-protected `.zip`.',
          'Automated Phishing Triage (SOAR): User report button ("Report Phishing") triggers automated header extraction, IOC scanning, and enterprise-wide inbox purging (ZAP - Zero-hour Auto Purge).',
          'Domain Spoofing Protection: External Sender Warning banners prepended to inbound emails originating from external MTAs.'
        ],
        realWorldCase: 'An adversary purchased look-alike domain `micros0ft-support[.]com`, configured valid SPF and DKIM on their own rogue mail server, and emailed finance users demanding an urgent password reset. While SPF and DKIM passed on their rogue domain, DMARC failed alignment with the genuine `microsoft.com` brand, and the SEG caught the newly registered domain (NRD) age (<3 days).'
      },
      cheatSheet: {
        title: 'Email Forensics & Authentication Cheat Sheet',
        description: 'Header fields, authentication mechanisms, and URL defanging conventions.',
        headers: ['Header / Parameter', 'Location', 'Purpose / Forensic Value', 'Red Flag Indicator'],
        rows: [
          {
            term: 'Received: from ...',
            description: 'MTA Hops',
            commandOrId: 'Header (Read bottom to top)',
            riskOrUsage: 'Bottom-most Received header reveals originating IP address of sender.',
            severity: 'High'
          },
          {
            term: 'Authentication-Results',
            description: 'Authentication verdicts',
            commandOrId: 'spf=pass/fail, dkim=pass/fail',
            riskOrUsage: 'SPF=fail or DMARC=fail indicates spoofing or unapproved sending relay.',
            severity: 'Critical'
          },
          {
            term: 'Return-Path',
            description: 'Bounce-back address',
            commandOrId: 'Envelope-From address',
            riskOrUsage: 'Mismatched Return-Path vs visible Header From: indicates spoofing.',
            severity: 'Medium'
          },
          {
            term: 'URL Defanging',
            description: 'Neutralize malicious links',
            commandOrId: 'http -> hxxp, . -> [.]',
            riskOrUsage: 'Prevents accidental clicks or automated link prefetching during investigations.',
            severity: 'Low'
          },
          {
            term: 'DKIM-Signature',
            description: 'Cryptographic header/body seal',
            commandOrId: 'd=domain.com, s=selector',
            riskOrUsage: 'Invalid signature indicates header tampering or man-in-the-middle alteration.',
            severity: 'Medium'
          },
          {
            term: 'DMARC Policy',
            description: 'Enforcement directive',
            commandOrId: 'p=none | quarantine | reject',
            riskOrUsage: 'p=none allows spoofed emails to land directly in user inboxes without rejection.',
            severity: 'High'
          }
        ]
      },
      sandboxType: 'phishing-headers',
      sandboxConfig: {
        title: 'Phishing Email Header Analyzer & Defanger Utility',
        instructions: 'Paste or inspect raw email headers. Check SPF/DKIM/DMARC status, trace originating MTA IP, and use the 1-click Defanger tool to sanitize URLs and IPs.',
        defaultData: {
          sampleHeader: `Delivered-To: victim@enterprise-corp.com
Received: from mail-relay-02.enterprise-corp.com by internal-mta
Received: from mail.spoofed-invoice-system.com (198.51.100.220)
  by mail-relay-02.enterprise-corp.com with ESMTP id 89aBcDeF;
  Fri, 03 Oct 2026 15:30:12 +0000
Authentication-Results: enterprise-corp.com;
  spf=fail (sender IP 198.51.100.220 is not permitted by domain microsoft-billing.com);
  dkim=neutral (no key for signature);
  dmarc=fail (p=reject) header.from=microsoft-billing.com
From: "Microsoft Billing Dept" <billing@microsoft-billing.com>
Return-Path: <attacker@spoofed-invoice-system.com>
To: victim@enterprise-corp.com
Subject: URGENT: Your corporate cloud subscription has expired - Pay now
Content-Type: multipart/mixed; boundary="====boundary===="

Please review invoice: http://malicious-credential-harvest.ru/login.php?user=victim`,
          extractedIocs: [
            { original: 'http://malicious-credential-harvest.ru/login.php?user=victim', defanged: 'hxxp://malicious-credential-harvest[.]ru/login[.]php?user=victim', type: 'URL' },
            { original: '198.51.100.220', defanged: '198[.]51[.]100[.]220', type: 'IP' }
          ]
        }
      },
      incident: {
        id: 'inc-2130',
        ticketNumber: 'SEC-2130',
        title: 'Executive Phishing Lure with Malicious ISO Attachment and SPF Failure',
        severity: 'High',
        affectedAsset: 'VIP Inbox: cfo@enterprise-corp.com',
        timestamp: '2026-10-03 19:55:00 UTC',
        summary: 'User reported email claiming to be from "KPMG Auditing" with subject "Urgent Q3 Audit Deficiencies.iso". Gateway logs show SPF=fail and Return-Path pointing to a known Russian bulletproof host.',
        rawTelemetry: [
          'Received: from relay01.vps-bulletproof.ru (203.0.113.99) by edge.enterprise-corp.com',
          'Authentication-Results: spf=fail (IP 203.0.113.99 not in spf record for kpmg.com) dkim=none dmarc=fail',
          'From: "KPMG Senior Partner" <audits@kpmg.com>',
          'Return-Path: <bounce@relay01.vps-bulletproof.ru>',
          'Attachment: Q3_Audit_Report.iso (SHA256: 7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a)'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Direct brand spoofing of KPMG with failed SPF/DMARC authentication containing a weaponized container file (.ISO) designed to bypass Mark-of-the-Web (MOTW).'
        },
        rootCauseOptions: {
          options: [
            'Adversary conducting targeted spear-phishing using an ISO container attachment to deliver malware and evade Mark-of-the-Web inspection.',
            'Legitimate KPMG auditor sending their quarterly financial review from a personal laptop.',
            'Automated email notification from the internal accounting portal.',
            'Spam email promoting marketing webinars.'
          ],
          correctIndex: 0,
          explanation: 'ISO attachments are commonly used by threat actors to deliver malware because when mounted in Windows, nested files often do not inherit the internet Mark-of-the-Web (MOTW) flag.'
        },
        containmentOptions: {
          options: [
            'Execute Zero-Hour Auto Purge (ZAP) to purge the email across all enterprise mailboxes, block sender IP 203.0.113.99 and attachment hash on EDR/gateways, check if the CFO opened the attachment, and reset credentials if entered.',
            'Reply to the email telling the sender they have an invalid SPF record.',
            'Forward the attachment to all other executives to warn them.',
            'Mark the ticket as resolved because the email landed in the user inbox.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires immediate enterprise-wide mail search and purge (ZAP), EDR indicator blocking, endpoint triage of the recipient, and threat intelligence logging.'
        },
        mitreTechniques: ['T1566.001 - Phishing: Spearphishing Attachment', 'T1553.005 - Subvert Trust Controls: Mark-of-the-Web Bypass'],
        slaMinutes: 30
      },
      flashcards: [
        {
          id: 'fc-2-10',
          question: 'What is the purpose of URL defanging, and how do you defang `http://evil.com/login` and IP `192.168.1.1`?',
          category: 'Phishing Forensics',
          difficulty: 'Junior',
          modelAnswer: 'URL defanging modifies malicious or suspicious links and IP addresses so that they cannot be accidentally clicked by analysts or automatically pre-fetched by web browsers, email clients, or security tools. The standard convention replaces "http" with "hxxp" and places square brackets around periods. For example: `http://evil.com/login` becomes `hxxp://evil[.]com/login`, and `192.168.1.1` becomes `192[.]168[.]1[.]1`.',
          scoringTips: ['Explain prevention of accidental clicking/previewing.', 'Show hxxp replacement.', 'Show bracketed dots [.] convention.'],
          corporateContext: 'Basic operational hygiene tested in every SOC candidate interview.'
        },
        {
          id: 'fc-2-11',
          question: 'Why do attackers use container formats like `.ISO` or `.VHD` instead of raw `.EXE` files in phishing emails?',
          category: 'Adversary TTPs',
          difficulty: 'Mid',
          modelAnswer: 'Attackers use `.ISO` and `.VHD` disk image files for two key reasons: 1) Secure Email Gateways often permit container formats while blocking direct `.EXE` executables, and 2) In older versions of Windows, when a user double-clicks an ISO, the OS mounts it as a virtual drive. Files inside the mounted volume historically did NOT inherit the NTFS Alternate Data Stream "Mark of the Web" (Zone.Identifier), bypassing Windows Defender SmartScreen security warnings.',
          scoringTips: ['Mention evasion of gateway executable filters.', 'Mention virtual drive auto-mounting in Windows.', 'Explain Mark of the Web (MOTW) bypass mechanism.'],
          corporateContext: 'Critical for analysts handling modern initial access campaigns.'
        },
        {
          id: 'fc-2-12',
          question: 'Explain how DMARC alignment works and why an email can pass both SPF and DKIM individually yet still fail DMARC.',
          category: 'Email Security',
          difficulty: 'Senior',
          modelAnswer: 'DMARC enforces domain alignment between the visible "From:" header domain (RFC 5322) and the domain validated by SPF (RFC 5321 Return-Path) or DKIM (`d=` tag). An attacker can set up their own server with valid SPF for `evil.com` and valid DKIM for `evil.com`. If they send an email with visible header `From: support@paypal.com`, SPF passes for `evil.com` and DKIM passes for `evil.com`. However, because neither matches `paypal.com`, DMARC alignment FAILS, allowing the receiving gateway to reject the spoofed message.',
          scoringTips: ['Define DMARC alignment between Header From and SPF/DKIM domains.', 'Give the attacker-controlled domain scenario.', 'Explain why individual passes do not prevent spoofing without alignment.'],
          corporateContext: 'A differentiator question for Senior SOC analysts and email security architects.'
        }
      ],
      quiz: [
        {
          id: 'q-2-10',
          question: 'When reading raw email headers to locate the original sending server IP address, in which direction should an analyst read the `Received:` headers?',
          options: [
            'From top to bottom (the top header is the originating sender)',
            'From bottom to top (the bottom-most Received header is closest to the originating sender)',
            'Only read the Subject line',
            'In alphabetical order of header names'
          ],
          correctIndex: 1,
          explanation: 'Each mail transfer agent (MTA) prepends a new `Received:` header at the very top. Therefore, reading from bottom to top reconstructs the chronological hop path from sender to recipient.'
        },
        {
          id: 'q-2-11',
          question: 'Which DMARC policy instructs receiving mail servers to outright drop and reject any message that fails authentication and alignment?',
          options: ['p=none', 'p=quarantine', 'p=reject', 'p=monitor'],
          correctIndex: 2,
          explanation: 'The `p=reject` policy is the strictest DMARC enforcement level, instructing receiving mail gateways to completely reject the message at SMTP connection time.'
        },
        {
          id: 'q-2-12',
          question: 'What is the defanged format of the malicious URL `https://phish.target.com/login`?',
          options: [
            'https://phish.target.com/login!safe',
            'hxxps://phish[.]target[.]com/login',
            'ftp://phish.target.com/login',
            'http://127.0.0.1/login'
          ],
          correctIndex: 1,
          explanation: 'Standard defanging protocol replaces `https` with `hxxps` and wraps periods in brackets `[.]` to prevent accidental clickability or automated DNS resolution.'
        }
      ]
    }
  ]
};
