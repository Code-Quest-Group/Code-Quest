import { useEffect, useState } from "react"
import { ProblemService } from "../../../services/problem-service"
import { Problem } from "../../../types";

export const ProblemList = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
  
    useEffect(() => {
      const fetchProblems = async () => {
        try {
          const data = await ProblemService.getProblems()
          setProblems(data)
        } catch (error) {
          console.log(error)
        }
      };
  
      fetchProblems();
    }, [])
    
    return (
        <div>
          <h1>Problems</h1>
          <ul>
            {problems.map((problem, index) => (
              <li key={index} onClick={(problem) => {console.log('Problem clicked:', problem)}}>
                {problem.name}
              </li>
            ))}
          </ul>
        </div>
      )
}