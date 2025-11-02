import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Quote,
  Code,
  Undo,
  Redo,
  RemoveFormatting,
  ChevronLeft,
  ChevronRight,
  LineChart,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Custom extension for line height
const LineHeight = Extension.create({
  name: 'lineHeight',
  
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.getAttribute('data-line-height'),
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                'data-line-height': attributes.lineHeight,
                class: `lh-${attributes.lineHeight.replace('.', '')}`,
              };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }: any) => {
        return commands.updateAttributes('paragraph', { lineHeight });
      },
    } as any;
  },
});

// Custom extension for paragraph spacing
const ParagraphSpacing = Extension.create({
  name: 'paragraphSpacing',
  
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          spacing: {
            default: null,
            parseHTML: element => element.getAttribute('data-spacing'),
            renderHTML: attributes => {
              if (!attributes.spacing) {
                return {};
              }
              return {
                'data-spacing': attributes.spacing,
                class: `para-gap-${attributes.spacing}`,
              };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setParagraphSpacing: (spacing: string) => ({ commands }: any) => {
        return commands.updateAttributes('paragraph', { spacing });
      },
    } as any;
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder = 'Start writing your article...' }: RichTextEditorProps) => {
  const [isDirty, setIsDirty] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Paragraph,
      ListItem.configure({
        HTMLAttributes: {
          class: 'ml-0',
        },
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
          class: 'list-disc pl-10 my-4',
        },
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
          class: 'list-decimal pl-10 my-4',
        },
      }),
      Blockquote,
      CodeBlock,
      History,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      LineHeight,
      ParagraphSpacing,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      setIsDirty(true);
    },
    editorProps: {
      attributes: {
        class: 'max-w-none focus:outline-none min-h-[400px] p-6',
      },
      handlePaste: (view, event) => {
        // Let TipTap handle paste naturally but sanitize
        return false;
      },
    },
  });

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30 overflow-x-auto">
        {/* Inline Formatting */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Block Formatting */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph')}
            title="Paragraph"
          >
            <Pilcrow className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1 (Ctrl+Alt+1)"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2 (Ctrl+Alt+2)"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3 (Ctrl+Alt+3)"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List (Ctrl+Shift+8)"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List (Ctrl+Shift+7)"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            disabled={!editor.can().sinkListItem('listItem')}
            title="Indent"
          >
            <ChevronRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            disabled={!editor.can().liftListItem('listItem')}
            title="Outdent"
          >
            <ChevronLeft className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Spacing */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm" title="Line Height" className="h-8 px-2">
                <LineChart className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setLineHeight('1.0').run()}>
                1.0 (Single)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setLineHeight('1.5').run()}>
                1.5 (Default)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setLineHeight('2.0').run()}>
                2.0 (Double)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm" title="Paragraph Spacing" className="h-8 px-2 text-xs">
                ¶
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setParagraphSpacing('none').run()}>
                None (0px)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setParagraphSpacing('xs').run()}>
                Extra Small (4px)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setParagraphSpacing('sm').run()}>
                Small (8px)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setParagraphSpacing('md').run()}>
                Medium (12px)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setParagraphSpacing('lg').run()}>
                Large (16px)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (editor.chain().focus() as any).setParagraphSpacing('xl').run()}>
                Extra Large (24px)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* History & Clear */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};
