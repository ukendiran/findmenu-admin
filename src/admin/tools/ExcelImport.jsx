import { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const ExcelImport = () => {
  const [data, setData] = useState([]);

  // Handle file upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const abuf = e.target.result;
      const wb = XLSX.read(abuf, { type: "array" });

      // Assuming the first sheet contains the data
      const mainCategory = wb.Sheets["MainCategory"];
      const subCategory = wb.Sheets["SubCategory"];
      const items = wb.Sheets["Items"];

      // Convert sheet data to JSON
      const mainCategoryData = XLSX.utils.sheet_to_json(mainCategory);
      const subCategoryData = XLSX.utils.sheet_to_json(subCategory);
      const itemData = XLSX.utils.sheet_to_json(items);
      setData({
        mainCategory: mainCategoryData,
        subCategory: subCategoryData,
        itemData: itemData,
      });
      message.success("File successfully uploaded and parsed");
    };
    reader.readAsArrayBuffer(file);
    return false; // prevent upload action to keep it client-side
  };

  return (
    <div>
      <Upload
        customRequest={({ file, onSuccess }) => {
          handleFileUpload(file);
          onSuccess(null, file);
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Upload Excel File</Button>
      </Upload>

      <h3>Parsed Data:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ExcelImport;
