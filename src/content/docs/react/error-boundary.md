---
title: Error Boundary
description: React Error Boundary를 사용하여 React 컴포넌트에서 발생하는 오류를 처리하는 방법을 알아봅니다.
---

컴포넌트 렌더링 시 발생하는 오류는 런타임에 발생하므로 미리 제거하기 힘듭니다.

물론, 컴포넌트에서 `try - catch` 구문을 사용하여 이를 해결할 수 있지만, 모든 컴포넌트에서 이를 사용하는 것은 매우 비효율적입니다.

[`react-error-boundary`](https://www.npmjs.com/package/react-error-boundary) 라이브러리를 사용하면 이러한 복잡한 문제를 매우 간단하게 해결할 수 있습니다.

## 동작 원리

컴포넌트 렌더링을 시도하고, 성공하면 해당 컴포넌트를 렌더링하며, 실패하면 대체 컴포넌트를 렌더링합니다.

다음과 같은 방식으로 동작한다고 생각할 수 있습니다.

```tsx
<Try catch={<div>Oh no!</div>}>
	<App />
</Try>
```

실제 코드 역시, 위 예시와 매우 유사합니다.

```tsx
<ErrorBoundary fallback={<div>Oh no!</div>}>
	<App />
</ErrorBoundary>
```

### 대체 컴포넌트

대체 컴포넌트를 만드는 방법은 다양하지만 다음과 같은 코드를 사용하는 것을 권장합니다.

```tsx
import {
	ErrorBoundary,
	type FallbackProps,
} from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div role="alert">
			<pre>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	)
}
```

이렇게 만들어진 대체 컴포넌트는 `ErrorBoundary` 컴포넌트의 `FallbackComponent` 프로퍼티로 전달합니다.

```tsx
<ErrorBoundary FallbackComponent={ErrorFallback}>
	<App />
</ErrorBoundary>
```

## 비동기 오류 해결

`react-error-boundary`는 기본적으로 컴포넌트 렌더링 과정에서 발생하는 오류를 해결하기 위해 사용되는 라이브러리입니다.

하지만, `useEffect`, 이벤트 핸들러 등 컴포넌트 렌더링 후 비동기 작업에서 발생하는 오류를 처리할 수도 있습니다.

이러한 오류를 처리하기 위해서는 `useErrorBoundary` 훅을 사용합니다.

```tsx {6, 18}
import {
	useErrorBoundary,
} from 'react-error-boundary'

function App() {
	const { showBoundary } = useErrorBoundary()

	return (
		<form
			action="..."
			method="POST"
			onSubmit={event => {
				try {
					event.preventDefault()
					const formData = new FormData(event.currentTarget)
					console.log([...formData.entries()])
				} catch (error: unknown) {
					showBoundary(error)
				}
			}}
		>
		...
  	</form>
  )
```

`showBoundary`를 사용하면 이벤트 핸들러에서 발생한 오류를 가장 가까운 에러 바운더리로 전달합니다.
