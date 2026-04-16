// All shared interfaces and type aliases for lia-annotation.

export type Mode = 'cursor' | 'pen' | 'eraser';
export type PanelMode = 'pen' | 'eraser';

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

export interface SlideData {
  items: PathItem[];
  redo: PathItem[];
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
