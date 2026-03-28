# Баг 4 — Хэрэглэгчийн удирдлагын хэсэг

## Бие даалт 2: Frontend хөгжүүлэлт

### Төслийн тухай

Цахим сургалтын систем (LMS)-ийн **хэрэглэгчийн удирдлагын хэсэг**-ийг хариуцан хөгжүүлнэ.

**API Base URL:** `https://todu.mn/bs/lms/v1`  
**API Swagger:** `todu.mn/bs/lms/open-api-catalog/v1/`  
**API Documentation (Ready to use):** `https://registry.scalar.com/@default-team-74qpj/apis/ords-generated-api-for-v1@1.0.0`

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

### ⚠️ API-тай ажиллах чухал дүрмүүд

1. **Бүх request body утга нь STRING байна.** Тоо ч гэсэн `"1"` гэж илгээнэ, `1` биш.

2. **`current_user` талбар заавал шаардлагатай.** Олон POST/PUT/DELETE endpoint-д `"current_user": "<user_id>"` body-д оруулна. Энэ нь нэвтэрсэн хэрэглэгчийн ID.

3. **`{}` prefix-тэй талбарууд нь JSON string.** API-аас `"{}schools": "[{...}]"` гэх мэтээр ирнэ. Заавал `JSON.parse()` хийж задлана:

   ```js
   const user = await apiGet("/users/me");
   const schools = JSON.parse(user["{}schools"] || "[]");
   ```

4. **Auth header:** Нэвтэрсний дараа бүх хүсэлтэд:

   ```
   Authorization: Bearer <token>
   ```

5. **Pagination** API талаас байхгүй тул client-side pagination хийнэ.

---

### API Endpoints (Swagger-аас баталгаажуулсан)

#### 🔐 Authentication

| Method | Endpoint           | Body                                    | Тайлбар                    |
| ------ | ------------------ | --------------------------------------- | -------------------------- |
| POST   | `/token/email`     | `{ "email": "...", "password": "..." }` | Нэвтрэх → token авна       |
| POST   | `/token/refresh`   | `{ "refresh_token": "..." }`            | Token шинэчлэх             |
| DELETE | `/token`           | `{ "current_user": "..." }`             | Logout                     |
| POST   | `/otp/email`       | `{ "email": "..." }`                    | Нууц үг сэргээх код илгээх |
| POST   | `/otp/email/login` | `{ "email": "...", "code": "..." }`     | OTP кодоор нэвтрэх         |

#### 👤 Users (BearerAuth шаардлагатай)

| Method | Endpoint                   | Body / Params                                                                               | Тайлбар                   |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------- | ------------------------- |
| GET    | `/users`                   | —                                                                                           | Бүх хэрэглэгчийн жагсаалт |
| POST   | `/users`                   | `{ "email", "first_name", "last_name", "password", "username", "phone" }`                   | Хэрэглэгч бүртгэх         |
| GET    | `/users/{user_id}`         | —                                                                                           | Нэг хэрэглэгчийн мэдээлэл |
| PUT    | `/users/{user_id}`         | `{ "current_user", "email", "first_name", "last_name", "family_name", "phone", "picture" }` | Хэрэглэгч засах           |
| DELETE | `/users/{user_id}`         | `{ "current_user": "..." }`                                                                 | Хэрэглэгч устгах          |
| GET    | `/users/me`                | query: `?current_user=...`                                                                  | Өөрийн мэдээлэл           |
| PUT    | `/users/me`                | `{ "current_user", "first_name", "last_name", "phone", ... }`                               | Өөрийн мэдээлэл засах     |
| PUT    | `/users/me/password`       | `{ "current_user", "password": "old", "new_password": "new" }`                              | Нууц үг солих             |
| POST   | `/users/me/picture`        | `{ "current_user", "body": "base64..." }`                                                   | Зураг оруулах             |
| GET    | `/users/{user_id}/schools` | —                                                                                           | Хэрэглэгчийн сургуулиуд   |
| GET    | `/users/{user_id}/courses` | —                                                                                           | Хэрэглэгчийн хичээлүүд    |

