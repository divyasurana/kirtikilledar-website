import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

/**
 * Check whether a string contains HTML tags.
 * Used to decide between safe HTML rendering vs plain-text fallback for
 * legacy content saved before the rich-text migration.
 */
const looksLikeHtml = (text) => {
  if (typeof text !== 'string') return false;
  return /<\/?[a-z][\s\S]*>/i.test(text);
};

/**
 * Escape a plain-text string so it can be safely injected as HTML.
 */
const escapeHtml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Convert legacy plain-text content (with \n\n paragraph breaks) into
 * equivalent HTML so a single renderer can handle both old and new data.
 */
const plainTextToHtml = (text) => {
  if (!text) return '';
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return paragraphs
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
};

/**
 * Sanitise HTML and force every <a> to open in a new tab safely.
 */
const sanitize = (html) => {
  // Ensure all links get target="_blank" and rel="noopener noreferrer"
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u',
      'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'blockquote', 'code',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

  DOMPurify.removeHook('afterSanitizeAttributes');
  return clean;
};

/**
 * RichText — renders sanitised HTML from the admin rich-text editor, while
 * remaining backward-compatible with plain-text content saved before the
 * migration. Always emits hyperlinks that open in a new tab safely.
 */
const RichText = ({ content, className = '', as: Tag = 'div', ...props }) => {
  const html = useMemo(() => {
    if (!content) return '';
    const raw = looksLikeHtml(content) ? content : plainTextToHtml(content);
    return sanitize(raw);
  }, [content]);

  if (!html) return null;

  return (
    <Tag
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
};

export default RichText;
