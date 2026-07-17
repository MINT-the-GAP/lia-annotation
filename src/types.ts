// All shared interfaces and type aliases for lia-annotation.

export type Mode = 'cursor' | 'pen' | 'eraser' | 'rect';

export interface LiaTexOcrEngine {
  model?: string;
  recognize: (source: HTMLCanvasElement, opts?: Record<string, unknown>) => Promise<unknown>;
  setModel?: (model: string) => Promise<void> | void;
}

// ----- Global declarations -----

declare global {
  interface Window {
    __LIA_ANNOTATION__: {
      exportState: () => unknown;
      exportFreezeState: () => unknown;
      importState: (payload: unknown, opts?: { replace?: boolean }) => boolean;
      importFreezeState: (payload: unknown, opts?: { replace?: boolean }) => boolean;
      hasFreezeData: () => boolean;
      setVisible: (v: boolean) => void;
      toggleVisible: () => void;
      setReadOnly: (v: boolean | null) => void;
      clearSlide: () => void;
      clearAllSlides: () => void;
      isOcrAvailable: () => boolean;
      recognizeLatestAnnotationText: () => Promise<string | null>;
      submitOcrTextToNearestQuiz: (text: string) => boolean;
      transferToNearestQuiz: () => Promise<boolean>;
      startDgsPlacementMode: () => void;
      refresh: () => void;
      getStore: () => unknown;
      getSlideKey: () => string;
    };
    __LIA_TEX_OCR__?: LiaTexOcrEngine;
    __LIA_CANVAS_OCR__?: {
      ocr?: LiaTexOcrEngine;
      [key: string]: unknown;
    };
    __LIA_ANNOTATION_EXPORT__: () => unknown;
    __LIA_ANNOTATION_IMPORT__: (payload: unknown, opts?: { replace?: boolean }) => boolean;
    __LIA_ANNOTATION_FREEZE_EXPORT__: () => unknown;
    __LIA_ANNOTATION_FREEZE_IMPORT__: (payload: unknown, opts?: { replace?: boolean }) => boolean;
    __LIA_ANNOTATION_FREEZE_HAS_DATA__: () => boolean;
  }

  interface HTMLCanvasElement {
    __liaAnnotBound?: boolean;
  }
}
export type PanelMode = 'pen' | 'eraser' | 'ocr';

export interface Point { x: number; y: number; }

export interface PathItem {
  kind: 'path';
  tool: Mode;
  color: string;
  width: number;
  alpha: number;
  baseW: number;
  points: Point[];
}

export interface DgsWidget {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  spec?: string;
  language?: 'de' | 'en';
}

export interface SlideData {
  items: PathItem[];
  redo: PathItem[];
  widgets?: DgsWidget[];
}

export interface UiState {
  mode: Mode;
  visible: boolean;
  panelOpen: boolean;
  panelMode: PanelMode;
  color: string;
  width: number;
  alpha: number;
  eraserWidth: number;
  ocrBusy: boolean;
  ocrDraft: string;
  ocrFailed: boolean;
  forcedReadOnly: boolean | null;
}

export interface Store {
  slides: Record<string, SlideData>;
  ui: UiState;
}

export interface State {
  host: Element | null;
  shell: HTMLElement | null;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  slideKey: string | null;
  cssW: number;
  cssH: number;
  dpr: number;
  drawing: boolean;
  activePath: PathItem | null;
  syncRAF: number;
  redrawRAF: number;
  resizeObserver: ResizeObserver | null;
  toolbar: HTMLElement | null;
  eraserRing: HTMLElement | null;
  lastPointer: { x: number; y: number; inside: boolean; pointerType: string; };
}
