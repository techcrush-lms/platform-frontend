'use client';

import React from 'react';
import { Play, Image, FileText, BookOpen, Download, Eye } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface ContentPreviewProps {
  content: {
    title: string;
    multimedia?: {
      url: string;
      type: string;
    };
  };
  contentType: 'video' | 'image' | 'document' | 'text';
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  contentType,
  onProgress,
  onComplete,
}) => {
  // Encode video URL to prevent it from being visible in browser inspection
  const encodeVideoUrl = (url: string): string => {
    try {
      return btoa(url);
    } catch {
      return url; // Fallback to original if encoding fails
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case 'video':
        return content.multimedia?.url ? (
          <VideoPlayer
            src={encodeVideoUrl(content.multimedia.url)}
            title={content.title}
            // onProgress={onProgress}
            // onComplete={onComplete}
          />
        ) : (
          <div className='flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg'>
            <div className='text-center'>
              <Play className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <p className='text-gray-600 dark:text-gray-400'>
                No video available
              </p>
            </div>
          </div>
        );

      case 'image':
        return content.multimedia?.url ? (
          <div className='relative group'>
            <img
              src={content.multimedia.url}
              alt={content.title}
              className='w-full h-full object-contain rounded-lg'
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg'>
              <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <button className='p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors'>
                  <Eye className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg'>
            <div className='text-center'>
              <Image className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <p className='text-gray-600 dark:text-gray-400'>
                No image available
              </p>
            </div>
          </div>
        );

      case 'document':
        return content.multimedia?.url ? (
          <div className='h-full flex flex-col'>
            <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-3'>
                <FileText className='w-6 h-6 text-primary-main' />
                <div>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    {content.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Document
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button className='p-2 rounded-lg bg-primary-main text-white hover:bg-primary-dark transition-colors'>
                  <Eye className='w-4 h-4' />
                </button>
                <a
                  href={content.multimedia.url}
                  download
                  className='p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
                >
                  <Download className='w-4 h-4' />
                </a>
              </div>
            </div>
            <div className='flex-1 bg-white dark:bg-gray-900 rounded-b-lg'>
              <iframe
                src={`${content.multimedia.url}#toolbar=0`}
                className='w-full h-full rounded-b-lg'
                title={content.title}
              />
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg'>
            <div className='text-center'>
              <FileText className='w-16 h-16 mx-auto mb-4 text-gray-400' />
              <p className='text-gray-600 dark:text-gray-400'>
                No document available
              </p>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div className='h-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-y-auto'>
            <div className='max-w-4xl mx-auto'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                {content.title}
              </h2>
              <div className='prose dark:prose-invert max-w-none'>
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                    📚 Lesson Content
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300 mb-4'>
                    This lesson covers important concepts and provides valuable
                    insights for your learning journey.
                  </p>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-primary-main rounded-full mt-2 flex-shrink-0'></div>
                      <p className='text-gray-700 dark:text-gray-300'>
                        Understand the core principles and fundamental concepts
                      </p>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-primary-main rounded-full mt-2 flex-shrink-0'></div>
                      <p className='text-gray-700 dark:text-gray-300'>
                        Learn through practical examples and real-world
                        applications
                      </p>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-primary-main rounded-full mt-2 flex-shrink-0'></div>
                      <p className='text-gray-700 dark:text-gray-300'>
                        Apply your knowledge through interactive exercises and
                        assessments
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6'>
                  <h4 className='font-semibold text-blue-900 dark:text-blue-300 mb-3'>
                    💡 Key Takeaways
                  </h4>
                  <ul className='space-y-2 text-blue-800 dark:text-blue-200'>
                    <li>• Master essential concepts and techniques</li>
                    <li>
                      • Develop practical skills through hands-on practice
                    </li>
                    <li>• Build confidence through progressive learning</li>
                    <li>• Apply knowledge in real-world scenarios</li>
                  </ul>
                </div>

                <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-6'>
                  <h4 className='font-semibold text-green-900 dark:text-green-300 mb-3'>
                    🎯 Learning Objectives
                  </h4>
                  <p className='text-green-800 dark:text-green-200'>
                    By the end of this lesson, you will be able to demonstrate
                    understanding of the core concepts and apply them
                    effectively in practical situations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
    // className='w-full h-full'
    >
      {renderContent()}
    </div>
  );
};

export default ContentPreview;
