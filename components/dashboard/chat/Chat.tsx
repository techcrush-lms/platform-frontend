'use client';
import Icon from '@/components/ui/Icon';
import type React from 'react';

import Input from '@/components/ui/Input';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { socketService } from '@/lib/services/socketService';
import {
  messagesRetrieved,
  messagesSent,
  retrieveMessages,
  sendMessage,
  updateMessagesReadStatus,
} from '@/redux/slices/chatSlice';
import { useSocket } from '@/context/SocketProvider';
import type { Message, MessagesResponse } from '@/types/chat';
import Link from 'next/link';
import {
  IoIosDocument,
  IoIosImage,
  IoIosClose,
  IoIosDownload,
} from 'react-icons/io';
import { uploadImage, uploadDocument } from '@/redux/slices/multimediaSlice';
import Image from 'next/image';
import { cn, getAvatar, SystemRole } from '@/lib/utils';
import type { JSX } from 'react/jsx-runtime';
import TeamInfoDrawer from './TeamInfoDrawer';
import { renderAvatar } from './RenderAvatar';
import { renderName } from './RenderName';

interface FileUploadOption {
  type: string;
  label: string;
  icon: React.ReactNode;
  accept: string;
}

interface FilePreview {
  url: string;
  type: string;
  name: string;
}

const FILE_UPLOAD_OPTIONS: FileUploadOption[] = [
  {
    type: 'image',
    label: 'Image',
    icon: <IoIosImage className='text-xl' />,
    accept: 'image/*',
  },
  {
    type: 'document',
    label: 'Document',
    icon: <IoIosDocument className='text-xl' />,
    accept: '.pdf,.doc,.docx,.txt',
  },
];

interface FilePreviewModalProps {
  file: {
    url: string;
    type: string;
    name: string;
  };
  onClose: () => void;
}

