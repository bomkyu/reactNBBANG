
## 소개


친구들과 여행갈때 항상 총무역할을 맡아 왔는데,

여행 계획 및 금액을 나누는것이 힘들어 만들어본 React앱 입니다!

**홈페이지 주소 :** [http://tjqjarb1.dothome.co.kr/](http://tjqjarb1.dothome.co.kr/)

- **기간 : 2023-06 ~ 2023-07 (약 한달)**
- **인원 : 서범규**
- **툴 : VSCODE, GIT**
- **라이브러리 : REACT.js, react-date-range(달력)**
- **API** :  **GoogleMap, GoogleMapPlace**
- **DB : FireStore(NoSQL)**

<br>
<br>

## 주요기능
1. 로그인, 회원가입
2. 실시간 친구추가 및 수락
3. 일정추가에서 작성한 숙소금액, 구매물품 금액을 인원수에서 나눠서 인당 금액을 알려줍니다.

<br>
<br>

## 설계

**FriendRequest( 친구요청 컬렉션 )**

![Untitled 1](https://github.com/bomkyu/reactNBBANG/assets/128655202/f59db5ce-d729-479e-80de-19a3e0cf7b47)

**Trip ( 일정 정보를 저장할 컬렉션 )**

![Untitled 2](https://github.com/bomkyu/reactNBBANG/assets/128655202/c64f0438-75cb-47a9-9d4f-82aaf7f74015)

**User ( 회원정보 )**

![Untitled 1](https://github.com/bomkyu/reactNBBANG/assets/128655202/aed576c3-3afb-494b-8470-77ac9e32fbaa)

<br>
<br>

## 시연

**로그인**

![로그인](https://github.com/bomkyu/reactNBBANG/assets/128655202/4abbb315-81b7-45ad-a94f-f893912d01f6)

---

**친구추가**

![친구추가](https://github.com/bomkyu/reactNBBANG/assets/128655202/2635e018-89b6-4d72-a35f-f034e14d638b)

---

**수정**

![수정](https://github.com/bomkyu/reactNBBANG/assets/128655202/9db8d3f1-ecba-49b6-a264-12801b317db6)

**회원가입**

![회원가입](https://github.com/bomkyu/reactNBBANG/assets/128655202/3ab64d3c-4a7b-450e-b855-975df648ad7d)


---

**등록**

![등록](https://github.com/bomkyu/reactNBBANG/assets/128655202/32b8630b-0487-4b7d-bb36-45bbcf1aa785)

<br>
<br>

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
