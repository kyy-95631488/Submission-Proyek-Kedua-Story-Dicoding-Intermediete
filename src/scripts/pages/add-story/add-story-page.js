import AddStoryView from './add-story-view';
import AddStoryModel from './add-story-model';
import AddStoryPresenter from './add-story-presenter';

export default class AddStoryPage {
  constructor(navigate) {
    // console.log('AddStoryPage constructor: navigate function:', navigate);
    this._navigate = navigate || ((path) => { window.location.hash = path; });
    this._view = new AddStoryView();
    this._model = new AddStoryModel();
    this._presenter = new AddStoryPresenter({ 
      view: this._view, 
      model: this._model
    });
  }

  async render() {
    return this._view.render();
  }

  async afterRender() {
    // console.log('afterRender: Setting navigation callback with:', this._navigate);
    this._view.setNavigationCallback(this._navigate);
    await this._presenter.initialize();
  }

  cleanup() {
    this._view.cleanup();
  }
}