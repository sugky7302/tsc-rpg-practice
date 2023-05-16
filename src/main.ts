import * as XLSX from 'xlsx';
const workbook = XLSX.readFile('data.xlsx');
export const DATABASE = Object.keys(workbook.Sheets).map((sheetName) => ({
    name: sheetName,
    data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
}));

console.log(DATABASE[0].data);
