---
title: 테스트 문서 2
description: 테스트 문서입니다.
---

## 테스트 콘텐츠 샘플

### 소개

이 문서는 마크다운 테스트를 위한 샘플 콘텐츠입니다.

### 주요 기능

#### 1. 헤딩 사용

다양한 레벨의 헤딩을 사용하여 문서를 구조화할 수 있습니다.

#### 2. 코드 블록

Rust 언어로 작성된 코드 예시:

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();

    map.insert("apple", 5);
    map.insert("banana", 3);
    map.insert("orange", 7);

    if let Some(count) = map.get("apple") {
        println!("사과의 개수: {}", count);
    }

    for (fruit, count) in &map {
        println!("{}: {}", fruit, count);
    }

    *map.entry("banana").or_insert(0) += 2;

    map.remove("orange");

    println!("최종 맵: {:?}", map);
}
```

### 결론

이상으로 마크다운 테스트 콘텐츠 샘플을 마칩니다.
