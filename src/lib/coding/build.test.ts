import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { codeRows } from "./build.ts";
import { sampleMayo, sampleOpinions } from "./sample.ts";

function codeOf(project: ReturnType<typeof sampleMayo>, label: string): number {
  const entry = project.entries.find(
    (item) => item.kind === "item" && !item.residual && item.label.toLowerCase() === label.toLowerCase(),
  );
  assert.ok(entry, `falta código de ${label}: ${project.entries.map((item) => `${item.code}:${item.label}`).join(" | ")}`);
  return entry.code;
}

describe("marcas de mayonesa", () => {
  const project = sampleMayo();
  const coded = codeRows(project.rows, project.entries, project.settings);
  const byText = (text: string) => {
    const row = coded.find((item) => item.text === text);
    assert.ok(row, text);
    return row;
  };

  it("arma Kraft, Mavesa y Hellmann's como códigos propios", () => {
    const kraft = codeOf(project, "Kraft");
    const mavesa = codeOf(project, "Mavesa");
    const hell = project.entries.find((item) => /hell/i.test(item.label) && !item.residual);
    assert.ok(hell, project.entries.map((item) => item.label).join(", "));
    assert.notEqual(kraft, mavesa);
    assert.equal(byText("Kraft")!.codeString, String(kraft));
    assert.equal(byText("Kraf")!.codeString, String(kraft));
    assert.equal(byText("Craft")!.codeString, String(kraft));
    assert.equal(byText("Krfat")!.codeString, String(kraft));
    assert.equal(byText("Mayonesa Kraft")!.codeString, String(kraft));
    assert.equal(byText("maveza")!.codeString, String(mavesa));
    assert.equal(byText("Mabesa")!.codeString, String(mavesa));
    assert.equal(byText("Mavesaa")!.codeString, String(mavesa));
    assert.equal(byText("Hellmans")!.codeString, String(hell!.code));
    assert.equal(byText("Helmans")!.codeString, String(hell!.code));
    assert.equal(byText("Heins")!.codeString, byText("Heinz")!.codeString);
    assert.equal(byText("Mc Cormick")!.codeString, byText("McCormick")!.codeString);
    assert.equal(byText("Macormick")!.codeString, byText("McCormick")!.codeString);
  });

  it("respeta el orden de mención con punto y coma", () => {
    const kraft = codeOf(project, "Kraft");
    const mavesa = codeOf(project, "Mavesa");
    assert.equal(byText("Mavesa, Kraft")!.codeString, `${mavesa};${kraft}`);
    assert.equal(byText("Kraft, Mavesa")!.codeString, `${kraft};${mavesa}`);
  });

  it("reserva 97, 98 y 99", () => {
    assert.equal(byText("No sé")!.codeString, "97");
    assert.equal(byText("no recuerdo")!.codeString, "97");
    assert.equal(byText("ns/nr")!.codeString, "97");
    assert.equal(byText("no aplica")!.codeString, "99");
    assert.equal(byText("No consumo")!.codeString, "99");
    assert.equal(byText("otros")!.codeString, "98");
    assert.equal(byText("Otras marcas")!.codeString, "98");
    assert.equal(byText("Natura")!.codeString, "98");
    assert.equal(byText("Fruco")!.codeString, "98");
    const kraft = codeOf(project, "Kraft");
    assert.equal(byText("Kraft, no se")!.codeString, String(kraft));
    assert.match(byText("Kraft, no se")!.note, /97/);
  });

  it("no fusiona natural con natura sin confirmación", () => {
    const natural = project.entries.find((item) => item.variants.some((variant) => variant.key === "natural"));
    const natura = project.entries.find((item) => item.variants.some((variant) => variant.key === "natura"));
    assert.ok(natural && natura);
    assert.notEqual(natural.id, natura.id);
    assert.equal(natural.suggest?.targetId, natura.id);
  });
});

describe("opiniones", () => {
  const project = sampleOpinions();
  const coded = codeRows(project.rows, project.entries, project.settings);
  const byText = (text: string) => coded.find((item) => item.text === text)!;

  it("junta la misma idea y separa la negación", () => {
    assert.equal(byText("es muy cara")!.codeString, byText("está cara")!.codeString);
    assert.equal(byText("muy cara")!.codeString, byText("está cara")!.codeString);
    assert.notEqual(byText("no me gusta")!.codeString, byText("me gusta el sabor")!.codeString);
    assert.equal(byText("no se")!.codeString, "97");
    assert.equal(byText("la compra mi mama")!.codeString, byText("porque la compra mi mamá")!.codeString);
    assert.equal(byText("empaque bonito")!.codeString, byText("el empaque es bonito")!.codeString);
  });
});
