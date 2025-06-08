import { onUnmounted } from 'vue'

export function useDebounce() {
  let timeout: NodeJS.Timeout | null = null

  function debounce(miliseconds: number): Promise<void> {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    return new Promise((resolve) => {
      timeout = setTimeout((): void => {
        resolve()
      }, miliseconds)
    })
  }

  onUnmounted((): void => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
  })

  return debounce
}
