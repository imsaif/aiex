'use client';

interface StatusBadgeProps {
  status: 'not-started' | 'in-progress' | 'completed' | 'ready' | 'work-in-progress';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const styles = {
    'not-started': {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      label: 'Not Started',
    },
    'in-progress': {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      label: 'In Progress',
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
      label: 'Completed',
    },
    ready: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      label: 'Ready',
    },
    'work-in-progress': {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      text: 'text-yellow-600 dark:text-yellow-400',
      label: 'Work in Progress',
    },
  };

  const style = styles[status];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span className={`inline-block ${sizeClasses} rounded-full font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}
