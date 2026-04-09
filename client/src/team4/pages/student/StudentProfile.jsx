import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "../../utils/AuthContext";
import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  getUserById,
  updateMyProfile,
  uploadMyProfilePicture,
} from "./api/studentProfileApi";

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
  return "";
}

function toInitials(profile) {
  const first = profile?.first_name?.[0] ?? "";
  const last = profile?.last_name?.[0] ?? "";
  const initials = `${last}${first}`.trim().toUpperCase();
  return initials || "ST";
}

export default function StudentProfile() {
  const { logout, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    family_name: "",
    phone: "",
  });

  const [pictureUrl, setPictureUrl] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPicture, setIsSavingPicture] = useState(false);
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
        setForm({
          first_name: data?.first_name ?? "",
          last_name: data?.last_name ?? "",
          family_name: data?.family_name ?? "",
          phone: data?.phone ?? "",
        });
        setPictureUrl(
          data?.picture && data.picture !== "no-image.jpg" ? data.picture : "",
        );
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

  const school = useMemo(() => {
    if (!profile?.schools?.length) return null;
    return profile.schools[0];
  }, [profile]);

  const displayName = toDisplayName(profile);
  const avatarSource = toAvatarSource(profile?.picture);
  const initials = toInitials(profile);

  async function handleProfileSave(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSavingProfile(true);

    try {
      const updated = await updateMyProfile(form);
      const nextProfile = { ...profile, ...updated, ...form };
      setProfile(nextProfile);
      await refreshUser();
      setSuccessMessage("Профайл мэдээллийг амжилттай шинэчиллээ.");
    } catch (error) {
      setErrorMessage(error?.message || "Профайл хадгалахад алдаа гарлаа.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePictureSave(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!pictureUrl.trim()) {
      setErrorMessage("Зургийн холбоос оруулна уу.");
      return;
    }

    setIsSavingPicture(true);
    try {
      await uploadMyProfilePicture(pictureUrl.trim());
      setProfile((prev) => ({ ...prev, picture: pictureUrl.trim() }));
      await refreshUser();
      setSuccessMessage("Профайл зураг амжилттай шинэчлэгдлээ.");
    } catch (error) {
      setErrorMessage(
        error?.message || "Профайл зураг шинэчлэхэд алдаа гарлаа.",
      );
    } finally {
      setIsSavingPicture(false);
    }
  }

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
    } catch (error) {
      setErrorMessage(error?.message || "Нууц үг солих үед алдаа гарлаа.");
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
      await logout();
    } catch (error) {
      setErrorMessage(error?.message || "Бүртгэл устгах үед алдаа гарлаа.");
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Оюутны профайл</h1>
        <p className="text-sm text-zinc-500">
          Өөрийн мэдээллээ энэ хуудсаас шууд шинэчлээрэй.
        </p>
      </div>

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
        <CardContent className="pt-6">
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
            <CardTitle>Профайл засах</CardTitle>
            <CardDescription>
              Нэр, овог, холбоо барих мэдээллээ шинэчилнэ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="last_name">Овог</Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        last_name: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first_name">Нэр</Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        first_name: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="family_name">Эцгийн нэр</Label>
                <Input
                  id="family_name"
                  value={form.family_name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      family_name: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Утас</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>

              <Button
                type="submit"
                loading={isSavingProfile}
                disabled={loading}
              >
                Мэдээлэл хадгалах
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Профайл зураг</CardTitle>
            <CardDescription>
              Зургийн URL оруулж профайл зураг шинэчилнэ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePictureSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="picture">Зургийн холбоос</Label>
                <Input
                  id="picture"
                  value={pictureUrl}
                  onChange={(event) => setPictureUrl(event.target.value)}
                  placeholder="https://..."
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                loading={isSavingPicture}
                disabled={loading}
              >
                Зураг шинэчлэх
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

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
            <CardDescription>
              Бүртгэл устгавал буцаах боломжгүй. Баталгаажуулж үргэлжлүүлнэ үү.
            </CardDescription>
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
