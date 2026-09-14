// Other templates can observe attributes and child nodes across the document.
// Keep unchanged values out of their MutationObserver queues.
export function setAttribute(el: Element, name: string, value: string): void {
  if (el.getAttribute(name) !== value) el.setAttribute(name, value);
}

type StyleValue = { input: string; serialized: string; priority: string };
const styleValues = new WeakMap<HTMLElement, Map<string, StyleValue>>();

export function setStyle(el: HTMLElement, name: string, value: string): void {
  const style = el.style;
  const current = style.getPropertyValue(name);
  const priority = style.getPropertyPriority(name);
  const previous = styleValues.get(el)?.get(name);
  // Browsers normalize shorthands and subpixel lengths. Remember the actual
  // serialization after a write, but recheck it so external edits still win
  // detection and can be reconciled on the next call.
  if ((current === value && !priority) ||
      (previous?.input === value && previous.serialized === current && previous.priority === priority)) return;
  style.setProperty(name, value);
  let values = styleValues.get(el);
  if (!values) { values = new Map(); styleValues.set(el, values); }
  values.set(name, { input: value, serialized: style.getPropertyValue(name), priority: style.getPropertyPriority(name) });
}

export function setText(el: Element, value: string): void {
  if (el.textContent !== value) el.textContent = value;
}
