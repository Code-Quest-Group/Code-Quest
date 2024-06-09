import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalSeperatorComponent } from './vertical-seperator.component';

describe('VerticalSeperatorComponent', () => {
  let component: VerticalSeperatorComponent;
  let fixture: ComponentFixture<VerticalSeperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalSeperatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerticalSeperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
