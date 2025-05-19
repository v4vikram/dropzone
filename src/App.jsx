import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactSortable } from 'react-sortablejs';

const App = () => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}`, // unique ID for sorting
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (fileToRemove) => {
    setFiles(files.filter(({ file }) => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  useEffect(() => {
    // Cleanup memory when previews are no longer needed
    return () => {
      files.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [files]);

  return (
    <div className="min-h-screen p-10 bg-gray-100 space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center cursor-pointer min-h-[150px] rounded bg-white ${
          isDragActive ? 'bg-blue-100' : ''
        }`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop some images here, or click to select files</p>
      </div>

      {/* Sortable List */}
      <ReactSortable
        list={files}
        setList={setFiles}
        className="flex gap-4 flex-wrap"
      >
        {files.map(({ id, file, preview }) => (
          <div key={id} className="relative w-32 h-32">
            <img
              src={preview}
              alt={file.name}
              className="w-[300px] h-[300px] object-cover rounded-md"
              style={{width: "300px", height:"300px", objectFit:"contain"}}
            />
            <button
              onClick={() => removeImage(file)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              X
            </button>
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default App;
