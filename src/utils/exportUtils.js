// Export utilities for CSV and Excel
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data, filename = 'export.xlsx') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Create a simple HTML table that Excel can parse
  const headers = Object.keys(data[0]);
  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format role data for export
export const formatRolesForExport = (roles) => {
  return roles.map(role => ({
    'Role Name': role.name,
    'Description': role.description,
    'Status': role.status,
    'Sidebar Permissions': role.sidebarCount,
    'Assigned Users': role.userCount,
    'Created Date': role.createdAt,
    'Created By': role.createdBy,
    'System Role': role.isSystem ? 'Yes' : 'No'
  }));
};

// Format user data for export
export const formatUsersForExport = (users) => {
  return users.map(user => ({
    'Name': user.name,
    'Email': user.email,
    'Role': user.roleName,
    'Department': user.department,
    'Status': user.status,
    'Phone': user.phone,
    'Last Login': user.lastLogin,
    'Created Date': user.createdAt
  }));
};
