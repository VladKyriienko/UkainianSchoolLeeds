'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyleKit } from '@tiptap/extension-text-style';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Heading2,
  Heading3
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/utils/cn';

type RichTextEditorProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

const toolbarButtonClass =
  'h-7 w-7 rounded-sm border border-transparent bg-transparent p-0 text-foreground transition-colors hover:bg-muted';

function getToolbarButtonClass(isActive: boolean): string {
  return cn(
    toolbarButtonClass,
    isActive &&
    'bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/25 dark:text-primary dark:hover:bg-primary/35'
  );
}

function keepEditorSelection(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
}

export function RichTextEditor({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = 'Start writing...',
  required,
  disabled
}: RichTextEditorProps) {
  const isDisabled = Boolean(disabled);
  const editor = useEditor({
    immediatelyRender: false,
    editable: !isDisabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        blockquote: false
      }),
      Underline,
      TextStyleKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https'
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none dark:prose-invert min-h-editor px-4 py-3 focus:outline-none'
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    }
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      isBold: currentEditor?.isActive('bold') ?? false,
      isItalic: currentEditor?.isActive('italic') ?? false,
      isUnderline: currentEditor?.isActive('underline') ?? false,
      isHeading2: currentEditor?.isActive('heading', { level: 2 }) ?? false,
      isHeading3: currentEditor?.isActive('heading', { level: 3 }) ?? false,
      isBulletList: currentEditor?.isActive('bulletList') ?? false,
      isOrderedList: currentEditor?.isActive('orderedList') ?? false,
      textColor: currentEditor?.getAttributes('textStyle').color ?? '',
      canUndo: currentEditor?.can().chain().focus().undo().run() ?? false,
      canRedo: currentEditor?.can().chain().focus().redo().run() ?? false
    })
  });
  const toolbarState = editorState ?? {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isHeading2: false,
    isHeading3: false,
    isBulletList: false,
    isOrderedList: false,
    textColor: '',
    canUndo: false,
    canRedo: false
  };

  useEffect(() => {
    if (!editor) return;
    if (value === editor.getHTML()) return;
    editor.commands.setContent(value || '', { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="rounded-md border bg-background">
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-2 py-1.5">
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={getToolbarButtonClass(toolbarState.isBold)}
            pressed={toolbarState.isBold}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={getToolbarButtonClass(toolbarState.isItalic)}
            pressed={toolbarState.isItalic}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={getToolbarButtonClass(toolbarState.isUnderline)}
            pressed={toolbarState.isUnderline}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>

          <div className="mx-1.5 h-5 w-px bg-border/80" />

          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={getToolbarButtonClass(toolbarState.isHeading2)}
            pressed={toolbarState.isHeading2}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={getToolbarButtonClass(toolbarState.isHeading3)}
            pressed={toolbarState.isHeading3}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>

          <div className="mx-1.5 h-5 w-px bg-border/80" />

          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={getToolbarButtonClass(toolbarState.isBulletList)}
            pressed={toolbarState.isBulletList}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().toggleBulletList().run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Bulleted list"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={getToolbarButtonClass(toolbarState.isOrderedList)}
            pressed={toolbarState.isOrderedList}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().toggleOrderedList().run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Numbered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <div className="mx-1 h-6 w-px bg-border" />

          <Label
            htmlFor={`${id}-text-color`}
            className="sr-only"
          >
            Text color
          </Label>
          <input
            id={`${id}-text-color`}
            type="color"
            value={toolbarState.textColor || '#000000'}
            onChange={(e) => {
              editor
                ?.chain()
                .focus()
                .setMark('textStyle', { color: e.target.value })
                .run();
            }}
            disabled={!editor || isDisabled}
            className="h-7 w-7 cursor-pointer rounded-sm border border-input bg-background p-1 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Text color"
          />
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className="h-7 rounded-sm border border-transparent px-2 text-2xs transition-colors hover:bg-muted"
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor
                ?.chain()
                .focus()
                .setMark('textStyle', { color: null })
                .removeEmptyTextStyle()
                .run();
            }}
            disabled={!editor || isDisabled}
            aria-label="Reset text color"
          >
            Reset
          </Toggle>

          <div className="mx-1.5 h-5 w-px bg-border/80" />

          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={toolbarButtonClass}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().undo().run();
            }}
            disabled={!editor || isDisabled || !toolbarState.canUndo}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            className={toolbarButtonClass}
            onMouseDown={keepEditorSelection}
            onClick={() => {
              editor?.chain().focus().redo().run();
            }}
            disabled={!editor || isDisabled || !toolbarState.canRedo}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Toggle>
        </div>

        <EditorContent
          id={id}
          editor={editor}
          className={cn(
            'min-h-editor',
            '[&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:leading-tight [&_.ProseMirror_h2]:my-4',
            '[&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:leading-snug [&_.ProseMirror_h3]:my-3',
            '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-3',
            '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-3',
            '[&_.ProseMirror>p.is-editor-empty:first-child::before]:pointer-events-none',
            '[&_.ProseMirror>p.is-editor-empty:first-child::before]:float-left',
            '[&_.ProseMirror>p.is-editor-empty:first-child::before]:h-0',
            '[&_.ProseMirror>p.is-editor-empty:first-child::before]:text-muted-foreground',
            '[&_.ProseMirror>p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]'
          )}
        />
      </div>

      <textarea
        name={name}
        value={value}
        required={required}
        readOnly
        aria-hidden="true"
        tabIndex={-1}
        className="hidden"
      />
    </div>
  );
}
