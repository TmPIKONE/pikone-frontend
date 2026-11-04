<div align="center">

<img src="src/assets/branding/pikone-logo.png" width="160" alt="PIKONE 로고" />

<h2>PIKONE Frontend 🍽️</h2>

사진으로 기록하는 나만의 외식 일기장<br />
누적된 방문 기록과 취향을 바탕으로 다음 식당까지 추천합니다.

<a href="https://github.com/TmPIKONE"><strong>PIKONE 소개 »</strong></a> ·
<a href="https://github.com/TmPIKONE/backend-master"><strong>Backend Repo »</strong></a>

</div>

<br />

## 📖 목차

1. [주요 기능](#-주요-기능)
2. [기술 스택](#-기술-스택)
3. [화면 구성](#-화면-구성)
4. [프론트엔드 구조](#-프론트엔드-구조)
5. [시작하기](#-시작하기)
6. [배포](#-배포)
7. [Developer](#-developer)

<br />

## ✨ 주요 기능

| 기능             | 설명                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| **간편 로그인**  | Kakao · Naver OAuth2 로그인, 로그인된 기기 확인 및 원격 로그아웃                                  |
| **사진 기록**    | 음식 사진을 올리면 이미지 분석 결과로 메뉴 · 식당 후보를 채워주고, 확인 후 기록 저장              |
| **임시 기록**    | 사진 분석 후 아직 확정하지 않은 기록을 모아 보고 이어서 작성                                      |
| **캘린더**       | 날짜별 외식 기록 조회 · 수정 · 삭제                                                               |
| **동반자**       | 함께 식사한 사람을 등록하고, 동반자별 외식 기록을 피드로 모아보기                                 |
| **AI 식당 추천** | 누적된 방문 기록 · 고정 장소 · 알레르기 정보를 바탕으로 식당 추천, 추천 결과를 바로 기록으로 연결 |
| **개인 설정**    | 고정 장소(집 · 회사 등), 알레르기, 계정 관리                                                      |

<br />

## 💡 기술 스택

| 분류         | 사용 기술                  |
| ------------ | -------------------------- |
| Core         | React 19, TypeScript, Vite |
| Server State | TanStack Query             |
| HTTP         | Axios                      |
| Routing      | React Router               |
| Styling      | Emotion                    |
| Icon         | lucide-react               |
| Test         | Vitest, Testing Library    |
| Quality      | ESLint, Prettier           |
| CI/CD        | GitHub Actions → AWS EC2   |

<br />

## 📱 화면 구성

| 경로                               | 화면                    |
| ---------------------------------- | ----------------------- |
| `/login`, `/loginwait`             | 로그인 · OAuth 콜백     |
| `/home`                            | 홈 (날짜별 기록 요약)   |
| `/calendar`                        | 캘린더                  |
| `/record/add`                      | 기록 작성 (사진 → 저장) |
| `/record/view`, `/record/edit/:id` | 기록 상세 · 수정        |
| `/draft`, `/draft/:draftId`        | 임시 기록               |
| `/ai`, `/ai/result`                | AI 추천 조건 · 결과     |
| `/companion/*`                     | 동반자 관리 · 기록 피드 |
| `/mypage/settings`                 | 설정                    |

> 로그인이 필요한 화면은 `ProtectedRoute`로 보호하고, 모든 페이지는 `React.lazy`로 코드 분할합니다.

<br />

## 🏗 프론트엔드 구조

```
src
├─ apis/          # 도메인별 API 정의 (*.api.ts) 와 요청·응답 타입 (*.types.ts)
│  └─ config/     # Axios 클라이언트, ApiBuilder, QueryClient 설정
├─ features/      # 도메인별 TanStack Query 훅 (*.queries.ts) 과 비즈니스 로직
├─ pages/         # 라우트 단위 화면
├─ components/    # 공용 UI 컴포넌트 (컴포넌트 · styles · types · test 를 한 폴더에)
├─ contexts/      # 인증 상태 (AuthContext)
├─ layouts/       # 인증 / 메인 레이아웃
├─ hooks/         # 공용 훅 (현재 위치 등)
├─ styles/        # 테마, 글로벌 스타일
└─ utils/         # 날짜 · 이미지 · 토큰 유틸
```

### 데이터 흐름

```
pages / components
      │  useXxxQuery · useXxxMutation
      ▼
features/*.queries.ts   ── TanStack Query (캐싱 · 무효화, queryKeys 로 키 관리)
      │
      ▼
apis/*.api.ts           ── ApiBuilder 로 엔드포인트 · 메서드 · 타입 선언
      │
      ▼
apis/config/apiClient   ── Axios 인스턴스
                           · 요청마다 Access Token 첨부
                           · 401 TOKEN_EXPIRED 시 토큰 재발급 후 원래 요청 재시도
                             (동시 요청은 재발급 1회를 공유)
```

<br />

## 🚀 시작하기

```bash
npm install
npm run dev
```

`.env`

```
VITE_BASE_URL=http://localhost:8080   # 백엔드 API 주소
VITE_TELEMETRY_URL=                   # (선택) 클라이언트 지표 수집 주소
```

| 명령어              | 설명                 |
| ------------------- | -------------------- |
| `npm run dev`       | 개발 서버 실행       |
| `npm run build`     | 프로덕션 빌드        |
| `npm run lint`      | ESLint 검사          |
| `npm run typecheck` | 타입 검사            |
| `npm run test`      | 단위 테스트 (Vitest) |

<br />

## 📦 배포

`main` 브랜치에 push 하면 GitHub Actions 가 빌드 후 결과물(`dist`)을 AWS EC2 로 업로드해 배포합니다.
(`.github/workflows/frontend.yml`)

<br />

## 👨‍💻 Developer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/424on">
        <img src="https://github.com/424on.png" width="100" alt="424on" /><br />
        <sub><b>조윤호</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/jwoo13">
        <img src="https://github.com/jwoo13.png" width="100" alt="jwoo13" /><br />
        <sub><b>jwoo13</b></sub>
      </a>
    </td>
  </tr>
</table>
