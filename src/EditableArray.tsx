import { useState } from 'react';
import { EditableText } from './components/EditableText';

function EditableArray() {
  const [array, setArray] = useState<string[]>(['one', 'two', 'three']);

  const setValue = (index: number) => {
    return (text: string) => {
      const newArray = [...array];
      newArray[index] = text;
      setArray(newArray);
    };
  };

  return (
    <div className="App">
      <h1>Controlled contenteditable elements</h1>
      {array.map((text, i) => (
        <EditableText key={i} value={text} setValue={setValue(i)} />
      ))}
    </div>
  );
}

export default EditableArray;
