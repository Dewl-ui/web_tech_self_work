# Баг 4 — Хэрэглэгчийн удирдлагын хэсэг

## Бие даалт 2: Frontend хөгжүүлэлт

### Төслийн тухай

Цахим сургалтын систем (LMS)-ийн **хэрэглэгчийн удирдлагын хэсэг**-ийг хариуцан хөгжүүлнэ.

**API Base URL:** `https://todu.mn/bs/lms/v1`  
**API Swagger editor:** `https://editor.swagger.io/`
**API Swagger:** `todu.mn/bs/lms/open-api-catalog/v1/`  
**API Documentation (Ready to use):** `https://registry.scalar.com/@default-team-74qpj/apis/ords-generated-api-for-v1@1.0.0`

### Даалгаврын шаардлага

> • Админ нь оюутан, багш нарыг **бүртгэнэ**
> • Багш нь оюутанг **бүртгэнэ**
> • Багш нь өөрийн хичээл дээрээ оюутанг **нэмнэ**
> • Багш нь хичээл дээрээ оюутнуудаа **багт хуваана**

---

### Тест хэрэглэгчид

| №   | Email                     | Нууц үг | Эрх                 |
| --- | ------------------------- | ------- | ------------------- |
| 1   | admin@must.edu.mn         | 123     | Системийн админ     |
| 2   | User@must.edu.mn          | 123     | Системийн хэрэглэгч |
| 3   | schooladmin@must.edu.mn   | 123     | Сургуулийн админ    |
| 4   | schoolteacher@must.edu.mn | 123     | Сургуулийн багш     |
| 5   | schoolstudent@must.edu.mn | 123     | Сургуулийн оюутан   |

---

### ⚠️ Чухал: Эрхийн тодорхойлолт

Хэрэглэгчийн эрх нь **сургууль бүрт өөр** байна. Нэг хүн А сургуульд админ, Б сургуульд оюутан байж болно.

**Эрхийг хэрхэн тодорхойлох:**

```
GET /users/{id}/schools → { items: [{ id, name, "{}role": "{\"name\":\"teacher\"}" }] }
```

`{}role` талбарыг `JSON.parse()` хийж, сонгосон сургууль дахь role.name-г авна.

**SchoolSelect хуудас:**

- `GET /schools` биш → `GET /users/{me.id}/schools` дуудна
- Зөвхөн тухайн хэрэглэгчийн **хамаарах сургуулиудыг** харуулна
- Сонгосон сургуулийг localStorage-д хадгална
- Сургууль сонгосны дараа тэр сургууль дахь role-г тодорхойлно

---

### Эрхийн хяналт (PDF-ийн шаардлагаар)

| Хуудас / Үйлдэл                                 | Админ                 | Багш                 | Оюутан               |
| ----------------------------------------------- | --------------------- | -------------------- | -------------------- |
| `/` Нүүр хуудас                                 | ✅ Системийн мэдээлэл | ✅ Миний хичээлүүд   | ✅ Миний хичээлүүд   |
| `/login` Нэвтрэх                                | ✅                    | ✅                   | ✅                   |
| `/register` Бүртгүүлэх                          | ✅                    | ✅                   | ✅                   |
| `/forgot-password`                              | ✅                    | ✅                   | ✅                   |
| `/reset-password`                               | ✅                    | ✅                   | ✅                   |
| `/schools/current` Сургууль сонгох              | ✅ Өөрийн сургуулиуд  | ✅ Өөрийн сургуулиуд | ✅ Өөрийн сургуулиуд |
| `/roles` Эрхийн удирдлага                       | ✅                    | ❌ redirect          | ❌ redirect          |
| `/users` Хэрэглэгчийн жагсаалт                  | ✅ Бүх хэрэглэгч      | ❌ redirect          | ❌ redirect          |
| `/users/create` Хэрэглэгч бүртгэх               | ✅ Бүгдийг            | ✅ Зөвхөн оюутан     | ❌ redirect          |
| `/users/:id` Хэрэглэгч харах                    | ✅                    | ❌                   | ❌                   |
| `/users/:id/edit` Хэрэглэгч засах               | ✅                    | ❌                   | ❌                   |
| `/profile` Өөрийн мэдээлэл                      | ✅                    | ✅                   | ✅                   |
| `/profile/change-password` Нууц үг солих        | ✅                    | ✅                   | ✅                   |
| `/courses/:id/users` Хичээлийн хэрэглэгчид      | ✅                    | ✅ Өөрийн хичээл     | ❌ redirect          |
| `/courses/:id/users/edit` Хэрэглэгч нэмэх/хасах | ✅                    | ✅ Өөрийн хичээл     | ❌ redirect          |
| `/courses/:id/groups` Бүлэг удирдах             | ✅                    | ✅ Өөрийн хичээл     | ❌ redirect          |
| `/courses/:id/groups/:gid/users` Бүлгийн гишүүд | ✅                    | ✅ Өөрийн хичээл     | ❌ redirect          |

