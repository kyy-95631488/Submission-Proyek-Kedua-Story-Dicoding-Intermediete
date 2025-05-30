import { showFormattedDate } from '../../utils/index';
import { deleteStory as deleteStoryFromDB } from '../../data/indexedDB';

export default class HomeView {
  constructor() {
    this._onNavigate = null;
  }

  setNavigationCallback(callback) {
    this._onNavigate = callback;
  }

  render() {
    return `
      <section class="container">
        <h1 class="section-title">Explore Stories</h1>
        <div class="loading-container" id="loading" aria-live="polite" aria-busy="false">
          <div class="loader" aria-label="Loading"></div>
        </div>
        <div id="stories-list" class="stories-grid"></div>
        <div id="map" style="height: 400px;"></div>
      </section>
    `;
  }

  showLoading() {
    const loadingContainer = document.querySelector('#loading');
    if (loadingContainer) {
      loadingContainer.classList.add('active');
      loadingContainer.setAttribute('aria-busy', 'true');
    } else {
      console.warn('Loading container not found in DOM');
    }
  }

  hideLoading() {
    const loadingContainer = document.querySelector('#loading');
    if (loadingContainer) {
      loadingContainer.classList.remove('active');
      loadingContainer.setAttribute('aria-busy', 'false');
    } else {
      console.warn('Loading container not found in DOM');
    }
  }

  showLoginMessage() {
    const storiesList = document.querySelector('#stories-list');
    storiesList.innerHTML = `
      <p class="login-message">Please <a href="#/login">login</a> first to view stories.</p>
    `;
  }

  displayStories(stories) {
    const storiesList = document.querySelector('#stories-list');
    storiesList.innerHTML = stories
      .map(
        (story) => `
      <article role="article" aria-labelledby="story-${story.id}" class="story-card">
        <h2 id="story-${story.id}">${story.name}</h2>
        <img src="${story.photoUrl || 'https://via.placeholder.com/300x169?text=No+Image'}" alt="${story.description}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x169?text=Image+Error'"/>
        <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
        <p class="story-date">Posted on ${showFormattedDate(story.createdAt)}</p>
        <a href="#/stories/${story.id}" class="story-link">View Details</a>
        <button class="delete-story" data-id="${story.id}">Delete</button>
      </article>
    `
      )
      .join('');

    document.querySelectorAll('.delete-story').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        if (confirm('Are you sure you want to delete this story?')) {
          try {
            await deleteStoryFromDB(id);

            button.closest('.story-card').remove();
            this.showErrorDialog('Story deleted successfully', false);
          } catch (error) {
            this.showErrorDialog(`Failed to delete story: ${error.message}`, false);
          }
        }
      });
    });
  }

  initMap(stories) {
    if (!window.L) {
      console.error('Leaflet library is not loaded.');
      return;
    }

    const map = L.map('map').setView([-6.2088, 106.8456], 5);

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri',
      }
    );

    osm.addTo(map);

    const baseLayers = {
      OpenStreetMap: osm,
      Satellite: satellite,
    };
    L.control.layers(baseLayers).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}`);
      }
    });
  }

  showErrorDialog(message, redirectToHome = false) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('alert-dialog');
    dialog.innerHTML = `
      <div class="dialog-content">
        <p>${message}</p>
        <button class="dialog-button">OK</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('.dialog-button').addEventListener('click', () => {
      dialog.close();
      dialog.remove();
      if (redirectToHome && this._onNavigate) {
        this._onNavigate('#/');
      }
    });
  }
}