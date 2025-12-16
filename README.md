# 과제 02 - Movie Demo (React)

본 프로젝트는 **React + Vite**를 사용하여 구현한  
영화 포스터 기반 **Single Page Application (SPA)** 데모 사이트입니다.

The Movie Database (TMDB) API를 활용하여  
영화 목록 조회, 검색, 상세 페이지, 추천(Wishlist) 기능을 구현하였으며,  
GitHub Pages를 통해 정적 웹사이트로 배포하였습니다.

---

## 🔗 Deployment

- **GitHub Repository**  
  https://github.com/nasooh12/movie-app

- **GitHub Pages**  
  https://nasooh12.github.io/movie-app/

---

## 🛠 Tech Stack

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS (Transition / Animation 활용)
- **API**: The Movie Database (TMDB)
- **Deployment**: GitHub Pages

---

## 📁 Project Structure

movie-app/
├─ src/
│ ├─ api/ # TMDB API 연동
│ ├─ components/ # 공통 컴포넌트
│ ├─ context/ # Auth / Wishlist Context
│ ├─ pages/ # 페이지 단위 컴포넌트
│ ├─ styles/ # CSS 스타일
│ ├─ hooks/ # Custom Hooks
│ └─ main.tsx
├─ public/
├─ package.json
├─ vite.config.ts
└─ README.md


---

## ✨ Main Features

### 🔐 Authentication
- 로그인 / 회원가입 기능
- Local Storage를 활용한 사용자 정보 저장
- 자동 로그인(Keep Login) 지원
- 로그인 상태에 따른 라우팅 보호

### 🎬 Movie
- TMDB API를 활용한 영화 데이터 조회
- 홈 페이지에서 다양한 카테고리 영화 목록 표시
- 인기 영화 페이지 (Table / Infinite Scroll View 전환)
- 영화 상세 페이지 제공
- 영화 검색 기능

### ⭐ Wishlist
- 영화 추천(찜) 기능
- 추천 영화 Local Storage 저장
- 추천 상태 실시간 반영
- Wishlist 페이지에서 추천 영화만 표시

### 🎨 UI / UX
- 페이지 전환 애니메이션
- 카드 Hover / Transition 효과
- 로그인-회원가입 전환 애니메이션
- 반응형 웹 (모바일 대응)

---

## 🔑 Environment Variables

TMDB API Key는 **환경 변수**로 관리됩니다.

### `.env` 예시 (로컬 개발용)


VITE_TMDB_API_KEY=YOUR_TMDB_API_KEY



## ▶️ Installation & Run

### 1. 패키지 설치
```bash
npm install

2. 개발 서버 실행
npm run dev


브라우저에서 아래 주소로 접속:

http://localhost:5173/

🏗 Build
npm run build


빌드 결과물은 dist/ 폴더에 생성됩니다.

📦 Deployment

GitHub Pages를 사용하여 배포

Project Page 형태로 배포

배포 주소:

https://nasooh12.github.io/movie-app/

🤖 AI Assistance

본 프로젝트는 개발 과정에서
ChatGPT를 활용하여 다음과 같은 부분에서 도움을 받았습니다.

React 컴포넌트 구조 설계

Git Flow 전략 정리

UI / UX 개선 아이디어

CSS Transition 및 Animation 설계

오류 디버깅 및 코드 개선

👤 Author

Name: 이수형

Student ID: 2023
