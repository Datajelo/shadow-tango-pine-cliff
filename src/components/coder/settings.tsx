import type { Settings } from "@/lib/coding/types";

export function SettingsFields({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (settings: Settings) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm">
        <span className="font-medium">Tipo de abierta</span>
        <span className="seg w-fit">
          <button
            type="button"
            aria-pressed={settings.mode === "marca"}
            onClick={() => onChange({ ...settings, mode: "marca" })}
          >
            Marcas
          </button>
          <button
            type="button"
            aria-pressed={settings.mode === "opinion"}
            onClick={() => onChange({ ...settings, mode: "opinion" })}
          >
            Opiniones
          </button>
        </span>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="font-medium">Frecuencia mínima para código propio</span>
        <input
          className="field tabular-nums"
          type="number"
          min={1}
          max={50}
          value={settings.minFrequency}
          onChange={(event) =>
            onChange({
              ...settings,
              minFrequency: Math.max(1, Math.min(50, Number(event.target.value) || 1)),
            })
          }
        />
      </label>
      <label className="grid gap-2 text-sm sm:col-span-2">
        <span className="font-medium">Palabras de la categoría que no distinguen</span>
        <input
          className="field"
          value={settings.categoryWords}
          placeholder="mayonesa, mayo, aderezo"
          onChange={(event) => onChange({ ...settings, categoryWords: event.target.value })}
        />
        <span className="text-muted-foreground">
          «Mayonesa Kraft» y «Kraft» quedan en el mismo código. En opiniones déjelo vacío.
        </span>
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="size-4"
          checked={settings.splitAnd}
          onChange={(event) => onChange({ ...settings, splitAnd: event.target.checked })}
        />
        Separar también por «y» / «e»
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="size-4"
          checked={settings.emptyAs99}
          onChange={(event) => onChange({ ...settings, emptyAs99: event.target.checked })}
        />
        Vacíos como 99
      </label>
    </div>
  );
}
