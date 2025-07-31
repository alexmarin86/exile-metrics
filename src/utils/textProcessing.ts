import DOMPurify from 'dompurify'

export function linkifyAndSanitize(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g

  const linkified = text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline text-primary hover:text-primary/80">${url}</a>`
  })

  return DOMPurify.sanitize(linkified, {
    ALLOWED_TAGS: ['a', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  })
}
