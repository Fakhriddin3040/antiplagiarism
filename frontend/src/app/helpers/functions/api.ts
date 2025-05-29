export function makeQSearchParam(value: string, props: string | string[]): {search: string} {
  if (typeof props === 'string') {
    return {search: `${props}=${value}`};
  } else if (Array.isArray(props)) {
    return props.map(prop => `${prop}=${value}`).join(',');
  }
  return null;
}
