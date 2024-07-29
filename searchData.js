<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Table Search</title>
  <style>
    .action-btn {
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <div>
    <input type="text" id="searchBox" placeholder="Search...">
    <button id="addBtn">Add Row</button>
  </div>
  <div id="table-data"></div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      function tableToJSON() {
        const table = document.getElementById("main-table");
        const rows = table.querySelectorAll("tr");
        const data = [];

        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].querySelectorAll("td");
          const rowData = {
            name: cells[0].innerText,
            dob: cells[1].innerText,
            email: cells[2].innerText,
            age: cells[3].innerText,
            phone: cells[4].innerText,
          };
          data.push(rowData);
        }
        return data;
      }

      function showRecords(filteredData = null) {
        const data = filteredData || JSON.parse(localStorage.getItem("tableData")) || [];

        const table = document.createElement("table");
        table.classList.add("main-table");
        table.id = "main-table";
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = ["Name", "D.O.B.", "Email", "Age", "Phone", "Action"];

        headers.forEach((headerText) => {
          const th = document.createElement("th");
          th.textContent = headerText;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        data.forEach((item, index) => {
          const bodyRow = document.createElement("tr");
          bodyRow.setAttribute("data-index", index);

          Object.values(item).forEach((text) => {
            const td = document.createElement("td");
            td.textContent = text;
            bodyRow.appendChild(td);
          });

          const actionTd = document.createElement("td");

          const editButton = document.createElement("button");
          editButton.id = "editBtn";
          editButton.textContent = "Edit";
          editButton.classList.add("action-btn");

          const deleteButton = document.createElement("button");
          deleteButton.id = "deleteBtn";
          deleteButton.textContent = "Delete";
          deleteButton.classList.add("action-btn");

          deleteButton.addEventListener("click", () => {
            deleteData(index);
          });

          editButton.addEventListener("click", () => {
            editData(index, bodyRow);
          });
          actionTd.appendChild(editButton);
          actionTd.appendChild(deleteButton);

          bodyRow.appendChild(actionTd);
          tbody.appendChild(bodyRow);
        });

        table.appendChild(tbody);

        return table;
      }

      function addInputRow(table) {
        const tbody = table.querySelector("tbody");

        const newRow = document.createElement("tr");
        const fields = [
          { id: "name", type: "text" },
          { id: "dob", type: "date" },
          { id: "email", type: "email" },
          { id: "age", type: "text" },
          { id: "phone", type: "tel" },
        ];

        fields.forEach((field) => {
          const td = document.createElement("td");
          const input = document.createElement("input");
          input.id = field.id;
          input.type = field.type;
          td.appendChild(input);
          newRow.appendChild(td);
        });

        const actionTd = document.createElement("td");

        const saveButton = document.createElement("button");
        saveButton.id = "saveBtn";
        saveButton.textContent = "Save";
        saveButton.classList.add("action-btn");

        saveButton.addEventListener("click", () => saveData(newRow));

        const deleteButton = document.createElement("button");
        deleteButton.id = "deleteBtn";
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("action-btn");

        deleteButton.addEventListener("click", () => {
          newRow.remove();
        });

        actionTd.appendChild(saveButton);
        actionTd.appendChild(deleteButton);

        newRow.appendChild(actionTd);

        tbody.insertBefore(newRow, tbody.firstChild);
      }

      function saveData(row, index = null) {
        const inputs = row.querySelectorAll("input");

        const data = {
          name: inputs[0].value,
          dob: inputs[1].value,
          email: inputs[2].value,
          age: inputs[3].value,
          phone: inputs[4].value,
        };

        const tableData = JSON.parse(localStorage.getItem("tableData")) || [];

        if (index !== null) {
          tableData[index] = data;
        } else {
          tableData.push(data);
        }

        localStorage.setItem("tableData", JSON.stringify(tableData));
        refreshTable();
      }

      function deleteData(index) {
        const tableData = JSON.parse(localStorage.getItem("tableData"));
        tableData.splice(index, 1);
        localStorage.setItem("tableData", JSON.stringify(tableData));
        refreshTable();
      }

      function editData(index, row) {
        const tableData = JSON.parse(localStorage.getItem("tableData")) || [];
        const rowData = tableData[index];

        row.innerHTML = "";

        const fields = [
          { id: "name", type: "text", value: rowData.name || "" },
          { id: "dob", type: "date", value: rowData.dob || "" },
          { id: "email", type: "email", value: rowData.email || "" },
          { id: "age", type: "text", value: rowData.age || "" },
          { id: "phone", type: "tel", value: rowData.phone || "" },
        ];

        fields.forEach((field) => {
          const td = document.createElement("td");
          const input = document.createElement("input");
          input.id = field.id;
          input.type = field.type;
          input.value = field.value;
          td.appendChild(input);
          row.appendChild(td);
        });

        const actionTd = document.createElement("td");

        const saveButton = document.createElement("button");
        saveButton.id = "saveBtn";
        saveButton.textContent = "Save";
        saveButton.classList.add("action-btn");

        saveButton.addEventListener("click", () => saveData(row, index));

        const cancelButton = document.createElement("button");
        cancelButton.id = "cancelBtn";
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("action-btn");

        cancelButton.addEventListener("click", () => refreshTable());

        actionTd.appendChild(saveButton);
        actionTd.appendChild(cancelButton);

        row.appendChild(actionTd);
      }

      function refreshTable() {
        const container = document.getElementById("table-data");
        container.innerHTML = "";
        container.appendChild(showRecords());
      }

      function searchTable(query) {
        const tableData = JSON.parse(localStorage.getItem("tableData")) || [];
        const filteredData = tableData.filter(item => {
          return Object.values(item).some(value => value.toLowerCase().includes(query.toLowerCase()));
        });
        const container = document.getElementById("table-data");
        container.innerHTML = "";
        container.appendChild(showRecords(filteredData));
      }

      document.getElementById("searchBox").addEventListener("input", (event) => {
        searchTable(event.target.value);
      });

      refreshTable();

      const addBtn = document.getElementById("addBtn");
      addBtn.addEventListener("click", () => {
        const table = document.getElementsByClassName("main-table")[0];
        addInputRow(table);
      });
    });
  </script>
</body>
</html>
