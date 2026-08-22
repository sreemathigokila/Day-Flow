export const exportToPdf = ({ title, subtitle, headers, data, filename = 'Dayflow_Report.pdf', user }) => {
  const todayStr = new Date().toLocaleString();
  
  const headersHtml = headers
    .map(
      (h) =>
        `<th style="padding: 10px 14px; background-color: #1e293b; color: #ffffff; text-align: left; font-size: 12px; font-weight: 700; border: 1px solid #334155;">${h}</th>`
    )
    .join('');

  const rowsHtml = data
    .map(
      (row, idx) =>
        `<tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          ${row
            .map(
              (cell) =>
                `<td style="padding: 9px 14px; border: 1px solid #e2e8f0; font-size: 11.5px; color: #334155; vertical-align: middle;">${cell}</td>`
            )
            .join('')}
        </tr>`
    )
    .join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the PDF report.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Dayflow HRMS</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            color: #1e293b;
            background: #ffffff;
          }
          .brand-header {
            background: linear-gradient(135deg, #1e40af, #2563eb);
            color: #ffffff;
            padding: 20px 24px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .brand-title {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin: 0;
          }
          .brand-sub {
            font-size: 11px;
            opacity: 0.9;
            margin-top: 4px;
          }
          .meta-info {
            text-align: right;
            font-size: 10.5px;
            opacity: 0.95;
            line-height: 1.5;
          }
          .doc-header {
            margin-bottom: 18px;
          }
          .doc-title {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 6px 0;
          }
          .doc-subtitle {
            font-size: 12px;
            color: #64748b;
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            border-radius: 8px;
            overflow: hidden;
          }
          .footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="brand-header">
          <div>
            <div class="brand-title">Dayflow HRMS</div>
            <div class="brand-sub">Enterprise Role-Based Management System & AI Assistant</div>
          </div>
          <div class="meta-info">
            <div><strong>Generated:</strong> ${todayStr}</div>
            ${user?.name ? `<div><strong>User:</strong> ${user.name} (${user.role?.replace('ROLE_', '')})</div>` : ''}
          </div>
        </div>

        <div class="doc-header">
          <div class="doc-title">${title}</div>
          ${subtitle ? `<div class="doc-subtitle">${subtitle}</div>` : ''}
        </div>

        <table>
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <span>Dayflow HRMS — Confidential Official Document</span>
          <span>Page 1 of 1</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 200);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
