---
title: Satisfies 연산자
description: Satisfies 연산자를 사용하여 객체의 타입을 검사하는 방법에 대해 알아봅니다.
---

우리는 TypeScript에서 다음 객체를 사용하려고 합니다.

```ts
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255]
}
```

객체의 키와 값의 유효성을 검사하기 위해 타입을 정의하려고 합니다.

## Type Annotation

변수를 특정 타입으로 강제하는 방법이며, 다음과 같이 값을 잘못 추론할 수 있습니다.

```ts {9}
type Color = 'red' | 'green' | 'blue';

const palette: Record<Color, string | number[]> = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255]
}

const greenHex = palette.green.toUpperCase(); // Property 'toUpperCase' does not exist on type 'number[]'
```

`palette.green`은 문자열이지만, 타입 어노테이션에 의해 `string | number[]`로 추론되어 오류가 발생합니다.

## Satisfies

타입을 강제하지 않으며, 오직 타입 검사만 수행하고, 올바른 값을 추론합니다.

```ts {9}
type Color = 'red' | 'green' | 'blue';

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255]
} satisfies Record<Color, string | number[]>;

const greenHex = palette.green.toUpperCase(); // "#00FF00"
```

`palette.green`이 문자열로 올바르게 추론되어 오류가 발생하지 않습니다.

## 요약

- TypeScript 4.9+ 코드에서 값의 타입을 검사하면서, 타입을 올바르게 추론하려면 `satisfies` 연산자를 사용하세요.
- Type Annotation을 사용하는 경우 타입을 명시적으로 지정할 수는 있지만, 타입 추론이 올바르게 동작하지 않을 수도 있습니다.
