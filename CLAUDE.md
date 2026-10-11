# 교재 집필 하네스

새 원고 집필·기존 원고 개편 요청에는 `.claude/skills/book-manuscript/SKILL.md`와 그 안의 `references/authoring-workflow.md`를 적용한다. 집필 후에는 `book-review` 검수까지 이어서 진행한다. 목차 설계는 `book-syllabus`, 부족한 설계 정보 수집은 `book-interview`, Mermaid는 `book-mermaid`를 사용한다.

- JavaScript: 원고 `book/`, 설계·진행 자료 `.book/`.
- React: 원고 `book2/`, 설계·진행 자료 `.book2/`.
- 다른 교재: 사용자가 지정한 원고 폴더와 그 과정의 `course-setup.md`를 찾는다. 기존 과정의 규칙을 자동 상속하지 않는다.

집필 전에 대상 과정의 설정·코드 few-shot·연결된 최신 계획서·장부를 읽는다. 새로 합의한 few-shot·목차·실행 환경·검토 방식을 해당 과정 파일에 저장해 다음 세션도 이어받게 한다. 이미 정한 기준을 다시 질문하지 않는다.

기본 흐름은 기준 확인 → 집필·내용 개편 → 실제 코드·내용 검증과 이미지·Mermaid 확인 → 문체 다듬기 → 보존 검사 → 최종 검수 → 장부 갱신 → 브라우저 검토이다. 새 원고는 읽기용 HTML, 기존 원고 개편은 백업과 수정본의 좌우 비교 HTML을 만든다. 완료한 요청 범위의 화면을 브라우저에 직접 열고 경로와 검증 결과를 보고한다. 작업 범위·교재 확정 상태는 사용자의 지시를 따른다.

상세 절차와 완료 기준은 `.claude/skills/book-manuscript/references/authoring-workflow.md`를 단일 기준으로 사용한다.

제목·본문 문체는 `.claude/skills/book-manuscript/references/title-style.md`를 공통 기준으로 사용한다. 문체 교정에서는 코드·수치·고유명사·기존 제목·문단 순서를 보존한다. 제목 개편은 계획서부터 반영하고, 문체 교정에서 발견한 내용 오류는 별도 내용 개편으로 처리한다. 코드·Markdown 검사에 더해 제목·문체 수동 검토와 보존 검사를 마쳐야 검수 완료다.
