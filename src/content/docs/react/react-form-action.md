---
title: Form Actions
description: 액션을 이용해 양식을 제출하는 방법에 대해 알아봅니다.
---

기존 리액트 `<form>` 컴포넌트에서는 다음과 같이 클라이언트 측에서 POST 요청을 처리했습니다.

```tsx
<form
	action="..."
	method="POST"
	encType="multipart/form-data"
	onSubmit={event => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		console.log(Object.fromEntries(formData))
	}}
>
```

- 양식 제출은 기본적으로 풀 페이지 리로드를 일으키므로 `event.preventDefault()` 함수를 사용합니다.
- 필드에 바이너리 데이터를 포함하기 위해 `encType="multipart/form-data"` 속성을 사용합니다.

## Form Actions

React 19에서 도입된 새로운 기능인 Actions를 사용하면 클라이언트 측 POST 요청을 대폭 단순화할 수 있습니다.

```tsx del={6-13} ins={1-3, 14}
function handleData(formData: FormData) {
	console.log(Object.fromEntries(formData))
}

<form
	action="..."
	method="POST"
	encType="multipart/form-data"
	onSubmit={event => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		console.log(Object.fromEntries(formData))
	}}
	action={handleData}
>
```

- `FormData` 객체를 인자로 받는 함수를 생성하여 `action` 속성의 값으로 전달합니다.
- 기존에 사용하던 나머지 모든 속성을 제거합니다.
