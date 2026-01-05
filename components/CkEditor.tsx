// components/custom-editor.js
'use client'; // only in App Router

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  HtmlComment,
  HtmlEmbed,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  ShowBlocks,
  SourceEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Undo,
  Font,
  List,
  Image,
  ImageInsert,
  ImageInline,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageToolbar,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface CkEditorProps {
  editorData: string;
  setEditorData: Dispatch<SetStateAction<string>>;
}

const CkEditor = ({ editorData, setEditorData }: CkEditorProps) => {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Check initially
    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Set color tile backgrounds after editor is ready
  useEffect(() => {
    if (!loading) {
      const setColorTileBackgrounds = () => {
        const colorTiles = document.querySelectorAll('.ck.ck-color-grid__tile');
        colorTiles.forEach((tile) => {
          const dataColor = tile.getAttribute('data-color');
          const styleColor = tile.getAttribute('style');

          if (dataColor) {
            // Set the background color directly on the tile and inner element
            (tile as HTMLElement).style.backgroundColor = dataColor;
            const innerTile = tile.querySelector(
              '.ck-color-grid__tile-inner'
            ) as HTMLElement;
            if (innerTile) {
              innerTile.style.backgroundColor = dataColor;
            }
          } else if (styleColor && styleColor.includes('background-color')) {
            // Extract color from style attribute
            const match = styleColor.match(/background-color:\s*([^;]+)/);
            if (match) {
              const color = match[1].trim();
              const innerTile = tile.querySelector(
                '.ck-color-grid__tile-inner'
              ) as HTMLElement;
              if (innerTile) {
                innerTile.style.backgroundColor = color;
              }
            }
          }
        });
      };

      // Set colors immediately
      setColorTileBackgrounds();

      // Set up observer for dynamically added color tiles
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.classList.contains('ck-color-grid__tile')) {
                  setColorTileBackgrounds();
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, [loading]);

  // Custom CSS for dark/light mode
  const editorStyles = `
    .ck-editor__editable {
      background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
      border-color: ${isDarkMode ? '#374151' : '#d1d5db'} !important;
    }
    
    .ck.ck-editor__main > .ck-editor__editable {
      background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
    }
    
    .ck.ck-editor__main > .ck-editor__editable:not(.ck-focused) {
      border-color: ${isDarkMode ? '#374151' : '#d1d5db'} !important;
    }
    
    .ck.ck-editor__main > .ck-editor__editable.ck-focused {
      border-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      box-shadow: 0 0 0 2px ${
        isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
      } !important;
    }
    
    .ck.ck-toolbar {
      background-color: ${isDarkMode ? '#374151' : '#f9fafb'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
    }
    
    .ck.ck-toolbar .ck-toolbar__items {
      background-color: ${isDarkMode ? '#374151' : '#f9fafb'} !important;
    }
    
    .ck.ck-button {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      background-color: ${isDarkMode ? '#374151' : '#f9fafb'} !important;
    }
    
    .ck.ck-button:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#e5e7eb'} !important;
    }
    
    .ck.ck-button.ck-on {
      background-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      color: ${isDarkMode ? '#ffffff' : '#ffffff'} !important;
    }
    
    .ck.ck-dropdown__panel {
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
    }
    
    .ck.ck-dropdown__panel .ck-button {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
    }
    
    .ck.ck-dropdown__panel .ck-button:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#f3f4f6'} !important;
    }
    
    .ck.ck-input {
      background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
    }
    
    .ck.ck-input:focus {
      border-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      box-shadow: 0 0 0 2px ${
        isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
      } !important;
    }
    
    .ck.ck-balloon-panel {
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
    }
    
    .ck.ck-balloon-panel .ck-button {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
    }
    
    .ck.ck-balloon-panel .ck-button:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#f3f4f6'} !important;
    }
    
    .ck.ck-list__item .ck-button {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
    }
    
    .ck.ck-list__item .ck-button:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#f3f4f6'} !important;
    }
    
    .ck.ck-list__item .ck-button.ck-on {
      background-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      color: ${isDarkMode ? '#ffffff' : '#ffffff'} !important;
    }
    
    .ck.ck-color-grid__tile {
      border: 2px solid ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      border-radius: 4px !important;
      transition: all 0.2s ease !important;
      position: relative !important;
      overflow: hidden !important;
    }
    
    .ck.ck-color-grid__tile:hover {
      border-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      transform: scale(1.1) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      z-index: 10 !important;
    }
    
    .ck.ck-color-grid__tile.ck-on {
      border-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      border-width: 3px !important;
      box-shadow: 0 0 0 2px ${
        isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'
      } !important;
    }
    
    .ck.ck-color-grid__tile .ck-color-grid__tile-inner {
      border-radius: 2px !important;
      box-shadow: inset 0 0 0 1px ${
        isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      } !important;
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }
    
    .ck.ck-color-grid__tile[data-color="#f44336"] .ck-color-grid__tile-inner { background-color: #f44336 !important; }
    .ck.ck-color-grid__tile[data-color="#e91e63"] .ck-color-grid__tile-inner { background-color: #e91e63 !important; }
    .ck.ck-color-grid__tile[data-color="#9c27b0"] .ck-color-grid__tile-inner { background-color: #9c27b0 !important; }
    .ck.ck-color-grid__tile[data-color="#673ab7"] .ck-color-grid__tile-inner { background-color: #673ab7 !important; }
    .ck.ck-color-grid__tile[data-color="#3f51b5"] .ck-color-grid__tile-inner { background-color: #3f51b5 !important; }
    .ck.ck-color-grid__tile[data-color="#2196f3"] .ck-color-grid__tile-inner { background-color: #2196f3 !important; }
    .ck.ck-color-grid__tile[data-color="#03a9f4"] .ck-color-grid__tile-inner { background-color: #03a9f4 !important; }
    .ck.ck-color-grid__tile[data-color="#00bcd4"] .ck-color-grid__tile-inner { background-color: #00bcd4 !important; }
    .ck.ck-color-grid__tile[data-color="#009688"] .ck-color-grid__tile-inner { background-color: #009688 !important; }
    .ck.ck-color-grid__tile[data-color="#4caf50"] .ck-color-grid__tile-inner { background-color: #4caf50 !important; }
    .ck.ck-color-grid__tile[data-color="#8bc34a"] .ck-color-grid__tile-inner { background-color: #8bc34a !important; }
    .ck.ck-color-grid__tile[data-color="#cddc39"] .ck-color-grid__tile-inner { background-color: #cddc39 !important; }
    .ck.ck-color-grid__tile[data-color="#ffeb3b"] .ck-color-grid__tile-inner { background-color: #ffeb3b !important; }
    .ck.ck-color-grid__tile[data-color="#ffc107"] .ck-color-grid__tile-inner { background-color: #ffc107 !important; }
    .ck.ck-color-grid__tile[data-color="#ff9800"] .ck-color-grid__tile-inner { background-color: #ff9800 !important; }
    .ck.ck-color-grid__tile[data-color="#ff5722"] .ck-color-grid__tile-inner { background-color: #ff5722 !important; }
    .ck.ck-color-grid__tile[data-color="#795548"] .ck-color-grid__tile-inner { background-color: #795548 !important; }
    .ck.ck-color-grid__tile[data-color="#607d8b"] .ck-color-grid__tile-inner { background-color: #607d8b !important; }
    .ck.ck-color-grid__tile[data-color="#9e9e9e"] .ck-color-grid__tile-inner { background-color: #9e9e9e !important; }
    .ck.ck-color-grid__tile[data-color="#000000"] .ck-color-grid__tile-inner { background-color: #000000 !important; }
    .ck.ck-color-grid__tile[data-color="#ffffff"] .ck-color-grid__tile-inner { background-color: #ffffff !important; }
    
    .ck.ck-color-grid__tile[data-color="red"] .ck-color-grid__tile-inner { background-color: red !important; }
    .ck.ck-color-grid__tile[data-color="blue"] .ck-color-grid__tile-inner { background-color: blue !important; }
    .ck.ck-color-grid__tile[data-color="green"] .ck-color-grid__tile-inner { background-color: green !important; }
    .ck.ck-color-grid__tile[data-color="yellow"] .ck-color-grid__tile-inner { background-color: yellow !important; }
    .ck.ck-color-grid__tile[data-color="orange"] .ck-color-grid__tile-inner { background-color: orange !important; }
    .ck.ck-color-grid__tile[data-color="purple"] .ck-color-grid__tile-inner { background-color: purple !important; }
    .ck.ck-color-grid__tile[data-color="pink"] .ck-color-grid__tile-inner { background-color: pink !important; }
    .ck.ck-color-grid__tile[data-color="brown"] .ck-color-grid__tile-inner { background-color: brown !important; }
    .ck.ck-color-grid__tile[data-color="gray"] .ck-color-grid__tile-inner { background-color: gray !important; }
    .ck.ck-color-grid__tile[data-color="black"] .ck-color-grid__tile-inner { background-color: black !important; }
    .ck.ck-color-grid__tile[data-color="white"] .ck-color-grid__tile-inner { background-color: white !important; }
    
    .ck.ck-color-grid__tile {
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      min-height: 24px !important;
    }
    
    .ck.ck-color-table {
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      border-radius: 6px !important;
      padding: 8px !important;
    }
    
    .ck.ck-color-table__remove-color {
      color: ${isDarkMode ? '#ef4444' : '#ef4444'} !important;
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border: 1px solid ${isDarkMode ? '#ef4444' : '#ef4444'} !important;
      border-radius: 4px !important;
      padding: 4px 8px !important;
      font-size: 12px !important;
      transition: all 0.2s ease !important;
    }
    
    .ck.ck-color-table__remove-color:hover {
      background-color: ${isDarkMode ? '#ef4444' : '#ef4444'} !important;
      color: ${isDarkMode ? '#ffffff' : '#ffffff'} !important;
    }
    
    .ck.ck-color-dropdown .ck-dropdown__panel {
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px ${
        isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
      } !important;
      padding: 12px !important;
    }
    
    .ck.ck-color-dropdown .ck-color-grid {
      gap: 6px !important;
      padding: 8px !important;
    }
    
    .ck.ck-font-color-dropdown .ck-dropdown__panel,
    .ck.ck-font-background-color-dropdown .ck-dropdown__panel {
      min-width: 200px !important;
    }
    
    .ck.ck-font-color-dropdown .ck-color-grid,
    .ck.ck-font-background-color-dropdown .ck-color-grid {
      grid-template-columns: repeat(8, 1fr) !important;
      gap: 4px !important;
    }
    
    .ck.ck-color-dropdown .ck-button .ck-button__label {
      width: 16px !important;
      height: 16px !important;
      border-radius: 2px !important;
      border: 1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
    }
    
    /* Link form styling */
    .ck.ck-link-form {
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
    }
    
    .ck.ck-link-form .ck-labeled-field-view .ck-input {
      background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
    }
    
    .ck.ck-link-form .ck-labeled-field-view .ck-input:focus {
      border-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      box-shadow: 0 0 0 2px ${
        isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
      } !important;
    }
    
    .ck.ck-link-form .ck-button {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      background-color: ${isDarkMode ? '#374151' : '#f9fafb'} !important;
    }
    
    .ck.ck-link-form .ck-button:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#e5e7eb'} !important;
    }
    
    .ck.ck-link-form .ck-button.ck-button-save {
      background-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      color: ${isDarkMode ? '#ffffff' : '#ffffff'} !important;
    }
    
    .ck.ck-link-form .ck-button.ck-button-save:hover {
      background-color: ${isDarkMode ? '#2563eb' : '#2563eb'} !important;
    }
    
    .ck.ck-link-form .ck-button.ck-button-cancel {
      background-color: ${isDarkMode ? '#6b7280' : '#6b7280'} !important;
      color: ${isDarkMode ? '#ffffff' : '#ffffff'} !important;
    }
    
    .ck.ck-link-form .ck-button.ck-button-cancel:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#4b5563'} !important;
    }
    
    /* Force color display with CSS custom properties */
    .ck.ck-color-grid__tile {
      --ck-color-tile-background: var(--ck-color-tile-color, transparent) !important;
    }
    
    .ck.ck-color-grid__tile .ck-color-grid__tile-inner {
      background-color: var(--ck-color-tile-background) !important;
    }
    
    /* Additional color overrides for better visibility */
    .ck.ck-color-grid__tile[style*="background-color"] .ck-color-grid__tile-inner {
      background-color: inherit !important;
    }
    
    /* Ensure color tiles show their actual colors */
    .ck.ck-color-grid__tile[data-color] {
      background-color: var(--ck-color-tile-color) !important;
    }
    
    .ck.ck-color-grid__tile[data-color] .ck-color-grid__tile-inner {
      background-color: var(--ck-color-tile-color) !important;
    }
  `;

  return (
    <>
      <style>{editorStyles}</style>
      {loading && (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main'></div>
        </div>
      )}
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onReady={(editor) => {
          setLoading(false);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
        }}
        config={{
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'sourceEditing',
              'showBlocks',
              '|',
              'heading',
              '|',
              'fontColor',
              'fontBackgroundColor',
              'bold',
              'italic',
              'underline',
              '|',
              'insertImageViaUrl',
              'link',
              'insertTable',
              'blockQuote',
              'htmlEmbed',
              '|',
              'bulletedList',
              'numberedList',
              'outdent',
              'indent',
            ],
          },
          plugins: [
            AccessibilityHelp,
            Autoformat,
            Autosave,
            BlockQuote,
            Bold,
            Essentials,
            FullPage,
            GeneralHtmlSupport,
            Heading,
            HtmlComment,
            HtmlEmbed,
            Indent,
            IndentBlock,
            Italic,
            Link,
            Paragraph,
            SelectAll,
            ShowBlocks,
            SourceEditing,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            Underline,
            Undo,
            Font,
            List,
            Image,
            ImageInsert,
            ImageInline,
            ImageResizeEditing,
            ImageResizeHandles,
            ImageToolbar,
          ],
          heading: {
            options: [
              {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
              },
              {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
              },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
              },
              {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4',
              },
              {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5',
              },
              {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6',
              },
            ],
          },
          htmlSupport: {
            allow: [
              {
                name: /^.*$/,
                styles: true,
                attributes: true,
                classes: true,
              },
            ],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
              toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                  download: 'file',
                },
              },
            },
          },
          placeholder: 'Compose an email...',
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties',
            ],
          },
          image: {
            insert: {
              type: 'inline',
            },
          },
        }}
      />
    </>
  );
};

export default CkEditor;
