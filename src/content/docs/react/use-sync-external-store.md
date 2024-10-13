---
title: 외부 API와 통신하기
description: useSyncExternalStore를 사용하여 외부 API와 통신하는 방법을 알아봅니다.
---

외부 라이브러리나 플랫폼 API와 통신하기 위해서 해당 데이터를 컴포넌트로 가져와 상태 및 라이프사이클에 통합시켜 동기화해야 합니다.

예를 들면, Geolocation API를 사용해 현재 위치를 표시하는 컴포넌트를 만드는 경우입니다. 이 데이터는 React의 일부가 아니라 외부 상태입니다. 즉, 이 외부 상태를 컴포넌트의 내부 상태와 동기화시켜야합니다.

이를 위해 `useSyncExternalStore`를 사용할 수 있습니다.

## 인자

이 훅은 3개의 인자를 전달받을 수 있습니다.

1. `subscribe`: 콜백 함수를 전달받고, 클린업 함수를 반환하는 함수입니다. 연결된 외부 스토어의 값이 변경될 때마다 인자로 전달한 콜백 함수가 호출됩니다. 이 콜백 함수가 호출되면 두 번째 인자인 `getSnapshot` 함수를 호출하며 컴포넌트를 리렌더링합니다.
2. `getSnapshot`: 외부 저장소의 현재 값을 반환하는 함수입니다.
3. `getServerSnapshot` (선택적): 서버에 있는 외부 저장소의 현재 값을 반환하는 함수입니다. SSR이나 재수화를 위해 사용하며, 이 인자가 전달되지 않으면 `Suspense`의 대체 콘텐츠가 렌더링되며, 수화가 완료되면 `getSnapshot`을 호출하여 현재 값을 가져옵니다.

## 예시

간단한 예시를 통해 미디어 쿼리를 구독하여 변경될 때마다 다른 콘텐츠를 제공하는 방법을 알아봅니다.

현재 뷰포트가 500px보다 큰지 판단하고 그 결과를 화면에 렌더링하는 컴포넌트를 작성합니다.

```tsx
export default function App() {
  const query = "(max-width: 500px)";
  const result = window.matchMedia(query).matches;
  return <div>{result ? "Less than 500px" : "More than 500px"}</div>;
}
```

이 컴포넌트는 동작하지만, 값의 변화를 실시간으로 반영하지 않습니다. 이 문제를 해결하기 위해 `useSyncExternalStore`를 사용할 수 있습니다.

먼저 첫 번째 인자로 전달할 `subscribe` 함수를 정의합니다. 이 함수는 외부 스토어를 구독하고, 구독을 취소하는 클린업 함수를 반환합니다. 즉, 쿼리의 목록이 업데이트되면 콜백 함수를 호출합니다.

```tsx
function subscribe(callback: () => void) {
  const queryList = window.matchMedia(query);
  queryList.addEventListener("change", callback);
  return () => queryList.removeEventListener("change", callback);
}
```

이제 외부 스토어의 현재 값을 반환하는 `getSnapshot` 함수를 정의합니다. `subscribe`로 구독한 스토어가 업데이트되면 콜백 함수를 호출하는데, 그 콜백 함수가 바로 `getSnapshot` 함수입니다.

스토어가 업데이트되면 `getSnapshot` 함수를 호출하고, 컴포넌트를 리렌더링하여 UI를 업데이트합니다.

```tsx
function getSnapshot() {
  return window.matchMedia(query).matches;
}
```

이제 다음과 같이 `useSyncExternalStore`를 호출하여 뷰포트의 크기가 변경될 때마다 업데이트되는 값을 얻을 수 있습니다.

```tsx
const result = useSyncExternalStore(subscribe, getSnapshot);
```

위에서 작성한 전체 코드는 다음과 같습니다.

```tsx
import { useSyncExternalStore } from "react";

export default function App() {
  const query = "(max-width: 500px)";
  const result = useSyncExternalStore(subscribe, getSnapshot);

  function subscribe(callback: () => void) {
    const queryList = window.matchMedia(query);
    queryList.addEventListener("change", callback);
    return () => queryList.removeEventListener("change", callback);
  }

  function getSnapshot() {
    return window.matchMedia(query).matches;
  }

  return <div>{result ? "Less than 500px" : "More than 500px"}</div>;
}
```
