---
title: 포탈
description: React 포탈을 사용하여 컴포넌트를 원하는 위치에서 렌더링하는 방법을 알아봅니다.
---

모달이나 툴팁과 같은 요소들은 다음 이유로 인해 메인 DOM트리 외부에서 렌더링하는 것이 권장됩니다.

- 부모 요소의 스타일링에 영향을 받지 않습니다.
- 스크린 리더와 같은 보조 기술이 더 쉽게 접근할 수 있습니다.
- 메인 DOM트리의 이벤트 버블링을 피할 수 있습니다.

[createPortal](https://react.dev/reference/react-dom/createPortal)을 사용하여 이러한 작업을 편리하게 수행할 수 있습니다.

## 사용 방법

- 첫 번째 인자로 렌더링할 JSX를 전달합니다.
- 두 번재 인자로 렌더링 위치를 전달합니다.

```tsx
import { createPortal } from 'react-dom';

function Modal() {
  return createPortal(<div>Hello World</div>, document.body);
}

export default function App() {
  return (
    <div>
      <p>Hello</p>
      <Modal />
    </div>
  );
}
```

위 코드는 다음과 같은 DOM을 생성합니다.

```html
<body>
  <div id="root">
    <p>Hello App</p>
  </div>
  <div>Hello Modal</div>
</body>
```

즉, `body`의 마지막 자식 요소로 `Modal` 컴포넌트가 렌더링됩니다.

## 재렌더링

위 코드를 보면 `Modal` 컴포넌트는 `App` 컴포넌트의 자식 요소이지만, 메인 DOM트리 외부에서 렌더링됩니다.

그렇다고 하더라도 부모 컴포넌트의 하위 컴포넌트이므로 부모 컴포넌트의 재렌더링 시 `Modal` 컴포넌트도 함께 재렌더링됩니다.
