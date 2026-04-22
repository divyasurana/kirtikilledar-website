import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, List } from 'lucide-react';

/**
 * RichTextEditor — minimal TipTap editor for admin content fields.
 *
 * Supports: Bold, Italic, Hyperlinks (open in new tab), Bulleted lists.
 * Emits content as HTML via onChange(html).
 */
const RichTextEditor = ({ value = '', onChange, placeholder = '', rows = 6 }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        orderedList: false,
        strike: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-vintage-gold underline',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'rich-text-editor-content w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none font-light min-h-[8rem] prose prose-sm max-w-none',
        'data-testid': 'rich-text-editor',
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      // TipTap emits "<p></p>" for empty content — normalise to empty string
      const normalised = html === '<p></p>' ? '' : html;
      onChange && onChange(normalised);
    },
  });

  // Keep editor content in sync when parent value changes (e.g. after fetch)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || '';
    // Only update if content differs to avoid reset while typing
    if (incoming !== current && incoming !== (current === '<p></p>' ? '' : current)) {
      editor.commands.setContent(incoming, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const addOrEditLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Paste URL (leave empty to remove link)', previousUrl);

    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Prepend https:// if user pastes a bare domain
    const normalised = /^https?:\/\//i.test(url) || url.startsWith('mailto:') ? url : `https://${url}`;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: normalised, target: '_blank', rel: 'noopener noreferrer' })
      .run();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className="w-full px-4 py-3 border border-warm-brown/20 bg-vintage-paper/30"
        style={{ minHeight: `${rows * 1.5}rem` }}
      />
    );
  }

  const btn = (active) =>
    `p-2 border border-warm-brown/20 text-warm-brown hover:bg-vintage-paper transition-colors ${
      active ? 'bg-vintage-paper' : 'bg-white'
    }`;

  return (
    <div className="rich-text-editor" data-testid="rich-text-editor-wrapper">
      <div className="flex flex-wrap gap-1 mb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive('bold'))}
          title="Bold"
          data-testid="rte-bold"
          aria-label="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive('italic'))}
          title="Italic"
          data-testid="rte-italic"
          aria-label="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={addOrEditLink}
          className={btn(editor.isActive('link'))}
          title="Insert / edit link"
          data-testid="rte-link"
          aria-label="Insert link"
        >
          <LinkIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive('bulletList'))}
          title="Bulleted list"
          data-testid="rte-bullet"
          aria-label="Bulleted list"
        >
          <List size={14} />
        </button>
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};

export default RichTextEditor;
