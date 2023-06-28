import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private readonly meta: Meta, private readonly title: Title) {}

  setDefaults() {
    const title = 'Evaluation System';
    const description =
      'An optimise method of evaluating students performace on a particular subject topic';
    this.title.setTitle(title);
    this.meta.addTags([
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
    ]);
  }
}
