import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { mentionCount } from "@/lib/coding/build";
import {
  acceptAllSuggestions,
  extractVariant,
  mergeEntries,
  moveVariant,
  promoteEntry,
  rejectSuggestion,
  renameEntry,
  sendToOtros,
} from "@/lib/coding/edits";
import type { CodedRow, Entry, Project } from "@/lib/coding/types";

const HOW: Record<string, string> = {
  exacto: "",
  fonetica: "suena igual",
  typo: "error de escritura",
  truncado: "cortada",
  extension: "terminación",
  opinion: "misma idea",
  manual: "ajustada a mano",
};

function responseCounts(project: Project, coded: CodedRow[]) {
  const counts = new Map<string, number>();
  const owner = new Map<string, string>();
  for (const entry of project.entries) {
    counts.set(entry.id, 0);
    for (const variant of entry.variants) owner.set(variant.key, entry.id);
  }
  for (const row of coded) {
    const seen = new Set<string>();
    for (const mention of row.mentions) {
      const id = owner.get(mention.key);
      if (id) seen.add(id);
    }
    for (const id of seen) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

function MoveMenu({
  label,
  entries,
  currentId,
  allowNew,
  onPick,
}: {
  label: string;
  entries: Entry[];
  currentId: string;
  allowNew: boolean;
  onPick: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const options = entries.filter((entry) => {
    if (entry.id === currentId) return false;
    const hay = `${entry.code} ${entry.label}`.toLowerCase();
    return hay.includes(query.trim().toLowerCase());
  });
  return (
    <Popover.Root>
      <Popover.Trigger className="btn btn-ghost btn-tiny">{label}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-40 w-72 rounded-md border border-border bg-card p-2 shadow-sm"
          sideOffset={6}
          align="end"
        >
          <input
            className="field mb-2"
            placeholder="Buscar código"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="max-h-64 overflow-auto">
            {allowNew ? (
              <Popover.Close asChild>
                <button type="button" className="menu-row" onClick={() => onPick("new")}>
                  Código nuevo
                </button>
              </Popover.Close>
            ) : null}
            {options.map((entry) => (
              <Popover.Close asChild key={entry.id}>
                <button type="button" className="menu-row" onClick={() => onPick(entry.id)}>
                  <span className="tabular-nums">{entry.code}</span>
                  <span className="truncate">{entry.label}</span>
                </button>
              </Popover.Close>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function EntryCard({
  entry,
  project,
  responses,
  total,
  onEntries,
}: {
  entry: Entry;
  project: Project;
  responses: number;
  total: number;
  onEntries: (entries: Entry[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.label);
  const target = entry.suggest ? project.entries.find((item) => item.id === entry.suggest?.targetId) : undefined;
  const quiet = entry.kind !== "item" || entry.residual;

  return (
    <article className="panel grid gap-3">
      <div className="flex items-start gap-3">
        <span className={quiet ? "code-badge quiet" : "code-badge"}>{entry.code}</span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                onEntries(renameEntry(project.entries, entry.id, draft));
                setEditing(false);
              }}
            >
              <input className="field" value={draft} onChange={(event) => setDraft(event.target.value)} autoFocus />
              <button type="submit" className="btn btn-primary btn-tiny">
                Guardar
              </button>
            </form>
          ) : (
            <h3 className="font-medium">{entry.label}</h3>
          )}
          <p className="text-sm text-muted-foreground tabular-nums">
            {mentionCount(entry)} menciones · {responses} respuestas · {total ? Math.round((responses / total) * 100) : 0}%
          </p>
        </div>
      </div>

      {entry.suggest && target ? (
        <div className="grid gap-2 rounded-sm bg-warn-bg p-3 text-sm text-warn">
          <p>
            {entry.suggest.reason}. ¿La une con {target.label}
            {target.residual ? ", que hoy está en 98" : ` (código ${target.code})`}?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary btn-tiny"
              onClick={() => onEntries(mergeEntries(project.entries, entry.id, target.id))}
            >
              Unir
            </button>
            <button
              type="button"
              className="btn btn-outline btn-tiny"
              onClick={() => onEntries(rejectSuggestion(project.entries, entry.id))}
            >
              Dejar aparte
            </button>
          </div>
        </div>
      ) : null}

      {entry.variants.length ? (
        <ul className="grid gap-1">
          {entry.variants.map((variant) => (
            <li key={variant.key} className="flex flex-wrap items-center gap-2 rounded-sm px-1 py-1">
              <span className={variant.review ? "text-warn" : undefined}>{variant.label}</span>
              <span className="text-sm text-muted-foreground tabular-nums">×{variant.count}</span>
              {HOW[variant.how] ? <span className="text-xs text-muted-foreground">{HOW[variant.how]}</span> : null}
              <span className="ml-auto flex flex-wrap gap-1">
                <MoveMenu
                  label="Mover"
                  entries={project.entries}
                  currentId={entry.id}
                  allowNew={entry.variants.length > 1 || entry.kind !== "item" || entry.residual}
                  onPick={(id) => {
                    if (id === "new") onEntries(extractVariant(project.entries, entry.id, variant.key, project.settings.mode));
                    else onEntries(moveVariant(project.entries, entry.id, variant.key, id));
                  }}
                />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Sin menciones en esta base.</p>
      )}

      {entry.kind === "item" ? (
        <div className="flex flex-wrap gap-2">
          {!editing ? (
            <button
              type="button"
              className="btn btn-ghost btn-tiny"
              onClick={() => {
                setDraft(entry.label);
                setEditing(true);
              }}
            >
              Renombrar
            </button>
          ) : null}
          <MoveMenu
            label="Unir con"
            entries={project.entries.filter((item) => item.kind === "item")}
            currentId={entry.id}
            allowNew={false}
            onPick={(id) => onEntries(mergeEntries(project.entries, entry.id, id))}
          />
          {entry.residual ? (
            <button type="button" className="btn btn-outline btn-tiny" onClick={() => onEntries(promoteEntry(project.entries, entry.id))}>
              Dar código propio
            </button>
          ) : (
            <button type="button" className="btn btn-ghost btn-tiny" onClick={() => onEntries(sendToOtros(project.entries, entry.id))}>
              Pasar a 98
            </button>
          )}
        </div>
      ) : null}
    </article>
  );
}

export function Dictionary({
  project,
  coded,
  onEntries,
}: {
  project: Project;
  coded: CodedRow[];
  onEntries: (entries: Entry[]) => void;
}) {
  const [query, setQuery] = useState("");
  const counts = useMemo(() => responseCounts(project, coded), [project, coded]);
  const needle = query.trim().toLowerCase();
  const matches = (entry: Entry) => {
    if (!needle) return true;
    const blob = `${entry.code} ${entry.label} ${entry.variants.map((variant) => variant.label).join(" ")}`.toLowerCase();
    return blob.includes(needle);
  };
  const propios = project.entries
    .filter((entry) => entry.kind === "item" && !entry.residual)
    .sort((a, b) => a.code - b.code)
    .filter(matches);
  const residual = project.entries
    .filter((entry) => entry.kind === "item" && entry.residual)
    .sort((a, b) => mentionCount(b) - mentionCount(a))
    .filter(matches);
  const specials = project.entries.filter((entry) => entry.kind !== "item").filter(matches);
  const suggestions = project.entries.filter((entry) => entry.suggest).length;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="field max-w-xs"
          placeholder="Buscar en el diccionario"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="button"
          className="btn btn-outline btn-tiny"
          disabled={suggestions === 0}
          onClick={() => onEntries(acceptAllSuggestions(project.entries))}
        >
          Aceptar parecidos ({suggestions})
        </button>
      </div>
      <div className="grid gap-3">
        {propios.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            project={project}
            responses={counts.get(entry.id) ?? 0}
            total={project.rows.length}
            onEntries={onEntries}
          />
        ))}
      </div>
      <h3 className="pt-2 text-sm font-medium text-muted-foreground">Dentro de 98 — no llegaron a la frecuencia</h3>
      <div className="grid gap-3">
        {residual.length ? (
          residual.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              project={project}
              responses={counts.get(entry.id) ?? 0}
              total={project.rows.length}
              onEntries={onEntries}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Nada quedó por baja frecuencia.</p>
        )}
      </div>
      <h3 className="pt-2 text-sm font-medium text-muted-foreground">Códigos reservados</h3>
      <div className="grid gap-3">
        {specials.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            project={project}
            responses={counts.get(entry.id) ?? 0}
            total={project.rows.length}
            onEntries={onEntries}
          />
        ))}
      </div>
    </div>
  );
}
