import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Camera,
  ImagePlus,
  LocateFixed,
  Loader2,
  Sparkles,
  Trash2,
  Send,
} from "lucide-react";
import { PageHeader } from "../components/ui";
import { useEco } from "../context/EcoContext";
import {
  NEIGHBORHOODS,
  REPORT_LABELS,
  type EnvironmentalReport,
  type ReportCategory,
} from "../types";

const CATEGORIES: ReportCategory[] = [
  "lixo_irregular",
  "igarape",
  "queimada",
  "esgoto",
  "poluicao",
  "alagamento",
];

const AI_PARECER: Record<ReportCategory, string> = {
  lixo_irregular:
    "IA: Confirmada presença de resíduos sólidos em área urbana. Gravidade média-alta, recomendado encaminhamento à coleta.",
  igarape:
    "IA: Confirmada presença de resíduos sólidos em igarapé. Impacto hídrico alto — acionar limpeza do manancial.",
  queimada:
    "IA: Indícios visuais compatíveis com queimada urbana. Risco à qualidade do ar — prioridade alta.",
  esgoto:
    "IA: Detectados sinais de esgoto a céu aberto. Risco sanitário — encaminhar à rede de saneamento.",
  poluicao:
    "IA: Indícios de poluição/fumaça no ambiente. Gravidade moderada, monitorar evolução.",
  alagamento:
    "IA: Área com acúmulo de água compatível com ponto de alagamento. Risco para pedestres.",
};

export function Denunciar() {
  const { addReport, notify } = useEco();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ReportCategory>("lixo_irregular");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOODS[0]);
  const [address, setAddress] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "done">("idle");
  const [aiNote, setAiNote] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setAiStatus("loading");
    setAiNote("");
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => {
      setAiNote(AI_PARECER[category]);
      setAiStatus("done");
    }, 1600);
  };

  const captureGps = () => {
    if (!navigator.geolocation) {
      notify("Geolocalização não suportada neste navegador.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
        notify("Localização GPS capturada com sucesso!");
      },
      () => {
        setGpsLoading(false);
        notify("Não foi possível acessar o GPS. Verifique as permissões.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!photoPreview) {
      notify("Adicione uma foto do problema ambiental.");
      return;
    }
    if (!title.trim()) {
      notify("Dê um título à denúncia.");
      return;
    }
    const report: EnvironmentalReport = {
      id: `r${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      photoUrl: photoPreview,
      neighborhood,
      status: "Reportado",
      aiVerificationNotes: aiStatus === "done" ? aiNote : undefined,
      createdAt: new Date().toISOString(),
    };
    addReport(report);
    notify("Denúncia enviada! +20 EcoPontos");
    navigate("/denuncias");
  };

  return (
    <div>
      <PageHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Denúncia Ambiental"
        subtitle="Fotografe, classifique e reporte. A IA pré-analisa a imagem e o poder público acompanha o status."
      />

      <form onSubmit={handleSubmit} className="container-page mt-6 max-w-3xl space-y-6">
        <div className="card p-6">
          <h2 className="font-bold text-eco-950">Fotografe o problema</h2>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-eco-200 bg-eco-50/50 p-10 text-center transition hover:border-eco-400 hover:bg-eco-50"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Prévia da denúncia"
                className="max-h-72 rounded-xl object-cover"
              />
            ) : (
              <>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-eco-100 text-eco-700">
                  <Camera className="h-7 w-7" />
                </span>
                <span className="text-sm font-semibold text-eco-800">
                  Clique para enviar a foto do local
                </span>
                <span className="text-xs text-slate-400">
                  JPG ou PNG · a IA analisará a imagem automaticamente
                </span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhoto(e.target.files?.[0])}
          />
          {photoPreview && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setAiStatus("idle");
                  setAiNote("");
                }}
                className="btn-secondary !py-2 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remover foto
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn-secondary !py-2 text-xs"
              >
                <ImagePlus className="h-3.5 w-3.5" /> Trocar foto
              </button>
            </div>
          )}

          {aiStatus !== "idle" && (
            <div
              className={`status-enter mt-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                aiStatus === "loading"
                  ? "border-slate-200 bg-slate-50 text-slate-700"
                  : "border-eco-200 bg-eco-50 text-eco-800"
              }`}
            >
              {aiStatus === "loading" ? (
                <>
                  <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                  <span>IA Vision analisando a imagem...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-eco-600" />
                  <span>
                    <strong>Parecer da IA:</strong> {aiNote}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="card space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Título resumido
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-base"
              placeholder="Ex: Acúmulo de lixo próximo à escola"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <CategoryToggle
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                >
                  {REPORT_LABELS[c]}
                </CategoryToggle>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Bairro (Manaus)
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="input-base"
              >
                {NEIGHBORHOODS.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Endereço / referência
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-base"
                placeholder="Av., rua ou ponto de referência"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={captureGps}
            disabled={gpsLoading}
            className="btn-secondary w-full sm:w-auto"
          >
            {gpsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {coords
              ? `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
              : "Capturar minha localização GPS"}
          </button>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Descrição detalhada
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input-base resize-none"
              placeholder="Descreva o que está acontecendo, há quanto tempo, riscos, etc."
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full !py-3.5 text-base">
          <Send className="h-5 w-5" /> Enviar denúncia (+20 EcoPontos)
        </button>
      </form>
    </div>
  );
}

function CategoryToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
        active
          ? "border-eco-600 bg-eco-600 text-white shadow-sm"
          : "border-eco-200 bg-white text-eco-700 hover:bg-eco-50"
      }`}
    >
      {children}
    </button>
  );
}