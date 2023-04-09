原文：https://react.dev/reference/react/useState

`TODO`

### 存储以前渲染的信息
通常，你会在事件处理程序中更新状态。然而，在极少数情况下，你可能希望修改状态以响应渲染—-例如，你可能希望在prop发生变化时修改状态变量。

在大多数情况下，你不需要这个:

- 如果你需要的值完全可以从当前的props或其他状态中计算出来，则完全删除冗余状态。如果你担心过于频繁地重新计算，可以使用`useMemo`。
- 如果你想重置整个组件树的状态，给你的组件传递一个不同的`key`。
- 如果可以，在事件处理程序中更新所有相关的状态。

在这些都不适用的罕见情况下，你可以使用一种模式来根据到目前为止已经呈现的值更新状态，即在组件渲染时调用`set`函数。

举个例子。`CountLabel`组件显示传递给它的计数道具:

```jsx
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

假设你想显示计数器自上次更改以来是增加了还是减少了。`count`参数不会告诉你--你需要跟踪它之前的值。添加`prevCount`状态变量来跟踪它。添加另一个称为`trend`的状态变量来保持计数是增加还是减少。比较`prevCount`和`count`，如果它们不相等，更新`prevCount`和`trend`。现在你可以显示当前计数参数以及自上次渲染以来它是如何变化的。

```javascript
// App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```javascript
// CountLabel.js
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}

```

注意如果你在渲染的时候调用`set`函数，它必须在一个类似`prevCount !== count`的条件内，而且条件中必须有一个类似`setPrevCount(count) `的调用。否则，你的组件将会在循环中重复渲染，直至崩溃。而且，你也只能像这样更新当前渲染组件的状态。在渲染过程中调用另一个组件的`set`函数是个错误。最终，你的`set`调用仍然会更新状态而不发生异变--这并不意味着你可以打破纯函数的其他规则。

这个模式很难理解，而且最好避免掉。但是，它比在effect中更新状态要好。当你在渲染过程中调用`set`函数，你的组件用一个`return`语句退出时，在渲染子组件之前，React会立即重新渲染组件。这样，子组件就不需要渲染两次了。组件的剩余函数仍将执行（结果将被丢弃）。如果你的条件低于所有`Hook`调用，你可以添加一个早点的`return`来尽早重新启动渲染。

## 疑难解答
### 我已经更新了状态，但是日志给我的是旧值
在运行时调用`set`函数不能改变状态：
```javascript
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

这是因为状态的行为就像快照。更新状态请求使用新的状态值进行重渲染，但不会影响已经在运行中的事件处理器中的`count`变量。

如果你需要使用下一个状态，你可以在将它传递给`set`函数之前把它保存到一个变量中：

```javascript
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

### 我已经更新了状态，但屏幕上没有更新

如果下一个状态值等于前一个状态值，React会忽略你的更新，这由`Object.is`的比较结果来决定。这经常发生在当你在状态中修改一个对象或数组时：

```javascript
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

你修改一个已经存在的对象`obj`而且把它传递给`setObj`，所以React忽略了更新。为了修复它，你需要确定你在状态中总是替换对象和数组而不是修改他们：

```javascript
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

### 我收到一个错误："Too many re-renders"
你可能收到一个这样的错误："Too many re-renders"。React限制了渲染的次数防止无限循环。通常，这意味着你在渲染过程中无条件的设置状态，所以你的组件进入了一个循环：渲染，设置状态（导致了渲染），渲染，设置状态（导致了渲染），等等。通常，这是事件处理器中的错误导致的：
```javascript
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

如果你没有发现这个错误的原因，在Console上点击错误附近的箭头，寻找JavaScript堆栈来发现特殊的导致错误的特定`set`函数调用。

### 我的初始化或更新函数运行了两次
在严格模式下，React会调用两次你的函数而不是一次：

```javascript
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

这是预料中的，而且不会破坏你的代码。

这是只在开发环境中的行为，用来帮助你保持组件的纯净。React使用其中一个调用的结果，并且忽略其他调用的结果。只要你的组件、初始化函数、更新函数是纯净的，它就不会影响你的逻辑。但是，如果他们是不纯的，这能帮助你发现问题。

比如，在状态中，不纯的更新函数修改一个数组：

```javascript
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

因为React调用你的更新函数两次，你会看到todo被加入了两次，所以你将知道这里有问题。在这个例子中，你可以通过替换数组而不是修改它来修复这个错误。

```javascript
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
})
```

现在这个更新函数纯净了，多调用它一次不会造成不同的行为。这就是为什么React调用它两次帮你发现问题。只有组件，初始化函数，更新函数需要保持纯净。事件处理器不需要纯净，所以React不会调用你的事件处理器两次。

### 我尝试把函数设置给状态，但它被调用了

你不能像这样把函数赋值给状态：

```javascript
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

因为你传递了函数

`TODO`




