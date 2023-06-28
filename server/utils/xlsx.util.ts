import * as xlsx from 'xlsx';
import * as fs from 'fs';

const to_json = (workbook: xlsx.WorkBook) => {
  var result: any = {};
  workbook.SheetNames.forEach(function (sheetName) {
    var roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
  });
  return result;
};

export const xlsxReader = (filename: string) => {
  var workbook = xlsx.read(fs.readFileSync(filename));
  return to_json(workbook);
};