---

### API Endpoints (Swagger-аас баталгаажуулсан)

#### 🔐 Authentication

| Method | Endpoint           | Body                                        | Тайлбар                    |
| ------ | ------------------ | ------------------------------------------- | -------------------------- |
| POST   | `/token/email`     | `{ "email", "password", "push_token": "" }` | Нэвтрэх                    |
| POST   | `/token/refresh`   | `{ "refresh_token" }`                       | Token шинэчлэх             |
| DELETE | `/token`           | `{ "current_user" }`                        | Logout                     |
| POST   | `/otp/email`       | `{ "email" }`                               | Нууц үг сэргээх код илгээх |
| POST   | `/otp/email/login` | `{ "email", "code", "push_token": "" }`     | OTP кодоор нэвтрэх         |

#### 👤 Users (BearerAuth)

| Method | Endpoint              | Body                                                                                        | Тайлбар                                    |
| ------ | --------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------ |
| GET    | `/users`              | —                                                                                           | Бүх хэрэглэгч (items: [])                  |
| POST   | `/users`              | `{ "email", "first_name", "last_name", "password", "username", "phone" }`                   | Хэрэглэгч бүртгэх                          |
| GET    | `/users/{id}`         | —                                                                                           | Нэг хэрэглэгч ({}schools талбартай)        |
| PUT    | `/users/{id}`         | `{ "current_user", "email", "first_name", "last_name", "family_name", "phone", "picture" }` | Засах                                      |
| DELETE | `/users/{id}`         | `{ "current_user" }`                                                                        | Устгах                                     |
| GET    | `/users/me`           | query: `?current_user=`                                                                     | Өөрийн мэдээлэл ({}schools талбартай)      |
| PUT    | `/users/me`           | `{ "current_user", "first_name", "last_name", "phone" }`                                    | Өөрийгөө засах                             |
| PUT    | `/users/me/password`  | `{ "current_user", "password", "new_password" }`                                            | Нууц үг солих                              |
| POST   | `/users/me/picture`   | `{ "current_user", "body": "base64" }`                                                      | Зураг оруулах                              |
| GET    | `/users/{id}/schools` | —                                                                                           | Хэрэглэгчийн сургуулиуд ({}role талбартай) |
| GET    | `/users/{id}/courses/teaching` | —                                                                                  | Багшийн заадаг хичээлүүд |
| GET    | `/users/{id}/courses/enrolled` | —                                                                                  | Оюутны үздэг хичээлүүд ({}course, {}group) |

#### 🛡️ Roles

| Method | Endpoint      | Body                                     | Тайлбар         |
| ------ | ------------- | ---------------------------------------- | --------------- |
| GET    | `/roles`      | —                                        | Эрхийн жагсаалт |
| POST   | `/roles`      | `{ "current_user", "name", "priority" }` | Эрх нэмэх       |
| GET    | `/roles/{id}` | —                                        | Нэг эрх         |
| PUT    | `/roles/{id}` | `{ "current_user", "name", "priority" }` | Засах           |
| DELETE | `/roles/{id}` | `{ "ROLE_ID": "..." }`                   | Устгах          |

#### 🏫 Schools

