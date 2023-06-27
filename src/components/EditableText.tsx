import { useState, useRef, useEffect} from 'react'

// Workaround: React does not support 'plaintext-only' as a value for contentEditable
type ContentEditable = 'inherit' | boolean | undefined;

interface Props {
  placeholder?: string;
}

export const EditableText = ({placeholder}: Props) => {

  const [text, setText] = useState(placeholder || "This is editable text");
  const caretLocation = useRef(0);
  const textElement = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    placeCaretAt(caretLocation.current);
  }, [text]);

  function placeCaretAt(location: number) {
    const el = textElement.current;
    if (!el) {
      console.error("Error: No element")
      return
    }
    // Add empty text node if none exists
    if (!el.childNodes.length) el.appendChild(document.createTextNode(''));
    const sel = window.getSelection();
    if (sel) {
      const range = document.createRange();
      try {
        range.setStart(el.childNodes[0], location);
      } catch (e) {
        range.setStart(el.childNodes[0],(el.childNodes[0] as Text)?.wholeText.length || 0);
        console.warn("Warning: caret location outside of text node")
      }
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function handleChange(ev: React.SyntheticEvent<HTMLSpanElement, InputEvent>) {
    ev.preventDefault();

    const el = textElement.current;
    if (!el) {
      console.error("Error: No element")
      return
    }

    if (ev.nativeEvent.inputType === "insertLineBreak") {
      caretLocation.current += 1;
    } else {
      const sel = window.getSelection();
      if (sel) caretLocation.current = sel.anchorOffset;
    }

    const nodeText = el.innerHTML || '';
    setText(nodeText);
  }


  function handleClick() {
    // Set caret location when clicking on text
    const sel = window.getSelection();
    caretLocation.current = sel?.anchorOffset || 0;
  }

  function handelKeys(ev: React.KeyboardEvent<HTMLSpanElement>) {
    if (/^Arrow/.test(ev.key)) {
      // Move caret when using arrow keys
      const sel = window.getSelection();
      if (sel) caretLocation.current = sel.anchorOffset;
    } else if (ev.metaKey && ev.key === "z") {
      ev.preventDefault();
      if (ev.shiftKey) console.log("REDO")
      else console.log("UNDO")
    }
  }
  
  return (
    <span
        id="text"
        ref={textElement}
        className="editable-text" 
        contentEditable={'plaintext-only' as ContentEditable} // Use plaintext (not supporting HTML) 
        onKeyUp={(ev) => handelKeys(ev)}
        onKeyDown={(ev) => handelKeys(ev)}
        onClick={() => handleClick()}
        onInput={(ev: React.SyntheticEvent<HTMLSpanElement, InputEvent>) => handleChange(ev)}
        dangerouslySetInnerHTML={{ __html: text }}
        suppressContentEditableWarning={true}
      >
      </span>
  )
}

