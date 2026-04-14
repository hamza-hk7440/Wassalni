import fs from 'fs';
let code = fs.readFileSync('src/components/common/EmployeeManagementPage.jsx', 'utf8');
// The HTML `<section \n className="..." \n style={{ ...background... `
code = code.replace(/<section[\s\S]*?className=\"min-h-screen px-4 pb-10 pt-24 md:px-8\"[\s\S]*?style=\{\{[\s\S]*?background:[\s\S]*?\}\}[\s\S]*?>/, '<section className="min-h-screen px-4 pb-10 pt-24 md:px-8 bg-gradient-to-b from-iceWhite via-frostBlue via-[35%] to-pureWhite">');
fs.writeFileSync('src/components/common/EmployeeManagementPage.jsx', code);
