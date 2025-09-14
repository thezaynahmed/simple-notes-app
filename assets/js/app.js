document.addEventListener("DOMContentLoaded", () => {
  // --- 1. THEME TOGGLE (DARK/LIGHT MODE) ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Function to apply the saved theme on load
  const applyTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  };

  // Event listener for the toggle button
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    // Save the current theme preference to localStorage
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // Apply theme when the page loads
  applyTheme();

  // --- 2. NOTES CRUD APP ---
  const noteForm = document.getElementById("note-form");
  const noteIdInput = document.getElementById("note-id");
  const noteTitleInput = document.getElementById("note-title");
  const noteContentInput = document.getElementById("note-content");
  const noteList = document.getElementById("note-list");
  const formSubmitBtn = document.getElementById("form-submit-btn");
  const formCancelBtn = document.getElementById("form-cancel-btn");

  // Load notes from localStorage or initialize an empty array
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  // --- RENDER NOTES FUNCTION ---
  const renderNotes = () => {
    noteList.innerHTML = "";
    if (notes.length === 0) {
      noteList.innerHTML =
        '<p style="text-align:center; opacity: 0.7; grid-column: 1 / -1;">No notes yet. Add one above!</p>';
      return;
    }

    notes.forEach((note) => {
      const noteCard = document.createElement("div");
      noteCard.className = "note-card";
      noteCard.setAttribute("data-id", note.id);

      noteCard.innerHTML = `
                <div>
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-content">${note.content}</p>
                </div>
                <div class="note-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
      noteList.appendChild(noteCard);
    });
  };

  // --- SAVE NOTES TO LOCALSTORAGE ---
  const saveNotes = () => {
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  // --- RESET FORM ---
  const resetForm = () => {
    noteForm.reset();
    noteIdInput.value = "";
    formSubmitBtn.textContent = "Add Note";
    formCancelBtn.style.display = "none";
  };

  // --- ADD/UPDATE NOTE ---
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = noteIdInput.value;
    const noteData = {
      title: noteTitleInput.value,
      content: noteContentInput.value,
    };

    if (id) {
      // Update existing note
      notes = notes.map((note) =>
        note.id == id ? { ...note, ...noteData } : note
      );
    } else {
      // Add new note
      noteData.id = Date.now();
      notes.push(noteData);
    }

    saveNotes();
    renderNotes();
    resetForm();
  });

  // --- CANCEL EDIT ---
  formCancelBtn.addEventListener("click", resetForm);

  // --- EDIT AND DELETE ---
  noteList.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const noteCard = target.closest(".note-card");
    const noteId = noteCard.dataset.id;

    if (target.classList.contains("edit-btn")) {
      const noteToEdit = notes.find((note) => note.id == noteId);
      noteIdInput.value = noteToEdit.id;
      noteTitleInput.value = noteToEdit.title;
      noteContentInput.value = noteToEdit.content;

      formSubmitBtn.textContent = "Update Note";
      formCancelBtn.style.display = "inline-block";
      noteForm.scrollIntoView({ behavior: "smooth" });
    } else if (target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this note?")) {
        notes = notes.filter((note) => note.id != noteId);
        saveNotes();
        renderNotes();
      }
    }
  });

  // Initial render
  renderNotes();

  // --- DYNAMIC YEAR UPDATE ---
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
