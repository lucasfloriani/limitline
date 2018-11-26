const Backspace = 8
const Enter = 13
const End = 35
const Home = 36
const Left = 37
const Up = 38
const Right = 39
const Down = 40
const Delete = 46
const LetterV = 86
const LetterA = 65
const LetterC = 67

const Buttons = [Backspace, Enter, End, Home, Left, Up, Right, Down, Delete]


const limitBy = limit => {
  return elem => {
    _limitOnKeyDown(limit, elem)
    _limitOnPaste(limit, elem)
  }
}

const _limitOnKeyDown = (limit, elem) => {
  elem.addEventListener("keydown", e => {
    const column = getColumn(elem)
    const lines = elem.value.split("\n")
    const index = getLineNumber(elem) - 1
    const line = lines[index]

    if (e.ctrlKey && (e.keyCode === LetterC || e.keyCode === LetterV || e.keyCode === LetterA)) {
      return
    }

    if (line.length >= limit && !Buttons.includes(e.keyCode)) {
      e.preventDefault()
    }

    if (e.keyCode === Delete && column === line.length && lines[index+1] !== undefined) {
      if (line.length + lines[index+1].length > limit) {
        e.preventDefault()
      }
    }

    if (e.keyCode === Backspace && column === 0 && lines[index-1] !== undefined) {
      if (line.length + lines[index-1].length > limit) {
        e.preventDefault()
      }
    }
  });
}

const _limitOnPaste = (limit, elem) => {
  elem.addEventListener("paste", e => {
    e.preventDefault();
    const text = e.target.value;
    const pastedText = e.clipboardData.getData('text');
    const newContent = text.substring(0, elem.selectionStart) + pastedText + text.substring(elem.selectionStart)
    const lines = newContent.split("\n");

    const newLines = lines.flatMap(line => (line.length >= limit) ? line.match(new RegExp('.{1,' + limit + '}', 'g')) : line)
    e.target.value = newLines.join("\n");
  });
}

const getElemTextUntilCursorByArray = elem => elem.value.substr(0, elem.selectionStart).split("\n")


const getLineNumber = elem => getElemTextUntilCursorByArray(elem).length

const getColumn = elem => {
  const lines = getElemTextUntilCursorByArray(elem)
  return lines[lines.length - 1].length
}
