import * as XLSX from "xlsx";
import AddButton from "./AddButton";

const createOptions = (handleAdd, columns) => {
  return {
    download: true,
    customToolbar: () => {
      return (
        <AddButton onAdd={handleAdd} />
      );
    },
    print: false,
    viewColumns: true,
    filter: true,
    selectableRows: "none",
    responsive: "standard",
    textLabels: {
      toolbar: {
        downloadCsv: "Download",
      },
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      const dataToExport = data.map((row) => {
        let rowData = {};
        row.data.forEach((value, index) => {
          if (columns[index].name !== "Actions") {
            rowData[columns[index].label] = value != null ? value.toString() : ""; // Manejar valores indefinidos/nulos
          }
        });
        return rowData;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      const colWidths = columns
        .filter(col => col.name !== "Actions")
        .map(col => {
          const maxWidth = Math.max(
            col.label.length,
            ...data.map(row => {
              const value = row.data[columns.findIndex(c => c.label === col.label)];
              return value != null ? value.toString().length : 0; // Manejar valores indefinidos/nulos
            })
          );
          return { width: maxWidth + 2 }; // Añadir un poco de espacio extra
        });

      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "IPMS allocation Q125 09042024");
      XLSX.writeFile(wb, "IPMS allocation Q125 09042024.xlsx");
      return false;
    },
  };
};

export default createOptions;