#### 🛡️ Roles

| Method | Endpoint           | Body                                     | Тайлбар             |
| ------ | ------------------ | ---------------------------------------- | ------------------- |
| GET    | `/roles`           | —                                        | Эрхийн жагсаалт     |
| POST   | `/roles`           | `{ "current_user", "name", "priority" }` | Эрх үүсгэх          |
| GET    | `/roles/{role_id}` | —                                        | Нэг эрхийн мэдээлэл |
| PUT    | `/roles/{role_id}` | `{ "current_user", "name", "priority" }` | Эрх засах           |
| DELETE | `/roles/{role_id}` | `{ "ROLE_ID": "..." }`                   | Эрх устгах          |

#### 🏫 Schools

| Method | Endpoint                           | Body                                           | Тайлбар                   |
| ------ | ---------------------------------- | ---------------------------------------------- | ------------------------- |
| GET    | `/schools`                         | —                                              | Бүх сургуулийн жагсаалт   |
| GET    | `/schools/{school_id}`             | —                                              | Нэг сургуулийн мэдээлэл   |
| GET    | `/schools/{school_id}/users`       | —                                              | Сургуулийн хэрэглэгчид    |
| POST   | `/schools/{school_id}/users`       | `{ "current_user", "role_id", "username" }`    | Хэрэглэгч сургуульд нэмэх |
| DELETE | `/schools/{school_id}/users/{uid}` | —                                              | Хэрэглэгч хасах           |
| GET    | `/schools/{school_id}/requests`    | —                                              | Гишүүнчлэлийн хүсэлтүүд   |
| POST   | `/schools/{school_id}/requests`    | `{ "current_user", "role_id", "description" }` | Гишүүнчлэл хүсэх          |

#### 📚 Course Users

| Method | Endpoint                               | Body                                        | Тайлбар                   |
| ------ | -------------------------------------- | ------------------------------------------- | ------------------------- |
| GET    | `/courses/{course_id}/users`           | —                                           | Хичээлийн хэрэглэгчид     |
| POST   | `/courses/{course_id}/users`           | `{ "current_user", "user_id", "group_id" }` | Хэрэглэгч нэмэх           |
| GET    | `/courses/{course_id}/users/{user_id}` | —                                           | Нэг хэрэглэгчийн мэдээлэл |
| PUT    | `/courses/{course_id}/users/{user_id}` | `{ "group_id": "..." }`                     | Бүлэг солих               |
| DELETE | `/courses/{course_id}/users/{user_id}` | `{ "COURSE_ID": "...", "USER_ID": "..." }`  | Хэрэглэгч хасах           |

#### 👥 Groups

| Method | Endpoint                      | Body                                   | Тайлбар           |
| ------ | ----------------------------- | -------------------------------------- | ----------------- |
| GET    | `/courses/{course_id}/groups` | —                                      | Хичээлийн бүлгүүд |
| POST   | `/courses/{course_id}/groups` | `{ "name": "...", "priority": "..." }` | Бүлэг үүсгэх      |
| GET    | `/groups/{group_id}`          | —                                      | Бүлгийн мэдээлэл  |
| PUT    | `/groups/{group_id}`          | `{ "course_id", "name", "priority" }`  | Бүлэг засах       |
| DELETE | `/groups/{group_id}`          | —                                      | Бүлэг устгах      |

---

### Хийх ёстой хуудсууд

#### Ерөнхий хуудсууд (Auth)

| Зам                      | Хуудас           | API                             |
| ------------------------ | ---------------- | ------------------------------- |
| `/team4/`                | Dashboard        | `GET /users/me`, `GET /schools` |
| `/team4/login`           | Нэвтрэх          | `POST /token/email`             |
| `/team4/forgot-password` | Нууц үг сэргээх  | `POST /otp/email`               |
| `/team4/reset-password`  | Нууц үг шинэчлэх | `POST /otp/email/login`         |
| `/team4/register`        | Бүртгүүлэх       | `POST /users`                   |
| `/team4/schools/current` | Сургууль сонгох  | `GET /schools`                  |

