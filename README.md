# 개인프로젝트(N/B, React)

생성일: 2023년 7월 19일 오후 3:07
태그: CSS, HTML, JAVASCRIPT, REACT

## 소개

---

친구들과 여행갈때 항상 총무역할을 맡아 왔는데,

여행 계획 및 금액을 나누는것이 힘들어 만들어본 React앱 입니다!

**홈페이지 주소 :** [http://tjqjarb1.dothome.co.kr/](http://tjqjarb1.dothome.co.kr/)

[https://github.com/bomkyu/reactNBBANG](https://github.com/bomkyu/reactNBBANG)

- **기간 : 2023-06 ~ 2023-07 (약 한달)**
- **인원 : 서범규**
- **툴 : VSCODE, GIT**
- **라이브러리 : REACT.js, react-date-range(달력)**
- **API** :  **GoogleMap, GoogleMapPlace**
- **DB : FireStore(NoSQL)**

## 주요기능

---

1. 로그인, 회원가입
2. 실시간 친구추가 및 수락
3. 일정추가에서 작성한 숙소금액, 구매물품 금액을 인원수에서 나눠서 인당 금액을 알려줍니다.

## 설계

---

**FriendRequest( 친구요청 컬렉션 )**

![Untitled](Untitled.png)

**Trip ( 일정 정보를 저장할 컬렉션 )**

![Untitled](Untitled%201.png)

**User ( 회원정보 )**

![Untitled](Untitled%202.png)

## 시연

---

**로그인**

![로그인.gif](%25EB%25A1%259C%25EA%25B7%25B8%25EC%259D%25B8.gif)

---

**친구추가**

![친구추가.gif](%25EC%25B9%259C%25EA%25B5%25AC%25EC%25B6%2594%25EA%25B0%2580.gif)

---

**수정**

![수정.gif](%25EC%2588%2598%25EC%25A0%2595.gif)

**회원가입**

![회원가입.gif](%25ED%259A%258C%25EC%259B%2590%25EA%25B0%2580%25EC%259E%2585.gif)

---

**등록**

![등록.gif](%25EB%2593%25B1%25EB%25A1%259D.gif)

## 아쉬운점

---

**보안**

로그인 회원가입 구현을 할 때 보안을 생각 못한게 너무 아쉽다.

회원가입을 애초에 GoogleAuth로 토큰값을 저장해서 사용했으면 보안성이 올라갔을꺼 같은데..

**Redux 상태관리**

Redux로 상태관리를 했으면 어땠을까 하는 아쉬움이 밀려온다.

초반 앱을 구상하고 작업할때는 필요성을 못 느꼈으나 기능이 점점 추가되면서

(modal, Friend 등등.. )상태관리필요성을 점점 느끼게 되었다.

그래서 현재 Redux공부중이다.

**컴포넌트 쪼개기**

 NB이 React로 처음 한 프로젝트라 컴포넌트 쪼개는 부분이 미숙해서 정말 아쉽다.

결국 중복되는 UI들을 쉽게 가져다 쓰는게 장점인데

이 장점을 많이 못살린것 같아서 아쉽다.

**전체적으로…**

함수들을 쪼개는 부분이 미숙한거 같다 중복되는 코드도 많고,

지속적으로 리펙토링을 해야겠다.