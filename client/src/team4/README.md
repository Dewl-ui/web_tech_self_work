# Баг 4 — Хэрэглэгчийн удирдлагын хэсэг

## Бие даалт 2: Frontend хөгжүүлэлт

### Төслийн тухай

Цахим сургалтын систем (LMS)-ийн **хэрэглэгчийн удирдлагын хэсэг**-ийг хариуцан хөгжүүлнэ.
Энэ хэсэг нь хэрэглэгчийн бүртгэл, нэвтрэлт, эрхийн удирдлага, хичээлийн хэрэглэгч удирдах зэрэг үндсэн функцуудыг хамарна.

**API Base URL:** `https://todu.mn/bs/lms/v1`
**API Swagger:** `todu.mn/bs/lms/open-api-catalog/v1/`

---

### Тест хэрэглэгчид

| № | Email | Нууц үг | Эрх |
|---|-------|---------|-----|
| 1 | admin@must.edu.mn | 123 | Системийн админ |
| 2 | User@must.edu.mn | 123 | Системийн хэрэглэгч |
| 3 | schooladmin@must.edu.mn | 123 | Сургуулийн админ |
| 4 | schoolteacher@must.edu.mn | 123 | Сургуулийн багш |
| 5 | schoolstudent@must.edu.mn | 123 | Сургуулийн оюутан |

---

### Хийх ёстой хуудсууд (PDF-ийн дагуу)

#### Ерөнхий хуудсууд (Auth)

| Зам | Хуудасны нэр | Тайлбар |
|-----|-------------|---------|
| `/team4/` | Эхлэх хуудас | Dashboard / нүүр хуудас |
| `/team4/login` | Нэвтрэх хуудас | Email + password form |
| `/team4/forgot-password` | Нууц үгээ сэргээх код авах | Email оруулах form |
| `/team4/reset-password` | Нууц үг шинэчлэх | Код + шинэ нууц үг form |
| `/team4/register` | Бүртгүүлэх хуудас | Шинэ хэрэглэгч бүртгэх form |
| `/team4/schools/current` | Сургууль сонгох | Нэвтрэх сургуулиа сонгох |

#### Хэрэглэгчийн хуудсууд (User Management)

| Зам | Хуудасны нэр | Тайлбар |
|-----|-------------|---------|
| `/team4/roles` | Эрхийн төрөл удирдах | Role CRUD (admin, teacher, student) |
| `/team4/users` | Хэрэглэгчийн жагсаалт | Бүх хэрэглэгчийн list + хайлт, filter |
| `/team4/users/create` | Хэрэглэгч бүртгэх | Шинэ хэрэглэгч нэмэх form |
| `/team4/users/:user_id` | Хэрэглэгчийн дэлгэрэнгүй | Тухайн хэрэглэгчийн мэдээлэл харах |
| `/team4/users/:user_id/edit` | Хэрэглэгч засах | Мэдээлэл засах form |
| `/team4/profile` | Өөрийн мэдээлэл засах | Нэвтэрсэн хэрэглэгч өөрийгөө засах |
| `/team4/profile/change-password` | Нууц үг солих | Хуучин + шинэ нууц үг form |

#### Хичээлийн хэрэглэгчийн хуудсууд (Course Users)

| Зам | Хуудасны нэр | Тайлбар |
|-----|-------------|---------|
| `/team4/courses/:course_id/users` | Хичээлийн хэрэглэгчийн жагсаалт | Тухайн хичээлийн оюутан, багш нар |
| `/team4/courses/:course_id/users/edit` | Хэрэглэгч удирдах | Оюутан нэмэх/хасах |
| `/team4/courses/:course_id/groups` | Бүлэг удирдах | Багуудыг удирдах |
| `/team4/courses/:course_id/groups/:group_id/users` | Бүлгийн хэрэглэгчид | Тухайн бүлгийн гишүүд |

**Нийт: ~17 хуудас** (багийн гишүүн бүр ~3-4 хуудас хариуцна)

---

### Файлын бүтэц (Санал болгож буй)