const FilePreviewModal = ({ file, onClose }: FilePreviewModalProps) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50 animate-fadeIn'>
      <div
        className='absolute inset-0 bg-black bg-opacity-50 animate-fadeIn'
        onClick={onClose}
      />
      <div className='bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full mx-4 relative animate-slideUp'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
            {file.name}
          </h3>
          <div className='flex items-center gap-2'>
            <a
              href={file.url}
              download={file.name}
              className='text-gray-500 hover:text-primary-main p-1'
              target='_blank'
              rel='noopener noreferrer'
            >
              <IoIosDownload className='text-2xl' />
            </a>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-red-500'
            >
              <IoIosClose className='text-2xl' />
            </button>
          </div>
        </div>
        <div className='relative aspect-video w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden'>
          {file.type.startsWith('image/') ? (
            <Image
              src={file.url || '/placeholder.svg'}
              alt={file.name}
              fill
              className='object-contain'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <div className='text-center'>
                <IoIosDocument className='text-4xl mx-auto mb-2' />
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  {file.name}
                </p>
                <a
                  href={file.url}
                  download={file.name}
                  className='mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <IoIosDownload className='text-xl' />
                  <span>Download</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageSkeleton = ({ isOwnMessage }: { isOwnMessage: boolean }) => {
  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
          isOwnMessage
            ? 'bg-indigo-100 dark:bg-primary-main rounded-se-none'
            : 'bg-gray-100 dark:bg-gray-700 rounded-ss-none'
        }`}
      >
        <div className='space-y-2'>
          <div
            className='h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse'
            style={{ width: `${Math.random() * 100 + 50}px` }}
          />
          <div
            className='h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse'
            style={{ width: `${Math.random() * 100 + 100}px` }}
          />
          {Math.random() > 0.5 && (
            <div
              className='h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse'
              style={{ width: `${Math.random() * 50 + 50}px` }}
            />
          )}
        </div>
        <div className='flex justify-end mt-2'>
          <div className='h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
        </div>
      </div>
    </div>
  );
};

export interface ChatProps {
  chatbuddyId?: string;
  chatGroup?: string;
  chatId?: string;
  height?: string;
  enabledBackButton?: boolean;
  rightSideComponent?: JSX.Element;
}

export default function Chat({
  chatId,
  chatGroup,
  chatbuddyId,
  height = 'max-h-[64vh] md:max-h-[60vh] lg:max-h-[68vh]',
  enabledBackButton = true,
  rightSideComponent,
}: ChatProps) {
  // Format message time with smart display
  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInHours =
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    // Today: show time only
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    // Yesterday: show "Yesterday" + time
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }

    // Within last 7 days: show day name + time
    if (diffInHours < 168) {
      return `${messageDate.toLocaleDateString([], {
        weekday: 'short',
      })} ${messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }

    // Older: show date + time
    return `${messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    })} ${messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const { isConnected } = useSocket();
  const [input, setInput] = useState('');
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [uploadAbortController, setUploadAbortController] =
    useState<AbortController | null>(null);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    type: string;
    name: string;
  } | null>(null);

  const { token, profile } = useSelector((state: RootState) => state.auth);
  const { messages, chat, latestMessage } = useSelector(
    (state: RootState) => state.chat
  );
  const [updatedChatId, setUpdatedChatId] = useState(chatId);

  // HANDLE MESSAGES PAGINATION - Updated logic
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);
  const isNearBottom = useRef<boolean>(true);

  // MARK MESSAGE AS READ
  useEffect(() => {
    if (!isConnected || !chatId) return;

    const handleMessagesRead = (response: {
      status: string;
      data: { read_by: string };
    }) => {
      if (response.status === 'success') {
        dispatch(
          updateMessagesReadStatus({
            chatId,
            readBy: response.data.read_by,
          })
        );
      }
    };

    socketService.on(`messagesRead:${chatId}`, handleMessagesRead);

    return () => {
      socketService.off(`messagesRead:${chatId}`, handleMessagesRead);
    };
  }, [chatId, isConnected, dispatch]);

  // Check if user is near bottom of chat
  const checkIfNearBottom = () => {
    if (!messageContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } =
      messageContainerRef.current;
    const threshold = 100; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  const handleScroll = () => {
    if (!messageContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messageContainerRef.current;

    isNearBottom.current = checkIfNearBottom();

    if (scrollTop < 100 && !isFetchingMore && hasMoreMessages) {
      loadMoreMessages();
    }
  };

  // Load more messages function
  const loadMoreMessages = async () => {
    if (isFetchingMore || !hasMoreMessages || !token) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;

    try {
      if (messageContainerRef.current) {
        previousScrollHeight.current = messageContainerRef.current.scrollHeight;
      }

      dispatch(
        retrieveMessages({
          token,
          ...(chatbuddyId && {
            chatBuddy: chatbuddyId,
          }),
          ...(chatGroup && {
            chatGroup,
          }),
          page: nextPage,
        })
      );

      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more messages:', error);
      setIsFetchingMore(false);
    }
  };

  // Handle message retrieval
  useEffect(() => {
    if (!isConnected || !token) return;

    const handleMessagesRetrieved = (response: MessagesResponse) => {
      if (response.status === 'success') {
        setUpdatedChatId(response.data.chatId);

        // Check if we have fewer messages than the limit (20)
        if (response.data.result.length < 20) {
          setHasMoreMessages(false);
        }

        dispatch(
          messagesRetrieved({
            messages: response.data.result,
            chatId: response.data.chatId,
            chat: response.data.chat,
            // @ts-ignore
            page: isInitialLoad ? 1 : page,
            isInitialLoad: isInitialLoad,
            stats: response.data.stats,
          })
        );

        if (isInitialLoad) {
          setIsLoading(false);
          setIsInitialLoad(false);
        } else {
          setTimeout(() => {
            if (messageContainerRef.current && previousScrollHeight.current) {
              const newScrollHeight = messageContainerRef.current.scrollHeight;
              const scrollDifference =
                newScrollHeight - previousScrollHeight.current;
              messageContainerRef.current.scrollTop = scrollDifference + 50;
            }
            setIsFetchingMore(false);
          }, 50);
        }
      }
    };

    socketService.on(
      `messagesRetrieved:${profile?.id}`,
      handleMessagesRetrieved
    );

    // Only fetch initial messages on first load
    if (isInitialLoad) {
      dispatch(
        retrieveMessages({
          token,
          ...(chatbuddyId && {
            chatBuddy: chatbuddyId,
          }),
          ...(chatGroup && { chatGroup }),
          page: 1,
        })
      );
    }

    return () => {
      socketService.off(
        `messagesRetrieved:${profile?.id}`,
        handleMessagesRetrieved
      );
    };
  }, [
    token,
    dispatch,
    profile?.id,
    chatbuddyId,
    chatGroup,
    isConnected,
    isInitialLoad,
  ]);

  // Handle sent messages
  useEffect(() => {
    if (!isConnected || !token) return;

    const handleMessagesSent = (response: any) => {
      if (response.status === 'success') {
        dispatch(messagesSent(response.data));
        setIsMessageSent(false);
      }
    };

    socketService.on(`messageSent:${updatedChatId}`, handleMessagesSent);

    return () => {
      socketService.off(`messageSent:${updatedChatId}`, handleMessagesSent);
    };
  }, [token, dispatch, isConnected, updatedChatId]);

  // Handle incoming messages
  useEffect(() => {
    if (!isConnected || !token || !updatedChatId) return;

    const handleIncomingMessage = (message: Message) => {
      if (message.chat_id === updatedChatId) {
        dispatch(messagesSent(message));
        isNearBottom.current = checkIfNearBottom();
      }
    };

    // Listen for incoming messages
    socketService.on(`messageReceived:${updatedChatId}`, handleIncomingMessage);
    socketService.on(`newMessage:${profile?.id}`, handleIncomingMessage);

    return () => {
      socketService.off(
        `messageReceived:${updatedChatId}`,
        handleIncomingMessage
      );
      socketService.off(`newMessage:${profile?.id}`, handleIncomingMessage);
    };
  }, [isConnected, token, updatedChatId, profile?.id, dispatch]);

  // Auto-scroll to bottom - Fixed to handle all new messages
  useEffect(() => {
    // Auto-scroll on initial load
    if (isInitialLoad) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    // Auto-scroll when sending a message
    if (isMessageSent) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setIsMessageSent(false);
      return;
    }

    // Auto-scroll for new received messages only if user was near bottom
    if (isNearBottom.current && !isFetchingMore) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isInitialLoad, isMessageSent, isFetchingMore]);

  // Add scroll event listener
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 50);
    };

    container.addEventListener('scroll', throttledHandleScroll);
    return () => {
      container.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isFetchingMore, hasMoreMessages, page]);

  // Reset pagination
  useEffect(() => {
    setPage(1);
    setHasMoreMessages(true);
    setIsInitialLoad(true);
    setIsLoading(true);
    setIsFetchingMore(false);
    setShouldAutoScroll(true);
    isNearBottom.current = true;
    previousScrollHeight.current = 0;
  }, [chatbuddyId]);

  const handleFileSelect = async (file: File) => {
    if (!file || !token) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview({
          url: previewUrl,
          type: file.type,
          name: file.name,
        });
      } else {
        setFilePreview({
          url: '',
          type: file.type,
          name: file.name,
        });
      }

      // Create FormData for file upload
      const formData = new FormData();
      if (file.type.startsWith('image/')) {
        formData.append('image', file);
      } else {
        formData.append('document', file);
      }

      // Create new AbortController for this upload
      const controller = new AbortController();
      setUploadAbortController(controller);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      let response: any;
      try {
        if (file.type.startsWith('image/')) {
          response = await dispatch(
            uploadImage({
              form_data: formData,
            })
          );
        } else {
          response = await dispatch(
            uploadDocument({
              form_data: formData,
            })
          );
        }
      } catch (error) {
        throw error;
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (file.type.startsWith('image/')) {
        if (response.type === 'multimedia-upload/image/rejected') {
          throw new Error(response.payload.message);
        }
      } else {
        if (response.type === 'multimedia-upload/document/rejected') {
          throw new Error(response.payload.message);
        }
      }

      // Update preview with actual URL
      setFilePreview((prev) =>
        prev
          ? {
              ...prev,
              url: response.payload.multimedia.url,
            }
          : null
      );
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // console.log('Upload cancelled');
      } else {
        console.error('File upload error:', error);
      }
      setFilePreview(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadAbortController(null);
    }
  };

  const handleFileUpload = (accept: string) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = accept;
    fileInputRef.current.click();
    setShowFileMenu(false);
  };

  const removeFilePreview = () => {
    if (filePreview?.url) {
      URL.revokeObjectURL(filePreview.url);
    }
    setFilePreview(null);
  };

  const handleCancelUpload = () => {
    if (uploadAbortController) {
      uploadAbortController.abort();
      setUploadAbortController(null);
    }
    setIsUploading(false);
    setUploadProgress(0);
    removeFilePreview();
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !filePreview) || !token) return;

    setIsMessageSent(true);
    isNearBottom.current = true; // Ensure auto-scroll for sent messages

    dispatch(
      sendMessage({
        token,
        ...(chatbuddyId && {
          chatBuddy: chatbuddyId,
        }),
        ...(chatGroup && { chatGroup }),
        ...(input && { message: input }),
        ...(filePreview && { file: filePreview.url }),
      })
    );

    setInput('');
    removeFilePreview();
  };

  const renderMessage = (message: Message, is_group: boolean) => (
    <div
      key={message.id}
      className={`flex gap-2 mb-2 ${
        message.initiator_id === profile?.id ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar on the left, only for group messages from others */}
      {is_group && message.initiator_id !== profile?.id && (
        <img
          src={getAvatar(
            message.initiator?.profile?.profile_picture!,
            message.initiator?.name!
          )}
          alt={message.initiator?.name || 'User'}
          width={32}
          height={32}
          className='w-8 h-8 rounded-full object-cover self-start'
        />
      )}

      {/* Message bubble */}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
          message.initiator_id === profile?.id
            ? 'bg-indigo-100 dark:bg-primary-main rounded-se-none'
            : 'bg-gray-100 dark:bg-gray-700 rounded-ss-none'
        }`}
      >
        {/* Optional sender name on top (only in group) */}
        {is_group && message.initiator_id !== profile?.id && (
          <span className='block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1'>
            {message.initiator?.name}
          </span>
        )}

        {/* File content */}
        {message.file && (
          <div className='mb-2 relative group'>
            {message.file.startsWith('data:image/') ||
            message.file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <div
                className='relative w-[200px] h-[200px] rounded-lg overflow-hidden cursor-pointer'
                onClick={() =>
                  setPreviewFile({
                    url: message.file as string,
                    type: 'image',
                    name: 'Image',
                  })
                }
              >
                <Image
                  src={message.file || '/placeholder.svg'}
                  alt='Uploaded content'
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center'>
                  <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (message.file) {
                          window.open(message.file, '_blank');
                        }
                      }}
                      className='p-2 bg-white rounded-full shadow-lg hover:bg-gray-100'
                      title='Download'
                    >
                      <IoIosDownload className='text-xl text-gray-700' />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className='flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
                onClick={() =>
                  setPreviewFile({
                    url: message.file as string,
                    type: 'document',
                    name: 'Document',
                  })
                }
              >
                <IoIosDocument className='text-2xl text-gray-500' />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Document
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (message.file) {
                      window.open(message.file, '_blank');
                    }
                  }}
                  className='ml-auto p-1 text-gray-500 hover:text-primary-main'
                  title='Download'
                >
                  <IoIosDownload className='text-xl' />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Text message */}
        {message.message && (
          <p className='text-sm text-gray-800 dark:text-white font-bold'>
            {message.message}
          </p>
        )}

        {/* Footer (time + read checkmark) */}
        <div className='flex justify-end items-center mt-1 gap-1'>
          <span className='text-xs text-gray-500 dark:text-gray-300'>
            {formatMessageTime(message.created_at)}
          </span>
          {message.initiator_id === profile?.id && (
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                message.read ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const chatHeading = (
    <div className='flex gap-2 items-center'>
      <div className='flex items-center'>
        {enabledBackButton && (
          <Link
            href={
              profile?.role.role_id === SystemRole.USER
                ? '/dashboard/messages'
                : '/messages'
            }
            className='flex md:hidden dark:invert dark:brightness-0'
          >
            <Icon url='/icons/clients/angle-left.svg' width={30} />
          </Link>
        )}

        {renderAvatar(chat!)}
      </div>
      <div className='flex flex-col'>
        <p className='font-semibold text-gray-800 dark:text-white'>
          {renderName(chat!)}
        </p>
      </div>
    </div>
  );

  const noConversationsRender = () => {
    if (chat?.is_group && chat?.chat_group) {
      return `Start a conversation by sending your first message in the <b>${renderName(
        chat!
      )}</b> group`;
    } else {
      return `Start a conversation by sending your first message to <b>${renderName(
        chat!
      )}</b>`;
    }
    return '';
  };

  return (
    <div className={cn('mx-auto flex flex-col justify-between h-full w-full')}>
      <div className='flex flex-col'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-2 px-2 md:px-3 py-2 border-b dark:border-black-2 bg-neutral-4 dark:bg-gray-800 rounded-xl justify-between'>
          {chat?.is_group && chat.chat_group ? (
            <TeamInfoDrawer enabledBackButton={true} />
          ) : (
            chatHeading
          )}
          {rightSideComponent}
        </div>

        {/* Messages */}
        <div
          className={cn(
            'flex-1 overflow-y-auto p-4 space-y-6',
            height && height
          )}
          ref={messageContainerRef}
        >
          {/* Loading indicator for fetching more messages */}
          {isFetchingMore && (
            <div className='flex justify-center my-4'>
              <div className='w-6 h-6 border-2 border-t-transparent border-primary-main rounded-full animate-spin' />
            </div>
          )}

          {/* Initial loading skeletons */}
          {isLoading ? (
            <>
              <MessageSkeleton isOwnMessage={false} />
              <MessageSkeleton isOwnMessage={true} />
              <MessageSkeleton isOwnMessage={false} />
              <MessageSkeleton isOwnMessage={true} />
              <MessageSkeleton isOwnMessage={false} />
            </>
          ) : messages.length ? (
            messages.map((message) =>
              renderMessage(message, Boolean(message?.chat_group))
            )
          ) : (
            <div className='flex flex-col items-center justify-center h-full min-h-[full] text-center'>
              <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4'>
                <Icon
                  url='/icons/chat/chats.svg'
                  width={24}
                  className='text-gray-400'
                />
              </div>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                No messages yet
              </h3>
              <div
                className='text-gray-500 dark:text-gray-400 max-w-sm'
                dangerouslySetInnerHTML={{ __html: noConversationsRender() }}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {/* Message Input */}
      <div className='p-4 dark:border-black-2 bg-neutral-4 dark:bg-gray-800 flex gap-2 rounded-xl border-t'>
        <div className='relative flex items-center' ref={fileMenuRef}>
          <button
            className='text-gray-400 hover:text-primary-main transition-colors disabled:opacity-50'
            onClick={() => setShowFileMenu(!showFileMenu)}
            disabled={isUploading}
          >
            <Icon url='/icons/chat/clip.svg' width={30} />
          </button>
          {showFileMenu && (
            <div className='absolute bottom-full left-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700'>
              <div className='py-1'>
                {FILE_UPLOAD_OPTIONS.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleFileUpload(option.accept)}
                    className='w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2'
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='flex-1 relative'>
          <Input
            type='text'
            name='message'
            className='w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-main'
            placeholder='Type something'
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSendMessage()
            }
            disabled={isUploading}
          />
          {/* File Preview with Progress */}
          {filePreview && (
            <div className='absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border dark:border-gray-700'>
              <div className='flex items-center gap-2'>
                {filePreview.type.startsWith('image/') ? (
                  <Image
                    src={filePreview.url || '/placeholder.svg'}
                    alt='Preview'
                    width={40}
                    height={40}
                    className='rounded object-cover'
                  />
                ) : (
                  <div className='w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded'>
                    <IoIosDocument className='text-xl' />
                  </div>
                )}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm truncate'>{filePreview.name}</p>
                  {isUploading && (
                    <div className='mt-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-primary-main transition-all duration-300'
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                {isUploading ? (
                  <button
                    onClick={handleCancelUpload}
                    className='text-red-500 hover:text-red-600 p-1'
                  >
                    <IoIosClose className='text-xl' />
                  </button>
                ) : (
                  <button
                    onClick={removeFilePreview}
                    className='text-gray-500 hover:text-red-500 p-1'
                  >
                    <IoIosClose className='text-xl' />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          className='bg-primary-main p-2 rounded-lg text-white disabled:opacity-50'
          onClick={handleSendMessage}
          disabled={(!input.trim() && !filePreview) || isUploading}
        >
          <Icon url='/icons/chat/send.svg' />
        </button>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
