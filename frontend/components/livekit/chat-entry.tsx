import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  /** The locale to use for the timestamp. */
  locale: string;
  /** The timestamp of the message. */
  timestamp: number;
  /** The message to display. */
  message: string;
  /** The origin of the message. */
  messageOrigin: 'local' | 'remote';
  /** The sender's name. */
  name?: string;
  /** Whether the message has been edited. */
  hasBeenEdited?: boolean;
}

export const ChatEntry = ({
  name,
  locale,
  timestamp,
  message,
  messageOrigin,
  hasBeenEdited = false,
  className,
  ...props
}: ChatEntryProps) => {
  const time = new Date(timestamp);
  const title = time.toLocaleTimeString(locale, { timeStyle: 'full' });

  return (
    <li
      title={title}
      data-lk-message-origin={messageOrigin}
      className={cn('group flex w-full flex-col gap-1 mb-3', className)}
      style={{ opacity: 1, visibility: 'visible' }}
      {...props}
    >
      <header
        className={cn(
          'text-muted-foreground flex items-center gap-2 text-base md:text-lg',
          messageOrigin === 'local' ? 'flex-row-reverse' : 'text-left'
        )}
      >
        {name && <strong className="font-semibold">{name}</strong>}
        <span className="font-mono text-sm md:text-base opacity-70 transition-opacity ease-linear group-hover:opacity-100">
          {hasBeenEdited && '*'}
          {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
        </span>
      </header>
      <span
        className={cn(
          'max-w-xs md:max-w-sm rounded-[20px] text-lg md:text-xl font-medium tracking-wide',
          messageOrigin === 'local' 
            ? 'ml-auto p-3' 
            : 'mr-auto p-3'
        )}
        style={{ 
          color: '#faf5ff',
          opacity: 1,
          visibility: 'visible',
          display: 'block',
          fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
          letterSpacing: '0.025em',
          backgroundColor: messageOrigin === 'local' 
            ? 'rgba(139, 92, 246, 0.25)' // Purple tint for user messages
            : 'rgba(167, 139, 250, 0.2)', // Lighter purple for agent messages
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
        }}
      >
        {message}
      </span>
    </li>
  );
};
