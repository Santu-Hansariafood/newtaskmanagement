function createTaskElement(title, description, status, pdfPath) {
  const taskList = document.getElementById("task-list");
  const li = document.createElement("li");
  const titleSpan = document.createElement("span");
  const descriptionSpan = document.createElement("span");
  const statusSpan = document.createElement("span");
  const pdfLink = document.createElement("a");

  titleSpan.textContent = title;
  descriptionSpan.textContent = description;
  statusSpan.textContent = status;
  pdfLink.textContent = "View PDF";
  pdfLink.href = pdfPath;
  pdfLink.target = "_blank";

  li.appendChild(titleSpan);
  li.appendChild(descriptionSpan);
  li.appendChild(statusSpan);
  li.appendChild(pdfLink);

  li.addEventListener("click", () => {
    console.log("Clicked on task:", title);
  });

  taskList.appendChild(li);
}

function handleAddTaskFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const status = document.getElementById("task-status").value;
  const pdfPath = document.getElementById("pdf-path").value;

  if (title && description && status && pdfPath) {
    createTaskElement(title, description, status, pdfPath);
    addTaskForm.reset();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill out all fields.",
    });
  }
}

async function handleExcelUploadFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(this);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Excel file uploaded successfully.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error uploading Excel file.",
      });
    }
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error uploading Excel file.",
    });
  }
}

async function fetchTasks() {
  try {
    const response = await fetch("/api/tasks");

    if (response.ok) {
      const tasks = await response.json();
      tasks.forEach((task) => {
        createTaskElement(
          task.title,
          task.description,
          task.status,
          task.pdfPath
        );
      });
    } else {
      console.error("Failed to fetch tasks:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const addTaskForm = document.getElementById("add-task-form");
  const excelUploadForm = document.getElementById("excel-upload-form");

  addTaskForm.addEventListener("submit", handleAddTaskFormSubmit);
  excelUploadForm.addEventListener("submit", handleExcelUploadFormSubmit);

  fetchTasks();
});
