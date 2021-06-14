export function focusToInput(id: string) {
  const input = document.getElementById(id) as HTMLInputElement;
  input.select();
}

export function onClick(event: any) {
  event.target.select();
}