| Method | Endpoint                       | Body                                           | Тайлбар                              |
| ------ | ------------------------------ | ---------------------------------------------- | ------------------------------------ |
| GET    | `/users/{id}/schools`          | —                                              | **Хэрэглэгчийн** сургуулиуд ({}role) |
| GET    | `/schools/{id}/users`          | —                                              | Сургуулийн хэрэглэгчид               |
| POST   | `/schools/{id}/users`          | `{ "current_user", "role_id", "username" }`    | Сургуульд хэрэглэгч нэмэх            |
| DELETE | `/schools/{id}/users/{uid}`    | —                                              | Сургуулиас хасах                     |
| GET    | `/schools/{id}/requests`       | —                                              | Гишүүнчлэлийн хүсэлтүүд              |
| POST   | `/schools/{id}/requests`       | `{ "current_user", "role_id", "description" }` | Гишүүнчлэл хүсэх                     |
| POST   | `/schools/{id}/requests/{rid}` | `{ "current_user" }`                           | Хүсэлт зөвшөөрөх                     |
| DELETE | `/schools/{id}/requests/{rid}` | `{ "current_user" }`                           | Хүсэлт татгалзах                     |

#### 📚 Course Users

| Method | Endpoint                     | Body                                        | Тайлбар                                 |
| ------ | ---------------------------- | ------------------------------------------- | --------------------------------------- |
| GET    | `/courses/{cid}/users`       | —                                           | Хичээлийн хэрэглэгчид ({}user, {}group) |
| POST   | `/courses/{cid}/users`       | `{ "current_user", "user_id", "group_id" }` | Хэрэглэгч нэмэх                         |
| GET    | `/courses/{cid}/users/{uid}` | —                                           | Нэг хэрэглэгч                           |
| PUT    | `/courses/{cid}/users/{uid}` | `{ "group_id" }`                            | Бүлэг солих                             |
| DELETE | `/courses/{cid}/users/{uid}` | `{ "COURSE_ID", "USER_ID" }`                | Хасах                                   |

#### 👥 Groups

| Method | Endpoint                | Body                                  | Тайлбар           |
| ------ | ----------------------- | ------------------------------------- | ----------------- |
| GET    | `/courses/{cid}/groups` | —                                     | Хичээлийн бүлгүүд |
| POST   | `/courses/{cid}/groups` | `{ "name", "priority" }`              | Бүлэг үүсгэх      |
| GET    | `/groups/{gid}`         | —                                     | Бүлгийн мэдээлэл  |
| PUT    | `/groups/{gid}`         | `{ "course_id", "name", "priority" }` | Засах             |
| DELETE | `/groups/{gid}`         | —                                     | Устгах            |

---

### ⚠️ API-тай ажиллах дүрмүүд

1. **Бүх body утга STRING:** `"priority": "1"` биш `1`
2. **`current_user` заавал:** Олон POST/PUT/DELETE-д `"current_user": "<user_id>"` шаардлагатай
3. **`{}` prefix талбарууд JSON string:** `JSON.parse(obj["{}schools"] || "[]")` хийж задлана
4. **List response:** `{ items: [...] }` бүтэцтэй
5. **DELETE:** 204 status, body байхгүй
6. **Auth header:** `Authorization: Bearer <token>`

---

### Хуудасны тодорхойлолт (PDF-ийн дагуу яг)

#### Ерөнхий хуудсууд

| Зам                      | Хуудас                      | API                                        | Тайлбар                         |
| ------------------------ | --------------------------- | ------------------------------------------ | ------------------------------- |
| `/team4/`                | Эхлэх хуудас                | `GET /users/me`, role-с хамаарсан courses endpoint | Role-аас хамааран өөр dashboard |
| `/team4/login`           | Нэвтрэх                     | `POST /token/email`                        | Email + password                |
| `/team4/forgot-password` | Нууц үг сэргээх код авах    | `POST /otp/email`                          | Email оруулах                   |
| `/team4/reset-password`  | Код ашиглан нууц үг оруулах | `POST /otp/email/login`                    | Code + email                    |
| `/team4/register`        | Бүртгүүлэх                  | `POST /users`                              | Шинэ хэрэглэгч                  |
| `/team4/schools/current` | Нэвтрэх сургууль сонгох     | `GET /users/{id}/schools`                  | **Зөвхөн өөрийн сургуулиуд**    |

#### Хэрэглэгчийн хуудсууд

