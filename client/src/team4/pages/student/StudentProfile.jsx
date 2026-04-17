import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiUser } from "react-icons/fi";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
} from "../../components/ui";
import PageHeader from "./components/PageHeader";
import { useAuth } from "../../utils/AuthContext";
import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  getUserById,
} from "./api/studentProfileApi";
import { useToast } from "../../components/ui/Toast";

function toDisplayName(profile) {
  const fullName = [profile?.last_name, profile?.first_name]
    .filter((name) => name && name !== "-")
    .join(" ")
    .trim();
  return fullName || "Нэр оруулаагүй";
}

function toAvatarSource(picture) {
  if (!picture || picture === "no-image.jpg") return "";
  if (/^(https?:)?\/\//i.test(picture)) return picture;
  if (picture.startsWith("data:image/")) return picture;
  if (picture.length > 0) return `https://todu.mn/bs/lms/v1/${picture}`;
  return "";
}

function toInitials(profile) {
  const first = profile?.first_name?.[0] ?? "";
  const last = profile?.last_name?.[0] ?? "";
  const initials = `${last}${first}`.trim().toUpperCase();
  return initials || "ST";
}

export default function StudentProfile() {
  const { logout } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMessage("");

      try {
        const me = await getMyProfile();
        const fallbackProfile = me?.id ? await getUserById(me.id) : me;
        const data = fallbackProfile ?? me;

        setProfile(data);
      } catch (error) {
        setErrorMessage(
          error?.message || "Профайл мэдээлэл ачааллахад алдаа гарлаа.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const school = profile?.schools?.length ? profile.schools[0] : null;

  const displayName = toDisplayName(profile);
  const avatarSource = toAvatarSource(profile?.picture);
  const initials = toInitials(profile);

  async function handlePasswordChange(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setErrorMessage("Одоогийн болон шинэ нууц үгээ оруулна уу.");
      return;
    }

    if (passwordForm.newPassword.length < 3) {
      setErrorMessage("Шинэ нууц үг хамгийн багадаа 3 тэмдэгт байна.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("Шинэ нууц үг болон давтан нууц үг таарахгүй байна.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeMyPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage("Нууц үг амжилттай солигдлоо.");
      toast.success("Нууц үг амжилттай солигдлоо.");
    } catch (error) {
      const msg = error?.message || "Нууц үг солих үед алдаа гарлаа.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setErrorMessage("");
    setSuccessMessage("");

    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      setErrorMessage("Бүртгэл устгахын тулд DELETE гэж бичнэ үү.");
      return;
    }

    setIsDeletingAccount(true);
    try {
      await deleteMyAccount();
      toast.success("Бүртгэл амжилттай устгагдлаа.");
      await logout();
    } catch (error) {
      const msg = error?.message || "Бүртгэл устгах үед алдаа гарлаа.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Алдаа</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success">
          <AlertTitle>Амжилттай</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Профайл мэдээлэл</CardTitle>
          <Link
            to="/team4/student/profile/edit"
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
            Засах
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="space-y-4">
                <Skeleton className="h-28 w-28 rounded-full" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-44" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton key={item} className="h-16" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                <Avatar
                  src={avatarSource}
                  alt={displayName}
                  fallback={initials}
                  className="mx-auto h-24 w-24 text-2xl"
                />
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-zinc-800">
                  {displayName}
                </p>
                <p className="text-xs text-zinc-500">
                  {profile?.email || "И-мэйл бүртгэгдээгүй"}
                </p>
                <div className="mt-3 flex justify-center">
                  <Badge>{school?.role?.name || "Суралцагч"}</Badge>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 bg-white p-3">
                  <p className="text-xs text-zinc-500">Оюутны код</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {profile?.username || `ID-${profile?.id || "-"}`}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3">
                  <p className="text-xs text-zinc-500">Утас</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {profile?.phone || "Бүртгэгдээгүй"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3">
                  <p className="text-xs text-zinc-500">Сургууль</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {school?.name || "Тодорхойгүй"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3">
                  <p className="text-xs text-zinc-500">Хэрэглэгчийн ID</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {profile?.id || "-"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3 sm:col-span-2">
                  <p className="text-xs text-zinc-500">И-мэйл</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {profile?.email || "Бүртгэгдээгүй"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

<div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Нууц үг солих</CardTitle>
            <CardDescription>
              Одоогийн нууц үгээрээ баталгаажуулж шинэ нууц үг оруулна.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Одоогийн нууц үг</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">Шинэ нууц үг</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Шинэ нууц үг давтах</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                loading={isChangingPassword}
                disabled={loading}
              >
                Нууц үг шинэчлэх
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Бүртгэл устгах</CardTitle>
            {/* <CardDescription>
              Бүртгэл устгавал буцаах боломжгүй. Баталгаажуулж үргэлжлүүлнэ үү.
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="warning">
              <AlertTitle>Анхааруулга</AlertTitle>
              <AlertDescription>
                Бүртгэл устгасны дараа таны хувийн мэдээлэл болон хандах эрх
                цуцлагдана.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="delete_confirm">Баталгаажуулах үг</Label>
              <Input
                id="delete_confirm"
                value={deleteConfirmText}
                onChange={(event) => setDeleteConfirmText(event.target.value)}
                placeholder="DELETE"
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              loading={isDeletingAccount}
              onClick={handleDeleteAccount}
            >
              Бүртгэл устгах
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
