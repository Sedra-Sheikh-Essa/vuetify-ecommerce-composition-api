export default function useCurrency() {
  const formatPrice = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '$0.00'
    }
    return `$${Number(value).toFixed(2)}`
  }

  return {
    formatPrice,
  }
}