| Зам                              | Хуудас                      | API                          | Эрх                            |
| -------------------------------- | --------------------------- | ---------------------------- | ------------------------------ |
| `/team4/roles`                   | Эрхийн төрөл удирдах        | `GET/POST/PUT/DELETE /roles` | Админ only                     |
| `/team4/users`                   | Хэрэглэгчийн жагсаалт       | `GET /users`                 | Админ only                     |
| `/team4/users/create`            | Хэрэглэгч бүртгэх           | `POST /users`                | Админ: бүгд, Багш: оюутан only |
| `/team4/users/:user_id`          | Хэрэглэгчийн мэдээлэл харах | `GET /users/{id}`            | Админ only                     |
| `/team4/users/:user_id/edit`     | Хэрэглэгч засах             | `PUT /users/{id}`            | Админ only                     |
| `/team4/profile`                 | Өөрийн мэдээлэл засах       | `GET/PUT /users/me`          | Бүгд                           |
| `/team4/profile/change-password` | Нууц үг солих               | `PUT /users/me/password`     | Бүгд                           |

#### Хичээлийн хэрэглэгчийн хуудсууд

| Зам                                                | Хуудас                          | API                                        | Эрх         |
| -------------------------------------------------- | ------------------------------- | ------------------------------------------ | ----------- |
| `/team4/courses/:course_id/users`                  | Хичээлийн хэрэглэгчийн жагсаалт | `GET /courses/{cid}/users`                 | Админ, Багш |
| `/team4/courses/:course_id/users/edit`             | Хичээлийн хэрэглэгч удирдах     | `POST/DELETE /courses/{cid}/users`         | Админ, Багш |
| `/team4/courses/:course_id/groups`                 | Хичээлийн бүлэг удирдах         | `GET/POST /courses/{cid}/groups`           | Админ, Багш |
| `/team4/courses/:course_id/groups/:group_id/users` | Бүлгийн хэрэглэгчид             | `GET /courses/{cid}/users` filter by group | Админ, Багш |

**Нийт: 17 хуудас**

---

### Sidebar цэс (role-аас хамаарна)

**Админ:**

- Нүүр хуудас → `/team4/`
- Хэрэглэгчид → `/team4/users`
- Эрхийн удирдлага → `/team4/roles`
- Сургууль сонгох → `/team4/schools/current`
- Профайл → `/team4/profile`
- Нууц үг солих → `/team4/profile/change-password`

**Багш:**

- Нүүр хуудас → `/team4/`
- Оюутан бүртгэх → `/team4/users/create`
- Сургууль сонгох → `/team4/schools/current`
- Профайл → `/team4/profile`
- Нууц үг солих → `/team4/profile/change-password`

**Оюутан:**

- Нүүр хуудас → `/team4/`
- Сургууль сонгох → `/team4/schools/current`
- Профайл → `/team4/profile`
- Нууц үг солих → `/team4/profile/change-password`

---

### Dashboard (Нүүр хуудас) — role-аас хамаарна

**Админ харна:**

- StatCard: Нийт хэрэглэгч (GET /users → items.length)
- StatCard: Эрхийн тоо (GET /roles → items.length)
- StatCard: Сургуулийн тоо (GET /users/{id}/schools → items.length)
- PieChart: Эрхийн тархалт (recharts)
- Хурдан холбоосууд: Хэрэглэгчид, Эрхийн удирдлага, Профайл

**Багш харна:**

- StatCard: Миний хичээлүүд (GET /users/{id}/courses/teaching → items.length)
- Хурдан холбоосууд: Оюутан бүртгэх, Профайл
- Хичээлүүдийн жагсаалт (course_id-тай линкүүд → /courses/{id}/users)

**Оюутан харна:**

- StatCard: Миний хичээлүүд (GET /users/{id}/courses/enrolled → items.length)
- Хурдан холбоосууд: Профайл, Нууц үг солих
- ❌ Системийн мэдээлэл ХАРУУЛАХГҮЙ

---

### Файлын бүтэц

