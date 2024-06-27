import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SeparatorComponent } from "./subcomponents";
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-problem-page',
  standalone: true,
  templateUrl: './problem-page.component.html',
  styleUrls: ['./problem-page.component.scss'],
  imports: [SeparatorComponent, HttpClientModule, FormsModule, CommonModule] 
})
export class ProblemPageComponent implements OnInit {
  constructor(private http: HttpClient) {}

  code: string = '';
  problemName: string = '';
  problemDescription: string = "";
  problems: any[] = [];
  currentProblem: any = {};

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/problems').subscribe(problems => {
      this.problems = problems;
      this.setProblem(this.problems[0]);
    });
  }

  setProblem(problem: any) {
    this.currentProblem = problem;
    this.code = problem.codeTemplate;
    this.problemName = problem.name;
    this.problemDescription = problem.description;
  }

  fillResults() {
    const codeEditorValue = (document.getElementById('code-editor') as HTMLTextAreaElement).value;
    const payload = {
      sourceCode: codeEditorValue,
      problemId: this.currentProblem.problemId,
      language: "PYTHON",
    };

    this.http.post<{ token: string }>('http://localhost:8080/submissions/', payload)
      .pipe(
        switchMap(response => {
          const submissionId = response.token;
          return this.pollSubmission(submissionId);
        })
      )
      .subscribe(result => {
        const jsonResult = JSON.parse(result);
        const resultsSection = document.getElementById('results-section');
        
        if (resultsSection) {
          resultsSection.innerText = `
          Name: ${jsonResult.problem_id} \n 
          Time: ${jsonResult.time} \n
          Test Cases Passed: ${jsonResult.correct_testcases} / ${jsonResult.total_testcases} \n 
          Result: ${jsonResult.status} ${jsonResult.error_message ? `, Error: ${jsonResult.error_message}` : ''}
          `;
        }        
      });
  }

  pollSubmission(submissionId: string): Observable<string> {
    return new Observable(observer => {
      const intervalId = setInterval(() => {
        this.http.get(`http://localhost:8080/submissions/${submissionId}`, { responseType: 'text' }).subscribe(
          (response: string) => {
            console.log(response)
            observer.next(response);
            observer.complete();
            clearInterval(intervalId);
          },
          error => {
            console.error('Error fetching submission result', error);
            observer.error(error);
            clearInterval(intervalId);
          }
        );
      }, 1000); // Poll every 1 second
    });
  }
}
