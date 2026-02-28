
export function getImgUrl_UTIL(name: string) {
  return new URL(`/src/assets/images/${name}`, import.meta.url).href
}

export function getIconUrl_UTIL(name: string) {
  return new URL(`/src/assets/icons/${name}`, import.meta.url).href
}
