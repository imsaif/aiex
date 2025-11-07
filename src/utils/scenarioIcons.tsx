import {
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  ShoppingBagIcon,
  DocumentIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export function getScenarioIcon(iconType: string, className: string = 'w-8 h-8') {
  switch (iconType) {
    case 'envelope':
      return <EnvelopeIcon className={className} />
    case 'chat':
      return <ChatBubbleLeftIcon className={className} />
    case 'shopping':
      return <ShoppingBagIcon className={className} />
    case 'document':
      return <DocumentIcon className={className} />
    case 'sparkles':
      return <SparklesIcon className={className} />
    default:
      return null
  }
}
