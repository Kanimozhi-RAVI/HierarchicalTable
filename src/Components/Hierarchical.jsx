import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


function Hierarchical() {
  const initialData = [
    {
      id: "electronics",
      label: "Electronics",
      value: 1500,
      originalValue: 1500,
      children: [
        { id: "phones", label: "Phones", value: 800, originalValue: 800 },
        { id: "laptops", label: "Laptops", value: 700, originalValue: 700 },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      originalValue: 1000,
      children: [
        { id: "tables", label: "Tables", value: 300, originalValue: 300 },
        { id: "chairs", label: "Chairs", value: 700, originalValue: 700 },
      ],
    },
  ];

  const [rows, setRows] = useState(initialData);
  const [inputs, setInputs] = useState({});

  const calculateParent = (row) => {
    if (row.children) {
      row.value = row.children.reduce((acc, c) => acc + c.value, 0);
    }
    return row;
  };

  const calculateVariance = (row) => {
    row.variance = (((row.value - row.originalValue) / row.originalValue) * 100).toFixed(2);
    if (row.children) row.children.forEach(c => calculateVariance(c));
  };

  const handlePercent = (row, percent) => {
    const val = parseFloat(percent);
    if (isNaN(val)) return;

    if (row.children) {
      row.children.forEach(c => c.value = +(c.value + (c.value * val) / 100).toFixed(2));
      calculateParent(row);
    } else row.value = +(row.value + (row.value * val) / 100).toFixed(2);

    calculateVariance(row);
    setRows([...rows]);
  };

  const handleValue = (row, val) => {
    const value = parseFloat(val);
    if (isNaN(value)) return;

    if (row.children) {
      const total = row.children.reduce((acc, c) => acc + c.value, 0);
      row.children.forEach(c => c.value = +(c.value / total * value).toFixed(2));
      row.value = value;
    } else row.value = value;

    calculateVariance(row);
    setRows([...rows]);
  };

  const handleInputChange = (e, id) => setInputs({ ...inputs, [id]: e.target.value });

  const renderRow = (row, level = 0) => (
    <React.Fragment key={row.id}>
      <tr>
        <td style={{ fontWeight:'bold' ,width:"200px" }}>
          {row.label}
        </td>
        <td style={{width:"200px"}}>{row.value}</td>
        <td style={{width:"200px"}}>
          <input
            type="number"
            className="form-control"
            value={inputs[row.id] || ""}
            onChange={(e) => handleInputChange(e, row.id)}
          />
        </td>
        <td style={{width:'250px'}}>
          <button className="btn btn-primary btn-sm" onClick={() => handlePercent(row, inputs[row.id])}>
            Allocation %
          </button>
        </td>
        <td style={{width:'250px'}}>
          <button className="btn btn-success btn-sm" onClick={() => handleValue(row, inputs[row.id])}>
            Allocation Val
          </button>
        </td>
        <td style={{width:"200px"}}>{row.variance || 0}%</td>
      </tr>
      {row.children && row.children.map(child => renderRow(child, level + 1))}
    </React.Fragment>
  );

  const grandTotal = rows.reduce((acc, r) => acc + r.value, 0);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Hierarchical Table</h2>
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => renderRow(row))}
          <tr className="table-secondary fw-bold">
            <td>Grand Total</td>
            <td>{grandTotal}</td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Hierarchical;
