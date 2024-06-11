import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function UploadExcel() {
  const [rows, setRows] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target.result;
      const data = new Uint8Array(arrayBuffer);
      let binaryString = '';
      for (let i = 0; i < data.byteLength; i++) {
        binaryString += String.fromCharCode(data[i]);
      }
      const wb = XLSX.read(binaryString, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setRows(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="form-container">
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      <table className="excel-table">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default UploadExcel;