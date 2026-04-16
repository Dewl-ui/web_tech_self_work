import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "../../components/ui";
import PageHeader from "./components/PageHeader";
import { useAuth } from "../../utils/AuthContext";
import { getMyProfile, getUserById, updateMyProfile } from "./api/studentProfileApi";
import { useToast } from "../../components/ui/Toast";

export default function StudentProfileEdit() {
  const { refreshUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    family_name: "",
    phone: "",
    picture: "",
  });

  const [pictureUrl, setPictureUrl] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPicture, setIsSavingPicture] = useState(false);

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
          picture: data?.picture ?? "",
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
      toast.success("Профайл мэдээллийг амжилттай шинэчиллээ.");
    } catch (error) {
      const msg = error?.message || "Профайл хадгалахад алдаа гарлаа.";
      setErrorMessage(msg);
      toast.error(msg);
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
      await updateMyProfile({ ...form, picture: pictureUrl.trim() });
      setProfile((prev) => ({ ...prev, picture: pictureUrl.trim() }));
      setForm((prev) => ({ ...prev, picture: pictureUrl.trim() }));
      await refreshUser();
      setSuccessMessage("Профайл зураг амжилттай шинэчлэгдлээ.");
      toast.success("Профайл зураг амжилттай шинэчлэгдлээ.");
    } catch (error) {
      const msg = error?.message || "Профайл зураг шинэчлэхэд алдаа гарлаа.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSavingPicture(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          icon={FiEdit2}
          title="Профайл засах"
          subtitle="Нэр, холбоо барих мэдээлэл болон профайл зураг"
        />
        <Link
          to="/team4/student/profile"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 self-start rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        >
          Буцах
        </Link>
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
    </div>
  );
}
