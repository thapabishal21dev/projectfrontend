import React from "react";

const Docs = () => {
  return (
    <div className=" flex justify-center p-12 flex-col gap-4">
      <h1 className=" text-centre text-3xl">Libraries Used in this project</h1>
      <ul className=" text-lg gap-8">
        <li>
          React-Icons - Provides a wide range of scalable vector icons from
          popular icon packs.
        </li>
        <li>
          React-quill - A rich text editor for formatting posts with options
          like bold, lists, and images. Selected for its customization and
          lightweight performance.
        </li>
        <li>
          Sonner - A minimalist toast notification library. Chosen for its clean
          UI, ease of integration, and real-time feedback capability.
        </li>
        <li>
          shadcn/ui - A customizable UI component library that can be integrated
          with Tailwind CSS and also I wanted to try it as part of learning.
        </li>
      </ul>
    </div>
  );
};

export default Docs;
