export * from './types/ContentTypes.js';
export * from './loaders/ContentLoader.js';
export * from './mapping/content-mapping.js';

// Create default instance for easy use
import { ContentLoader } from './loaders/ContentLoader.js';

const defaultContentLoader = new ContentLoader();

// Export convenience functions
export const loadContentForConfig = async (config: any) => {
  return defaultContentLoader.loadContentForConfig(config);
};

export const loadTemplate = async (format: string) => {
  return defaultContentLoader.loadTemplate(format);
};

// For testing or custom paths
export const createContentLoader = (contentPath?: string) => {
  return new ContentLoader(contentPath);
};