---
title: useReducer 훅을 이용한 상태관리 
description: 상태관리를 위해 useReducer 훅을 사용하는 방법에 대해 알아봅니다.
---

`useReducer` 훅은 `useState` 훅처럼 상태를 관리하기 위해 사용되는 훅입니다.

## 사용 방법

`useState`를 `useReducer`로 마이그레이션하면서 `useReducer`의 사용 방법과 동작 원리에 대해 알아보겠습니다.

다음과 같이 `useState`를 사용하여 상태를 관리하는 카운터 앱을 준비합니다.

```tsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => setCount((prev) => prev - 1)}>-</button>
      <div>{count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
}

export default App;
```

가장 먼저, `useState`를 `useReducer`로 변경하고, 리듀서 함수를 생성합니다. 

리듀서 함수는 두 개의 매개변수를 가지며, 새로운 상태로 사용할 값을 반환합니다.

1. 첫 번째 매개변수는 기존 상태를 전달받습니다.
2. 두 번째 매개변수는 새로운 상태를 전달받습니다.

그리고 `useReducer`의 첫 번째 인자로 리듀서 함수를, 두 번째 인자로 초기 상태 값을 전달합니다.

```tsx ins={3-5, 9} del={8}
import { useReducer } from 'react';

function countReducer(state: number, newState: number) {
  return newState;
}

function App() {
  const [count, setCount] = useState(0);
  const [count, setCount] = useReducer(countReducer, 0)

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => setCount((prev) => prev - 1)}>-</button>
      <div>{count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
}

export default App;
```

`useReducer`가 반환하는 `setCount`는 `useState`가 반환하는 함수와 다른 동작을 수행합니다. 

- `useState`가 반환하는 `setCount`는 해당 값으로 상태를 업데이트하고 리렌더링을 트리거합니다.
- `useReducer`가 반환하는 `setCount`는 전달받은 값을 리듀서 함수의 두 번째 인자로 전달합니다.

즉, 다음과 같이 코드를 수정할 수 있습니다.

```tsx del={4, 13, 16} ins={5, 14, 17}
import { useReducer } from 'react';

function countReducer(state: number, newState: number) {
  return newState;
  return state + newState;
}

function App() {
  const [count, setCount] = useReducer(countReducer, 0);

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => setCount((prev) => prev - 1)}>-</button>
      <button onClick={() => setCount(-1)}>-</button>
      <div>{count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      <button onClick={() => setCount(1)}>+</button>
    </div>
  );
}

export default App;
```

일반적으로 리듀서 함수로 전달되는 값을 `action`, 이를 전달하는 함수를 `dispatch`라고 합니다.

다음과 같이 코드를 수정합니다.

```tsx "action" "dispatch"
import { useReducer } from 'react';

function countReducer(state: number, action: number) {
  return state + action;
}

function App() {
  const [count, dispatch] = useReducer(countReducer, 0);

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => dispatch(-1)}>-</button>
      <div>{count}</div>
      <button onClick={() => dispatch(1)}>+</button>
    </div>
  );
}

export default App;
```

`action`의 값은 일반적으로 어떤 작업을 수행할지 명시하는 `type` 프로퍼티와 상태 업데이트 로직에서 필요한 값을 포함하는 객체로 정의합니다.

다음과 같이 코드를 수정합니다.

```tsx "State" "Action" ins={3-7, 10-19, 28, 31} del={27, 30}
import { useReducer } from 'react';

type State = number;
type Action = {
  type: 'increase' | 'decrease';
  unit: number;
};

function countReducer(state: State, action: Action) {
  const { type, unit } = action;

  switch (type) {
    case 'increase': {
      return state + unit;
    }
    case 'decrease': {
      return state - unit;
    }
  }
}

function App() {
  const [count, dispatch] = useReducer(countReducer, 0);

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => dispatch(1)}>-</button>
      <button onClick={() => dispatch({ type: 'decrease', unit: 1 })}>-</button>
      <div>{count}</div>
      <button onClick={() => dispatch(-1)}>+</button>
      <button onClick={() => dispatch({ type: 'increase', unit: 1 })}>+</button>
    </div>
  );
}

export default App;
```

마이그레이션이 성공적으로 완료되었습니다. 기존 코드에 비해 복잡성이 증가할 수도 있지만, 다음과 같은 이점이 추가될 수 있습니다.

- 이벤트 핸들러가 어떤 작업을 수행할지 명확하게 나타나 있습니다.
- 복잡한 상태 업데이트 로직이 컴포넌트 외부로 이동하여 컴포넌트의 가독성이 증가합니다.
- 상태 업데이트 로직이 컴포넌트 외부에 있는 리듀서 함수에 캡슐화되어 디버깅 및 테스팅이 쉬워집니다.

## 지연 초기화

초기값을 계산하기 위해 함수를 사용하는 상황이 존재할 수 있습니다.

```tsx ins={1-4} "getInitialCount(50)"
function getInitialCount(value: number) {
  console.log('init!');
  return value;
}

export default function App() {
  const [count, dispatch] = useReducer(countReducer, getInitialCount(50));

  return (
    // ...
  );
}
```

하지만, 이 함수는 컴포넌트가 리렌더링될 때마다 실행됩니다. 이 문제를 해결하기 위해 `useState`처럼 함수를 그대로 전달하면 오류가 발생합니다.

이 문제는 `useReducer`의 세 번째 인자로 해당 함수를 전달하고, 두 번째 인자로 해당 함수의 인자를 전달하여 해결할 수 있습니다.

```tsx
const [count, dispatch] = useReducer(countReducer, 50, getInitialCount);
```

이제 상태의 초깃값은 50이며, 상태의 초깃값을 결정하는 함수가 리렌더링 시 호출되지 않습니다.

함수의 초깃값을 결정하는 함수에 인자가 필요하지 않다면 두 번째 인자에 `null`을 전달하여 이 문제를 해결할 수 있습니다.

```tsx
function getInitialCount() {
  console.log('init!');
  return 100;
}

export default function App() {
  const [count, dispatch] = useReducer(countReducer, null, getInitialCount);
  // ...
```
