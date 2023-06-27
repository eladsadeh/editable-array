import { useRef, useEffect} from 'react'

// Workaround: React does not support 'plaintext-only' as a value for contentEditable
type ContentEditable = 'inherit' | boolean | undefined;

interface Props {
  value?: string;
  setValue?: (text: string) => void;
}

export const EditableText = ({value = '', setValue}: Props) => {

  const isDisabled = !setValue;
  // const [text, setText] = useState(placeholder || "This is editable text");
  const caretLocation = useRef(0);
  const textElement = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    !isDisabled && placeCaretAt(caretLocation.current);
  }, [value, isDisabled]);

  if (isDisabled) return (<span className="not-editable text">{value}</span>)

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
    setValue && setValue(nodeText);
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
      // TODO: Undo/Redo functionality
      ev.preventDefault(); // Prevent browser undo/redo
      if (ev.shiftKey) console.log("REDO")
      else console.log("UNDO")
    }
  }
  
  return (
    <span
        ref={textElement}
        className="editable text" 
        contentEditable={'plaintext-only' as ContentEditable} // Use plaintext (not supporting HTML) 
        onKeyUp={(ev) => handelKeys(ev)}
        onKeyDown={(ev) => handelKeys(ev)}
        onClick={() => handleClick()}
        onInput={(ev: React.SyntheticEvent<HTMLSpanElement, InputEvent>) => handleChange(ev)}
        dangerouslySetInnerHTML={{ __html: value }}
        suppressContentEditableWarning={true}
      >
      </span>
  )
}

