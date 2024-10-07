---
title: 컴포넌트의 ref 속성 사용하기
description: React 컴포넌트의 ref 속성을 사용하여 DOM 요소 다루기
---

## ref 속성

React DOM에서 기본으로 제공하는 컴포넌트는 콜백 함수를 전달받는 `ref` 속성을 가질 수 있습니다. 

이 콜백 함수는 다음과 같은 순서로 동작합니다.

1. 이전 콜백 함수와 현재 콜백 함수를 비교합니다.
2. 두 함수가 같다면 함수를 호출하지 않고, 다르다면 `null`을 인자로 전달하여 호출합니다.
3. 그리고 DOM 요소를 인자로 전달하여 호출합니다.

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

`ref` 속성으로 전달된 콜백 함수는 컴포넌트 리렌더링과는 관련이 없고, 오직 콜백 함수가 달라지는 경우에만 호출됩니다.

이는 다음 코드를 통해 알 수 있는 사실입니다.

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

위 코드로 생성한 카운터 앱에서는 버튼을 아무리 클릭해도 콘솔에는 다음 메시지 한 줄만이 출력됩니다.

컴포넌트는 계속 리렌더링되지만, `ref`로 전달한 콜백 함수는 변하지 않기 때문입니다.

```html
Hello!! <div>​0​</div>​
```

## useRef

특정 반응형 값이 변경되는 경우에만 `ref`에 전달되는 콜백 함수를 호출하고 싶을 수도 있습니다.

기존 콜백 함수는 의존성 배열을 지원하지 않으므로, `useEffect` 및 `useRef`를 사용해야 합니다.

```tsx ins={9, 11-13} {17}
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