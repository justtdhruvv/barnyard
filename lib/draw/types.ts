export type Layer = "structure" | "detail" | "life" | "lamp";
export type P = [number, number];
export interface Stroke { d: string; layer: Layer; id?: string }
export interface Glow { x: number; y: number; r: number }
export interface Drawing { id: string; title: string; x?: number; y?: number; width: number; height: number; strokes: Stroke[]; glows?: Glow[]; morphs?: Record<string, string[]>; roll?: { ball: string; path: string } }
export const LAYER_ORDER: Layer[] = ["structure", "detail", "life", "lamp"];
