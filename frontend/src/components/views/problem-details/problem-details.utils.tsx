type ParsedResults = (number | string)[][]

export const parseRawResults = (testCases: string, format: string): ParsedResults => {
  const rawCases = testCases.split('\n').map(value => value.trim()).filter(Boolean)

  const formatParts = format.split(' ').map(part => part.trim())
  const groupSize = formatParts.length

  const prasedResults: ParsedResults = []

  for (let i = 0; i < rawCases.length; i += groupSize) {
    const group = rawCases.slice(i, i + groupSize).map(value => {
      const numValue = Number(value)
      return isNaN(numValue) ? value : numValue
    })

    if (group.length === groupSize) {
      prasedResults.push(group)
    }
  }

  return prasedResults
}
