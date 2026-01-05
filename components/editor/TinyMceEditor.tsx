import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@/hooks/use-theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface TinyMceEditorProps {
  value: string;
  onChange: any;
  isEmailTemplate?: boolean;
  height?: number;
}

const TinyMceEditor = ({
  value,
  onChange,
  isEmailTemplate = false,
  height = 500,
}: TinyMceEditorProps) => {
  const editorRef = useRef(null);
  const { theme, isMounted } = useTheme();
  const { org: organization } = useSelector((state: RootState) => state.org);

  // if (!isMounted) return null; // wait until theme is resolved
  if (!isMounted) {
    // Preloader while waiting for theme
    // Show a preloader until theme + editor can mount
    return (
      <div className='flex items-center justify-center h-[500px] w-full bg-gray-50 dark:bg-gray-900 rounded-md'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary-main'></div>
      </div>
    );
  }

  const additional_css =
    isEmailTemplate &&
    `background: url("${
      organization?.logo_url || '/default-logo.png'
    }") no-repeat center;
  background-size: 70px auto;
  padding: 10px;
  background-size: 70px auto;
  height: 70px;
  margin-bottom: 20px;`;

  return (
    <>
      <Editor
        key={theme} // forces re-init when theme changes
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_KEY}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | code preview',

          content_style: `
            body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
            body::before {
              content: '';
              display: block;
              ${additional_css}
            }
          `,
          skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: theme === 'dark' ? 'dark' : 'default',
          body_class:
            theme === 'dark' ? 'tinymce-dark-body' : 'tinymce-light-body',
        }}
      />
    </>
  );
};

export default TinyMceEditor;
