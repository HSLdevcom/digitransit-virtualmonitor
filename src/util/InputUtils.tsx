import type { SyntheticEvent } from 'react';

export function focusToInput(id: string) {
  const input = document.getElementById(id) as HTMLInputElement;
  input.select();
}

export function onClick(event: SyntheticEvent<HTMLInputElement>) {
  (event.target as HTMLInputElement).select();
}
