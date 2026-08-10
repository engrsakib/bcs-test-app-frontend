export const PDF_FONT_FAMILY = "SolaimanLipi";

const FONT_URL = "/fonts/SolaimanLipi.ttf";

let fontLoadPromise: Promise<void> | null = null;

export async function ensureSolaimanLipiFont(): Promise<void> {
  if (fontLoadPromise) {
    return fontLoadPromise;
  }

  fontLoadPromise = (async () => {
    if (typeof document === "undefined") {
      throw new Error("PDF font loading requires a browser environment.");
    }

    const alreadyLoaded = Array.from(document.fonts).some(
      (font) => font.family.replace(/['"]/g, "") === PDF_FONT_FAMILY,
    );

    if (alreadyLoaded) {
      await document.fonts.ready;
      return;
    }

    const face = new FontFace(PDF_FONT_FAMILY, `url(${FONT_URL})`);
    const loadedFace = await face.load();
    document.fonts.add(loadedFace);
    await document.fonts.ready;
  })();

  return fontLoadPromise;
}

export async function preloadPdfFonts(): Promise<void> {
  await ensureSolaimanLipiFont();
}
