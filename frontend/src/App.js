import React, { useState, useRef } from "react";
import "./App.css";

/*
  Color palette (from the work item):
  --primary: #1976D2
  --secondary: #424242
  --accent: #FFD600
*/

const initialFolders = [
  { id: "all", name: "All Notes" },
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
];

const initalNotes = [
  {
    id: "1",
    folder: "personal",
    title: "Welcome to Notes",
    content: "This is your very first note! Use the + to add more.",
    updated: new Date().toISOString(),
  },
  {
    id: "2",
    folder: "work",
    title: "React Project Ideas",
    content: "Build a notes app! ✔️",
    updated: new Date().toISOString(),
  },
];

function Sidebar({ folders, currentFolder, setCurrentFolder, onNewFolder }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="brand-title">🗒️ Notes</span>
      </div>
      <nav className="folder-list">
        {folders.map((f) => (
          <button
            key={f.id}
            className={f.id === currentFolder ? "folder btn-active" : "folder"}
            onClick={() => setCurrentFolder(f.id)}
          >
            {f.name}
          </button>
        ))}
      </nav>
      <button className="btn-add-folder" onClick={onNewFolder}>
        + New Folder
      </button>
    </aside>
  );
}

function NotesList({
  notes,
  selectedId,
  setSelectedId,
  onCreate,
  onDelete,
  search,
  setSearch,
}) {
  return (
    <section className="notes-list-section">
      <div className="notes-list-header">
        <input
          className="input search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes…"
        />
        <button className="btn btn-accent" onClick={onCreate} title="New note">
          ＋
        </button>
      </div>
      <ul className="notes-list">
        {notes.length === 0 && (
          <li className="no-notes">No notes found.</li>
        )}
        {notes.map((note) => (
          <li
            key={note.id}
            className={
              note.id === selectedId
                ? "note-list-item selected"
                : "note-list-item"
            }
          >
            <div className="note-title-area" onClick={() => setSelectedId(note.id)}>
              <div className="note-title">{note.title || "(Untitled Note)"}</div>
              <div className="note-updated">
                {new Date(note.updated).toLocaleDateString()}{" "}
                {new Date(note.updated).toLocaleTimeString()}
              </div>
            </div>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(note.id)}
              title="Delete note"
              aria-label="Delete"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NoteEditor({
  note,
  onEdit,
  onSave,
  onCancel,
  editing,
  setEditing,
  folders,
  onChangeFolder,
}) {
  const [draft, setDraft] = useState({ ...note });
  const didInit = useRef(false);
  React.useEffect(() => {
    if (!editing) setDraft(note);
    // eslint-disable-next-line
  }, [note.id]);
  React.useEffect(() => {
    if (editing && !didInit.current) {
      setDraft(note);
      didInit.current = true;
    }
    if (!editing) didInit.current = false;
  }, [editing, note]);

  if (!note) {
    return (
      <section className="note-editor empty">
        <span>Select or create a note to view/edit</span>
      </section>
    );
  }

  function handleChange(e) {
    setDraft((d) => ({ ...d, [e.target.name]: e.target.value }));
  }

  function handleFolderChange(e) {
    setDraft((d) => ({ ...d, folder: e.target.value }));
    onChangeFolder && onChangeFolder(e.target.value);
  }

  function handleSave() {
    onSave({ ...draft, updated: new Date().toISOString() });
    setEditing(false);
  }

  if (!editing) {
    return (
      <section className="note-editor">
        <div className="note-meta">
          <select
            className="input folder-select"
            value={note.folder}
            onChange={handleFolderChange}
            disabled
          >
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <button className="btn" onClick={() => setEditing(true)}>
            Edit
          </button>
        </div>
        <h2 className="note-title display">{note.title}</h2>
        <p className="note-content display">
          {note.content &&
            note.content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </p>
        <div className="note-footer">
          <span className="note-updated">
            Last updated: {new Date(note.updated).toLocaleString()}
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="note-editor editing">
      <div className="note-meta">
        <select
          className="input folder-select"
          name="folder"
          value={draft.folder}
          onChange={handleFolderChange}
        >
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      <input
        className="input note-title-edit"
        autoFocus
        name="title"
        value={draft.title}
        onChange={handleChange}
        placeholder="Note title"
        maxLength={128}
      />
      <textarea
        className="input note-content-edit"
        name="content"
        value={draft.content}
        onChange={handleChange}
        placeholder="Write your note here…"
        rows={12}
      />
      <div className="note-editor-actions">
        <button className="btn btn-main" onClick={handleSave}>
          Save
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Local state (Replace with backend integration where needed)
  const [folders, setFolders] = useState(initialFolders);
  const [currentFolder, setCurrentFolder] = useState("all");
  const [notes, setNotes] = useState(initalNotes);
  const [selectedId, setSelectedId] = useState(initalNotes[0]?.id || null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);

  // Derived
  const filteredNotes = notes
    .filter((note) =>
      currentFolder === "all" ? true : note.folder === currentFolder
    )
    .filter((note) => {
      if (search.trim().length === 0) return true;
      return (
        note.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        note.content.toLowerCase().includes(search.trim().toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.updated) - new Date(a.updated));

  const currentNote =
    notes.find((n) => n.id === selectedId) ||
    filteredNotes[0] ||
    null;

  // PUBLIC_INTERFACE
  function handleNewNote() {
    setEditing(true);
    const newId = Math.random().toString(36).slice(2, 9);
    const folderToAssign =
      currentFolder === "all" ? folders[1].id : currentFolder;
    const newNote = {
      id: newId,
      title: "",
      content: "",
      folder: folderToAssign,
      updated: new Date().toISOString(),
    };
    setNotes((ns) => [newNote, ...ns]);
    setSelectedId(newId);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(id) {
    if (window.confirm("Delete this note? This cannot be undone.")) {
      setNotes((ns) => ns.filter((n) => n.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  // PUBLIC_INTERFACE
  function handleSaveNote(editedNote) {
    setNotes((ns) =>
      ns.map((n) => (n.id === editedNote.id ? { ...editedNote } : n))
    );
    setEditing(false);
  }

  // PUBLIC_INTERFACE
  function handleCancelEdit() {
    setEditing(false);
  }

  // PUBLIC_INTERFACE
  function handleChangeFolder(newFolder) {
    setNotes((ns) =>
      ns.map((n) =>
        n.id === currentNote.id ? { ...n, folder: newFolder } : n
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleNewFolder() {
    const name = prompt("New folder name?");
    if (!name) return;
    const newId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setFolders((prev) => [...prev, { id: newId, name }]);
  }

  // Keyboard navigation for accessibility
  React.useEffect(() => {
    function onKeyDown(e) {
      // shortcut: "n" to make new note, "e" to edit
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement.tagName
        )
      )
        return;
      if (e.key === "n") {
        e.preventDefault(); handleNewNote();
      }
      if (e.key === "e" && selectedId && !editing) {
        e.preventDefault(); setEditing(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line
  }, [selectedId, editing]);

  return (
    <div className="notes-app-root">
      <Sidebar
        folders={folders}
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
        onNewFolder={handleNewFolder}
      />
      <main className="main-panel">
        <NotesList
          notes={filteredNotes}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onCreate={handleNewNote}
          onDelete={handleDeleteNote}
          search={search}
          setSearch={setSearch}
        />
        <NoteEditor
          note={currentNote}
          onEdit={() => setEditing(true)}
          onSave={handleSaveNote}
          onCancel={handleCancelEdit}
          editing={editing}
          setEditing={setEditing}
          folders={folders}
          onChangeFolder={handleChangeFolder}
        />
      </main>
    </div>
  );
}

export default App;