```
client/src/team4/
├── Index.jsx                          # Route тодорхойлолт (React Router)
├── Layout.jsx                         # Үндсэн layout (Sidebar + Outlet)
│
├── components/                        # Дахин ашиглагдах component-ууд
│   ├── header/
│   │   └── Header.jsx                 # Team4 header
│   ├── sidebar/
│   │   └── SideMenu.jsx               # Зүүн талын цэс
│   ├── common/
│   │   ├── Table.jsx                  # Хүснэгт component (жагсаалтуудад)
│   │   ├── Modal.jsx                  # Modal/Dialog component
│   │   ├── Pagination.jsx             # Хуудаслалт
│   │   ├── SearchBar.jsx              # Хайлтын талбар
│   │   └── FormInput.jsx              # Form input wrapper
│   └── user/
│       ├── UserCard.jsx               # Хэрэглэгчийн мэдээллийн card
│       └── UserForm.jsx               # Хэрэглэгч нэмэх/засах form
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx                  # Нэвтрэх хуудас
│   │   ├── Register.jsx               # Бүртгүүлэх хуудас
│   │   ├── ForgotPassword.jsx         # Нууц үг сэргээх
│   │   └── ResetPassword.jsx          # Нууц үг шинэчлэх
│   ├── home/
│   │   └── Home.jsx                   # Dashboard / эхлэх хуудас
│   ├── users/
│   │   ├── UserList.jsx               # Хэрэглэгчийн жагсаалт
│   │   ├── UserCreate.jsx             # Хэрэглэгч бүртгэх
│   │   ├── UserDetail.jsx             # Хэрэглэгчийн дэлгэрэнгүй
│   │   └── UserEdit.jsx               # Хэрэглэгч засах
│   ├── profile/
│   │   ├── Profile.jsx                # Өөрийн мэдээлэл засах
│   │   └── ChangePassword.jsx         # Нууц үг солих
│   ├── roles/
│   │   └── RoleManagement.jsx         # Эрхийн төрөл удирдах
│   ├── schools/
│   │   └── SchoolSelect.jsx           # Сургууль сонгох
│   └── course-users/
│       ├── CourseUserList.jsx          # Хичээлийн хэрэглэгчид
│       ├── CourseUserEdit.jsx          # Хэрэглэгч нэмэх/хасах
│       ├── GroupManagement.jsx         # Бүлэг удирдах
│       └── GroupUserList.jsx           # Бүлгийн гишүүд
│
└── utils/
    └── api.js                         # Team4-д хэрэглэгдэх API функцууд
```

---

### Routing тохиргоо (Index.jsx)

`Index.jsx` файлд бүх route-уудыг тодорхойлно:

```jsx
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Main pages
import Home from './pages/home/Home';
import UserList from './pages/users/UserList';
import UserCreate from './pages/users/UserCreate';
import UserDetail from './pages/users/UserDetail';
import UserEdit from './pages/users/UserEdit';
import Profile from './pages/profile/Profile';
import ChangePassword from './pages/profile/ChangePassword';
import RoleManagement from './pages/roles/RoleManagement';
import SchoolSelect from './pages/schools/SchoolSelect';
import CourseUserList from './pages/course-users/CourseUserList';
import CourseUserEdit from './pages/course-users/CourseUserEdit';
import GroupManagement from './pages/course-users/GroupManagement';
import GroupUserList from './pages/course-users/GroupUserList';

export default function Team4() {
  return (
    <Routes>
      {/* Auth хуудсууд - Layout-гүй */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

      {/* Layout-тай хуудсууд */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="schools/current" element={<SchoolSelect />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/:user_id" element={<UserDetail />} />
        <Route path="users/:user_id/edit" element={<UserEdit />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
        <Route path="courses/:course_id/users" element={<CourseUserList />} />
        <Route path="courses/:course_id/users/edit" element={<CourseUserEdit />} />
        <Route path="courses/:course_id/groups" element={<GroupManagement />} />
        <Route path="courses/:course_id/groups/:group_id/users" element={<GroupUserList />} />
      </Route>
    </Routes>
  );
}
```

---

### API Endpoints (Team4-д хамааралтай)

Бэлэн backend API (`https://todu.mn/bs/lms/v1`) ашиглана. Swagger documentation: `todu.mn/bs/lms/open-api-catalog/v1/`

