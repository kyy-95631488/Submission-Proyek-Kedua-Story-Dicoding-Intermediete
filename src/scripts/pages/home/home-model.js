import { getStories } from '../../data/api';
import { saveStory, getStories as getCachedStories } from '../../data/indexedDB';

export default class HomeModel {
  async getStories({ page = 1, size = 10, location = 0, token }) {
    try {
      const response = await getStories({ page, size, location, token });
      if (!response.error) {
        response.listStory.forEach(async (story) => {
          await saveStory(story);
        });
        return response;
      }
      const cachedStories = await getCachedStories();
      return { error: false, listStory: cachedStories };
    } catch (error) {
      const cachedStories = await getCachedStories();
      return { error: false, listStory: cachedStories };
    }
  }
}