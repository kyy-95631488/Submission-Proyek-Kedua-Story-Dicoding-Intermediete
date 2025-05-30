import LoginView from './login-view';
import LoginModel from './login-model';
import LoginPresenter from './login-presenter';

export default class LoginPage {
  constructor(navigate) {
    // console.log('LoginPage: constructor navigate function:', navigate);
    this._navigate = navigate || ((path) => { window.location.hash = path; });
    this._view = new LoginView();
    this._model = new LoginModel();
    this._presenter = new LoginPresenter({ view: this._view, model: this._model });
  }

  async render() {
    return this._view.render();
  }

  async afterRender() {
    // console.log('LoginPage: afterRender setting navigation callback:', this._navigate);
    this._view.setNavigationCallback(this._navigate);
    await this._presenter.initialize();
  }

  cleanup() {
  }
}