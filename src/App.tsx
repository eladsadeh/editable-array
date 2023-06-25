import { useState, useRef, useEffect} from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('Some text')
  const caretLocation = useRef(0);

  useEffect(() => {
    // console.log("UseEffect:", caretLocation.current, text);
    const el = document.getElementById("text");
    const sel = window.getSelection();
    if (el && sel) {
      // console.log(el.innerHTML);
      const range = document.createRange();
      // console.log(caretLocation.current, el.childNodes[0]);
      range.setStart(el.childNodes[0], caretLocation.current);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      // el.focus();
    }
  }, [text]);

  function handleChange() {
    const sel = window.getSelection();
    if (sel) {
      console.log(sel.anchorOffset);
      caretLocation.current = sel.anchorOffset;
    }
    const el = document.getElementById("text");
    el && setText(el.innerHTML);
  }
  return (
    <span
        id="text"
        contentEditable={true}
        onBeforeInput={(ev) => console.log("beforeInput", ev)}
        dangerouslySetInnerHTML={{ __html: text }}
        onInput={handleChange}
      >
      </span>
  )
}

export default App