#### Хэрэглэгчийн хуудсууд

| Зам                              | Хуудас                | API                          |
| -------------------------------- | --------------------- | ---------------------------- |
| `/team4/roles`                   | Эрхийн удирдлага      | `GET/POST/PUT/DELETE /roles` |
| `/team4/users`                   | Хэрэглэгчийн жагсаалт | `GET /users`                 |
| `/team4/users/create`            | Хэрэглэгч бүртгэх     | `POST /users`                |
| `/team4/users/:user_id`          | Дэлгэрэнгүй           | `GET /users/{id}`            |
| `/team4/users/:user_id/edit`     | Засах                 | `PUT /users/{id}`            |
| `/team4/profile`                 | Өөрийн мэдээлэл       | `GET/PUT /users/me`          |
| `/team4/profile/change-password` | Нууц үг солих         | `PUT /users/me/password`     |

#### Хичээлийн хэрэглэгчийн хуудсууд

| Зам                                                | Хуудас         | API                                     |
| -------------------------------------------------- | -------------- | --------------------------------------- |
| `/team4/courses/:course_id/users`                  | Хэрэглэгчид    | `GET /courses/{id}/users`               |
| `/team4/courses/:course_id/users/edit`             | Нэмэх/хасах    | `POST/DELETE /courses/{id}/users/{uid}` |
| `/team4/courses/:course_id/groups`                 | Бүлэг удирдах  | `GET/POST /courses/{id}/groups`         |
| `/team4/courses/:course_id/groups/:group_id/users` | Бүлгийн гишүүд | `GET /courses/{id}/users` + filter      |

**Нийт: ~17 хуудас**

---

### Файлын бүтэц

```
client/src/team4/
├── Index.jsx                     # Route тодорхойлолт
├── Layout.jsx                    # Sidebar + Header + Outlet
│
├── components/
│   ├── header/Header.jsx
│   ├── sidebar/SideMenu.jsx
│   └── common/
│       ├── Table.jsx             # Хүснэгт
│       ├── Modal.jsx             # Dialog
│       ├── Pagination.jsx        # Client-side pagination
│       └── SearchBar.jsx         # Хайлт
│
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
│
└── utils/
    └── api.js                    # API helper functions
```

---

### utils/api.js — API Helper

```js
const BASE = "https://todu.mn/bs/lms/v1";

function getToken() {
  return localStorage.getItem("team4_token");
}

function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("team4_user") || "{}");
  return user.id ? String(user.id) : "";
}

async function api(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body && method !== "GET") opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${endpoint}`, opts);

  if (res.status === 401) {
    localStorage.removeItem("team4_token");
    localStorage.removeItem("team4_user");
    window.location.href = "/team4/login";
    return null;
  }

  if (res.status === 204) return null; // DELETE success
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Helpers
export const apiGet = (url) => api(url);
export const apiPost = (url, data) => api(url, "POST", data);
export const apiPut = (url, data) => api(url, "PUT", data);
export const apiDelete = (url, data) => api(url, "DELETE", data);

// Auth helpers
export async function login(email, password) {
  const data = await apiPost("/token/email", { email, password });
  // Save token — check actual response structure
  if (data?.token) {
    localStorage.setItem("team4_token", data.token);
    // Fetch user info
    const me = await apiGet("/users/me");
    localStorage.setItem("team4_user", JSON.stringify(me));
    return me;
  }
  return data;
}

export function logout() {
  const uid = getCurrentUserId();
  apiDelete("/token", { current_user: uid }).catch(() => {});
  localStorage.removeItem("team4_token");
  localStorage.removeItem("team4_user");
  window.location.href = "/team4/login";
}

export function isLoggedIn() {
  return !!getToken();
}

export function getMe() {
  return JSON.parse(localStorage.getItem("team4_user") || "null");
}

