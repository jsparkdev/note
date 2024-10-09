---
title: 컴포넌트의 ref 속성
description: React 컴포넌트의 ref 속성을 사용하여 DOM 요소에 접근하는 방법에 대해 알아봅니다.
---

## ref 속성

React DOM에서 제공하는 컴포넌트는 콜백 함수를 전달받는 `ref` 속성을 가질 수 있습니다.

이 콜백 함수는 다음과 같은 순서로 동작합니다.

1. 이전 콜백 함수와 현재 콜백 함수를 비교합니다.
2. 두 함수가 같은 함수라면 아무런 동작을 수행하지 않습니다.
3. 두 함수가 다른 함수라면 `null`을 인자로 전달하여 호출하고 DOM 요소를 인자로 전달하여 다시 호출합니다.

다음은 버튼을 클릭하여 상태를 업데이트할 수 있는 카운터 앱입니다.

```tsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div
        ref={(node) => {
          console.log('Hello', node);
        }}
      >
        {count}
      </div>
      <button onClick={() => setCount((prev) => prev + 1)}>Update</button>
    </>
  );
}

export default App;
```

버튼을 세 번 클릭하여 상태를 세 번 업데이트하면 콘솔에 다음 메시지가 출력됩니다.

```html
Hello <div>​0​</div>​

Hello null
Hello <div>​1​</div>​

Hello null
Hello <div>​2​</div>​

Hello null
Hello <div>​3​</div>​
```

이는 전달된 콜백 함수가 매 리렌더링마다 새로 생성되기 때문에 발생합니다.

다음 코드는 컴포넌트가 리렌더링 되어도 콜백 함수가 다시 생성되지 않도록 수정한 코드입니다.

```tsx ins={3-5} {11}
import { useState } from 'react';

function callback(node: HTMLDivElement | null) {
  console.log('Hello!!', node);
}

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div ref={callback}>{count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Update</button>
    </>
  );
}

export default App;
```

이 경우 컴포넌트가 아무리 리렌더링 되어도 `ref`로 전달된 콜백 함수가 호출되지 않습니다.

## useRef

특정 반응형 값이 변경되는 경우에만 콜백 함수를 호출하고 싶을 수도 있습니다.

기존 콜백 함수는 의존성 배열을 지원하지 않으므로, `useEffect` 및 `useRef`를 사용해야 합니다.

```tsx ins={1, 9, 11-13} {17}
import { useEffect, useRef, useState } from 'react';

function callback() {
  console.log('Hello!!');
}

function App() {
  const [count, setCount] = useState(0);
  const myRef = useRef(null);

  useEffect(() => {
    callback();
  }, [count]);

  return (
    <>
      <div ref={myRef}>{count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Update</button>
    </>
  );
}

export default App;
```

위 코드는 컴포넌트 외부에 콜백 함수가 정의되었지만, `useEffect` 및 `useRef`를 사용하여 `count`가 업데이트될 때마다 콜백 함수를 호출합니다.
