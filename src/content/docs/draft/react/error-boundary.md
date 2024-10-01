---
title: 에러 바운더리
description: 에러 바운더리 사용 방법
---

에러바운더리가필요한이유?
런타임 에러는 미리 막을 수 없기 때문에 이걸 처리해줄게 필요함. 문제가 발생하면 유용한 정보를  제공해야함.
컴포넌트 렌더링시 발생하는 문제를 해결하기 위해 모든 내용을 try catch할 수도 있지만 매번 하는건 비효율적.
그냥 이걸 자동으로 해주는게 에러바운더리.

<Try catch={<div>Oh no!</div>}>
	<App />
</Try>

딱 이거임 시도해보고 되면렌러딩 안되면 오류컴포 렌더링
단순히 트라이 대신 에러바운더리, 캐치대신 폴백일 뿐

<ErrorBoundary fallback={<div>Oh no!</div>}>
	<App />
</ErrorBoundary>

비동기 오류 해결?
얘는 렌더링 후 발생하는 에러 (주로 이벤트 핸들러 오류)
이는 useErrorBoundary 훅으로 처리.

폴백 전달하는 방버은 많겠지만
<ErrorBoundary FallbackComponent={ErrorFallback}>{/*...*/}</ErrorBoundary>
로 전달하고
ErrorFallback의 인자는 FallbackProps 타입 사용.

바운더리로 감싸는건 컴포 정의할때가 아니라 호출해서 렌더링할때임. 에러바운더리 목적 자체가 렌더링시 발생하는 오류를 잡기 위한거임.
새로고침하면 해결되는 문제를 위해 reset에러바운더리 프롭스도 사용.
