import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SeparatorComponent } from "./subcomponents";
import { Observable } from 'rxjs';
import { switchMap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-problem-page',
  standalone: true,
  templateUrl: './problem-page.component.html',
  styleUrls: ['./problem-page.component.scss'],
  imports: [SeparatorComponent, HttpClientModule]
})
export class ProblemPageComponent {
  constructor(private http: HttpClient) {}

  fillResults() {
    const codeEditorValue = (document.getElementById('code-editor') as HTMLTextAreaElement).value;
    const payload = {
      source_code: codeEditorValue,
      language_id: "50",
      stdin: "world"
    };

    this.http.post<{ submission_id: string }>('http://localhost:8080/submissions', payload)
      .pipe(
        switchMap(response => {
          const submissionId = response.submission_id;
          return this.pollSubmission(submissionId);
        })
      )
      .subscribe(result => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.innerText = result;
        }
      });
  }

  pollSubmission(submissionId: string): Observable<string> {
    return new Observable(observer => {
      const intervalId = setInterval(() => {
        this.http.get(`http://localhost:8080/${submissionId}`, { responseType: 'text' }).subscribe(
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