#### Authentication

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| POST | `/token/email` | Нэвтрэх (email + password) |
| POST | `/token/refresh` | Token шинэчлэх |
| DELETE | `/token` | Гарах (logout) |

#### Users

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/users/me` | Нэвтэрсэн хэрэглэгчийн мэдээлэл |
| PUT | `/users/me` | Өөрийн мэдээлэл засах |
| GET | `/users` | Бүх хэрэглэгчийн жагсаалт |
| POST | `/users` | Шинэ хэрэглэгч бүртгэх |
| GET | `/users/:id` | Тухайн хэрэглэгчийн мэдээлэл |
| PUT | `/users/:id` | Хэрэглэгчийн мэдээлэл засах |
| DELETE | `/users/:id` | Хэрэглэгч устгах |

#### Roles

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/roles` | Эрхийн жагсаалт |
| POST | `/roles` | Эрх үүсгэх |
| PUT | `/roles/:id` | Эрх засах |
| DELETE | `/roles/:id` | Эрх устгах |

#### Schools

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/schools` | Сургуулийн жагсаалт |
| GET | `/schools/current` | Одоогийн сургууль |

#### Course Users & Groups

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/courses/:id/users` | Хичээлийн хэрэглэгчид |
| POST | `/courses/:id/users` | Хэрэглэгч нэмэх |
| DELETE | `/courses/:id/users/:user_id` | Хэрэглэгч хасах |
| GET | `/courses/:id/groups` | Хичээлийн бүлгүүд |
| POST | `/courses/:id/groups` | Бүлэг үүсгэх |
| PUT | `/courses/:id/groups/:group_id` | Бүлэг засах |

---

### Өгөгдлийн бүтэц (ERD-ээс)

#### User
```
{
  id, first_name, last_name, family_name,
  picture, username, email, password, role_id
}
```

#### Role
```
{
  id, name, priority
}
```

#### Group
```
{
  id, name, course_id, priority
}
```

#### SchoolUser (Холбоос хүснэгт)
```
{
  id, school_id, role_id, user_id
}
```

#### CourseStudent / CourseTeacher (Холбоос хүснэгт)
```
CourseStudent: { id, course_id, student_id, group_id, team_id }
CourseTeacher: { id, course_id, teacher_id }
```

---

### Эрхийн удирдлага (Role-based Access)

Хуудас бүр дээр нэвтэрсэн хэрэглэгчийн **эрхээс хамааран** харагдах байдал өөрчлөгдөнө:

| Үйлдэл | Admin | SchoolAdmin | Teacher | Student |
|---------|-------|-------------|---------|---------|
| Бүх хэрэглэгч харах | ✅ | ✅ | ❌ | ❌ |
| Хэрэглэгч бүртгэх | ✅ | ✅ (оюутан, багш) | ✅ (оюутан) | ❌ |
| Хэрэглэгч засах | ✅ | ✅ | ❌ | ❌ |
| Эрх удирдах | ✅ | ❌ | ❌ | ❌ |
| Өөрийн profile засах | ✅ | ✅ | ✅ | ✅ |
| Хичээлд оюутан нэмэх | ✅ | ✅ | ✅ | ❌ |
| Бүлэг удирдах | ✅ | ✅ | ✅ | ❌ |

---

### Хөгжүүлэлтийн алхмууд

#### 1-р алхам: Үндсэн бүтэц бэлдэх
- [ ] Файлын бүтэц үүсгэх (дээрх бүтцийн дагуу)
- [ ] `Index.jsx` дээр бүх route тодорхойлох
- [ ] `Layout.jsx` дээр sidebar + header + outlet бүтэц хийх
- [ ] `SideMenu.jsx` — зүүн талын navigation цэс хийх

#### 2-р алхам: Auth хуудсууд (Нэвтрэлтийн хэсэг)
- [ ] **Login.jsx** — Email/password form, `POST /token/email` API дуудах
- [ ] **Register.jsx** — Бүртгэлийн form, `POST /users` API дуудах
- [ ] **ForgotPassword.jsx** — Email оруулах, код авах
- [ ] **ResetPassword.jsx** — Код + шинэ нууц үг оруулах

