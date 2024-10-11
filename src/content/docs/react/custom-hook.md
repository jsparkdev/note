---
title: 커스텀 훅
description: 반복적으로 사용되는 논리를 커스텀 훅으로 만들어 여러 컴포넌트에서 재사용하는 방법을 알아봅니다.
---

커스텀 훅은 React가 기본적으로 제공하는 훅을 호출할 수 있는 함수입니다. 여러 컴포넌트에서 반복적으로 사용되는 논리를 캡슐화하여 재사용할 수 있습니다.

## 사용 방법

`useState`를 사용하여 다음과 같은 간단한 카운터를 작성할 수 있습니다.

```tsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount((prev) => prev - 1)}>decrease</button>
      <button onClick={() => setCount((prev) => prev + 1)}>increase</button>
    </div>
  );
}
```

커스텀 훅을 사용하여 위 코드를 마이그레이션하면 다음과 같이 작성할 수 있습니다.

```tsx ins={3-9,13,19-20} del={12,17-18}
import { useState } from 'react';

function useCount() {
  const [count, setCount] = useState(0);
  const decrease = () => setCount((prev) => prev - 1);
  const increase = () => setCount((prev) => prev + 1);

  return [count, increase, decrease] as const;
}

export default function App() {
  const [count, setCount] = useState(0);
  const [count, increase, decrease] = useCount();
  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount((prev) => prev - 1)}>decrease</button>
      <button onClick={() => setCount((prev) => prev + 1)}>increase</button>
      <button onClick={decrease}>decrease</button>
      <button onClick={increase}>increase</button>
    </div>
  );
}
```

## 의존성 배열에 커스텀 훅 전달

`useEffect`와 같이 의존성 배열을 사용하는 훅에서 커스텀 훅을 호출할 때는 주의가 필요합니다.

`increase` 함수를 매 초마다 실행하기 위해 다음과 같이 코드를 작성할 수 있습니다. 하지만 이 코드에는 문제가 있으며, 버그를 발생시킬 수 있습니다.

```tsx ins={4, 15-20} collapse={5-10, 21-29}
import { useEffect, useState } from 'react';

function useCount() {
  console.log('call useCount');
  const [count, setCount] = useState(0);
  const decrease = () => setCount((prev) => prev - 1);
  const increase = () => setCount((prev) => prev + 1);

  return [count, increase, decrease] as const;
}

export default function App() {
  const [count, increase, decrease] = useCount();

  useEffect(() => {
    const id = setInterval(() => {
      increase();
    }, 1000);
    return () => clearInterval(id);
  }, [increase]);

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={decrease}>decrease</button>
      <button onClick={increase}>increase</button>
    </div>
  );
}
```

이 코드는 다음과 같이 동작합니다.

1. `App` 컴포넌트가 렌더링을 시작합니다.
2. `useCount` 훅이 호출되어 `count`가 0으로 초기화되고, `increase`, `decrease` 함수를 생성합니다.
3. 컴포넌트가 반환하는 JSX가 평가되고 DOM을 업데이트하여 화면을 업데이트합니다.
4. `useEffect`로 인해 1초마다 `increase` 함수를 호출하도록 예약합니다.
5. 1초 후 `increase` 함수가 호출되어 `count` 상태가 업데이트됩니다. 이로 인해 컴포넌트가 리렌더링됩니다.
6. 컴포넌트가 리렌더링되어 `useCount` 훅이 다시 호출되고, `increase`, `decrease` 함수를 새로 생성합니다.
7. 이 과정이 계속 반복됩니다.

즉, 컴포넌트가 리렌더링될 때마다 `increase` 함수가 새로 생성되어 타이머가 계속 새로 생성됩니다.

위 예시 코드는 클린업 함수로 인해 이전 타이머를 제거하고 새로 생성하기 때문에 메모리와 관련된 문제는 발생하지 않습니다. 하지만, 다음과 같은 불필요한 연산을 수행하여 CPU 사이클을 낭비하고 있습니다.

- 로직이 변하지 않는 `increase`, `decrease` 함수가 계속해서 재생성되고 있습니다.
- 의미 없이 기존 타이머를 제거하고 새 타이머를 생성하는 연산이 반복되고 있습니다.

이 문제는 `increase` 함수가 재생성되는 것을 방지하여 해결할 수 있습니다. 이를 위해 [메모이제이션](/react/memoization)을 사용합니다.

### 메모이제이션

캐싱해야 할 값이 함수이므로 `useCallback`을 사용합니다.

메모이제이션을 위해 `increase`, `decrease` 함수에 `useCallback`을 사용합니다.

```tsx del={3-4} ins={5-6}
function useCount() {
  const [count, setCount] = useState(0);
  const decrease = () => setCount((prev) => prev - 1);
  const increase = () => setCount((prev) => prev + 1);
  const decrease = useCallback(() => setCount((prev) => prev - 1), []);
  const increase = useCallback(() => setCount((prev) => prev + 1), []);

  return [count, increase, decrease] as const;
}
```

`useCallback`을 사용해 함수를 메모하면 `useCount`가 호출되어도 `increase`, `decrease` 함수가 새로 생성되지 않습니다.

오직 `useCallback`의 두 번째 인자인 의존성 배열의 요소가 변경되는 경우에만 새로운 함수가 반환됩니다.
