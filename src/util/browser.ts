export const isKeyboardSelectionEvent = (event, roleButton?: boolean) => {
  const backspace = [8, 'Backspace'];
  const space = [32, ' ', 'Spacebar'];
  const enter = [13, 'Enter'];

  const key = event.key || event.which || event.keyCode || '';

  const check = roleButton
    ? !space.concat(enter).includes(key)
    : !enter.includes(key);

  if (!key || check) {
    return false;
  }
  event.preventDefault();
  return true;
};
