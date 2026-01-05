declare module 'quill-better-table' {
  import { Quill } from 'quill';
  
  interface QuillBetterTableOptions {
    operationMenu?: {
      items?: {
        unmergeCells?: {
          text?: string;
        };
      };
      color?: {
        colors?: string[];
        text?: string;
      };
    };
  }
  
  class QuillBetterTable {
    constructor(quill: Quill, options?: QuillBetterTableOptions);
  }
  
  export = QuillBetterTable;
}

declare module 'quill-image-resize-module' {
  import { Quill } from 'quill';
  
  interface ImageResizeOptions {
    displayStyles?: {
      backgroundColor?: string;
      border?: string;
      color?: string;
    };
    modules?: string[];
  }
  
  class ImageResize {
    constructor(quill: Quill, options?: ImageResizeOptions);
  }
  
  export = ImageResize;
}

declare module 'quill-image-drop-and-paste' {
  import { Quill } from 'quill';
  
  interface ImageDropAndPasteOptions {
    // Add any specific options if needed
  }
  
  class ImageDropAndPaste {
    constructor(quill: Quill, options?: ImageDropAndPasteOptions);
  }
  
  export = ImageDropAndPaste;
}
