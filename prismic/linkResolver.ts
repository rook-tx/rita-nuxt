import type { LinkResolverFunction } from '@prismicio/client'

const linkResolver: LinkResolverFunction = (doc) => {
  if (doc.type === 'page') {
    return `/${doc.uid}`
  }
  return '/'
}

export default linkResolver
