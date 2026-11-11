import { useEffect, useMemo, useRef, useState } from "react";
import { buildProject, codeRows, mentionCount, settingsSignature } from "@/lib/coding/build";
import { renumber } from "@/lib/coding/edits";
import { copyCodes, downloadCsv, downloadWorkbook } from "@/lib/coding/export";
import { DEFAULT_SETTINGS, type Entry, type Project, type Settings } from "@/lib/coding/types";
import { Dictionary } from "./dictionary";
import { Library } from "./library";
import { Loader } from "./loader";
import { SettingsFields } from "./settings";

const STORAGE_KEY = "libreto-project-v1";

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false;
  const project = value as Project;
  return Array.isArray(project.rows) && Array.isArray(project.entries) && Boolean(project.settings);
}

export function CoderApp() {
  const [project, setProject] = useState<Project | null>(null);
  const [question, setQuestion] = useState("¿Cuáles marcas conoce, aunque sea de nombre?");
  const [draft, setDraft] = useState<Settings>(DEFAULT_SETTINGS);
  const [picking, setPicking] = useState(false);
  const [pane, setPane] = useState<"biblioteca" | "diccionario">("biblioteca");
  const [notice, setNotice] = useState("");
  const [confirmRebuild, setConfirmRebuild] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!isProject(parsed)) return;
      setProject(parsed);
      setQuestion(parsed.question);
      setDraft(parsed.settings);
    } catch {
      /* la sesión anterior no se pudo leer */
    } finally {
      skipSave.current = false;
    }
  }, []);

  useEffect(() => {
    if (skipSave.current) return;
    try {
      if (project) localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* sin espacio, el trabajo sigue en pantalla */
    }
  }, [project]);

  const coded = useMemo(
    () => (project ? codeRows(project.rows, project.entries, project.settings) : []),
    [project],
  );

  function adopt(next: Project) {
    setProject(next);
    setQuestion(next.question);
    setDraft(next.settings);
    setPicking(false);
    setConfirmRebuild(false);
    setNotice("");
    setPane("diccionario");
  }

  function patchEntries(entries: Entry[]) {
    setProject((current) => (current ? { ...current, entries, edited: true } : current));
  }

  function updateQuestion(value: string) {
    setQuestion(value);
    setProject((current) => (current ? { ...current, question: value } : current));
  }

  function rebuild() {
    if (!project) return;
    const next = buildProject({
      question: question.trim() || project.question,
      settings: draft,
      columns: project.columns,
      textColumn: project.textColumn,
      rows: project.rows,
    });
    setProject(next);
    setConfirmRebuild(false);
    setNotice("Diccionario recalculado.");
  }

  async function exportExcel() {
    if (!project) return;
    try {
      await downloadWorkbook({ ...project, question });
      setNotice("Biblioteca descargada. Trae las hojas Biblioteca, Diccionario, Menciones y Criterios.");
    } catch {
      setNotice("No se pudo armar el Excel. Use CSV.");
    }
  }

  async function copy() {
    if (!project) return;
    const text = copyCodes({ ...project, question });
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Códigos copiados: id y códigos, listos para pegar junto a la base.");
    } catch {
      setNotice("No se pudo copiar. Descargue el archivo.");
    }
  }

  if (!project || picking) {
    return (
      <main className="min-h-screen">
        <Loader
          question={question}
          onQuestion={updateQuestion}
          settings={draft}
          onSettings={setDraft}
          onReady={adopt}
          onCancel={project ? () => setPicking(false) : undefined}
        />
      </main>
    );
  }

  const settingsChanged = settingsSignature(draft) !== settingsSignature(project.settings);
  const propios = project.entries.filter((entry) => entry.kind === "item" && !entry.residual).length;
  const suggestions = project.entries.filter((entry) => entry.suggest).length;
  const reviews = coded.filter((row) => row.review).length;
  const mentions = project.entries.reduce((sum, entry) => sum + mentionCount(entry), 0);

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-1">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="" className="size-8" />
              <p className="font-serif text-2xl italic leading-none">Libreto</p>
            </div>
            <p className="text-sm text-muted-foreground">Codificación de respuestas abiertas</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline" onClick={() => void copy()}>
              Copiar códigos
            </button>
            <button type="button" className="btn btn-outline" onClick={() => downloadCsv({ ...project, question })}>
              CSV
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void exportExcel()}>
              Descargar Excel
            </button>
          </div>
        </header>

        <section className="panel grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Pregunta</span>
            <input className="field" value={question} onChange={(event) => updateQuestion(event.target.value)} />
          </label>
          <details className="grid gap-4">
            <summary className="cursor-pointer text-sm font-medium">
              Criterios: {draft.mode === "marca" ? "marcas" : "opiniones"} · mínimo {draft.minFrequency}
              {draft.categoryWords.trim() ? ` · ignora ${draft.categoryWords.trim()}` : ""}
              {settingsChanged ? " · sin recalcular" : ""}
            </summary>
            <div className="grid gap-4 pt-4">
              <SettingsFields settings={draft} onChange={setDraft} />
              <div className="flex flex-wrap gap-2">
                {settingsChanged ? (
                  confirmRebuild && project.edited ? (
                    <>
                      <p className="w-full text-sm text-warn">
                        Recalcular borra uniones y nombres que haya corregido a mano.
                      </p>
                      <button type="button" className="btn btn-primary" onClick={rebuild}>
                        Sí, recalcular
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => setConfirmRebuild(false)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (project.edited) setConfirmRebuild(true);
                        else rebuild();
                      }}
                    >
                      Recalcular diccionario
                    </button>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Cámbielos y recalcule si la base debe leerse de otra forma.
                  </p>
                )}
                <button type="button" className="btn btn-ghost" onClick={() => patchEntries(renumber(project.entries))}>
                  Renumerar 1…n
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setPicking(true)}>
                  Cambiar base
                </button>
              </div>
            </div>
          </details>
        </section>

        <p className="text-sm tabular-nums text-muted-foreground">
          {project.rows.length} respuestas · {mentions} menciones · {propios} códigos propios · {reviews} filas por
          revisar
          {suggestions ? ` · ${suggestions} parecidos sin confirmar` : ""}
          {project.columns.length > 1 ? ` · abierta en «${project.textColumn}»` : ""}
        </p>

        {notice ? <p className="text-sm">{notice}</p> : null}

        <div className="seg w-fit">
          <button type="button" aria-pressed={pane === "biblioteca"} onClick={() => setPane("biblioteca")}>
            Biblioteca
          </button>
          <button type="button" aria-pressed={pane === "diccionario"} onClick={() => setPane("diccionario")}>
            Diccionario
          </button>
        </div>

        {pane === "biblioteca" ? (
          <Library project={{ ...project, question }} coded={coded} />
        ) : (
          <Dictionary project={project} coded={coded} onEntries={patchEntries} />
        )}

        <details className="panel text-sm">
          <summary className="cursor-pointer font-medium">Cómo se asignan los números</summary>
          <div className="mt-3 grid gap-2 text-muted-foreground">
            <p>Cada coma, punto y coma, barra o salto de línea es una mención. Si lo activa, también «y» / «e».</p>
            <p>Mayúsculas, acentos y las palabras de la categoría no distinguen. Kraft, Kraf y Craft pueden ser el mismo código.</p>
            <p>Lo que llega a la frecuencia mínima recibe 1, 2, 3… según cuántas veces aparece. El resto cae en 98.</p>
            <p>97 no sabe o no recuerda. 98 otros. 99 no aplica, no consume, o —si lo pide— la respuesta vacía.</p>
            <p>Si nombra marcas y además dice «no sé», se conservan las marcas y el 97 no se agrega.</p>
            <p>En la biblioteca el orden es el de la frase: Mavesa, Kraft queda 2;1, no 1;2.</p>
          </div>
        </details>
      </div>
    </main>
  );
}
