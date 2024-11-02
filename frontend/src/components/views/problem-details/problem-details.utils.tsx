type ParsedResults = (number | string)[][]

export const parseRawResults = (testCases: string, format: string): ParsedResults => {
  // Split the test cases string into an array, filtering out any empty strings
  const rawCases = testCases.split('\n').map(value => value.trim()).filter(Boolean)

  // Interpret the format to determine how many numbers to read per group
  const formatParts = format.split(' ').map(part => part.trim())
  const groupSize = formatParts.length

  // Group the values based on the group size
  const prasedResults: ParsedResults = []

  for (let i = 0; i < rawCases.length; i += groupSize) {
    const group = rawCases.slice(i, i + groupSize).map(value => {
      const numValue = Number(value)
      // Check if the value can be parsed as a number
      return isNaN(numValue) ? value : numValue
    })

    if (group.length === groupSize) {
      prasedResults.push(group)
    }
  }

  return prasedResults
}
