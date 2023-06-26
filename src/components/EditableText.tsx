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
    const sel = window.getSelection();
    // console.log("UseEffect:", caretLocation.current, text, sel, el);
    if (el && sel) {
      const range = document.createRange();
      range.setStart(el.childNodes[0],location);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function handleChange(ev: React.SyntheticEvent<HTMLSpanElement, InputEvent>) {
    ev.preventDefault();
    // Line break creates multiple text nodes
    // join them into one string to preserve one text node
    if (ev.nativeEvent.inputType === "insertLineBreak") {
      // console.log("insertLineBreak", window.getSelection()?.anchorNode, ev.nativeEvent, textElement.current?.childNodes);
      if (textElement.current?.childNodes) {
        const nodes = Array.from(textElement.current.childNodes);
        const text = nodes.reduce((t, node) => t += node.nodeValue || '', '');
        caretLocation.current += 1;
        setText(text);
      }
      return false;
    }
      
    const sel = window.getSelection();
    const el = textElement.current;
    if (sel) caretLocation.current = sel.anchorOffset;

    el && setText((el.innerHTML));
  }

  function handleClick() {
    // Set caret location when clicking on text
    const sel = window.getSelection();
    caretLocation.current = sel?.anchorOffset || 0;
  }

  function handelKeys(key: string) {
    // Move caret when using arrow keys
    if (/^Arrow/.test(key)) {
      const sel = window.getSelection();
      if (sel) caretLocation.current = sel.anchorOffset;
    }
  }
  
  return (
    <span
        id="text"
        ref={textElement}
        className="editable-text" 
        contentEditable={'plaintext-only' as ContentEditable} // Use plaintext (not supporting HTML) 
        onKeyUp={(ev) => handelKeys(ev.code)}
        dangerouslySetInnerHTML={{ __html: text }}
        onClick={() => handleClick()}
        onInput={(ev: React.SyntheticEvent<HTMLSpanElement, InputEvent>) => handleChange(ev)}
      >
      </span>
  )
}

