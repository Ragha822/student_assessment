document.addEventListener("DOMContentLoaded", () => {
  const timetableForm = document.getElementById("timetableForm");
  const timetableList = document.getElementById("timetableList");

  timetableForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const date = document.getElementById("date").value;
    const timeSlot = document.getElementById("timeSlot").value;
    const course = document.getElementById("course").value;
    const room = document.getElementById("room").value;

    // Add new row to timetable
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${date}</td>
            <td>${timeSlot}</td>
            <td>${course}</td>
            <td>${room}</td>
            <td>
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </td>
        `;
    timetableList.appendChild(row);

    // Clear form
    timetableForm.reset();
  });

  // Delete functionality
  timetableList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      e.target.parentElement.parentElement.remove();
    }
  });
});