```
client/src/team4/
├── Index.jsx
├── Layout.jsx
├── components/
│   ├── ui/                      
│   │   ├── index.js             
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Label.jsx
│   │   ├── Select.jsx
│   │   ├── Textarea.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Table.jsx
│   │   ├── Dialog.jsx
│   │   ├── Avatar.jsx
│   │   ├── Alert.jsx
│   │   ├── Separator.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Tabs.jsx
│   │   ├── DropdownMenu.jsx
│   │   ├── Sheet.jsx
│   │   ├── EmptyState.jsx
│   │   ├── DataTable.jsx
│   │   └── StatCard.jsx
│   ├── header/Header.jsx
│   └── sidebar/SideMenu.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── home/Home.jsx
│   ├── users/
│   │   ├── UserList.jsx
│   │   ├── UserCreate.jsx
│   │   ├── UserDetail.jsx
│   │   └── UserEdit.jsx
│   ├── profile/
│   │   ├── Profile.jsx
│   │   └── ChangePassword.jsx
│   ├── roles/RoleManagement.jsx
│   ├── schools/SchoolSelect.jsx
│   └── course-users/
│       ├── CourseUserList.jsx
│       ├── CourseUserEdit.jsx
│       ├── GroupManagement.jsx
│       └── GroupUserList.jsx
└── utils/
    └── api.js
```

---

### Гишүүдийн хуваарилалт (5 гишүүн)

| Гишүүн | Хуудсууд                                                        | Гол API                                      | Оноо              |
| ------ | --------------------------------------------------------------- | -------------------------------------------- | ----------------- |
| **1**  | Login, Register, ForgotPassword, ResetPassword + api.js, Layout | `/token/email`, `/otp/email`, `/users` POST  | Auth бүтэн        |
| **2**  | UserList, UserCreate, UserDetail, UserEdit                      | `/users` CRUD                                | User CRUD         |
| **3**  | Profile, ChangePassword, RoleManagement, SchoolSelect           | `/users/me`, `/roles`, `/users/{id}/schools` | Profile + Role    |
| **4**  | CourseUserList, CourseUserEdit, Header, SideMenu                | `/courses/{id}/users`                        | Course хэрэглэгч  |
| **5**  | GroupManagement, GroupUserList, Home (Dashboard + тайлан)       | `/groups`, `/courses/{id}/groups`, recharts  | Бүлэг + Dashboard |

---

### Дүгнэх зарчим (12 оноо)

| Шалгуур                                | Оноо  |
| -------------------------------------- | ----- |
| UI — Өнгө үзэмж                        | 1     |
| UX — Бүх деталыг тусгасан              | 1     |
| Хэрэглэгчийн эрхээс хамаарах ажиллагаа | 1     |
| **API холбосон байдал**                | **5** |
| **Gitlab commit-ууд**                  | **3** |
| Танилцуулга                            | 1     |

---

### Технологи (package.json-д бэлэн)

- React 19, react-dom 19, react-router-dom 7.13
- TailwindCSS 4
- react-icons 5.6
- recharts 3.7 (тайлан/статистик)
- @tinymce/tinymce-react 6.3
- Бусад сан суулгахыг **хориглоно**

---

### Ажиллуулах

```bash
cd client && npm install && npm run dev
```

Browser: `http://localhost:5173/team4/`

---

### Git workflow

```bash
git add .
git commit -m "feat(team4): login page API integration"
git push
```

Гишүүн бүр олон удаа commit хийсэн байх ёстой **(3 оноо!)**

---

### Чухал дүрмүүд

1. Зөвхөн `client/src/team4/` хавтасд код бичнэ
2. Бусад багийн кодыг **хөндөхгүй**
3. `GET /schools` нь **бүх** сургуулийг буцаана — SchoolSelect хуудсанд ашиглахгүй
4. `GET /users/{id}/schools` нь тухайн хэрэглэгчийн **хамаарах** сургуулиудыг буцаана — **үүнийг ашиглана**
5. Эрх нь сургууль бүрт өөр → `{}role` талбараас авна
6. Оюутан системийн тоо, бусдын мэдээлэл харах ёсгүй
7. Багш зөвхөн оюутан бүртгэнэ, хэрэглэгчийн жагсаалт харахгүй
8. URL-ээр шууд орохыг хориглох (ProtectedRoute + redirect)
