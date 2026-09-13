import { useRef } from "react";

const ACCEPT = ".pdf,.docx";

export default function FileDropzone({ file, onChange }) {
  const inputRef = useRef(null);

  function selectFile(selected) {
    const next = selected?.[0];
    if (next) onChange(next);
  }

  function onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    selectFile(event.dataTransfer.files);
  }

  return (
    <div
      className={`dropzone ${file ? "has-file" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(event) => selectFile(event.target.files)}
      />

      <div className="drop-icon">📄</div>

      {file ? (
        <>
          <strong>{file.name}</strong>
          <span>{(file.size / 1024).toFixed(1)} KB · Click to replace</span>
        </>
      ) : (
        <>
          <strong>Drop your resume here</strong>
          <span>or click to browse · PDF, DOCX · max 5 MB</span>
        </>
      )}
    </div>
  );
}