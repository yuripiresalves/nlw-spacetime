"use client";

import { ChangeEvent } from "react";

export function MediaPicker() {
  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.files);
  }

  return (
    <input
      onChange={onFileSelected}
      type="file"
      id="media"
      className="invisible h-0 w-0"
    />
  );
}
