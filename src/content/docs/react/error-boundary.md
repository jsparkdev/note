---
title: 에러 바운더리
description: react-error-boundary 라이브러리를 사용하여 React 컴포넌트에서 발생하는 오류를 처리하는 방법을 알아봅니다.
---

컴포넌트 렌더링 시 발생하는 오류는 런타임에 발생하므로 `try catch` 구문을 사용하여 이를 해결할 수 있습니다.

하지만, 모든 컴포넌트에서 사용하는 것은 비효율적이기에 [`react-error-boundary`](https://www.npmjs.com/package/react-error-boundary)와 같은 라이브러리를 사용하여 이 문제를 해결하는 것이 일반적입니다.

이 게시물에서는 해당 라이브러리를 사용하여 문제를 해결하는 방법에 대해 알아봅니다.

## 동작 원리

컴포넌트 렌더링을 시도하고, 성공하면 해당 컴포넌트를 렌더링하며, 실패하면 대체 컴포넌트를 렌더링합니다.

즉, 동작 원리는 다음과 같다고 할 수 있습니다.

```tsx
<Try catch={<div>Oh no!</div>}>
	<App />
</Try>
```

실제 코드는 다음과 같습니다.

```tsx
<ErrorBoundary fallback={<div>Oh no!</div>}>
	<App />
</ErrorBoundary>
```

### 대체 컴포넌트

만드는 방법은 다양하지만 다음과 같이 컴포넌트의 Props 타입을 가져와 사용하는 것을 권장합니다.

```tsx {3, 6}
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

이렇게 만들어진 대체 컴포넌트를 `ErrorBoundary` 컴포넌트의 `FallbackComponent` 프로퍼티로 전달합니다.

```tsx
<ErrorBoundary FallbackComponent={ErrorFallback}>
	<App />
</ErrorBoundary>
```

## 비동기 오류 해결

기본적으로 컴포넌트 렌더링 시 발생하는 오류를 해결하기 위해 사용되는 라이브러리이지만, 컴포넌트 렌더링 후 비동기로 동작하는 작업에서 발생하는 오류를 처리할 수도 있습니다.

이러한 오류를 처리하기 위해서는 `useErrorBoundary` 훅을 사용합니다.

```tsx {18} ins={1-3, 6}
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
