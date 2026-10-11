// ============================================================
//  SmartGen — Template Registry
//  Developer: Davix HDM
// ============================================================

const today = new Date().toISOString().split('T')[0];

export const templates = [
  // ── 1. Certificate of Excellence ────────────────────────────
  {
    id: 'cert-excellence',
    name: 'Certificate of Excellence',
    category: 'certificate',
    icon: '🎖️',
    description: 'Award outstanding achievement in any field.',
    schema: [
      { name: 'orgName', label: 'Issuing Organization', type: 'text', default: 'Nexus Academy' },
      { name: 'recipientName', label: 'Recipient Full Name', type: 'text', default: 'Emily Davis' },
      { name: 'achievement', label: 'Achievement / Course', type: 'text', default: 'Advanced Leadership & Strategy' },
      { name: 'dateIssued', label: 'Date Issued', type: 'date', default: today },
      { name: 'certId', label: 'Certificate ID', type: 'text', default: 'CERT-2025-089' },
      { name: 'director', label: 'Director / Signatory', type: 'text', default: 'Dr. A. Williams' },
      { name: 'directorTitle', label: 'Director Title', type: 'text', default: 'Executive Director' },
    ],
    render: (d) => `
      <div style="text-align:center;border:6px double #1e3a8a;padding:2.5rem 2rem;background:linear-gradient(160deg,#f0f4ff 0%,#fff 60%);font-family:'Times New Roman',serif">
        <div style="font-size:2.5rem;margin-bottom:.5rem">🎖️</div>
        <div style="font-size:.7rem;letter-spacing:.2em;color:#64748b;text-transform:uppercase;margin-bottom:.25rem">${d.orgName || '——————'}</div>
        <h2 style="font-size:1.9rem;font-weight:700;color:#1e3a8a;letter-spacing:.06em;text-transform:uppercase;margin:.5rem 0 .1rem">Certificate</h2>
        <div style="font-size:.65rem;letter-spacing:.3em;color:#94a3b8;text-transform:uppercase;margin-bottom:1.5rem">of Excellence</div>
        <div style="border-top:1px solid #bfdbfe;border-bottom:1px solid #bfdbfe;padding:1rem;margin-bottom:1.5rem">
          <div style="font-size:.8rem;color:#64748b;margin-bottom:.25rem">This certificate is proudly presented to</div>
          <div style="font-size:1.8rem;font-weight:700;color:#0f172a;font-style:italic">${d.recipientName || '——————'}</div>
          <div style="font-size:.8rem;color:#64748b;margin:.5rem 0 .25rem">in recognition of outstanding completion of</div>
          <div style="font-size:1.1rem;font-weight:600;color:#1e40af">${d.achievement || '——————'}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;font-size:.75rem">
          <div style="text-align:left"><div style="color:#94a3b8;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em">Date</div><strong>${d.dateIssued || '——————'}</strong></div>
          <div style="text-align:center"><div style="border-top:1px solid #334155;width:140px;margin:0 auto .25rem"></div><div style="font-style:italic">${d.director || '——————'}</div><div style="font-size:.65rem;color:#64748b">${d.directorTitle || '——————'}</div></div>
          <div style="text-align:right"><div style="color:#94a3b8;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em">Cert ID</div><strong style="font-family:monospace">${d.certId || '——————'}</strong></div>
        </div>
      </div>`,
  },

  // ── 2. Scholarship Certificate ───────────────────────────────
{
  id: 'cert-scholarship',
  name: 'Scholarship Certificate',
  category: 'certificate',
  icon: '🎓',
  description: 'Formal scholarship award certificate with stamp.',
  schema: [
    { name: 'institutionName', label: 'Institution Name', type: 'text', default: 'Greenfield University' },
    { name: 'recipientName', label: 'Student Full Name', type: 'text', default: 'James Mwangi' },
    { name: 'program', label: 'Program of Study', type: 'text', default: 'Bachelor of Science in Computer Science' },
    { name: 'academicYear', label: 'Academic Year', type: 'text', default: '2025 / 2026' },
    { name: 'basis', label: 'Awarded On Basis Of', type: 'text', default: 'Academic Excellence & Financial Need' },
    { name: 'dateIssued', label: 'Date Issued', type: 'date', default: today },
    { name: 'registrar', label: 'Registrar Name', type: 'text', default: 'Prof. Grace Odhiambo' },
    { name: 'registrarTitle', label: 'Registrar Title', type: 'text', default: 'Registrar, Academic Affairs' },
    { name: 'certificateId', label: 'Certificate ID', type: 'text', default: 'SCH-2026-001' },
    { name: 'stampUrl', label: 'Official Stamp URL (optional)', type: 'text', default: '' },
  ],
  render: (d) => {
    const smooth = '-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:geometricPrecision';

    const stampHTML = d.stampUrl
      ? `<img src="${d.stampUrl}" alt="Stamp" style="width:100px;height:100px;object-fit:contain;opacity:0.92" />`
      : `<div style="width:100px;height:100px;border:2px dashed #6ee7b7;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#6ee7b7;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;${smooth}">Stamp</div>`;

    return `
      <div style="position:relative;text-align:center;padding:3rem 2.5rem;background:#ffffff;border:6px double #047857;font-family:'Times New Roman',Georgia,serif;${smooth}">
        <!-- Top emblem -->
        <div style="font-size:2.4rem;line-height:1;margin-bottom:.75rem">🎓</div>

        <!-- Institution name -->
        <div style="font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;color:#065f46;font-weight:700;margin-bottom:.5rem;${smooth}">
          ${d.institutionName || '——————'}
        </div>

        <!-- Main title -->
        <h1 style="font-size:2rem;font-weight:700;color:#064e3b;letter-spacing:.06em;text-transform:uppercase;margin:.5rem 0 .25rem;${smooth}">
          Scholarship Award
        </h1>
        <div style="font-size:.65rem;letter-spacing:.35em;color:#059669;text-transform:uppercase;margin-bottom:2rem;${smooth}">
          Certificate of Achievement
        </div>

        <!-- Body -->
        <div style="border-top:1px solid #a7f3d0;border-bottom:1px solid #a7f3d0;padding:1.75rem 1rem;margin:0 auto 2rem;max-width:560px">
          <div style="font-size:.8rem;color:#4b5563;margin-bottom:.5rem;${smooth}">This is to certify that</div>

          <div style="font-size:1.9rem;font-weight:700;font-style:italic;color:#064e3b;margin:.5rem 0;letter-spacing:.02em;${smooth}">
            ${d.recipientName || '——————'}
          </div>

          <div style="font-size:.85rem;color:#374151;line-height:1.7;max-width:480px;margin:0 auto;${smooth}">
            has been formally awarded a scholarship for enrolment in
            <strong style="color:#065f46">${d.program || '——————'}</strong>
            for the academic year
            <strong style="color:#065f46">${d.academicYear || '——————'}</strong>,
            in recognition of
            <strong style="color:#065f46">${d.basis || '——————'}</strong>.
          </div>
        </div>

        <!-- Signature / stamp / date row -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:2.5rem;font-size:.75rem">
          <!-- Date -->
          <div style="text-align:left;min-width:130px">
            <div style="color:#9ca3af;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.35rem;${smooth}">Date Issued</div>
            <div style="border-top:1px solid #374151;padding-top:.35rem;font-weight:700;color:#064e3b;${smooth}">
              ${d.dateIssued || '——————'}
            </div>
          </div>

          <!-- Stamp -->
          <div style="text-align:center">
            ${stampHTML}
            <div style="color:#9ca3af;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;margin-top:.35rem;${smooth}">Official Stamp</div>
          </div>

          <!-- Registrar signature -->
          <div style="text-align:right;min-width:170px">
            <div style="color:#9ca3af;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.35rem;${smooth}">Authorised By</div>
            <div style="border-top:1px solid #374151;padding-top:.35rem;${smooth}">
              <div style="font-weight:700;color:#064e3b">${d.registrar || '——————'}</div>
              <div style="color:#4b5563;font-size:.7rem">${d.registrarTitle || '——————'}</div>
            </div>
          </div>
        </div>

        <!-- Certificate ID -->
        <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);font-size:.6rem;letter-spacing:.12em;color:#94a3b8;font-family:monospace;${smooth}">
          CERT ID: ${d.certificateId || '——————'}
        </div>
      </div>`;
  },
},

  // ── 3. Recommendation Letter ─────────────────────────────────
  {
    id: 'letter-recommendation',
    name: 'Recommendation Letter',
    category: 'letter',
    icon: '📝',
    description: 'Formal letter recommending a person for a role or opportunity.',
    schema: [
      { name: 'refName', label: 'Referee Full Name', type: 'text', default: 'Dr. Carol Mutua' },
      { name: 'refTitle', label: 'Referee Title / Position', type: 'text', default: 'Senior Lecturer, Dept. of Engineering' },
      { name: 'orgName', label: 'Referee Organization', type: 'text', default: 'Strathmore University' },
      { name: 'refEmail', label: 'Referee Email', type: 'text', default: 'c.mutua@strathmore.edu' },
      { name: 'refPhone', label: 'Referee Phone', type: 'text', default: '+254 722 000 000' },
      { name: 'recipientName', label: 'Candidate Name', type: 'text', default: 'Brian Otieno' },
      { name: 'applyingFor', label: 'Applying For', type: 'text', default: 'Software Engineer at Google Kenya' },
      { name: 'relationship', label: 'Relationship to Candidate', type: 'text', default: 'was my student for 3 years and research assistant' },
      { name: 'bodyText', label: 'Main Body (2-3 paragraphs)', type: 'textarea', rows: 6,
        default: `It is my genuine pleasure to recommend Brian Otieno for the Software Engineer position at Google Kenya. Brian demonstrated exceptional technical aptitude throughout his undergraduate studies, consistently ranking in the top 5% of his cohort.\n\nDuring his time as my research assistant, Brian contributed meaningfully to our distributed systems project, independently developing a fault-tolerant caching layer that reduced query latency by 40%. His ability to grasp complex concepts quickly and translate them into working solutions is remarkable.\n\nI am confident Brian will bring the same dedication, curiosity, and technical excellence to your team. I recommend him without reservation.` },
      { name: 'dateIssued', label: 'Date', type: 'date', default: today },
    ],
    render: (d) => `
      <div style="font-family:'Times New Roman',Georgia,serif;background:#fff;padding:2rem 1.8rem;line-height:1.6">
      <div style="border-bottom:3px solid #1e3a8a;padding-bottom:1rem;margin-bottom:1.5rem">
        <strong style="font-size:1.05rem">${d.refName || '——————'}</strong><br>
        <span style="font-size:.85rem;color:#475569">${d.refTitle || '——————'}</span><br>
        <span style="font-size:.85rem;color:#475569">${d.orgName || '——————'}</span><br>
        <span style="font-size:.8rem;color:#64748b">${d.refEmail || '——————'} | ${d.refPhone || '——————'}</span><br>
        <span style="font-size:.8rem;color:#64748b">${d.dateIssued || '——————'}</span>
      </div>
      <p style="font-size:.9rem;color:#374151"><strong>RE: Recommendation for ${d.recipientName || '——————'} — ${d.applyingFor || '——————'}</strong></p>
      <p style="font-size:.85rem;color:#374151;margin-top:.75rem">To Whom It May Concern,</p>
      <div style="font-size:.87rem;color:#374151;margin-top:.75rem;white-space:pre-wrap">${d.bodyText || '——————'}</div>
      <div style="margin-top:2rem;font-size:.85rem">
        <p>Yours sincerely,</p>
        <div style="margin-top:1.5rem;border-top:1px solid #cbd5e1;width:160px;padding-top:.3rem">
          <strong>${d.refName || '——————'}</strong><br>
          <span style="color:#64748b;font-size:.8rem">${d.refTitle || '——————'}</span>
        </div>
      </div>
      </div>`,
  },

  // ── 4. Application Letter ────────────────────────────────────
  {
    id: 'letter-application',
    name: 'Application Letter',
    category: 'letter',
    icon: '✉️',
    description: 'Job or program application letter with formal structure.',
    schema: [
      { name: 'applicantName', label: 'Your Full Name', type: 'text', default: 'Alex Muthoni' },
      { name: 'applicantAddr', label: 'Your Address', type: 'text', default: 'P.O. Box 1234, Nairobi' },
      { name: 'applicantEmail', label: 'Your Email', type: 'text', default: 'alex.muthoni@email.com' },
      { name: 'applicantPhone', label: 'Your Phone', type: 'text', default: '+254 700 123 456' },
      { name: 'dateIssued', label: 'Date', type: 'date', default: today },
      { name: 'hiringManager', label: 'Hiring Manager Name', type: 'text', default: 'The Human Resources Manager' },
      { name: 'companyName', label: 'Company / Institution', type: 'text', default: 'Safaricom PLC' },
      { name: 'companyAddr', label: 'Company Address', type: 'text', default: 'Safaricom House, Westlands, Nairobi' },
      { name: 'position', label: 'Position Applied For', type: 'text', default: 'Senior Data Analyst' },
      { name: 'bodyText', label: 'Letter Body', type: 'textarea', rows: 6,
        default: `I write with great enthusiasm to apply for the Senior Data Analyst position recently advertised. With a Bachelor's degree in Statistics and four years of progressive experience in data analysis and visualization, I am confident in my ability to add significant value to your team.\n\nIn my current role at DataKE Ltd., I have led a team of analysts to build automated reporting pipelines that reduced manual reporting time by 65%. I am proficient in Python, SQL, Power BI, and R, and have a proven record of translating complex datasets into actionable business insights.\n\nI am eager to bring my skills to Safaricom PLC and contribute to data-driven decision-making at scale. I have enclosed my CV for your review and welcome the opportunity to discuss my application further.` },
    ],
    render: (d) => `
      <div style="font-family:'Times New Roman',Georgia,serif;background:#fff;padding:2rem 1.8rem;line-height:1.6">
      <div style="margin-bottom:1.5rem;font-size:.85rem">
        <strong>${d.applicantName || '——————'}</strong><br>
        ${d.applicantAddr || '——————'}<br>
        ${d.applicantEmail || '——————'} | ${d.applicantPhone || '——————'}<br>
        <div style="margin-top:.5rem">${d.dateIssued || '——————'}</div>
      </div>
      <div style="margin-bottom:1rem;font-size:.85rem">
        <strong>${d.hiringManager || '——————'}</strong><br>
        ${d.companyName || '——————'}<br>
        ${d.companyAddr || '——————'}
      </div>
      <p style="font-size:.85rem;font-weight:600;text-decoration:underline;margin-bottom:.75rem">RE: Application for the Position of ${d.position || '——————'}</p>
      <p style="font-size:.85rem">Dear ${d.hiringManager || '——————'},</p>
      <div style="font-size:.87rem;margin-top:.75rem;white-space:pre-wrap">${d.bodyText || '——————'}</div>
      <div style="margin-top:2rem;font-size:.85rem">
        <p>Yours faithfully,</p>
        <div style="margin-top:2rem;border-top:1px solid #cbd5e1;width:160px;padding-top:.3rem">
          <strong>${d.applicantName || '——————'}</strong>
        </div>
      </div>
      </div>`,
  },

  // ── 5. Business Letter ───────────────────────────────────────
  {
    id: 'letter-business',
    name: 'Official Business Letter',
    category: 'letter',
    icon: '🏢',
    description: 'Formal inter-company or client correspondence.',
    schema: [
      { name: 'senderName', label: 'Sender Name', type: 'text', default: 'Michael Kamau' },
      { name: 'senderTitle', label: 'Sender Title', type: 'text', default: 'Director of Operations' },
      { name: 'orgName', label: 'Your Organization', type: 'text', default: 'Apex Dynamics Ltd.' },
      { name: 'orgAddress', label: 'Organization Address', type: 'text', default: 'Upper Hill, Nairobi, Kenya' },
      { name: 'dateIssued', label: 'Letter Date', type: 'date', default: today },
      { name: 'recipientName', label: 'Recipient Name', type: 'text', default: 'Ms. Sarah Otieno' },
      { name: 'recipientOrg', label: 'Recipient Company', type: 'text', default: 'TechBridge Africa' },
      { name: 'subjectLine', label: 'Subject', type: 'text', default: 'Partnership Proposal — Q3 2025' },
      { name: 'bodyText', label: 'Letter Body', type: 'textarea', rows: 5,
        default: `Dear Ms. Otieno,\n\nWe are pleased to reach out regarding an exciting partnership opportunity between Apex Dynamics Ltd. and TechBridge Africa. We believe our complementary capabilities in operational logistics and technology infrastructure position us uniquely to deliver transformative outcomes for the East African market.\n\nWe would welcome the opportunity to arrange a meeting at your earliest convenience to discuss the specifics of this proposal.\n\nWe look forward to your response.` },
      { name: 'refNumber', label: 'Reference Number', type: 'text', default: 'ADL/OPS/2025/042' },
    ],
    render: (d) => `
      <div style="font-family:'Times New Roman',Georgia,serif;background:#fff;padding:2rem 1.8rem;line-height:1.6">
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid #1e3a8a;padding-bottom:1rem;margin-bottom:1.5rem">
        <div>
          <strong style="font-size:1.1rem">${d.orgName || '——————'}</strong><br>
          <span style="font-size:.8rem;color:#475569">${d.orgAddress || '——————'}</span>
        </div>
        <div style="text-align:right;font-size:.8rem;color:#475569">
          Ref: <strong style="font-family:monospace">${d.refNumber || '——————'}</strong><br>
          Date: ${d.dateIssued || '——————'}
        </div>
      </div>
      <div style="font-size:.85rem;margin-bottom:1rem">
        <strong>${d.recipientName || '——————'}</strong><br>
        ${d.recipientOrg || '——————'}
      </div>
      <p style="font-weight:700;font-size:.9rem;margin-bottom:1rem;border-left:3px solid #1e3a8a;padding-left:.75rem">RE: ${d.subjectLine || '——————'}</p>
      <div style="font-size:.87rem;white-space:pre-wrap">${d.bodyText || '——————'}</div>
      <div style="margin-top:2rem;font-size:.85rem">
        <p>Yours sincerely,</p>
        <div style="margin-top:2rem;border-top:1px solid #94a3b8;width:160px;padding-top:.3rem">
          <strong>${d.senderName || '——————'}</strong><br>
          <span style="color:#64748b;font-size:.8rem">${d.senderTitle || '——————'}</span><br>
          <span style="color:#64748b;font-size:.8rem">${d.orgName || '——————'}</span>
        </div>
      </div>
      </div>`,
  },

  // ── 6. Leave Application ─────────────────────────────────────
  {
    id: 'letter-leave',
    name: 'Leave Application',
    category: 'letter',
    icon: '🏖️',
    description: 'Formal leave request for annual, sick, or maternity leave.',
    schema: [
      { name: 'employeeName', label: 'Employee Full Name', type: 'text', default: 'Janet Wanjiru' },
      { name: 'employeeId', label: 'Employee ID', type: 'text', default: 'EMP-2023-114' },
      { name: 'department', label: 'Department', type: 'text', default: 'Finance & Accounts' },
      { name: 'managerName', label: 'Manager / HR Name', type: 'text', default: 'Mr. James Kariuki' },
      { name: 'leaveType', label: 'Type of Leave', type: 'select', default: 'Annual Leave',
        options: ['Annual Leave','Sick Leave','Maternity Leave','Paternity Leave','Compassionate Leave','Study Leave','Unpaid Leave'] },
      { name: 'fromDate', label: 'From Date', type: 'date', default: today },
      { name: 'toDate', label: 'To Date', type: 'date', default: today },
      { name: 'totalDays', label: 'Total Days Requested', type: 'number', default: '5' },
      { name: 'reason', label: 'Reason for Leave', type: 'textarea', rows: 3,
        default: 'I would like to request annual leave to attend to pressing family matters and personal obligations during this period.' },
      { name: 'dateIssued', label: 'Application Date', type: 'date', default: today },
    ],
    render: (d) => `
      <div style="font-family:'Times New Roman',Georgia,serif;background:#fff;padding:2rem 1.8rem;line-height:1.6">
      <h3 style="text-align:center;font-size:1.1rem;font-weight:700;border-bottom:2px solid #0f172a;padding-bottom:.5rem;margin-bottom:1.5rem">LEAVE APPLICATION FORM</h3>
      <table style="width:100%;font-size:.85rem;border-collapse:collapse;margin-bottom:1rem">
        <tr><td style="width:40%;padding:.3rem 0;color:#475569;font-weight:600">Employee Name:</td><td>${d.employeeName || '——————'}</td></tr>
        <tr><td style="padding:.3rem 0;color:#475569;font-weight:600">Employee ID:</td><td style="font-family:monospace">${d.employeeId || '——————'}</td></tr>
        <tr><td style="padding:.3rem 0;color:#475569;font-weight:600">Department:</td><td>${d.department || '——————'}</td></tr>
        <tr><td style="padding:.3rem 0;color:#475569;font-weight:600">Type of Leave:</td><td><strong>${d.leaveType || '——————'}</strong></td></tr>
        <tr><td style="padding:.3rem 0;color:#475569;font-weight:600">From:</td><td>${d.fromDate || '——————'}</td></tr>
        <tr><td style="padding:.3rem 0;color:#475569;font-weight:600">To:</td><td>${d.toDate || '——————'}</td></tr>
        <tr><td style="padding:.3rem 0;color:#475569;font-weight:600">Total Days:</td><td><strong>${d.totalDays || '——————'} day(s)</strong></td></tr>
      </table>
      <div style="font-size:.85rem;margin-bottom:1.5rem">
        <div style="font-weight:600;color:#475569;margin-bottom:.3rem">Reason:</div>
        <div style="border-left:3px solid #e2e8f0;padding-left:.75rem;white-space:pre-wrap">${d.reason || '——————'}</div>
      </div>
      <p style="font-size:.85rem">To: <strong>${d.managerName || '——————'}</strong></p>
      <p style="font-size:.85rem;margin-top:.25rem">I hereby request approval for the above-stated leave. I commit to ensuring adequate handover of my duties before the commencement of this leave.</p>
      <div style="display:flex;justify-content:space-between;margin-top:2rem;font-size:.8rem">
        <div>
          <div style="border-top:1px solid #94a3b8;width:160px;padding-top:.3rem">
            <strong>${d.employeeName || '——————'}</strong><br>
            <span style="color:#64748b">Employee Signature & Date: ${d.dateIssued || '——————'}</span>
          </div>
        </div>
        <div>
          <div style="border-top:1px solid #94a3b8;width:160px;padding-top:.3rem">
            <strong>${d.managerName || '——————'}</strong><br>
            <span style="color:#64748b">Supervisor Signature & Date</span>
          </div>
        </div>
      </div>
      </div>`,
  },

  // ── 7. Employment Contract ───────────────────────────────────
  {
    id: 'legal-employment',
    name: 'Employment Contract',
    category: 'legal',
    icon: '📋',
    description: 'Standard employment contract between employer and employee.',
    schema: [
      { name: 'companyName', label: 'Employer / Company Name', type: 'text', default: 'Zenith Solutions Ltd.' },
      { name: 'companyAddr', label: 'Company Address', type: 'text', default: 'Kilimani, Nairobi, Kenya' },
      { name: 'employeeName', label: 'Employee Full Name', type: 'text', default: 'David Mutuku' },
      { name: 'employeeId', label: 'Employee ID / National ID', type: 'text', default: '30123456' },
      { name: 'position', label: 'Job Title / Position', type: 'text', default: 'Full-Stack Developer' },
      { name: 'department', label: 'Department', type: 'text', default: 'Engineering' },
      { name: 'startDate', label: 'Start Date', type: 'date', default: today },
      { name: 'contractType', label: 'Contract Type', type: 'select', default: 'Permanent',
        options: ['Permanent','Fixed-Term (1 Year)','Fixed-Term (2 Years)','Probationary (3 Months)','Part-Time','Contract'] },
      { name: 'grossSalary', label: 'Gross Monthly Salary (KES)', type: 'number', default: '120000' },
      { name: 'probation', label: 'Probation Period', type: 'text', default: '3 months' },
      { name: 'hrManager', label: 'HR Manager / Director', type: 'text', default: 'Ms. Grace Odhiambo' },
      { name: 'dateIssued', label: 'Contract Date', type: 'date', default: today },
    ],
    render: (d) => `
      <div style="font-family:'Times New Roman',Georgia,serif;background:#fff;padding:2rem 1.8rem;line-height:1.6">
      <h3 style="text-align:center;font-size:1.2rem;font-weight:700;letter-spacing:.05em;border-bottom:2px solid #0f172a;padding-bottom:.5rem;margin-bottom:1.5rem">CONTRACT OF EMPLOYMENT</h3>
      <p style="font-size:.85rem;margin-bottom:1rem">This Contract of Employment is entered into between <strong>${d.companyName || '——————'}</strong> (hereinafter "the Employer") of ${d.companyAddr || '——————'}, and <strong>${d.employeeName || '——————'}</strong>, ID No. <strong style="font-family:monospace">${d.employeeId || '——————'}</strong> (hereinafter "the Employee").</p>
      <table style="width:100%;font-size:.82rem;border-collapse:collapse;margin-bottom:1rem">
        ${[
          ['Position / Title', d.position],
          ['Department', d.department],
          ['Contract Type', d.contractType],
          ['Commencement Date', d.startDate],
          ['Probation Period', d.probation],
          ['Gross Monthly Salary', `KES ${parseFloat(d.grossSalary || 0).toLocaleString()}`],
        ].map(([k, v]) => `<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:.4rem .5rem;width:45%;background:#f8fafc;font-weight:600;color:#475569">${k}</td><td style="padding:.4rem .5rem">${v || '——————'}</td></tr>`).join('')}
      </table>
      <p style="font-size:.8rem;color:#475569;margin-bottom:1rem"><strong>Terms:</strong> The Employee agrees to abide by all company policies, maintain confidentiality of company information, and perform duties diligently. Either party may terminate this contract with notice as per the Employment Act (Kenya) 2007 or its amendments.</p>
      <div style="display:flex;justify-content:space-between;margin-top:2rem;font-size:.8rem">
        <div>
          <div style="border-top:1px solid #94a3b8;width:160px;padding-top:.3rem">
            <strong>${d.hrManager || '——————'}</strong><br>
            <span style="color:#64748b">For: ${d.companyName || '——————'}</span><br>
            <span style="color:#64748b">Date: ${d.dateIssued || '——————'}</span>
          </div>
        </div>
        <div>
          <div style="border-top:1px solid #94a3b8;width:160px;padding-top:.3rem">
            <strong>${d.employeeName || '——————'}</strong><br>
            <span style="color:#64748b">Employee Signature</span><br>
            <span style="color:#64748b">Date: ____________________</span>
          </div>
        </div>
      </div>
      </div>`,
  },

  // ── 8. Official Receipt ──────────────────────────────────────
  {
    id: 'receipt-official',
    name: 'Official Receipt',
    category: 'receipt',
    icon: '🧾',
    description: 'Formal payment receipt for goods or services rendered.',
    schema: [
      { name: 'orgName', label: 'Organization Name', type: 'text', default: 'HDM Services Ltd.' },
      { name: 'orgAddr', label: 'Organization Address', type: 'text', default: 'Westlands, Nairobi | info@hdm.co.ke' },
      { name: 'receiptNo', label: 'Receipt Number', type: 'text', default: 'RCT-2025-0042' },
      { name: 'receivedFrom', label: 'Received From', type: 'text', default: 'Acme Corporation' },
      { name: 'description', label: 'Payment Description', type: 'text', default: 'Web Development Services - Phase 1' },
      { name: 'paymentMode', label: 'Payment Method', type: 'select', default: 'M-Pesa',
        options: ['Cash','M-Pesa','Bank Transfer','Cheque','Credit Card','PayPal'] },
      { name: 'mpesaRef', label: 'Transaction / Cheque Ref', type: 'text', default: 'QFE72KPLA8' },
      { name: 'currency', label: 'Currency', type: 'select', default: 'KES',
        options: ['KES','USD','EUR','GBP','UGX','TZS'] },
      { name: 'amount', label: 'Amount Paid', type: 'number', default: '75000' },
      { name: 'dateIssued', label: 'Date Received', type: 'date', default: today },
      { name: 'issuedBy', label: 'Received By (Name)', type: 'text', default: 'Jane Waweru' },
    ],
    render: (d) => {
      const amt = parseFloat(d.amount || 0);
      return `
      <div style="font-family:'Courier New',monospace;background:#fff;border:2px solid #0f172a;padding:1.5rem">
        <div style="text-align:center;border-bottom:2px dashed #0f172a;padding-bottom:1rem;margin-bottom:1rem">
          <div style="font-size:1.2rem;font-weight:700;letter-spacing:.1em">${(d.orgName || '——————').toUpperCase()}</div>
          <div style="font-size:.75rem;color:#475569">${d.orgAddr || '——————'}</div>
          <div style="font-size:1.1rem;font-weight:700;letter-spacing:.15em;margin-top:.5rem">OFFICIAL RECEIPT</div>
          <div style="font-size:.75rem">No: <strong>${d.receiptNo || '——————'}</strong></div>
        </div>
        <table style="width:100%;font-size:.82rem;border-collapse:collapse">
          <tr><td style="padding:.3rem 0;width:40%;color:#475569">Date:</td><td><strong>${d.dateIssued || '——————'}</strong></td></tr>
          <tr><td style="padding:.3rem 0;color:#475569">Received From:</td><td><strong>${d.receivedFrom || '——————'}</strong></td></tr>
          <tr><td style="padding:.3rem 0;color:#475569">Description:</td><td>${d.description || '——————'}</td></tr>
          <tr><td style="padding:.3rem 0;color:#475569">Payment Mode:</td><td>${d.paymentMode || '——————'}</td></tr>
          <tr><td style="padding:.3rem 0;color:#475569">Ref / Txn No:</td><td style="font-family:monospace">${d.mpesaRef || '——————'}</td></tr>
        </table>
        <div style="border-top:2px dashed #0f172a;border-bottom:2px dashed #0f172a;padding:.75rem 0;margin:1rem 0;text-align:center">
          <div style="font-size:.75rem;color:#475569;text-transform:uppercase;letter-spacing:.1em">Amount Received</div>
          <div style="font-size:1.8rem;font-weight:700">${d.currency || 'KES'} ${amt.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.78rem">
          <div>Received By:<br><strong>${d.issuedBy || '——————'}</strong><br>_________________<br><span style="color:#94a3b8">Signature</span></div>
          <div style="text-align:right;color:#475569;font-size:.7rem">*This is an official receipt.*<br>Keep for your records.</div>
        </div>
      </div>`;
    },
  },

  // ── 9. Quotation / Estimate ──────────────────────────────────
  {
    id: 'finance-quotation',
    name: 'Quotation / Estimate',
    category: 'finance',
    icon: '💰',
    description: 'Professional business quotation for products or services.',
    schema: [
      { name: 'orgName', label: 'Your Company Name', type: 'text', default: 'Davix HDM Solutions' },
      { name: 'orgAddr', label: 'Company Address', type: 'text', default: 'Nairobi, Kenya | davix@hdm.co.ke' },
      { name: 'quoteNo', label: 'Quotation Number', type: 'text', default: 'QT-2025-019' },
      { name: 'clientName', label: 'Client Name', type: 'text', default: 'BuildRight Construction Ltd.' },
      { name: 'clientAddr', label: 'Client Address', type: 'text', default: 'Industrial Area, Nairobi' },
      { name: 'item1', label: 'Item 1 Description', type: 'text', default: 'Website Design & Development' },
      { name: 'qty1', label: 'Qty 1', type: 'number', default: '1' },
      { name: 'rate1', label: 'Unit Rate 1 (KES)', type: 'number', default: '85000' },
      { name: 'item2', label: 'Item 2 Description', type: 'text', default: 'SEO Setup & Configuration' },
      { name: 'qty2', label: 'Qty 2', type: 'number', default: '1' },
      { name: 'rate2', label: 'Unit Rate 2 (KES)', type: 'number', default: '25000' },
      { name: 'item3', label: 'Item 3 Description', type: 'text', default: 'Monthly Maintenance (3 months)' },
      { name: 'qty3', label: 'Qty 3', type: 'number', default: '3' },
      { name: 'rate3', label: 'Unit Rate 3 (KES)', type: 'number', default: '8000' },
      { name: 'vatRate', label: 'VAT %', type: 'number', default: '16' },
      { name: 'validDays', label: 'Valid for (days)', type: 'number', default: '30' },
      { name: 'dateIssued', label: 'Quote Date', type: 'date', default: today },
      { name: 'preparedBy', label: 'Prepared By', type: 'text', default: 'Davix HDM' },
    ],
    render: (d) => {
      const sub1 = (parseFloat(d.qty1) || 0) * (parseFloat(d.rate1) || 0);
      const sub2 = (parseFloat(d.qty2) || 0) * (parseFloat(d.rate2) || 0);
      const sub3 = (parseFloat(d.qty3) || 0) * (parseFloat(d.rate3) || 0);
      const subtotal = sub1 + sub2 + sub3;
      const vat = subtotal * ((parseFloat(d.vatRate) || 0) / 100);
      const total = subtotal + vat;
      const fmt = (n) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });
      return `
      <div style="font-family:'Times New Roman',serif;background:#fff;padding:1.5rem;border:1px solid #e2e8f0">
        <div style="display:flex;justify-content:space-between;border-bottom:3px solid #1e3a8a;padding-bottom:1rem;margin-bottom:1.5rem">
          <div>
            <div style="font-size:1.2rem;font-weight:700;color:#1e3a8a">${d.orgName || '——————'}</div>
            <div style="font-size:.75rem;color:#64748b">${d.orgAddr || '——————'}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.3rem;font-weight:700;letter-spacing:.05em;color:#0f172a">QUOTATION</div>
            <div style="font-size:.78rem;font-family:monospace">No: ${d.quoteNo || '——————'}</div>
            <div style="font-size:.75rem;color:#64748b">Date: ${d.dateIssued || '——————'}</div>
            <div style="font-size:.75rem;color:#64748b">Valid: ${d.validDays || '——————'} days</div>
          </div>
        </div>
        <div style="font-size:.83rem;margin-bottom:1rem">
          <strong>Prepared for:</strong><br>${d.clientName || '——————'}<br><span style="color:#64748b">${d.clientAddr || '——————'}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
          <thead>
            <tr style="background:#0f172a;color:#fff">
              <th style="padding:.5rem;text-align:left">Description</th>
              <th style="padding:.5rem;text-align:center">Qty</th>
              <th style="padding:.5rem;text-align:right">Rate (KES)</th>
              <th style="padding:.5rem;text-align:right">Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            ${[[d.item1, d.qty1, d.rate1, sub1], [d.item2, d.qty2, d.rate2, sub2], [d.item3, d.qty3, d.rate3, sub3]]
              .map(([i, q, r, s], idx) => i ? `
              <tr style="border-bottom:1px solid #f1f5f9;background:${idx % 2 === 0 ? '#fff' : '#f8fafc'}">
                <td style="padding:.4rem .5rem">${i}</td>
                <td style="padding:.4rem .5rem;text-align:center">${q || '—'}</td>
                <td style="padding:.4rem .5rem;text-align:right">${fmt(parseFloat(r) || 0)}</td>
                <td style="padding:.4rem .5rem;text-align:right">${fmt(s)}</td>
              </tr>` : '').join('')}
          </tbody>
          <tfoot>
            <tr><td colspan="3" style="padding:.4rem .5rem;text-align:right;font-weight:600">Subtotal:</td><td style="padding:.4rem .5rem;text-align:right">KES ${fmt(subtotal)}</td></tr>
            <tr><td colspan="3" style="padding:.4rem .5rem;text-align:right;font-weight:600">VAT (${d.vatRate || 0}%):</td><td style="padding:.4rem .5rem;text-align:right">KES ${fmt(vat)}</td></tr>
            <tr style="background:#0f172a;color:#fff"><td colspan="3" style="padding:.5rem;text-align:right;font-weight:700">TOTAL:</td><td style="padding:.5rem;text-align:right;font-weight:700">KES ${fmt(total)}</td></tr>
          </tfoot>
        </table>
        <div style="margin-top:1.5rem;font-size:.78rem;color:#64748b">Prepared by: <strong>${d.preparedBy || '——————'}</strong> | This quotation is valid for ${d.validDays || '——————'} days from the date of issue.</div>
      </div>`;
    },
  },

  // ── 10. Professional Invoice ─────────────────────────────────
  {
    id: 'finance-invoice',
    name: 'Professional Invoice',
    category: 'finance',
    icon: '📑',
    description: 'Detailed invoice with line items, VAT, and due date.',
    schema: [
      { name: 'orgName', label: 'Your Company', type: 'text', default: 'HDM Digital Agency' },
      { name: 'orgAddr', label: 'Your Address', type: 'text', default: 'Westlands, Nairobi | accounts@hdm.co.ke' },
      { name: 'invoiceNo', label: 'Invoice Number', type: 'text', default: 'INV-2025-042' },
      { name: 'billTo', label: 'Bill To (Client)', type: 'text', default: 'Acme Corp — Attn: Finance Dept' },
      { name: 'billAddr', label: 'Client Address', type: 'text', default: 'Kilimani, Nairobi' },
      { name: 'invoiceDate', label: 'Invoice Date', type: 'date', default: today },
      { name: 'dueDate', label: 'Due Date', type: 'date', default: today },
      { name: 'item1', label: 'Service / Item 1', type: 'text', default: 'UI/UX Design — 3 screens' },
      { name: 'amt1', label: 'Amount 1 (KES)', type: 'number', default: '45000' },
      { name: 'item2', label: 'Service / Item 2', type: 'text', default: 'React Frontend Development' },
      { name: 'amt2', label: 'Amount 2 (KES)', type: 'number', default: '90000' },
      { name: 'item3', label: 'Service / Item 3', type: 'text', default: 'API Integration & Testing' },
      { name: 'amt3', label: 'Amount 3 (KES)', type: 'number', default: '35000' },
      { name: 'vatRate', label: 'VAT %', type: 'number', default: '16' },
      { name: 'bankName', label: 'Bank Name', type: 'text', default: 'Equity Bank Kenya' },
      { name: 'accountNo', label: 'Account Number', type: 'text', default: '0190259876201' },
      { name: 'accountName', label: 'Account Name', type: 'text', default: 'HDM Digital Agency Ltd.' },
    ],
    render: (d) => {
      const a1 = parseFloat(d.amt1) || 0;
      const a2 = parseFloat(d.amt2) || 0;
      const a3 = parseFloat(d.amt3) || 0;
      const subtotal = a1 + a2 + a3;
      const vat = subtotal * ((parseFloat(d.vatRate || 0)) / 100);
      const total = subtotal + vat;
      const fmt = (n) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
      return `
      <div style="font-family:'Times New Roman',serif;background:#fff;border:1px solid #e2e8f0;padding:1.5rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem">
          <div><div style="font-size:1.2rem;font-weight:700">${d.orgName || '——————'}</div><div style="font-size:.75rem;color:#64748b">${d.orgAddr || '——————'}</div></div>
          <div style="text-align:right"><div style="font-size:1.8rem;font-weight:300;color:#94a3b8;letter-spacing:.05em">INVOICE</div><div style="font-family:monospace;font-size:.8rem;font-weight:700">${d.invoiceNo || '——————'}</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;font-size:.83rem">
          <div><div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin-bottom:.25rem">Bill To</div><strong>${d.billTo || '——————'}</strong><br><span style="color:#64748b">${d.billAddr || '——————'}</span></div>
          <div style="text-align:right"><div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin-bottom:.25rem">Invoice Details</div>Invoice Date: <strong>${d.invoiceDate || '——————'}</strong><br>Due Date: <strong>${d.dueDate || '——————'}</strong></div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:.82rem;margin-bottom:1rem">
          <thead><tr style="border-bottom:2px solid #0f172a"><th style="padding:.4rem;text-align:left">Description</th><th style="padding:.4rem;text-align:right">Amount</th></tr></thead>
          <tbody>
            ${[[d.item1, a1], [d.item2, a2], [d.item3, a3]].filter(([i]) => i).map(([i, a]) =>
              `<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:.5rem">${i}</td><td style="padding:.5rem;text-align:right">${fmt(a)}</td></tr>`
            ).join('')}
          </tbody>
          <tfoot>
            <tr><td style="padding:.4rem;text-align:right;color:#64748b">Subtotal:</td><td style="padding:.4rem;text-align:right">${fmt(subtotal)}</td></tr>
            <tr><td style="padding:.4rem;text-align:right;color:#64748b">VAT ${d.vatRate || 0}%:</td><td style="padding:.4rem;text-align:right">${fmt(vat)}</td></tr>
            <tr style="border-top:2px solid #0f172a"><td style="padding:.5rem;text-align:right;font-weight:700;font-size:1rem">Total Due:</td><td style="padding:.5rem;text-align:right;font-weight:700;font-size:1.1rem">${fmt(total)}</td></tr>
          </tfoot>
        </table>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:.75rem;font-size:.78rem;border-radius:4px">
          <strong>Payment Details:</strong> ${d.bankName || '——————'} | Acc: <span style="font-family:monospace">${d.accountNo || '——————'}</span> | Name: ${d.accountName || '——————'}
        </div>
        <p style="font-size:.75rem;color:#94a3b8;margin-top:.75rem;text-align:center">Thank you for your business. Please quote invoice number ${d.invoiceNo || '——————'} on all payments.</p>
      </div>`;
    },
  },

  // ── 11. Curriculum Vitae ─────────────────────────────────────
{
  id: 'cv-standard',
  name: 'Curriculum Vitae (CV)',
  category: 'cv',
  icon: '👤',
  description: 'Clean, professional CV / résumé layout with photo, projects, referees, and hobbies.',
  schema: [
    { name: 'fullName', label: 'Full Name', type: 'text', default: 'Grace Njeri Kamau' },
    { name: 'jobTitle', label: 'Professional Title', type: 'text', default: 'Senior Software Engineer' },
    { name: 'photoUrl', label: 'Photo URL (optional)', type: 'text', default: '' },
    { name: 'email', label: 'Email', type: 'text', default: 'grace.kamau@email.com' },
    { name: 'phone', label: 'Phone', type: 'text', default: '+254 722 456 789' },
    { name: 'location', label: 'Location', type: 'text', default: 'Nairobi, Kenya' },
    { name: 'linkedin', label: 'Portfolio / LinkedIn', type: 'text', default: 'linkedin.com/in/grace-kamau' },
    { name: 'github', label: 'GitHub (optional)', type: 'text', default: '' },
    { name: 'summary', label: 'Professional Summary', type: 'textarea', rows: 3,
      default: 'Results-driven Software Engineer with 6+ years of experience building scalable web applications. Adept in React, Node.js, and cloud infrastructure. Passionate about clean code, mentorship, and delivering user-centric products.' },
    { name: 'experience', label: 'Work Experience', type: 'textarea', rows: 5,
      default: 'Senior Software Engineer | Safaricom PLC | 2022–Present\n• Led migration of monolithic API to microservices, reducing load times by 45%\n• Mentored 4 junior engineers; introduced code review standards\n\nSoftware Developer | Andela Kenya | 2019–2022\n• Built 3 production React applications serving 100k+ users\n• Reduced bug backlog by 70% through systematic testing implementation' },
    { name: 'education', label: 'Education', type: 'textarea', rows: 3,
      default: 'BSc. Computer Science | University of Nairobi | 2015–2019\nAWS Certified Solutions Architect | 2022\nGoogle Professional Data Engineer | 2023' },
    { name: 'skills', label: 'Key Skills (comma-separated)', type: 'text', default: 'React, Node.js, TypeScript, MongoDB, AWS, Docker, PostgreSQL, Python, Git, Agile/Scrum' },
    { name: 'projects', label: 'Projects (one per line: Name | Tech | Link)', type: 'textarea', rows: 4,
      default: 'DocuSoft | React, Node.js, MongoDB | docusoftstore.pxxl.click\nSmartGen | Python, FastAPI, React | smartgen.pxxl.click\nHDM Portfolio | React, Tailwind, Express | hdmdevelopers.pxxl.click' },
    { name: 'hobbies', label: 'Hobbies (comma-separated)', type: 'text', default: 'Open Source, Chess, Photography, Hiking' },
    { name: 'referees', label: 'Referees (one per line: Name, Title, Organization, Phone, Email)', type: 'textarea', rows: 3,
      default: 'Dr. Carol Mutua, Senior Lecturer, Strathmore University, +254 722 000 000, c.mutua@strathmore.edu\nProf. James Otieno, Dean of Engineering, University of Nairobi, +254 733 000 000, j.otieno@uonbi.ac.ke' },
  ],
  render: (d) => {
    const skills = (d.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
    const hobbies = (d.hobbies || '').split(',').map((s) => s.trim()).filter(Boolean);

    const projects = (d.projects || '').split('\n').filter(Boolean).map((line) => {
      const parts = line.split('|').map((s) => s.trim());
      return { name: parts[0] || '', tech: parts[1] || '', link: parts[2] || '' };
    });

    const referees = (d.referees || '').split('\n').filter(Boolean).map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      return { name: parts[0] || '', title: parts[1] || '', org: parts[2] || '', phone: parts[3] || '', email: parts[4] || '' };
    });

    const photoHTML = d.photoUrl
      ? `<img src="${d.photoUrl}" alt="Photo" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #93c5fd;margin-bottom:1rem" />`
      : `<div style="width:100px;height:100px;border-radius:50%;background:#1e293b;color:#93c5fd;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;margin-bottom:1rem;border:3px solid #93c5fd">${(d.fullName || '?').charAt(0)}</div>`;

    // Smoothing helpers
    const smooth = '-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:geometricPrecision';
    const shadow = 'text-shadow:0 0 1px currentColor';

    return `
      <div style="font-family:'Times New Roman',Georgia,serif;background:#fff;${smooth}">
        <h1 style="text-align:center;font-size:1.3rem;font-weight:700;letter-spacing:.15em;padding:1.2rem 0 .5rem;border-bottom:3px double #0f172a;margin:0 1.5rem;color:#0f172a;${smooth}">CURRICULUM VITAE</h1>
        <div style="display:flex;min-height:400px">
          <!-- LEFT SIDEBAR (dark) -->
          <div style="width:35%;background:#0f172a;color:#fff;padding:1.5rem 1rem;${smooth}">
            <div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:1.5rem">
              ${photoHTML}
              <div style="font-size:1.1rem;font-weight:800;line-height:1.2;color:#ffffff;${smooth};${shadow}">${d.fullName || '——————'}</div>
              <div style="font-size:.78rem;color:#93c5fd;margin-top:.25rem;font-weight:600;${smooth};${shadow}">${d.jobTitle || '——————'}</div>
            </div>

            <div style="font-size:.85rem;margin-bottom:1.5rem;line-height:2;color:#ffffff;${smooth}">
              <div style="color:#93c5fd;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.3rem;font-weight:700;${smooth};${shadow}">Contact</div>
              ${d.email ? `<div style="${smooth}">📧 ${d.email}</div>` : ''}
              ${d.phone ? `<div style="${smooth}">📞 ${d.phone}</div>` : ''}
              ${d.location ? `<div style="${smooth}">📍 ${d.location}</div>` : ''}
              ${d.linkedin ? `<div style="${smooth}">🔗 ${d.linkedin}</div>` : ''}
              ${d.github ? `<div style="${smooth}">🐙 ${d.github}</div>` : ''}
            </div>

            ${skills.length ? `
            <div style="margin-bottom:1.5rem">
              <div style="color:#93c5fd;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem;font-weight:700;${smooth};${shadow}">Skills</div>
              <div style="display:flex;flex-wrap:wrap;gap:.3rem">
                ${skills.map((s) => `<span style="background:#1e293b;color:#93c5fd;padding:.2rem .5rem;border-radius:3px;font-size:.7rem;font-weight:600;${smooth};${shadow}">${s}</span>`).join('')}
              </div>
            </div>` : ''}

            ${hobbies.length ? `
            <div style="margin-bottom:1.5rem">
              <div style="color:#93c5fd;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem;font-weight:700;${smooth};${shadow}">Hobbies</div>
              <div style="display:flex;flex-wrap:wrap;gap:.3rem">
                ${hobbies.map((h) => `<span style="background:#1e293b;color:#93c5fd;padding:.2rem .5rem;border-radius:3px;font-size:.7rem;font-weight:600;${smooth};${shadow}">${h}</span>`).join('')}
              </div>
            </div>` : ''}

            ${referees.some((r) => r.name) ? `
            <div>
              <div style="color:#93c5fd;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem;font-weight:700;${smooth};${shadow}">Referees</div>
              ${referees.filter((r) => r.name).map((r) => `
                <div style="font-size:.7rem;margin-bottom:.6rem;line-height:1.5;${smooth}">
                  <div style="font-weight:700;color:#ffffff;${smooth};${shadow}">${r.name}</div>
                  ${r.title ? `<div style="color:#93c5fd;${smooth}">${r.title}</div>` : ''}
                  ${r.org ? `<div style="color:#cbd5e1;${smooth}">${r.org}</div>` : ''}
                  ${r.phone ? `<div style="color:#cbd5e1;${smooth}">📞 ${r.phone}</div>` : ''}
                  ${r.email ? `<div style="color:#cbd5e1;font-size:.65rem;${smooth}">✉️ ${r.email}</div>` : ''}
                </div>
              `).join('')}
            </div>` : ''}
          </div>

          <!-- RIGHT COLUMN (light) -->
          <div style="flex:1;padding:1.5rem;font-size:.87rem;color:#0f172a;${smooth}">
            ${d.summary ? `
            <section style="margin-bottom:1.2rem">
              <h3 style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #0f172a;padding-bottom:.2rem;margin-bottom:.5rem;color:#0f172a;${smooth}">Profile</h3>
              <p style="color:#1f2937;${smooth}">${d.summary}</p>
            </section>` : ''}

            ${d.experience ? `
            <section style="margin-bottom:1.2rem">
              <h3 style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #0f172a;padding-bottom:.2rem;margin-bottom:.5rem;color:#0f172a;${smooth}">Experience</h3>
              <div style="color:#1f2937;white-space:pre-wrap;${smooth}">${d.experience}</div>
            </section>` : ''}

            ${d.education ? `
            <section style="margin-bottom:1.2rem">
              <h3 style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #0f172a;padding-bottom:.2rem;margin-bottom:.5rem;color:#0f172a;${smooth}">Education &amp; Certifications</h3>
              <div style="color:#1f2937;white-space:pre-wrap;${smooth}">${d.education}</div>
            </section>` : ''}

            ${projects.some((p) => p.name) ? `
            <section style="margin-bottom:1.2rem">
              <h3 style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #0f172a;padding-bottom:.2rem;margin-bottom:.5rem;color:#0f172a;${smooth}">Projects</h3>
              ${projects.filter((p) => p.name).map((p) => `
                <div style="margin-bottom:.5rem">
                  <div style="font-weight:700;color:#0f172a;${smooth}">${p.name}</div>
                  ${p.tech ? `<div style="color:#4b5563;font-size:.8rem;${smooth}">${p.tech}</div>` : ''}
                  ${p.link ? `<a href="${p.link.startsWith('http') ? p.link : 'https://' + p.link}" style="color:#2563eb;font-size:.75rem;${smooth}">🔗 ${p.link}</a>` : ''}
                </div>
              `).join('')}
            </section>` : ''}
          </div>
        </div>
      </div>`;
  },
},

  // ── 12. Cover Letter ─────────────────────────────────────────
  {
    id: 'letter-cover',
    name: 'Modern Cover Letter',
    category: 'letter',
    icon: '📨',
    description: 'Contemporary cover letter with a professional accent bar.',
    schema: [
      { name: 'applicantName', label: 'Your Full Name', type: 'text', default: 'Alex Rivera' },
      { name: 'applicantEmail', label: 'Email', type: 'text', default: 'alex.rivera@email.com' },
      { name: 'applicantPhone', label: 'Phone', type: 'text', default: '+254 700 000 111' },
      { name: 'position', label: 'Position', type: 'text', default: 'Product Manager' },
      { name: 'companyName', label: 'Company', type: 'text', default: 'InnovateTech Kenya' },
      { name: 'hiringManager', label: 'Hiring Manager', type: 'text', default: 'Taylor Smith' },
      { name: 'dateIssued', label: 'Date', type: 'date', default: today },
      { name: 'bodyText', label: 'Letter Body', type: 'textarea', rows: 6,
        default: `I am writing to express my enthusiasm for the Product Manager role at InnovateTech Kenya. With 6+ years of experience driving cross-functional teams to deliver high-impact digital products, I am confident I can contribute meaningfully to your mission.\n\nIn my previous role, I led the end-to-end launch of a fintech product that onboarded 250,000 users within the first quarter, achieving a 4.7-star app store rating. I excel at translating customer insights into clear product requirements and rallying engineering, design, and marketing teams around a shared vision.\n\nI am particularly excited by InnovateTech's focus on financial inclusion in East Africa — a space I am deeply passionate about. I would welcome the opportunity to discuss how my experience aligns with your goals.` },
    ],
    render: (d) => `
      <div style="font-family:'Times New Roman',serif;background:#fff;border-left:5px solid #1e3a8a;padding:1.5rem">
        <div style="margin-bottom:1.5rem">
          <div style="font-size:1.1rem;font-weight:700">${d.applicantName || '——————'}</div>
          <div style="font-size:.78rem;color:#475569">${d.applicantEmail || '——————'} | ${d.applicantPhone || '——————'}</div>
          <div style="font-size:.78rem;color:#94a3b8;margin-top:.2rem">${d.dateIssued || '——————'}</div>
        </div>
        <div style="font-size:.85rem;margin-bottom:1rem">
          <strong>${d.hiringManager || '——————'}</strong><br>
          Hiring Manager, ${d.companyName || '——————'}
        </div>
        <p style="font-size:.85rem;font-weight:600;color:#1e3a8a;margin-bottom:.75rem">Re: Application — ${d.position || '——————'}</p>
        <p style="font-size:.85rem">Dear ${d.hiringManager || '——————'},</p>
        <div style="font-size:.87rem;margin-top:.75rem;white-space:pre-wrap;color:#374151">${d.bodyText || '——————'}</div>
        <div style="margin-top:2rem;font-size:.85rem">
          <p>Warm regards,</p>
          <div style="margin-top:1.5rem;border-top:1px solid #cbd5e1;width:150px;padding-top:.25rem;font-weight:700">${d.applicantName || '——————'}</div>
        </div>
      </div>`,
  },

  {
  id: 'cert-completion',
  name: 'Certificate of Completion',
  category: 'certificate',
  icon: '📜',
  description: 'Award for successfully completing a course or training program.',
  schema: [
    { name: 'institutionName', label: 'Institution / Academy', type: 'text', default: 'HDM Academy' },
    { name: 'recipientName', label: 'Recipient Full Name', type: 'text', default: 'Jane Wanjiru' },
    { name: 'courseName', label: 'Course / Program Name', type: 'text', default: 'Full-Stack Web Development' },
    { name: 'duration', label: 'Duration / Period', type: 'text', default: 'January – March 2026' },
    { name: 'grade', label: 'Grade / Distinction', type: 'text', default: 'Completed with Distinction' },
    { name: 'description', label: 'Additional Description (optional)', type: 'textarea', rows: 2,
      default: 'Having demonstrated proficiency in frontend development, backend APIs, and deployment workflows.' },
    { name: 'dateIssued', label: 'Date of Completion', type: 'date', default: today },
    { name: 'instructor', label: 'Instructor / Director Name', type: 'text', default: 'Davix H. McIntyre' },
    { name: 'instructorTitle', label: 'Instructor / Director Title', type: 'text', default: 'Lead Instructor' },
    { name: 'certificateId', label: 'Certificate ID', type: 'text', default: 'CMP-2026-001' },
    { name: 'stampUrl', label: 'Official Seal URL (optional)', type: 'text', default: '' },
  ],
  render: (d) => {
    const smooth = '-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:geometricPrecision';

    const sealHTML = d.stampUrl
      ? `<img src="${d.stampUrl}" alt="Seal" style="width:110px;height:110px;object-fit:contain;opacity:0.92" />`
      : `<div style="width:110px;height:110px;border:2px dashed #93c5fd;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#93c5fd;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;${smooth}">Seal</div>`;

    return `
      <div style="position:relative;text-align:center;padding:3rem 2.5rem;background:#ffffff;border:6px double #1e3a8a;font-family:'Times New Roman',Georgia,serif;${smooth}">

        <!-- Top emblem -->
        <div style="font-size:2.4rem;line-height:1;margin-bottom:.75rem">📜</div>

        <!-- Institution name -->
        <div style="font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;color:#1e40af;font-weight:700;margin-bottom:.5rem;${smooth}">
          ${d.institutionName || '——————'}
        </div>

        <!-- Main title -->
        <h1 style="font-size:2rem;font-weight:700;color:#1e3a8a;letter-spacing:.06em;text-transform:uppercase;margin:.5rem 0 .25rem;${smooth}">
          Certificate of Completion
        </h1>
        <div style="font-size:.65rem;letter-spacing:.35em;color:#3b82f6;text-transform:uppercase;margin-bottom:2rem;${smooth}">
          Awarded Upon Successful Completion
        </div>

        <!-- Body -->
        <div style="border-top:1px solid #bfdbfe;border-bottom:1px solid #bfdbfe;padding:1.75rem 1rem;margin:0 auto 2rem;max-width:580px">
          <div style="font-size:.8rem;color:#4b5563;margin-bottom:.5rem;${smooth}">This is to certify that</div>

          <div style="font-size:1.9rem;font-weight:700;font-style:italic;color:#1e3a8a;margin:.5rem 0;letter-spacing:.02em;${smooth}">
            ${d.recipientName || '——————'}
          </div>

          <div style="font-size:.85rem;color:#374151;line-height:1.7;max-width:520px;margin:0 auto;${smooth}">
            has successfully completed the course
            <strong style="color:#1e40af">${d.courseName || '——————'}</strong>
            conducted during
            <strong style="color:#1e40af">${d.duration || '——————'}</strong>.
          </div>

          ${d.description ? `
          <div style="font-size:.8rem;color:#4b5563;line-height:1.7;max-width:520px;margin:1rem auto 0;font-style:italic;${smooth}">
            ${d.description}
          </div>` : ''}

          ${d.grade ? `
          <div style="margin-top:1.25rem;display:inline-block;padding:.5rem 1.25rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:999px;font-size:.8rem;font-weight:700;color:#1e40af;letter-spacing:.05em;${smooth}">
            ${d.grade}
          </div>` : ''}
        </div>

        <!-- Signature / seal / date row -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:2.5rem;font-size:.75rem">
          <!-- Date -->
          <div style="text-align:left;min-width:130px">
            <div style="color:#9ca3af;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.35rem;${smooth}">Date of Completion</div>
            <div style="border-top:1px solid #374151;padding-top:.35rem;font-weight:700;color:#1e3a8a;${smooth}">
              ${d.dateIssued || '——————'}
            </div>
          </div>

          <!-- Seal -->
          <div style="text-align:center">
            ${sealHTML}
            <div style="color:#9ca3af;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;margin-top:.35rem;${smooth}">Official Seal</div>
          </div>

          <!-- Instructor signature -->
          <div style="text-align:right;min-width:170px">
            <div style="color:#9ca3af;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.35rem;${smooth}">Authorised By</div>
            <div style="border-top:1px solid #374151;padding-top:.35rem;${smooth}">
              <div style="font-weight:700;color:#1e3a8a">${d.instructor || '——————'}</div>
              <div style="color:#4b5563;font-size:.7rem">${d.instructorTitle || '——————'}</div>
            </div>
          </div>
        </div>

        <!-- Certificate ID -->
        <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);font-size:.6rem;letter-spacing:.12em;color:#94a3b8;font-family:monospace;${smooth}">
          CERT ID: ${d.certificateId || '——————'}
        </div>
      </div>`;
  },
},
];

// ── Filter + lookup helpers ────────────────────────────────────

export const filterTemplates = (list, { category = 'all', search = '' } = {}) => {
  let result = list;
  if (category !== 'all') {
    result = result.filter((t) => t.category === category);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }
  return result;
};

export const getTemplateById = (id) => templates.find((t) => t.id === id);

export default templates;