React的hook是React 16.8版本推出的一种新特性，它允许我们在不编写类的情况下，使用状态和其他React特性。它的名字“hook”取自其“钩子”功能，它允许您“挂钩”组件生命周期的状态和行为。
React内置的hook有以下几种：
1. `useState`用于为函数式组件引入状态。
2. `useEffect`用于在组件渲染或更新时执行一些操作。
3. `useContext`用于在组件树中共享状态。
4. `useReducer`用于管理复杂的组件级别状态逻辑。
5. `useCallback`用于记忆指定的函数。
6. `useMemo`用于记忆计算（对于类组件中的 `shouldComponentUpdate` 方法尤其有用）。
7. `useRef`用于在函数式组件中引入一个可变引用。
8. `useImperativeHandle`允许您在函数式组件中公开自定义的外部API。
9. `useLayoutEffect`用于在视图渲染前行动。
使用hook可以使得我们的代码更易于理解和维护，同时，由于不再需要编写类，可以减少很多样板代码，从而使代码更加简洁。但需要注意的是，需要按照React官方的使用规则使用Hook，以免导致性能问题和其他错误。

### 什么时候需要自定义hook
React 的自定义 Hook 实际上是一个函数，这个函数名以 `use` 开头，其作用是让你能够在函数组件中提取出可重用的 Hooks 代码。

一般来说，如果你发现组件代码中出现了一些重复的逻辑，那么可以考虑使用自定义 Hook 把这些逻辑封装起来，实现代码复用。

需要注意的是，自定义 Hook 不能包含任何 JSX 元素或者依赖于其他组件的状态或生命周期函数。自定义 Hook 的参数和返回值也是非常灵活的，可以根据实际的需求来定义。比如，可以将当前组件的状态提取为一个自定义 Hook 并返回 state 和 setState，还可以抽取一个返回距离当前时间的时间差的 Hook。

常见的自定义 Hook 可以有如下几种：

- 用于操作浏览器的 API
- 处理异步请求和响应
- 用于封装和处理表单的值和有效性
- 处理和使用 React Context
- 用于优化性能的 Hook，如使用 useMemo 和 useCallback

总之，在组件中重复使用的逻辑可以考虑提取为自定义 Hook，可以使代码更加清晰和简洁。自定义 Hook 能够在函数组件中复用逻辑，并且增强了代码的可重用性，使得组件逻辑更容易维护和扩展。


### 内置hook函数的执行顺序
React 中内置的 Hook 函数有一定的执行顺序，这个顺序是固定的。它们的执行顺序是：

1. `useState`
2. `useReducer`
3. `useEffect`
4. `useContext`
5. `useRef`
6. `useLayoutEffect`
7. `useImperativeHandle`
8. `useDebugValue`

需要注意的是，这些 Hook 函数并不是必须按照这个顺序调用的，这个顺序只是给出了它们的默认执行顺序，你可以根据自己的需求在代码中任意定义它们的执行顺序。


### 内置hook函数在服务端和客户端有什么不同表现

在 React 中，内置 Hook 函数在服务端渲染（Server-Side Rendering，SSR）和客户端渲染（Client-Side Rendering，CSR）方面表现并不完全相同。

在服务端渲染时，React 会先将组件代码转换成纯 HTML，再发送给客户端进行渲染。因此，在服务端渲染时有一些特殊的注意点：

1. `useEffect` 函数在服务端渲染中不会按照代码顺序立即执行，而是在组件渲染完成后才执行。如果在 `useEffect` 函数中使用了类似于 `window`、`document` 这样的全局对象，因为服务端没有这些对象，可能会导致代码出错。

2. `useState` 和 `useReducer` 函数的执行顺序和在客户端渲染时一样，但是服务端渲染会对它们的初始值进行快照并将它们和组件一起发送到客户端，这样在客户端渲染的时候就可以复用这些数据，而不用重新计算。

3. `useLayoutEffect` 函数在服务端渲染时会阻塞渲染，直到所有的同步渲染代码执行完成后再执行。因此，为了提高性能，我们需要尽量避免使用 `useLayoutEffect` 函数。

在客户端渲染时，React 会将组件代码转换成 DOM，并通过 JavaScript 动态生成视图。因此，在客户端渲染时，内置 Hook 函数的表现和在服务端渲染时一样。

