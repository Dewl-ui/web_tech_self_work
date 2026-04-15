function decodeEntities(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function getMaterial(content = "", fileUrl = "") {
  const iframeSrc = content.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1] || "";
  const directUrl = /^https?:\/\/\S+$/i.test(content.trim()) ? content.trim() : "";

  return {
    embedUrl: fileUrl || decodeEntities(iframeSrc) || directUrl,
    text: content.replace(/<iframe[\s\S]*?<\/iframe>/gi, "").trim(),
  };
}

export default function LessonMaterial({ content = "", fileUrl = "", title = "Материал" }) {
  const { embedUrl, text } = getMaterial(content, fileUrl);
  const showTextBelowEmbed = text && text !== embedUrl;

  return (
    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 text-gray-700">
      {embedUrl ? (
        <div>
          <iframe
            src={embedUrl}
            title={title}
            className="min-h-[28rem] w-full rounded-lg border border-slate-200 bg-white"
            allowFullScreen
          />
          {showTextBelowEmbed ? (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm">{text}</p>
          ) : null}
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-words">{text || "Контент алга."}</p>
      )}
    </div>
  );
}
