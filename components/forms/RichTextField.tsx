// components/custom-editor.js

import React from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
  data: string;
  fieldChange: (data: string) => void;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ align: [] }],
    [{ color: [] }],
    ["code-block"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "align",
  "color",
  "code-block",
];

function RickTextField({ data, fieldChange }: Props) {
  const handleChange = (newData: string) => {
    // const newData = editor.getData();
    console.log("newData :>> ", newData);
    fieldChange(newData);
  };

  return (
    <QuillEditor
      value={data}
      onChange={handleChange}
      modules={quillModules}
      // formats={quillFormats}
      className="w-full h-[70%] mt-10 bg-dark-3 text-light-1 !text-base-regular"
    />
    // <CKEditor
    //   editor={ClassicEditor}
    //   config={editorConfiguration}
    //   data={data}
    //   onChange={handleChange}
    // />
  );
}

export default RickTextField;
