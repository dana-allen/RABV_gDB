import React from "react";
import 'assets/styles/tables.css';

import { metaDataTableRows } from "utils/metaDataHelper";

const MetaData = () => {
  

  return (
    <div className="container">
      <h2>Meta Data Description</h2>

      <table className="table table-striped table-bordered table-font-12 table-width-50">
        <thead>
          <col width="40%" />
          <col width="60%" />
          <tr>
            <th>Field</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {metaDataTableRows.map((row) => (
            <tr key={row.label}>
              <td><b>{row.label}</b></td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetaData;