#### 3-р алхам: Хэрэглэгчийн CRUD
- [ ] **UserList.jsx** — `GET /users` жагсаалт, хайлт, pagination
- [ ] **UserCreate.jsx** — `POST /users` шинэ хэрэглэгч form
- [ ] **UserDetail.jsx** — `GET /users/:id` дэлгэрэнгүй мэдээлэл
- [ ] **UserEdit.jsx** — `PUT /users/:id` мэдээлэл засах form

#### 4-р алхам: Profile, Role, School
- [ ] **Profile.jsx** — `GET/PUT /users/me` өөрийн мэдээлэл
- [ ] **ChangePassword.jsx** — Нууц үг солих form
- [ ] **RoleManagement.jsx** — `GET/POST/PUT/DELETE /roles` CRUD
- [ ] **SchoolSelect.jsx** — `GET /schools` сургууль сонгох

#### 5-р алхам: Хичээлийн хэрэглэгч, бүлэг
- [ ] **CourseUserList.jsx** — Хичээлийн оюутан/багш жагсаалт
- [ ] **CourseUserEdit.jsx** — Оюутан нэмэх/хасах
- [ ] **GroupManagement.jsx** — Бүлэг CRUD
- [ ] **GroupUserList.jsx** — Бүлгийн гишүүдийн жагсаалт

#### 6-р алхам: Эрхийн хяналт нэмэх
- [ ] Хэрэглэгчийн role-оос хамааран хуудас/товч нуух
- [ ] Нэвтрээгүй хэрэглэгчийг login руу redirect хийх
- [ ] Admin, Teacher, Student тус бүрт UI өөрчлөх

---

### Гишүүдэд хуваарилах санал (5 гишүүн)

| Гишүүн | Хариуцах хуудсууд | Оноо |
|--------|-------------------|------|
| **Гишүүн 1** | Login, Register, ForgotPassword, ResetPassword | Auth бүтэн хэсэг |
| **Гишүүн 2** | UserList, UserCreate, UserDetail, UserEdit | User CRUD |
| **Гишүүн 3** | Profile, ChangePassword, RoleManagement, SchoolSelect | Profile + Role + School |
| **Гишүүн 4** | CourseUserList, CourseUserEdit, Layout, SideMenu, Header | Course хэрэглэгч + Layout |
| **Гишүүн 5** | GroupManagement, GroupUserList, Home (Dashboard + тайлан/статистик) | Бүлэг + Dashboard |

> Гишүүн бүр дор хаяж **3-4 хуудас** хариуцна. Бүгд тус тусын хуудсыг API-тай холбоно.

---

### Дүгнэх зарчим (12 оноо)

| Шалгуур | Оноо |
|---------|------|
| UI — Өнгө үзэмж | 1 |
| UX — Бүх деталыг тусгасан байдал | 1 |
| Хэрэглэгчийн эрхээс хамаарах ажиллагаа | 1 |
| **API холбосон байдал** | **5** |
| **Gitlab руу код илгээсэн байдал** | **3** |
| Танилцуулсан байдал | 1 |

> **Хугацаа:** 10-р долоо хоногийн лабораторийн цаг дээр шалгана.

---

### Технологи

- **React** (Vite) — Frontend framework
- **React Router** — Client-side routing
- **TailwindCSS** — Загварчлал (CSS framework)
- **fetch API** — HTTP хүсэлт илгээх (бэлэн `fetchData.js` util ашиглана)
- **localStorage** — Token хадгалах
- **react-icons** — Icon-ууд

> **Анхаар:** Нэмэлт сан ашиглахыг **хориглоно**. Зөвхөн бэлэн суусан сангуудыг ашиглана.

---

### Ажиллуулах

```bash
cd client
npm install
npm run dev
```

Дараа нь browser дээр `/team4/` руу орно.

---

### Чухал дүрэм

1. **Зөвхөн `client/src/team4/` хавтасд** код бичнэ
2. Бусад багийн кодыг **хөндөхгүй**
3. Статик файлуудыг (зураг гэх мэт) `client/public/team4/` хавтасд хадгална
4. Код өөрчлөлтийг **Gitlab руу тухай бүрт push** хийнэ
5. Бэлэн API (`todu.mn/bs/lms/v1`) ашиглан **бүрэн ажиллагаатай** систем хийнэ
6. Нэмэлт сан дур мэдэн **ашиглахгүй**