// Parse {}fields helper
export function parseJsonField(obj, field) {
  try {
    return JSON.parse(obj[`{}${field}`] || "[]");
  } catch {
    return [];
  }
}
```

---

### Эрхийн удирдлага (Role-based Access)

| Үйлдэл                  | Admin | SchoolAdmin | Teacher     | Student |
| ----------------------- | ----- | ----------- | ----------- | ------- |
| Бүх хэрэглэгч харах     | ✅    | ✅          | ❌          | ❌      |
| Хэрэглэгч бүртгэх       | ✅    | ✅          | ✅ (оюутан) | ❌      |
| Хэрэглэгч засах/устгах  | ✅    | ✅          | ❌          | ❌      |
| Эрх удирдах (roles)     | ✅    | ❌          | ❌          | ❌      |
| Өөрийн profile засах    | ✅    | ✅          | ✅          | ✅      |
| Хичээлд хэрэглэгч нэмэх | ✅    | ✅          | ✅          | ❌      |
| Бүлэг удирдах           | ✅    | ✅          | ✅          | ❌      |

> Эдгээр хязгаарлалтыг frontend талаас шалгаж хэрэгжүүлнэ.

---

### Гишүүдийн хуваарилалт (5 гишүүн)

| Гишүүн | Хуудсууд                                                       | Гол API                                     |
| ------ | -------------------------------------------------------------- | ------------------------------------------- |
| **1**  | Login, Register, ForgotPassword, ResetPassword, Layout, api.js | `/token/email`, `/otp/email`, `/users` POST |
| **2**  | UserList, UserCreate, UserDetail, UserEdit                     | `/users` CRUD                               |
| **3**  | Profile, ChangePassword, RoleManagement, SchoolSelect          | `/users/me`, `/roles`, `/schools`           |
| **4**  | CourseUserList, CourseUserEdit, Header, SideMenu               | `/courses/{id}/users`                       |
| **5**  | GroupManagement, GroupUserList, Home (Dashboard + stats)       | `/groups`, `/courses/{id}/groups`           |

---

### Дүгнэх зарчим (12 оноо)

| Шалгуур                    | Оноо  |
| -------------------------- | ----- |
| UI — Өнгө үзэмж            | 1     |
| UX — Бүх деталыг тусгасан  | 1     |
| Хэрэглэгчийн эрхийн хяналт | 1     |
| **API холбосон байдал**    | **5** |
| **Gitlab commit-ууд**      | **3** |
| Танилцуулга                | 1     |

**Хугацаа:** 10-р долоо хоногийн лабораторийн цаг

---

### Технологи (package.json-д бэлэн суусан)

- **React 19** (Vite) — Frontend framework
- **React Router DOM** — Client-side routing
- **TailwindCSS 4** — Загварчлал
- **react-icons** — Icon-ууд (`import { FiUser } from "react-icons/fi"`)
- **recharts** — Тайлан/статистик график (`PieChart`, `BarChart` гэх мэт)
- **@tinymce/tinymce-react** — Rich text editor (шаардлагатай бол)
- **fetch API** — HTTP хүсэлт
- **localStorage** — Token хадгалах

> ⚠️ Дээрхээс **өөр** нэмэлт сан суулгахыг **хориглоно**.

---

### Ажиллуулах

```bash
cd client
npm install
npm run dev
```

Browser: `http://localhost:5173/team4/`

---

### Git workflow

```bash
# Өдөр бүр:
git add .
git commit -m "feat(team4): login page API integration"
git push

# Commit message жишээ:
# "feat(team4): user list page with search"
# "fix(team4): token expiry redirect"
# "style(team4): responsive sidebar"
```

> Гишүүн бүр олон удаа commit хийсэн байх ёстой (3 оноо!)

---

### Чухал дүрэм

1. Зөвхөн `client/src/team4/` хавтасд код бичнэ
2. Бусад багийн кодыг хөндөхгүй
3. Код өөрчлөлтийг Gitlab руу тухай бүрт push хийнэ
4. Бэлэн API ашиглан бүрэн ажиллагаатай систем хийнэ
5. Нэмэлт сан суулгахгүй
