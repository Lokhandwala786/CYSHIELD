import { Phase } from '../../types/curriculum';

export const phase5: Phase = {
  id: 'phase-5',
  phaseNumber: 5,
  title: 'Cloud Security Fundamentals (AWS)',
  description: 'Master AWS Identity & Access Management (IAM) evaluation logic, stateful Security Groups vs stateless NACLs, VPC Flow Logs, and CloudTrail forensic investigation.',
  iconName: 'Cloud',
  badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  topics: [
    {
      id: 'cloud-iam',
      phaseId: 'phase-5',
      title: 'AWS Identity & Access Management (IAM)',
      subtitle: 'Principle of Least Privilege, Roles vs Users, Policy Evaluation Logic, & MFA',
      estimatedMinutes: 30,
      iconName: 'Key',
      analogy: {
        headline: 'The Master Keycard Office & Diplomatic Security Badges',
        story: 'In an ultra-secure government research facility, there is a Master Red Key that can open every vault and launch every missile (the AWS Root Account). You lock that key in a biometric safe, spin the dial, and NEVER use it for daily tasks. Instead, every employee receives an individual card with only the room doors they need (Principle of Least Privilege). When a scientist needs to walk into the radiation lab for 1 hour, they don\'t carry a permanent key; they check out a temporary hazmat badge that expires in 60 minutes (an IAM Role assumed via AWS STS). If an access policy says "DENY entering the vault" anywhere in writing, that rule instantly overrides 100 other cards that say "Allow" (Explicit Deny evaluation logic).',
        keyTakeaway: 'In the cloud, Identity is the new perimeter. The easiest way for an attacker to compromise your enterprise is not breaking your encryption, but finding an overprivileged IAM Access Key leaked on GitHub.'
      },
      corporateReality: {
        headline: 'IAM Policy Evaluation Logic, CloudTrail Key Audits, and Role Assumption',
        deepDive: ["AWS IAM security fundamentals:","- **IAM Policy Evaluation Algorithm:**","  1. Default: All requests are **Denied** by default (implicit deny).","  2. If an **Explicit Deny** exists anywhere across Identity-based policies, Resource-based policies, Permissions Boundaries, or SCPs (Service Control Policies), the request is immediately **DENIED** (Explicit Deny always wins).","  3. If an **Explicit Allow** exists and NO explicit deny exists, the request is **ALLOWED**.","- **IAM Users vs Roles vs Temporary Credentials:**","  - *IAM Users:* Long-term credentials (Access Key ID `AKIA...` and Secret Access Key). High risk of credential leakage. Corporate policy mandates migrating users to SSO/IdP (Okta, Azure AD) via AWS IAM Identity Center.","  - *IAM Roles:* Temporary credentials (`ASIA...`) generated via AWS STS (Security Token Service) using `sts:AssumeRole`. Used by EC2 instances (instance profiles), Lambda functions, and cross-account administrators. No hardcoded keys.","- **Root Account Hardening:**","  - Zero access keys allowed on the root account.","  - Hardware FIDO2 multi-factor authentication (YubiKey) required.","  - Dedicated CloudWatch alarm triggering a P1 SOC alert if the root account ever logs in."].join('\n'),
        architectureNotes: [
          'Service Control Policies (SCPs): Enforce organizational guardrails in AWS Organizations (e.g. deny unapproved AWS regions or prevent disabling CloudTrail).',
          'Permission Boundaries: Maximum permissions an IAM entity can ever possess, preventing junior admins from escalating their own privileges.',
          'Access Key Rotation: Enforce automated 90-day key rotation; alert on any access key unused for >30 days.',
          'Credential Exposure Automation: AWS Health / GuardDuty automatically detects leaked access keys committed to public GitHub repositories and triggers automated lambda revocation within 60 seconds.'
        ],
        realWorldCase: 'A junior developer committed an AWS access key pair (`AKIA...`) to a public GitHub repo at 02:00 AM. Within 4 minutes, automated adversary scrapers detected the key, called `sts:GetCallerIdentity`, launched 40 GPU EC2 instances across 5 regions for Monero cryptocurrency mining, and racked up $38,000 in compute charges before AWS GuardDuty notified the SOC.'
      },
      cheatSheet: {
        title: 'AWS IAM Policy Structure & Evaluation Reference',
        description: 'JSON policy syntax, policy elements, and evaluation precedence rules.',
        headers: ['Policy Element / Concept', 'JSON Syntax', 'Function & Purpose', 'Security Best Practice'],
        rows: [
          {
            term: 'Effect',
            description: '"Effect": "Allow" | "Deny"',
            commandOrId: 'Evaluation outcome',
            riskOrUsage: 'Explicit Deny always overrides any Allow rule across all scopes.',
            severity: 'Critical'
          },
          {
            term: 'Action',
            description: '"Action": ["s3:GetObject", "s3:ListBucket"]',
            commandOrId: 'API operations',
            riskOrUsage: 'Never use wildcard `"Action": "*"` on production roles.',
            severity: 'High'
          },
          {
            term: 'Resource',
            description: '"Resource": "arn:aws:s3:::prod-vault/*"',
            commandOrId: 'Target AWS ARN',
            riskOrUsage: 'Constrain to exact ARNs rather than wildcard `"Resource": "*"`.',
            severity: 'High'
          },
          {
            term: 'Condition',
            description: '"Condition": {"Bool": {"aws:MultiFactorAuthPresent": "true"}}',
            commandOrId: 'Contextual constraints',
            riskOrUsage: 'Enforce MFA presence, source IP subnet restrictions, or TLS versions.',
            severity: 'Medium'
          },
          {
            term: 'Access Key Prefix',
            description: 'AKIA... (Long-term) vs ASIA... (Temporary STS)',
            commandOrId: 'Key Identifier',
            riskOrUsage: 'AKIA indicates static user credentials; ASIA indicates temporary role session.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'iam-evaluator',
      sandboxConfig: {
        title: 'AWS IAM Policy Evaluation Sandbox',
        instructions: 'Test JSON IAM policies against specific API requests (e.g. `s3:GetObject`, `ec2:TerminateInstances`, `iam:CreateUser`). Observe real-time evaluation logic: Explicit Deny vs Explicit Allow vs Default Deny.',
        defaultData: {
          policies: [
            {
              name: 'Developer-S3-Policy',
              json: {
                Version: '2012-10-17',
                Statement: [
                  { Effect: 'Allow', Action: ['s3:GetObject', 's3:ListBucket'], Resource: 'arn:aws:s3:::dev-assets/*' },
                  { Effect: 'Deny', Action: 's3:DeleteObject', Resource: '*' }
                ]
              }
            }
          ],
          testRequests: [
            { action: 's3:GetObject', resource: 'arn:aws:s3:::dev-assets/image.png', expectedVerdict: 'ALLOW' },
            { action: 's3:DeleteObject', resource: 'arn:aws:s3:::dev-assets/image.png', expectedVerdict: 'DENY (Explicit Deny)' },
            { action: 's3:PutObject', resource: 'arn:aws:s3:::dev-assets/image.png', expectedVerdict: 'DENY (Default Implicit Deny)' }
          ]
        }
      },
      incident: {
        id: 'inc-5010',
        ticketNumber: 'SEC-5010',
        title: 'AWS Root Account Console Login Without MFA During Non-Business Hours',
        severity: 'Critical',
        affectedAsset: 'AWS Master Account (ID: 112233445566)',
        timestamp: '2026-10-03 23:05:00 UTC',
        summary: 'CloudWatch Metric Alarm `Alert-Root-Account-Usage` triggered: Root account console login detected from IP 198.51.100.200 (ASN located in Eastern Europe) with `additionalEventData.MFAUsed = "No"`.',
        rawTelemetry: [
          '2026-10-03T23:04:12Z CloudTrail eventName="ConsoleLogin" eventSource="signin.amazonaws.com"',
          'userIdentity: {"type": "Root", "principalId": "112233445566", "arn": "arn:aws:iam::112233445566:root", "accountId": "112233445566"}',
          'sourceIPAddress: "198.51.100.200"',
          'additionalEventData: {"LoginTo": "https://console.aws.amazon.com", "MobileVersion": "No", "MFAUsed": "No"}',
          'Subsequent Event: eventName="CreateAccessKey" userName="root" (Generated AKIA... key)'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Root account access without MFA from an unrecognized external IP generating long-term API access keys indicates a total cloud account compromise.'
        },
        rootCauseOptions: {
          options: [
            'Adversary compromised the master AWS Root password, authenticated without MFA, and generated a root API access key to establish persistent backdoor control.',
            'Cloud security engineer performing routine quarterly password audit.',
            'Automated AWS bill payment processing.',
            'AWS support technician troubleshooting a service outage.'
          ],
          correctIndex: 0,
          explanation: 'The CloudTrail telemetry confirms root login, no MFA, foreign source IP, and immediate execution of `CreateAccessKey` under the root identity.'
        },
        containmentOptions: {
          options: [
            'Immediately delete the newly created root access key, change the root password, attach a hardware FIDO2 MFA token, terminate all active AWS console sessions, and review CloudTrail for newly spun up EC2 instances or S3 exfiltration.',
            'Email the AWS billing department to check if invoices were paid.',
            'Close the ticket and wait to see what the attacker does next.',
            'Delete the entire AWS Organization.'
          ],
          correctIndex: 0,
          explanation: 'Root compromise is a P1 disaster: immediately revoke the created access key, reset the root password, bind hardware MFA, revoke active sessions, and initiate complete CloudTrail audit.'
        },
        mitreTechniques: [
          'T1078.004 - Valid Accounts: Cloud Accounts',
          'T1098 - Account Manipulation: Additional Cloud Credentials'
        ],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-5-1',
          question: 'In AWS IAM, what is the policy evaluation order between Explicit Allow, Explicit Deny, and Implicit (Default) Deny?',
          category: 'Cloud IAM',
          difficulty: 'Junior',
          modelAnswer: 'The AWS IAM policy evaluation order follows a strict hierarchy: 1) By default, all requests are implicitly denied (Default Deny). 2) If ANY policy (identity-based, resource-based, SCP, or boundary) contains an **Explicit Deny** that matches the request, the final decision is immediately **DENIED**, overriding any allows. 3) If there is an **Explicit Allow** and NO explicit deny, the request is **ALLOWED**. If neither exists, it remains denied.',
          scoringTips: ['State default is implicit deny.', 'Explicit Deny ALWAYS trumps Explicit Allow.', 'Explain that an explicit allow is required to grant access.'],
          corporateContext: 'A core test of IAM policy architecture understanding.'
        },
        {
          id: 'fc-5-2',
          question: 'Why should AWS IAM Access Keys starting with `AKIA` NEVER be hardcoded into applications or stored on developer laptops?',
          category: 'Cloud Security',
          difficulty: 'Junior',
          modelAnswer: 'Access keys starting with `AKIA` are long-term static credentials tied to IAM users. Unlike temporary credentials, they never expire unless manually deleted or rotated. If a developer accidentally commits code to a public GitHub repo or their laptop is compromised by malware, attackers obtain perpetual access to the cloud environment. Best practice dictates using IAM Roles with temporary credentials (`ASIA...`) via Instance Profiles, ECS Task Roles, or AWS IAM Identity Center (SSO).',
          scoringTips: ['Define AKIA as long-term, non-expiring credentials.', 'Explain risk of public git exposure and malware theft.', 'Mention IAM Roles and temporary credentials (ASIA) as the solution.'],
          corporateContext: 'Major cause of real-world cloud ransomware and crypto-mining breaches.'
        },
        {
          id: 'fc-5-3',
          question: 'What is the purpose of an IAM Permissions Boundary, and how does it prevent privilege escalation by delegated administrators?',
          category: 'Cloud Architecture',
          difficulty: 'Senior',
          modelAnswer: 'An IAM Permissions Boundary is an advanced policy that sets the MAXIMUM allowable permissions an IAM entity (user or role) can possess, regardless of what identity-based policies are attached. If a delegated team administrator is given permission to create new IAM roles for developers, they could theoretically create a role with `AdministratorAccess` and assume it to escalate their own privileges. By attaching a Permissions Boundary, the organization enforces that any role created can never exceed the boundary, neutralizing the privilege escalation vector.',
          scoringTips: ['Define boundary as the maximum ceiling of permissions.', 'Explain delegation of role creation to junior admins.', 'Explain how it prevents privilege escalation to Administrator.'],
          corporateContext: 'Essential design pattern for enterprise multi-account AWS architectures.'
        }
      ],
      quiz: [
        {
          id: 'q-5-1',
          question: 'If an IAM User has an attached policy allowing `s3:GetObject` on all buckets, but a Service Control Policy (SCP) explicitly denies `s3:*` in that AWS account, what is the final access decision when the user attempts to download an S3 file?',
          options: [
            'Allowed, because user identity policies override organization SCPs.',
            'Denied, because an Explicit Deny in any applicable policy (including SCPs) permanently overrides all allows.',
            'Allowed, but only during business hours.',
            'The request triggers an automated EC2 reboot.'
          ],
          correctIndex: 1,
          explanation: 'In AWS, an Explicit Deny anywhere in the policy evaluation path (Identity, Resource, Permissions Boundary, or SCP) immediately and unconditionally denies access.'
        },
        {
          id: 'q-5-2',
          question: 'What type of AWS credential begins with the prefix `ASIA`?',
          options: [
            'A long-term root account access key',
            'A temporary security credential generated via AWS Security Token Service (STS) / IAM Role assumption',
            'An SSL certificate issued by Amazon Certificate Manager',
            'An Amazon S3 bucket identifier'
          ],
          correctIndex: 1,
          explanation: '`ASIA` prefixes indicate temporary credentials provided by AWS STS through role assumption, containing an expiration time and session token.'
        },
        {
          id: 'q-5-3',
          question: 'What is the security recommendation for the AWS Root Account in enterprise environments?',
          options: [
            'Use it for daily administrative tasks with a strong password',
            'Lock it away with hardware MFA, delete all access keys, and alert the SOC immediately if a login occurs',
            'Share the credentials among all members of the DevOps team',
            'Disable CloudTrail auditing for the root user to save storage costs'
          ],
          correctIndex: 1,
          explanation: 'The Root account has unrestricted god-mode access across the AWS account; it should never have active access keys, must enforce hardware MFA, and any usage must trigger a high-severity SOC alert.'
        }
      ]
    },
    {
      id: 'cloud-vpc-network',
      phaseId: 'phase-5',
      title: 'Cloud Network Boundaries: VPC, SGs & NACLs',
      subtitle: 'Stateful Security Groups vs Stateless NACLs & VPC Flow Log Analysis',
      estimatedMinutes: 30,
      iconName: 'Shield',
      analogy: {
        headline: 'The Gated Apartment Complex vs The Individual Smart Front-Door Lock',
        story: 'Imagine a private gated condominium community. At the outer perimeter fence, there is a guard booth checking every single car coming in AND every single car going out (Stateless Network ACL at the subnet boundary). If the guard lets a delivery truck in, the guard does NOT automatically remember the truck—the truck must be checked again against the exit rule list on the way out! But once the visitor arrives at your private apartment door, you have a smart lock (Stateful Security Group at the instance boundary). If you invite someone inside your apartment, your smart lock automatically opens to let them walk back out without asking for their ID a second time (Stateful return traffic).',
        keyTakeaway: 'Security Groups are stateful and attach to EC2 network interfaces (ENIs). NACLs are stateless, operate at the subnet layer, and require explicit inbound and outbound rules for ephemeral return ports.'
      },
      corporateReality: {
        headline: 'Cloud Network Segmentation, Micro-Perimeters, and VPC Flow Logs Forensics',
        deepDive: ["Enterprise cloud networking defense principles:","- **Security Groups (Instance Level):**","  - **Stateful:** If an inbound rule permits traffic (e.g. port 443), return outbound response traffic is automatically allowed regardless of outbound rules.","  - Supports **Allow rules only** (no explicit deny rules).","  - Can reference other Security Groups as source/destination (enabling dynamic micro-segmentation, e.g. \"Allow Port 3306 from `sg-web-tier`\").","- **Network Access Control Lists (NACLs - Subnet Level):**","  - **Stateless:** Return traffic is NOT automatically tracked. Inbound and outbound must be explicitly defined.","  - Supports both **Allow and Deny rules**.","  - Evaluated in numerical order (Rule 100, 200, ... * Default Deny). First match applies.","  - **Ephemeral Port Gotcha:** If inbound traffic comes from a web client on port 443, the outbound NACL MUST allow return traffic to ephemeral ports (`1024-65535`).","- **VPC Flow Logs Format:**","  - Standard schema: `<version> <account-id> <interface-id> <srcaddr> <dstaddr> <srcport> <dstport> <protocol> <packets> <bytes> <start> <end> <action> <log-status>`.","  - Actions: `ACCEPT` (permitted by both SG and NACL) vs `REJECT` (blocked by either SG or NACL)."].join('\n'),
        architectureNotes: [
          'Micro-Segmentation: Never allow open subnet communication. Web tier communicates only with App tier; App tier communicates only with DB tier on specific database ports.',
          'NACL Blocklists: Use NACLs to quickly block known malicious IP blocks or scanning ranges across entire subnets with a single low-numbered Deny rule.',
          'VPC Egress Filtering: Route all outbound internet traffic through an AWS Network Firewall or Squid proxy to prevent reverse shell callbacks.',
          'Flow Log Ingestion: Stream VPC Flow Logs to Amazon Athena or SIEM (Splunk/Sentinel) for automated network behavioral analysis.'
        ],
        realWorldCase: 'During an attack, an external adversary breached a public web server and attempted to pivot to the internal MySQL database (`10.0.3.50:3306`). The SOC observed thousands of `REJECT` lines in VPC Flow Logs because the database Security Group only allowed inbound 3306 from the specific security group `sg-app-servers`, thwarting the lateral movement.'
      },
      cheatSheet: {
        title: 'Security Groups vs Network ACLs Comparison',
        description: 'Complete architectural differences between AWS SGs and NACLs.',
        headers: ['Feature', 'Security Group (SG)', 'Network ACL (NACL)', 'SOC Triage Significance'],
        rows: [
          {
            term: 'Scope / Boundary',
            description: 'Network Interface (ENI / Instance)',
            commandOrId: 'Subnet Boundary',
            riskOrUsage: 'SGs protect individual workloads; NACLs protect the whole subnet.',
            severity: 'Low'
          },
          {
            term: 'Statefulness',
            description: 'Stateful',
            commandOrId: 'Stateless',
            riskOrUsage: 'NACLs require outbound ephemeral port rules (1024-65535) for return traffic.',
            severity: 'Medium'
          },
          {
            term: 'Rule Types Supported',
            description: 'Allow rules only',
            commandOrId: 'Allow AND Deny rules',
            riskOrUsage: 'Use NACLs for immediate emergency IP / subnet blocking.',
            severity: 'High'
          },
          {
            term: 'Rule Evaluation Order',
            description: 'All rules evaluated collectively',
            commandOrId: 'Numbered order (lowest number first)',
            riskOrUsage: 'NACL stops processing on first rule match; order matters.',
            severity: 'Medium'
          },
          {
            term: 'VPC Flow Log Action',
            description: 'REJECT if blocked by SG or NACL',
            commandOrId: 'ACCEPT only if both allow',
            riskOrUsage: 'Spikes of REJECTs identify port scans or blocked lateral movement.',
            severity: 'High'
          }
        ]
      },
      sandboxType: 'vpc-flow',
      sandboxConfig: {
        title: 'VPC Network & Flow Log Inspector',
        instructions: 'Parse simulated raw AWS VPC Flow Logs. Filter by ACCEPT/REJECT status, spot port scanning on Port 22, and detect unauthorized lateral connections.',
        defaultData: {
          flowLogs: [
            { version: 2, accountId: '112233445566', eni: 'eni-01a2b3c4', src: '198.51.100.88', dst: '10.0.1.15', srcPort: 49120, dstPort: 22, proto: 6, packets: 1, bytes: 40, action: 'REJECT', verdict: 'Blocked by Security Group (No SSH from Public)' },
            { version: 2, accountId: '112233445566', eni: 'eni-01a2b3c4', src: '198.51.100.88', dst: '10.0.1.15', srcPort: 49121, dstPort: 22, proto: 6, packets: 1, bytes: 40, action: 'REJECT', verdict: 'Blocked by Security Group' },
            { version: 2, accountId: '112233445566', eni: 'eni-01a2b3c4', src: '203.0.113.50', dst: '10.0.1.15', srcPort: 52144, dstPort: 443, proto: 6, packets: 15, bytes: 3200, action: 'ACCEPT', verdict: 'Legitimate HTTPS Web Traffic' },
            { version: 2, accountId: '112233445566', eni: 'eni-09f8e7d6', src: '10.0.1.15', dst: '10.0.3.50', srcPort: 41200, dstPort: 3306, proto: 6, packets: 42, bytes: 8400, action: 'REJECT', verdict: 'Suspicious Lateral Movement Probe to Database Tier Blocked' }
          ]
        }
      },
      incident: {
        id: 'inc-5045',
        ticketNumber: 'SEC-5045',
        title: 'VPC Flow Log Anomaly: Port 22 Probe Burst Followed by DB Ingress Accept',
        severity: 'High',
        affectedAsset: 'VPC-PROD (10.0.0.0/16)',
        timestamp: '2026-10-03 23:25:00 UTC',
        summary: 'Athena Flow Log query flagged 2,500 REJECT events on Port 22 from external IP 198.51.100.77, followed immediately by ACCEPT packets on port 8080 where security group `sg-jenkins` was accidentally updated with `0.0.0.0/0`.',
        rawTelemetry: [
          '2 112233445566 eni-088a7b6c 198.51.100.77 10.0.2.80 54122 8080 6 85 14200 1727997600 1727997660 ACCEPT OK',
          'CloudTrail check: eventName="AuthorizeSecurityGroupIngress" userName="dev_intern" parameters="IpPermissions: [{FromPort: 8080, ToPort: 8080, IpProtocol: tcp, IpRanges: [{CidrIp: 0.0.0.0/0}]}]"',
          'Outbound Flow: 2 112233445566 eni-088a7b6c 10.0.2.80 198.51.100.77 41200 4444 6 120 18400 ACCEPT OK (Reverse Shell callback)'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Overly permissive security group change (`0.0.0.0/0` on port 8080) allowed an external attacker to exploit Jenkins and trigger an outbound reverse shell on port 4444.'
        },
        rootCauseOptions: {
          options: [
            'Security group misconfiguration exposed internal Jenkins CI server to the public internet, allowing remote exploitation and an outbound reverse shell.',
            'Developer pushing code to GitHub repository.',
            'VPC Flow Log software generating false alarms.',
            'Routine AWS internal system health check.'
          ],
          correctIndex: 0,
          explanation: 'The CloudTrail log reveals `AuthorizeSecurityGroupIngress` opened port 8080 to `0.0.0.0/0`, immediately followed by inbound ACCEPT traffic and an outbound reverse shell connection to port 4444.'
        },
        containmentOptions: {
          options: [
            'Immediately revoke the `0.0.0.0/0` ingress rule from security group `sg-jenkins`, isolate the EC2 instance network interface, terminate active reverse shell socket, and place an emergency NACL block on IP 198.51.100.77.',
            'Turn off VPC Flow Logs to stop the alerts.',
            'Allow the reverse shell to run to see what the attacker wants.',
            'Reboot the entire AWS VPC.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires immediate remediation of the open security group rule, isolating the compromised Jenkins instance, terminating the reverse shell, and applying a subnet NACL block.'
        },
        mitreTechniques: [
          'T1190 - Exploit Public-Facing Application',
          'T1562.007 - Impair Defenses: Disable Cloud Security Tools',
          'T1071.001 - Web Protocols'
        ],
        slaMinutes: 30
      },
      flashcards: [
        {
          id: 'fc-5-4',
          question: 'What does it mean that an AWS Security Group is "Stateful" while a Network ACL (NACL) is "Stateless"?',
          category: 'Cloud Networking',
          difficulty: 'Junior',
          modelAnswer: 'A Security Group is **Stateful**, meaning connection state is automatically remembered by the hypervisor. If an inbound packet is allowed in (e.g. on port 443), the return response packet from the server is automatically allowed back out, regardless of what outbound rules exist. A Network ACL is **Stateless**, meaning it evaluates every single packet independently with no memory of connection state. For a web server behind a NACL to receive inbound HTTPS (port 443) and return data to the client, you must explicitly create an Inbound rule allowing port 443 AND an Outbound rule allowing ephemeral return ports (`1024-65535`).',
          scoringTips: ['Stateful automatically permits return traffic.', 'Stateless does not track connections.', 'Explain ephemeral port requirement for NACL outbound rules.'],
          corporateContext: 'A classic question used in almost every AWS cloud security interview.'
        },
        {
          id: 'fc-5-5',
          question: 'Why can you not write an "Explicit Deny" rule inside an AWS Security Group?',
          category: 'AWS Architecture',
          difficulty: 'Mid',
          modelAnswer: 'AWS Security Groups are designed exclusively around an "Allow-list" model; they do NOT support Deny rules. If a packet does not match any configured Allow rule, it is dropped by default. If you need to explicitly deny or block a specific malicious IP address or CIDR range before it reaches your subnets, you must use a **Network ACL (NACL)**, which explicitly supports numbered Allow and Deny rules evaluated in sequential order.',
          scoringTips: ['SGs only support Allow rules; unallowed traffic is dropped by default.', 'Explain that NACLs must be used for explicit Deny rules.', 'Explain the architectural role of each layer.'],
          corporateContext: 'Essential distinction when designing emergency perimeter containment rules in the cloud.'
        },
        {
          id: 'fc-5-6',
          question: 'In an AWS VPC Flow Log record, what does `action=REJECT` indicate, and can it distinguish between an SG drop vs a NACL drop?',
          category: 'Cloud Forensics',
          difficulty: 'Mid',
          modelAnswer: 'In VPC Flow Logs, `action=REJECT` indicates that the packet was blocked by either a Security Group (because no matching allow rule existed) OR by a Network ACL (due to an explicit Deny rule or hitting the default deny rule). VPC Flow Logs do NOT natively indicate WHICH of the two mechanisms caused the rejection. To determine which dropped the packet, an analyst must correlate the packet direction and ports against the specific SG and NACL configurations applied to that Elastic Network Interface (ENI).',
          scoringTips: ['REJECT means dropped by either SG or NACL.', 'Flow logs do not differentiate which one caused the drop.', 'Explain the need to cross-check ENI security configurations.'],
          corporateContext: 'Tests practical forensic knowledge of AWS network telemetry limitations.'
        }
      ],
      quiz: [
        {
          id: 'q-5-4',
          question: 'When an inbound HTTP request arrives at an EC2 instance protected by a stateless Network ACL, which port range must be permitted in the OUTBOUND NACL rules to allow the web server to send response data back to the client?',
          options: [
            'Port 80 only',
            'Port 443 only',
            'Ephemeral ports (1024 - 65535)',
            'Port 22 only'
          ],
          correctIndex: 2,
          explanation: 'Client web browsers initiate connections from randomized dynamic ephemeral source ports (1024-65535). Because NACLs are stateless, return traffic must be explicitly permitted to these ephemeral ports.'
        },
        {
          id: 'q-5-5',
          question: 'Which AWS service records network IP traffic going to and from network interfaces across your Virtual Private Cloud (VPC)?',
          options: ['AWS CloudTrail', 'AWS VPC Flow Logs', 'AWS Shield', 'Amazon Macie'],
          correctIndex: 1,
          explanation: 'VPC Flow Logs capture network telemetry (IP addresses, ports, protocols, packet and byte counts, and ACCEPT/REJECT verdicts) across VPC network interfaces.'
        },
        {
          id: 'q-5-6',
          question: 'How are rules evaluated inside a Network Access Control List (NACL)?',
          options: [
            'All rules are evaluated simultaneously with equal priority',
            'In numerical order starting from the lowest rule number, stopping as soon as a matching rule is found',
            'In alphabetical order of rule names',
            'Only the highest numbered rule is evaluated'
          ],
          correctIndex: 1,
          explanation: 'NACLs process rules in strict numerical ascending order (e.g. rule 100 before rule 200). The first rule that matches the packet determines the outcome, and evaluation halts.'
        }
      ]
    },
    {
      id: 'cloud-auditing-siem',
      phaseId: 'phase-5',
      title: 'Cloud Auditing & SIEM: CloudTrail & CloudWatch',
      subtitle: 'API Activity Monitoring, Multi-Region Trails, Metric Alarms, & SIEM Integration',
      estimatedMinutes: 30,
      iconName: 'Eye',
      analogy: {
        headline: 'The Unalterable 360-Degree CCTV Security Cameras & Tripwire Alarms',
        story: 'Imagine walking into a high-security bank vault where invisible 360-degree cameras record every single breath, touch, and button pressed in high-definition (AWS CloudTrail). If anyone turns a knob, opens a locker, or writes a check, CloudTrail writes an indelible record: Who did it (Identity ARN), What door they touched (API eventName), What time they arrived (EventTime), and Where they were standing (SourceIPAddress). Meanwhile, CloudWatch is the automated tripwire laser alarm system: If anyone attempts to enter after midnight without their badge, the laser instantly rings the police station and triggers automatic steel lockdown shutters (CloudWatch Alarm & SNS notification).',
        keyTakeaway: 'In AWS, literally everything is an API call. CloudTrail records every API call made via console, SDK, or CLI. If an attacker moves in your cloud, CloudTrail is where their footprints are captured.'
      },
      corporateReality: {
        headline: 'CloudTrail Log Integrity, Athena Hunting, and SIEM Ingestion Pipelines',
        deepDive: ["Enterprise cloud auditing architecture:","- **AWS CloudTrail Fundamentals:**","  - *Management Events:* Control plane operations (e.g. `CreateBucket`, `RunInstances`, `AttachUserPolicy`, `ConsoleLogin`).","  - *Data Events:* High-volume data plane operations (e.g. S3 `GetObject`/`PutObject`, Lambda `InvokeFunction`).","  - *Multi-Region Trails:* Mandatory enterprise baseline. If an adversary attacks an unused region (e.g. `eu-west-3`), a single-region trail in `us-east-1` will be completely blind.","  - *Log File Validation:* Uses SHA-256 and RSA digital signatures with digest files to detect if logs were tampered with or deleted.","  - *S3 Bucket MFA Delete:* Protects the CloudTrail destination S3 bucket from being deleted by a compromised admin account.","- **Critical CloudTrail Fields for SOC Analysts:**","  - `eventName`: Exact AWS API action (e.g. `StopLogging`, `CreateAccessKey`, `AuthorizeSecurityGroupIngress`).","  - `userIdentity`: ARN, accountId, principalId, assumed role details.","  - `sourceIPAddress`: IP address of caller (or AWS internal service name).","  - `userAgent`: Calling client (AWS CLI `aws-cli/2.0`, Python SDK `boto3`, Terraform, or browser).","  - `errorCode` / `errorMessage`: `AccessDenied` or `UnauthorizedOperation` spikes reveal automated enumeration.","- **CloudWatch Alarms & Metric Filters:**","  - Metric filter on unauthorized API calls: `{($.errorCode = \"*UnauthorizedOperation\") || ($.errorCode = \"AccessDenied*\")}`","  - Metric filter on console logins without MFA: `{($.eventName = \"ConsoleLogin\") && ($.additionalEventData.MFAUsed != \"Yes\")}`."].join('\n'),
        architectureNotes: [
          'Centralized Security Account: Aggregate CloudTrail logs from all AWS accounts in the Organization into an isolated, write-only S3 bucket in a dedicated Log Archive account.',
          'GuardDuty Integration: Amazon GuardDuty continuously analyzes CloudTrail management and data events using machine learning to detect compromised credentials and anomalous API spikes.',
          'SIEM Ingestion (Splunk / Sentinel): Forward CloudTrail S3 notifications via SQS (Simple Queue Service) to Splunk AWS Add-on for sub-minute detection alerting.',
          'EventBridge Automation: Trigger automated containment Lambda functions (e.g. detach IAM policy or isolate instance) in response to critical CloudTrail events.'
        ],
        realWorldCase: 'An adversary breached an AWS environment and immediately executed `cloudtrail:StopLogging` to blind the defenders. However, because the enterprise had a CloudWatch Metric Filter watching for `eventName = "StopLogging"`, an SNS alert woke the on-call SOC analyst within 90 seconds, who immediately severed the attacker\'s session.'
      },
      cheatSheet: {
        title: 'CloudTrail Event Schema & Critical Security Events',
        description: 'Key JSON fields, forensic significance, and top high-risk CloudTrail API events.',
        headers: ['CloudTrail API Event', 'Service', 'Forensic & Security Significance', 'Severity'],
        rows: [
          {
            term: 'ConsoleLogin',
            description: 'signin.amazonaws.com',
            commandOrId: 'MFAUsed == "No"',
            riskOrUsage: 'Detects unauthenticated password logins lacking MFA protection.',
            severity: 'High'
          },
          {
            term: 'StopLogging / DeleteTrail',
            description: 'cloudtrail.amazonaws.com',
            commandOrId: 'Defense Evasion',
            riskOrUsage: 'Adversary attempting to blind SOC visibility and erase audit trails.',
            severity: 'Critical'
          },
          {
            term: 'AttachUserPolicy / PutUserPolicy',
            description: 'iam.amazonaws.com',
            commandOrId: 'Privilege Escalation',
            riskOrUsage: 'Attaching `AdministratorAccess` policy to standard user accounts.',
            severity: 'Critical'
          },
          {
            term: 'CreateAccessKey',
            description: 'iam.amazonaws.com',
            commandOrId: 'Persistence',
            riskOrUsage: 'Generating new programmatic access keys for persistence.',
            severity: 'High'
          },
          {
            term: 'AuthorizeSecurityGroupIngress',
            description: 'ec2.amazonaws.com',
            commandOrId: 'Perimeter Tampering',
            riskOrUsage: 'Opening inbound firewall ports to `0.0.0.0/0`.',
            severity: 'High'
          },
          {
            term: 'GetCallerIdentity',
            description: 'sts.amazonaws.com',
            commandOrId: 'Cloud Discovery',
            riskOrUsage: 'Adversary\'s very first command to discover who they compromised.',
            severity: 'Medium'
          }
        ]
      },
      sandboxType: 'cloudtrail',
      sandboxConfig: {
        title: 'CloudTrail Forensic Log Investigator',
        instructions: 'Search and inspect simulated AWS CloudTrail JSON events. Hunt for unauthorized privilege escalation, identify compromised access keys, and detect defense evasion tactics.',
        defaultData: {
          events: [
            {
              eventTime: '2026-10-03T23:10:00Z',
              eventName: 'GetCallerIdentity',
              eventSource: 'sts.amazonaws.com',
              sourceIPAddress: '198.51.100.44',
              userAgent: 'aws-cli/2.15.0 Python/3.11 Linux/5.15',
              userIdentity: { type: 'IAMUser', userName: 'svc-backup', arn: 'arn:aws:iam::112233445566:user/svc-backup' },
              responseElements: { UserId: 'AIDA123...', Account: '112233445566', Arn: 'arn:aws:iam::112233445566:user/svc-backup' }
            },
            {
              eventTime: '2026-10-03T23:11:15Z',
              eventName: 'AttachUserPolicy',
              eventSource: 'iam.amazonaws.com',
              sourceIPAddress: '198.51.100.44',
              userAgent: 'aws-cli/2.15.0 Python/3.11 Linux/5.15',
              userIdentity: { type: 'IAMUser', userName: 'svc-backup', arn: 'arn:aws:iam::112233445566:user/svc-backup' },
              requestParameters: { userName: 'svc-backup', policyArn: 'arn:aws:iam::aws:policy/AdministratorAccess' },
              responseElements: null
            },
            {
              eventTime: '2026-10-03T23:12:00Z',
              eventName: 'StopLogging',
              eventSource: 'cloudtrail.amazonaws.com',
              sourceIPAddress: '198.51.100.44',
              userAgent: 'aws-cli/2.15.0 Python/3.11 Linux/5.15',
              userIdentity: { type: 'IAMUser', userName: 'svc-backup', arn: 'arn:aws:iam::112233445566:user/svc-backup' },
              requestParameters: { name: 'arn:aws:cloudtrail:us-east-1:112233445566:trail/main-enterprise-trail' },
              responseElements: null
            }
          ]
        }
      },
      incident: {
        id: 'inc-5080',
        ticketNumber: 'SEC-5080',
        title: 'Privilege Escalation & Trail Disablement via Compromised Service Account',
        severity: 'Critical',
        affectedAsset: 'AWS CloudTrail `main-enterprise-trail` & IAM Service User `svc-backup`',
        timestamp: '2026-10-03 23:45:00 UTC',
        summary: 'CloudWatch Alarm `CRITICAL-CloudTrail-Stopped` fired: Service account `svc-backup` executed `iam:AttachUserPolicy` granting itself `AdministratorAccess`, followed 45 seconds later by `cloudtrail:StopLogging`.',
        rawTelemetry: [
          '2026-10-03T23:42:10Z eventName="AttachUserPolicy" userName="svc-backup" policyArn="arn:aws:iam::aws:policy/AdministratorAccess" sourceIPAddress="198.51.100.44"',
          '2026-10-03T23:42:55Z eventName="StopLogging" name="main-enterprise-trail" userName="svc-backup" sourceIPAddress="198.51.100.44"',
          'Origin Check: IP 198.51.100.44 is a digital ocean VPS with no relation to corporate enterprise subnets'
        ],
        triageOptions: {
          correctClassification: 'True Positive',
          explanation: 'Stolen programmatic credentials for `svc-backup` were used to grant full Administrator privileges and immediately attempt defense evasion by disabling CloudTrail logging.'
        },
        rootCauseOptions: {
          options: [
            'Adversary stole the AWS API access key for `svc-backup`, escalated privileges to AdministratorAccess, and disabled CloudTrail to conceal subsequent lateral movement and data exfiltration.',
            'Backup administrator testing script failure recovery.',
            'AWS performing maintenance on CloudTrail backend storage.',
            'Scheduled Terraform pipeline rotating cloud infrastructure.'
          ],
          correctIndex: 0,
          explanation: 'The sequential execution from an unknown VPS IP of `AttachUserPolicy` (AdministratorAccess) followed by `StopLogging` confirms malicious privilege escalation and defense evasion.'
        },
        containmentOptions: {
          options: [
            'Immediately re-enable CloudTrail via `StartLogging`, deactivate and delete all access keys for `svc-backup`, detach the `AdministratorAccess` policy, revoke active STS sessions, block IP 198.51.100.44, and initiate forensic investigation in Athena.',
            'Delete the `main-enterprise-trail` completely.',
            'Wait until Monday morning to contact the backup engineer.',
            'Reboot all AWS EC2 instances.'
          ],
          correctIndex: 0,
          explanation: 'Containment requires instantly restoring CloudTrail audit logging, revoking the compromised credentials, stripping administrator privileges, killing active sessions, and scoping the breach.'
        },
        mitreTechniques: [
          'T1098 - Account Manipulation',
          'T1562.008 - Impair Defenses: Disable Cloud Logs',
          'T1078.004 - Valid Accounts: Cloud Accounts'
        ],
        slaMinutes: 15
      },
      flashcards: [
        {
          id: 'fc-5-7',
          question: 'Why is it mandatory for enterprise AWS CloudTrail trails to be configured as "Multi-Region" instead of single-region?',
          category: 'Cloud Auditing',
          difficulty: 'Junior',
          modelAnswer: 'If a CloudTrail trail is configured only in `us-east-1` (single-region), it records API activities happening ONLY in that specific region. If an adversary compromises an AWS access key and spins up 50 cryptocurrency mining instances in `eu-west-3` or `ap-southeast-1` (regions the company may not normally use), a single-region trail will record ZERO events. A Multi-Region trail ensures that CloudTrail automatically logs API calls across ALL current and future AWS regions into a central audit repository.',
          scoringTips: ['Explain blindness to attacks in unused/alternate regions.', 'Explain that multi-region records API calls across all regions.', 'Mention adversary tactics of pivoting to obscure regions.'],
          corporateContext: 'A key benchmark for auditing cloud security posture and compliance.'
        },
        {
          id: 'fc-5-8',
          question: 'What is CloudTrail Log File Validation, and how does it detect log tampering by an adversary?',
          category: 'Cloud Forensics',
          difficulty: 'Mid',
          modelAnswer: 'CloudTrail Log File Validation uses public key cryptography and cryptographic hashing to ensure audit trail integrity. When enabled, CloudTrail generates a "digest file" every hour in the S3 bucket that contains the SHA-256 hash of each log file delivered, cryptographically signed with an AWS private key. A SOC analyst can run `aws cloudtrail validate-logs` to mathematically verify that the log files have not been modified, deleted, or injected since they were written by AWS.',
          scoringTips: ['Explain digest files containing SHA-256 hashes.', 'Mention digital signatures / asymmetric cryptography.', 'Explain detection of modified, deleted, or injected log records.'],
          corporateContext: 'Critical for establishing chain of custody and forensic integrity in legal proceedings.'
        },
        {
          id: 'fc-5-9',
          question: 'In a CloudTrail JSON log record, what is the forensic difference between `userIdentity.type = "Root"` vs `"IAMUser"` vs `"AssumedRole"`?',
          category: 'Cloud Telemetry',
          difficulty: 'Mid',
          modelAnswer: '1) `Root` indicates the action was taken by the master account owner using the root email and password, which represents extreme privilege and should rarely occur. 2) `IAMUser` indicates long-term static credentials (access key or console password) of an individual user account. 3) `AssumedRole` indicates temporary credentials obtained via AWS STS (Security Token Service), used by EC2 instance profiles, Lambda functions, cross-account administrators, or federated SSO logins. The `principalId` will reveal both the role name and the session caller name.',
          scoringTips: ['Define Root as master account credentials.', 'Define IAMUser as static long-term credentials.', 'Define AssumedRole as temporary STS credentials with session name.'],
          corporateContext: 'Standard knowledge test for cloud security analysts reviewing CloudTrail events.'
        }
      ],
      quiz: [
        {
          id: 'q-5-7',
          question: 'Which AWS API call is commonly executed by adversaries immediately after compromising an API key to discover the account identity and permissions associated with the credential?',
          options: [
            'sts:GetCallerIdentity',
            'ec2:StopInstances',
            's3:DeleteBucket',
            'route53:DeleteHostedZone'
          ],
          correctIndex: 0,
          explanation: '`sts:GetCallerIdentity` is the cloud equivalent of `whoami`. It returns the Account ID, User ID, and ARN associated with the active credentials without requiring special permissions.'
        },
        {
          id: 'q-5-8',
          question: 'Which CloudTrail API event represents an adversary attempting to evade defense detection by turning off audit logging on an enterprise trail?',
          options: ['StartLogging', 'StopLogging', 'DescribeTrails', 'LookupEvents'],
          correctIndex: 1,
          explanation: '`StopLogging` halts the recording of AWS API activities on the specified trail, representing a classic defense evasion technique (MITRE ATT&CK T1562.008).'
        },
        {
          id: 'q-5-9',
          question: 'What security feature should be enabled on the Amazon S3 bucket storing CloudTrail logs to prevent an attacker with compromised admin credentials from permanently deleting historical audit logs?',
          options: [
            'Website Hosting',
            'S3 Versioning combined with MFA Delete and S3 Object Lock (WORM)',
            'Public Read Access',
            'Server-side encryption with default keys'
          ],
          correctIndex: 1,
          explanation: 'S3 Object Lock in Compliance mode (Write Once, Read Many) combined with Versioning and MFA Delete prevents even the root or administrator accounts from deleting historical audit logs.'
        }
      ]
    }
  ]
};
