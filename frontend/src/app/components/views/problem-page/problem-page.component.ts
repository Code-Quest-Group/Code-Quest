import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SeparatorComponent } from "./subcomponents";
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { switchMap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-problem-page',
  standalone: true,
  templateUrl: './problem-page.component.html',
  styleUrls: ['./problem-page.component.scss'],
  imports: [SeparatorComponent, HttpClientModule, FormsModule] 
})
export class ProblemPageComponent {
  constructor(private http: HttpClient) {}

  code: string = `class Problem:
  def solve(self, a, b):
      return a + b
`;

  fillResults() {
    const codeEditorValue = (document.getElementById('code-editor') as HTMLTextAreaElement).value;
    const payload = {
      sourceCode: codeEditorValue,
      problemId: "1",
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
          resultsSection.innerText = `Time: ${jsonResult.time}, Description: ${jsonResult.status.description}`;
        }
      });
  }

  pollSubmission(submissionId: string): Observable<string> {
    return new Observable(observer => {
      const intervalId = setInterval(() => {
        this.http.get(`http://localhost:8080/submissions/${submissionId}`, { responseType: 'text' }).subscribe(
          (response: string) => {
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
