export type Proposal = {
    name: string
    author: string
    description: string
    codeTemplate: string
    correctSolution: string
    constraints: string
    example: string
    tags: string[] // Minimum 1
    hints?: string
    pseudoCode?: string
}
