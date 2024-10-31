type ParsedTestCases = number[][]

export const parseTestCases = (testCases: string, format: string): ParsedTestCases => {
  // Split the test cases string into an array, filtering out any empty strings
  const numbers = testCases.split('\n').map(Number).filter(num => !isNaN(num))

  // Interpret the format to determine how many numbers to read per group
  const formatParts = format.split(' ').map(part => part.trim())
  const groupSize = formatParts.length

  // Group the numbers based on the group size
  const parsedCases: ParsedTestCases = []

  for (let i = 0; i < numbers.length; i += groupSize) {
    const group = numbers.slice(i, i + groupSize)
    if (group.length === groupSize) {
      parsedCases.push(group)
    }
  }

  return parsedCases
}
