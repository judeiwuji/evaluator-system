import { environment } from 'src/environments/environment';

export default class LinkManager {
  static get baseUrl() {
    let url = '';
    if (!environment.production) {
      url = 'http://localhost:4200';
    }
    return url;
  }

  static get apiUrl() {
    return `${LinkManager.baseUrl}/api/`;
  }
}
